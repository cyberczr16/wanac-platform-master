<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use App\Exceptions\GroqApiException;

/**
 * GroqSummaryService
 *
 * Handles all "lighter" Groq LLM tasks using the faster llama3-8b-8192 model:
 *
 *   Feature C: Session Summary — markdown overview for instructors
 *   Feature D: Quiz Explanation — auto-generate explanation for wrong quiz answers
 *   Feature F: Conversation Insight Tags — extract themes and missed concepts
 *
 * Uses llama3-8b-8192 (not 70b) because these tasks don't need deep reasoning,
 * and 8b has a higher daily request quota on the free tier.
 */
class GroqSummaryService
{
    private string $apiKey;
    private string $baseUrl;
    private string $summaryModel;
    private int    $timeout;

    public function __construct()
    {
        $this->apiKey        = config('groq.api_key');
        $this->baseUrl       = config('groq.base_url');
        $this->summaryModel  = config('groq.models.summary', 'llama3-8b-8192');
        $this->timeout       = config('groq.timeouts.summary', 60);
    }

    // ═══════════════════════════════════════════════════════
    //  FEATURE C: Session Summary
    // ═══════════════════════════════════════════════════════

    /**
     * Generate a markdown session summary for an instructor.
     *
     * Stores result in fireteam.session_summaries.
     * Called by EvaluateSessionJob after rubric_results are stored.
     *
     * @param  int  $sessionId
     * @return string  The generated markdown summary
     */
    public function generateSessionSummary(int $sessionId): string
    {
        $session = DB::table('fireteam.sessions as s')
            ->join('fireteam.experiences as e', 's.experience_id', '=', 'e.id')
            ->where('s.id', $sessionId)
            ->select('s.*', 'e.name as experience_name', 'e.key_concepts', 'e.learning_objectives')
            ->first();

        if (!$session) {
            throw new \RuntimeException("Session {$sessionId} not found.");
        }

        // Get all transcripts grouped by user
        $transcriptsByUser = DB::table('fireteam.transcripts')
            ->where('session_id', $sessionId)
            ->orderBy('chunk_index')
            ->get()
            ->groupBy('user_id');

        // Get rubric scores
        $rubricResults = DB::table('fireteam.rubric_results as rr')
            ->join('fireteam.rubrics as r', 'rr.rubric_id', '=', 'r.id')
            ->where('rr.session_id', $sessionId)
            ->select('rr.user_id', 'r.rubric', 'rr.score', 'rr.justification')
            ->get();

        $prompt = $this->buildSummaryPrompt($session, $transcriptsByUser, $rubricResults);

        $response = $this->chat($prompt, [
            'temperature' => 0.3,
            'max_tokens'  => 1500,
        ]);

        // Parse out group_balance_score if the model included it
        $balanceScore = $this->extractBalanceScore($response);
        $summaryMd    = $this->stripBalanceScoreFromText($response);

        // Store in database
        DB::table('fireteam.session_summaries')->upsert(
            [
                'session_id'          => $sessionId,
                'summary_md'          => $summaryMd,
                'group_balance_score' => $balanceScore,
                'groq_model'          => $this->summaryModel,
                'created_at'          => now(),
            ],
            ['session_id'],
            ['summary_md', 'group_balance_score', 'groq_model']
        );

        return $summaryMd;
    }

    // ═══════════════════════════════════════════════════════
    //  FEATURE D: Quiz Explanation Generation
    // ═══════════════════════════════════════════════════════

    /**
     * Auto-generate a quiz explanation for a wrong answer.
     *
     * Called from the admin QuestionController when an instructor saves
     * a question or clicks "Generate Explanation".
     *
     * @param  string  $questionText       The quiz question
     * @param  string  $correctAnswer      Text of the correct answer option
     * @param  array   $wrongAnswers       Array of incorrect answer option texts
     * @param  string  $experienceName     Name of the case study (context)
     * @param  string  $keyConcepts        Comma-separated key concepts
     * @return string  Plain-text explanation (2-3 sentences)
     */
    public function generateQuizExplanation(
        string $questionText,
        string $correctAnswer,
        array  $wrongAnswers,
        string $experienceName = '',
        string $keyConcepts    = ''
    ): string {
        $wrongList = implode('; ', $wrongAnswers);

        $prompt = <<<PROMPT
You are a learning coach helping business students understand why they got a quiz question wrong.

Context: Case study titled "{$experienceName}". Key concepts: {$keyConcepts}

Quiz question: "{$questionText}"
Correct answer: "{$correctAnswer}"
Incorrect options: {$wrongList}

Write 2–3 clear, encouraging sentences that:
1. Explain WHY the correct answer is right
2. Address a common misconception from the wrong options (if obvious)
3. Connect the answer to the case study concepts

Keep it educational, friendly, and under 60 words. Do NOT start with "The correct answer is".
PROMPT;

        return trim($this->chat($prompt, [
            'temperature' => 0.4,
            'max_tokens'  => 150,
        ]));
    }

    // ═══════════════════════════════════════════════════════
    //  FEATURE F: Conversation Insight Tags
    // ═══════════════════════════════════════════════════════

