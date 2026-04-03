<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use App\Exceptions\GroqApiException;
use App\Models\Session;
use App\Models\Rubric;
use App\Models\Transcript;
use App\Models\RubricResult;

/**
 * GroqEvaluationService
 *
 * Implements the Bloom's Taxonomy AI evaluation pipeline (Feature B).
 * Triggered when a session reaches slideType 11 (processingData).
 *
 * Flow:
 *   1. Load all transcripts for the session (per user, ordered by chunk)
 *   2. Assemble a full per-student transcript string
 *   3. For each student, send ONE Groq LLM call with ALL rubrics
 *   4. Parse the JSON response into rubric_result records
 *   5. Store in fireteam.rubric_results
 *
 * Model: llama-3.3-70b-versatile (best reasoning on Groq free tier)
 * Format: Forced JSON output via response_format + system prompt
 */
class GroqEvaluationService
{
    private string $apiKey;
    private string $baseUrl;
    private string $model;
    private int    $timeout;

    // Bloom's Taxonomy score labels (from prompt_type.json)
    private const BLOOMS_LABELS = [
        0 => 'Did Not Discuss',
        1 => 'Remembering',
        2 => 'Understanding',
        3 => 'Applying',
        4 => 'Analyzing',
        5 => 'Evaluating',
        6 => 'Creating',
    ];

    public function __construct()
    {
        $this->apiKey  = config('groq.api_key');
        $this->baseUrl = config('groq.base_url');
        $this->model   = config('groq.models.evaluation', 'llama-3.3-70b-versatile');
        $this->timeout = config('groq.timeouts.evaluation', 120);
    }

    /**
     * Run the full evaluation pipeline for a session.
     *
     * Called by EvaluateSessionJob. Evaluates every participant against
     * every rubric and stores results in fireteam.rubric_results.
     *
     * @param  int  $sessionId
     * @return array{evaluated: int, failed: int}
     */
    public function evaluateSession(int $sessionId): array
    {
        $session  = Session::with(['experience.rubrics', 'participants'])->findOrFail($sessionId);
        $rubrics  = $session->experience->rubrics;
        $userIds  = $session->participant_user_ids; // array of UUIDs

        if ($rubrics->isEmpty()) {
            throw new \RuntimeException("Session {$sessionId}: no rubrics found for experience.");
        }

        $evaluated = 0;
        $failed    = 0;

        foreach ($userIds as $userId) {
            try {
                $transcript = $this->assembleTranscript($sessionId, $userId);

                if (empty(trim($transcript))) {
                    // Student had no transcript — give them all 0s
                    $this->storeZeroScores($sessionId, $userId, $rubrics);
                    $evaluated++;
                    continue;
                }

                $results = $this->evaluateStudent(
                    transcript: $transcript,
                    rubrics:    $rubrics->toArray(),
                    experience: $session->experience,
                    userId:     $userId,
                );

                $this->storeResults($sessionId, $userId, $results);
                $evaluated++;

            } catch (\Throwable $e) {
                logger()->error("GroqEvaluation failed for user {$userId} in session {$sessionId}", [
                    'error' => $e->getMessage(),
                ]);
                $failed++;
            }

            // Respect Groq rate limit: 30 RPM → ~2s between calls
            usleep(2_100_000);
        }

        return ['evaluated' => $evaluated, 'failed' => $failed];
    }

    /**
     * Evaluate a single student against all rubrics.
     *
     * Returns parsed rubric_result array ready for storage.
     *
     * @param  string  $transcript  Full concatenated transcript for this student
     * @param  array   $rubrics     Array of rubric models (id, rubric, rubric_prompt, rubric_type)
     * @param  mixed   $experience  Experience (slide deck) model with name, key_concepts, etc.
     * @param  string  $userId
     * @return array<int, array{rubric_id, score, arguments, justification, disagreements, model}>
     */
    public function evaluateStudent(
        string $transcript,
        array  $rubrics,
        mixed  $experience,
        string $userId
    ): array {
        $systemPrompt = $this->buildSystemPrompt();
        $userMessage  = $this->buildUserMessage($transcript, $rubrics, $experience);

        $payload = [
            'model'       => $this->model,
            'messages'    => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user',   'content' => $userMessage],
            ],
            'temperature'     => 0.1,   // Low temp = more consistent scoring
            'max_tokens'      => 2048,
            'response_format' => ['type' => 'json_object'],  // Force JSON output
        ];