    /**
     * Extract structured insight tags from group discussion transcripts.
     *
     * Stores results in fireteam.session_insights.
     * Powers the Conversation Map analytics view.
     *
     * @param  int  $sessionId
     * @return array<int, array{insight_type: string, label: string, relevance_score: float}>
     */
    public function generateInsightTags(int $sessionId): array
    {
        $session = DB::table('fireteam.sessions as s')
            ->join('fireteam.experiences as e', 's.experience_id', '=', 'e.id')
            ->where('s.id', $sessionId)
            ->select('e.key_concepts', 'e.slide_deck_phrase_set')
            ->first();

        // Full group transcript (all users combined)
        $fullTranscript = DB::table('fireteam.transcripts')
            ->where('session_id', $sessionId)
            ->orderBy('chunk_index')
            ->pluck('transcript_text')
            ->implode(' ');

        if (empty(trim($fullTranscript))) {
            return [];
        }

        $keyConcepts = is_array($session->key_concepts)
            ? implode(', ', $session->key_concepts)
            : $session->key_concepts;

        $prompt = <<<PROMPT
You are an educational analytics AI. Analyze this group discussion transcript and extract structured insights.

Key Concepts the group should have covered: {$keyConcepts}

Group Discussion Transcript:
{$fullTranscript}

Return a JSON array of up to 10 insight tags:
[
  { "insight_type": "theme", "label": "Equity dilution risk", "relevance_score": 0.92 },
  { "insight_type": "missed_concept", "label": "Post-money valuation", "relevance_score": 0.71 },
  { "insight_type": "strong_point", "label": "Customer interview design", "relevance_score": 0.88 },
  { "insight_type": "question_raised", "label": "When to pivot vs. persist?", "relevance_score": 0.65 }
]

insight_type values: "theme" | "missed_concept" | "strong_point" | "question_raised"
relevance_score: 0.0 (barely mentioned) to 1.0 (heavily discussed)

Return ONLY the JSON array, no other text.
PROMPT;

        $raw  = $this->chat($prompt, ['temperature' => 0.2, 'max_tokens' => 600, 'response_format' => ['type' => 'json_object']]);
        $tags = json_decode($raw, true);

        // Handle both array and {results:[]} wrapping
        if (isset($tags[0])) {
            $tagList = $tags;
        } elseif (isset($tags['results'])) {
            $tagList = $tags['results'];
        } elseif (isset($tags['tags'])) {
            $tagList = $tags['tags'];
        } else {
            $tagList = array_values($tags)[0] ?? [];
        }

        // Persist to database
        $rows = [];
        foreach ($tagList as $tag) {
            if (!isset($tag['insight_type'], $tag['label'])) {
                continue;
            }
            $rows[] = [
                'session_id'      => $sessionId,
                'insight_type'    => $tag['insight_type'],
                'label'           => $tag['label'],
                'relevance_score' => (float) ($tag['relevance_score'] ?? 0.5),
                'created_at'      => now(),
            ];
        }

        if (!empty($rows)) {
            // Remove old tags before inserting new ones
            DB::table('fireteam.session_insights')->where('session_id', $sessionId)->delete();
            DB::table('fireteam.session_insights')->insert($rows);
        }

        return $rows;
    }

    // ─────────────────────────────────────────────
    //  Core Groq chat helper
    // ─────────────────────────────────────────────

    /**
     * Make a chat completion call to Groq LLM.
     *
     * @param  string  $userMessage   The user message content
     * @param  array   $options       Override model, temperature, max_tokens, response_format
     * @return string  The assistant's response text
     */
    public function chat(string $userMessage, array $options = []): string
    {
        $payload = array_merge([
            'model'       => $this->summaryModel,
            'messages'    => [['role' => 'user', 'content' => $userMessage]],
            'temperature' => 0.3,
            'max_tokens'  => 1000,
        ], $options);

        $attempts   = 0;
        $maxRetries = 3;

        while ($attempts < $maxRetries) {
            $response = Http::withToken($this->apiKey)
                ->timeout($this->timeout)
                ->post($this->baseUrl . '/chat/completions', $payload);

            if ($response->successful()) {
                return $response->json('choices.0.message.content', '');
            }

            if ($response->status() === 429) {
                $waitSeconds = (int) $response->header('Retry-After', 60);
                sleep($waitSeconds);
                $attempts++;
                continue;
            }

            throw new GroqApiException(
                "Groq Summary API error ({$response->status()}): " . $response->body(),
                $response->status()
            );
        }

        throw new GroqApiException('Groq Summary API: max retries exceeded');
    }

    // ─────────────────────────────────────────────
    //  Private helpers
    // ─────────────────────────────────────────────

    private function buildSummaryPrompt(
        object $session,
        mixed  $transcriptsByUser,
        mixed  $rubricResults
    ): string {
        $transcriptSection = '';
        foreach ($transcriptsByUser as $userId => $chunks) {
            $text = $chunks->pluck('transcript_text')->implode(' ');
            $transcriptSection .= "Participant {$userId}:\n{$text}\n\n";
        }

        $scoresSection = $rubricResults->map(fn($r) =>
            "- {$r->rubric}: Score {$r->score}/6 — {$r->justification}"
        )->implode("\n");

        return <<<PROMPT
You are an educational analytics assistant. Write a session summary for the instructor.

Case Study: {$session->experience_name}
Session Date: {$session->scheduled_at}
Key Concepts: {$session->key_concepts}

Participant Transcripts:
{$transcriptSection}

Rubric Evaluation Scores:
{$scoresSection}

Write a markdown document with these sections:
## Overview
## What the Group Discussed Well
## Gaps in Coverage
## Participation Balance
## Top 3 Insights

After the markdown, on the VERY LAST LINE write:
GROUP_BALANCE_SCORE: <number between 0.0 and 1.0>
(0.0 = one person dominated; 1.0 = perfectly even participation)
PROMPT;
    }

    private function extractBalanceScore(string $text): ?float
    {
        if (preg_match('/GROUP_BALANCE_SCORE:\s*([\d.]+)/i', $text, $m)) {
            return (float) $m[1];
        }
        return null;
    }

    private function stripBalanceScoreFromText(string $text): string
    {
        return trim(preg_replace('/GROUP_BALANCE_SCORE:.*$/im', '', $text));
    }
}