        $response = $this->callWithRetry($payload, '/chat/completions');

        $content = $response['choices'][0]['message']['content'] ?? '';
        $parsed  = json_decode($content, true);

        if (!isset($parsed['results']) || !is_array($parsed['results'])) {
            throw new GroqApiException("Groq evaluation returned invalid JSON structure: {$content}");
        }

        // Attach model info and validate scores
        return array_map(function (array $result) use ($response) {
            return [
                'rubric_id'     => (int) $result['rubric_id'],
                'score'         => $this->clampScore((int) ($result['score'] ?? 0)),
                'arguments'     => $result['arguments']     ?? [],
                'justification' => $result['justification'] ?? '',
                'disagreements' => $result['disagreements'] ?? [],
                'groq_model'    => $this->model,
                'prompt_tokens' => $response['usage']['prompt_tokens'] ?? null,
            ];
        }, $parsed['results']);
    }

    // ─────────────────────────────────────────────
    //  Prompt builders
    // ─────────────────────────────────────────────

    private function buildSystemPrompt(): string
    {
        $bloomsDescriptions = collect(self::BLOOMS_LABELS)
            ->map(fn($label, $score) => "{$score}={$label}")
            ->implode(', ');

        return <<<PROMPT
You are an educational AI evaluator trained in Bloom's Taxonomy for business case study discussions.

Your job is to evaluate a student's participation in a live discussion session and score them
on each rubric provided. You must ONLY use evidence found in the student's transcript.

BLOOM'S TAXONOMY SCORING (0–6):
{$bloomsDescriptions}

SCORING RULES:
- Score 0 if the student did NOT discuss that topic AT ALL.
- Score 1 (Remembering) if student only recalled or listed facts without explanation.
- Score 2 (Understanding) if student explained concepts in their own words.
- Score 3 (Applying) if student used concepts to address the case situation.
- Score 4 (Analyzing) if student broke down components, compared options, or identified causes/effects.
- Score 5 (Evaluating) if student made judgments, critiques, or justified recommendations with evidence.
- Score 6 (Creating) if student proposed novel solutions, frameworks, or original synthesis.

Be strict and conservative. Do NOT give credit for vague or implied discussion.
Quote directly from the transcript in the "arguments" field.

You MUST respond with valid JSON only, in this exact format:
{
  "results": [
    {
      "rubric_id": <integer>,
      "score": <0-6>,
      "arguments": ["exact quote or paraphrase from transcript", ...],
      "justification": "One paragraph explaining why this score was assigned.",
      "disagreements": []
    }
  ]
}
PROMPT;
    }

    private function buildUserMessage(string $transcript, array $rubrics, mixed $experience): string
    {
        $rubricList = json_encode(
            array_map(fn($r) => [
                'id'            => $r['id'],
                'rubric'        => $r['rubric'],
                'rubricPrompt'  => $r['rubric_prompt'],
            ], $rubrics),
            JSON_PRETTY_PRINT
        );

        $keyConcepts = is_array($experience->key_concepts)
            ? implode(', ', $experience->key_concepts)
            : ($experience->key_concepts ?? 'N/A');

        $learningObjectives = is_array($experience->learning_objectives)
            ? implode("\n- ", $experience->learning_objectives)
            : ($experience->learning_objectives ?? 'N/A');

        return <<<MSG
CASE STUDY: {$experience->name}
Key Concepts: {$keyConcepts}
Learning Objectives:
- {$learningObjectives}

─────────────────────────────────────────
STUDENT TRANSCRIPT (discussion slides only):
─────────────────────────────────────────
{$transcript}

─────────────────────────────────────────
RUBRICS TO EVALUATE:
─────────────────────────────────────────
{$rubricList}

Evaluate this student on EVERY rubric listed above.
Return results for ALL {count($rubrics)} rubrics in your JSON response.
MSG;
    }

    // ─────────────────────────────────────────────
    //  Transcript assembly
    // ─────────────────────────────────────────────

    /**
     * Assemble all transcript chunks for a user in a session, in order.
     *
     * Only includes chunks from discussion slides (slideType 6).
     * Chunks are ordered by slide_id ASC, chunk_index ASC.
     */
    private function assembleTranscript(int $sessionId, string $userId): string
    {
        $chunks = DB::table('fireteam.transcripts')
            ->join('fireteam.slides', 'fireteam.transcripts.slide_id', '=', 'fireteam.slides.id')
            ->where('fireteam.transcripts.session_id', $sessionId)
            ->where('fireteam.transcripts.user_id', $userId)
            ->where('fireteam.slides.slide_type', 6)  // discussion slides only
            ->orderBy('fireteam.slides.slide_order')
            ->orderBy('fireteam.transcripts.chunk_index')
            ->pluck('fireteam.transcripts.transcript_text')
            ->toArray();

        return implode(' ', $chunks);
    }

    // ─────────────────────────────────────────────
    //  Storage helpers
    // ─────────────────────────────────────────────

    private function storeResults(int $sessionId, string $userId, array $results): void
    {
        foreach ($results as $result) {
            DB::table('fireteam.rubric_results')->upsert(
                [
                    'session_id'    => $sessionId,
                    'rubric_id'     => $result['rubric_id'],
                    'user_id'       => $userId,
                    'score'         => $result['score'],
                    'arguments'     => json_encode($result['arguments']),
                    'justification' => $result['justification'],
                    'disagreements' => json_encode($result['disagreements']),
                    'groq_model'    => $result['groq_model'],
                    'prompt_tokens' => $result['prompt_tokens'],
                    'created_at'    => now(),
                ],
                ['session_id', 'rubric_id', 'user_id'],   // conflict keys
                ['score', 'arguments', 'justification', 'disagreements', 'groq_model']
            );
        }
    }

    private function storeZeroScores(int $sessionId, string $userId, mixed $rubrics): void
    {
        foreach ($rubrics as $rubric) {
            DB::table('fireteam.rubric_results')->upsert(
                [
                    'session_id'    => $sessionId,
                    'rubric_id'     => $rubric->id,
                    'user_id'       => $userId,
                    'score'         => 0,
                    'arguments'     => '[]',
                    'justification' => 'Student did not participate or no transcript was captured.',
                    'disagreements' => '[]',
                    'groq_model'    => 'none',
                    'created_at'    => now(),
                ],
                ['session_id', 'rubric_id', 'user_id'],
                ['score', 'arguments', 'justification']
            );
        }
    }

    // ─────────────────────────────────────────────
    //  HTTP helper with retry + model fallback
    // ─────────────────────────────────────────────

    private function callWithRetry(array $payload, string $endpoint): array
    {
        $attempts = 0;
        $maxRetries = 3;
        $fallbackModel = 'mixtral-8x7b-32768';

        while ($attempts < $maxRetries) {
            $response = Http::withToken($this->apiKey)
                ->timeout($this->timeout)
                ->post($this->baseUrl . $endpoint, $payload);

            if ($response->successful()) {
                return $response->json();
            }

            if ($response->status() === 429) {
                $waitSeconds = (int) $response->header('Retry-After', 60);
                logger()->warning("GroqEvaluation rate limited. Waiting {$waitSeconds}s.");
                sleep($waitSeconds);

                // Switch to fallback model after first rate limit
                if ($attempts === 1 && $payload['model'] !== $fallbackModel) {
                    $payload['model'] = $fallbackModel;
                    logger()->info("GroqEvaluation switched to fallback model: {$fallbackModel}");
                }

                $attempts++;
                continue;
            }

            throw new GroqApiException(
                "Groq LLM API error ({$response->status()}): " . $response->body(),
                $response->status()
            );
        }

        throw new GroqApiException('Groq LLM API: max retries exceeded');
    }

    private function clampScore(int $score): int
    {
        return max(0, min(6, $score));
    }
}
