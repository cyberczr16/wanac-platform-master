<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Jobs\TranscribeAudioJob;
use Illuminate\Support\Facades\DB;

/**
 * TranscriptionController
 *
 * Handles incoming audio chunks from the React frontend during live sessions.
 *
 * Routes:
 *   POST /api/transcribe                    — Receive and queue an audio chunk
 *   POST /api/sessions/{id}/evaluate        — Manually trigger evaluation (instructor)
 *   POST /api/admin/questions/{id}/explain  — Generate quiz explanation
 *   POST /api/slides/{id}/captions/generate — Generate captions for a video slide
 */
class TranscriptionController extends Controller
{
    /**
     * Receive an audio chunk from the browser and queue it for transcription.
     *
     * Called every 30 seconds per participant during discussion slides.
     * Audio is stored to tmp/audio/{uuid}.webm then processed by TranscribeAudioJob.
     *
     * POST /api/transcribe
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'audio'       => [
                'required',
                'file',
                'mimes:webm,mp4,wav,ogg,m4a,flac',
                'max:' . (25 * 1024),  // 25MB in kilobytes
            ],
            'session_id'  => 'required|integer|exists:fireteam.sessions,id',
            'slide_id'    => 'required|integer|exists:fireteam.slides,id',
            'user_id'     => 'required|uuid',
            'chunk_index' => 'required|integer|min:0',
        ]);

        // Verify the requesting user is actually in this session
        $isParticipant = DB::table('fireteam.sessions')
            ->whereJsonContains('participant_user_ids', $validated['user_id'])
            ->where('id', $validated['session_id'])
            ->exists();

        if (!$isParticipant) {
            return response()->json(['error' => 'User is not a participant in this session.'], 403);
        }

        // Store file to temporary location
        $path = $request->file('audio')->store(
            'tmp/audio',
            'local'  // Store in storage/app/tmp/audio/
        );

        // Dispatch background job
        TranscribeAudioJob::dispatch(
            storagePath: $path,
            sessionId:   $validated['session_id'],
            slideId:     $validated['slide_id'],
            userId:      $validated['user_id'],
            chunkIndex:  $validated['chunk_index'],
        );

        return response()->json([
            'queued'      => true,
            'chunk_index' => $validated['chunk_index'],
        ], 202);
    }

    /**
     * Manually trigger AI evaluation for a session (instructor action).
     *
     * Normally auto-triggered at slideType 11. This endpoint allows instructors
     * to re-run evaluation or trigger it early from the admin panel.
     *
     * POST /api/sessions/{sessionId}/evaluate
     */
    public function triggerEvaluation(int $sessionId): JsonResponse
    {
        // Check session exists
        $session = DB::table('fireteam.sessions')->find($sessionId);
        if (!$session) {
            return response()->json(['error' => 'Session not found.'], 404);
        }

        \App\Jobs\EvaluateSessionJob::dispatch($sessionId);

        return response()->json([
            'message'    => 'Evaluation job queued.',
            'session_id' => $sessionId,
        ], 202);
    }

    /**
     * Generate a quiz question explanation using Groq LLM.
     *
     * POST /api/admin/questions/{questionId}/explain
     */
    public function generateExplanation(
        int $questionId,
        \App\Services\GroqSummaryService $summaryService
    ): JsonResponse {
        $question = DB::table('fireteam.questions as q')
            ->join('fireteam.slides as s', 'q.slide_id', '=', 's.id')
            ->join('fireteam.experiences as e', 's.experience_id', '=', 'e.id')
            ->where('q.id', $questionId)
            ->select('q.*', 'e.name as experience_name', 'e.key_concepts')
            ->first();

        if (!$question) {
            return response()->json(['error' => 'Question not found.'], 404);
        }

        $answers      = json_decode($question->answers, true) ?? [];
        $correctIndex = (int) $question->correct_answer_index;
        $correctText  = $answers[$correctIndex] ?? '';
        $wrongAnswers = array_values(array_filter(
            $answers,
            fn($a, $i) => $i !== $correctIndex,
            ARRAY_FILTER_USE_BOTH
        ));

        $keyConcepts = is_array($question->key_concepts)
            ? implode(', ', $question->key_concepts)
            : ($question->key_concepts ?? '');

        $explanation = $summaryService->generateQuizExplanation(
            questionText:    $question->question_text,
            correctAnswer:   $correctText,
            wrongAnswers:    $wrongAnswers,
            experienceName:  $question->experience_name,
            keyConcepts:     $keyConcepts,
        );

        // Persist to question record
        DB::table('fireteam.questions')
            ->where('id', $questionId)
            ->update(['explanation' => $explanation]);

        return response()->json([
            'explanation' => $explanation,
            'question_id' => $questionId,
        ]);
    }

    /**
     * Generate timed captions for a video slide using Groq Whisper.
     *
     * POST /api/slides/{slideId}/captions/generate
     *
     * Expects the slide to have a video file already stored.
     * Creates records in fireteam.slide_captions.
     */
    public function generateCaptions(
        int $slideId,
        \App\Services\GroqWhisperService $whisper
    ): JsonResponse {
        $slide = DB::table('fireteam.slides')->find($slideId);

        if (!$slide) {
            return response()->json(['error' => 'Slide not found.'], 404);
        }

        if (empty($slide->storage_url)) {
            return response()->json(['error' => 'Slide has no video file attached.'], 422);
        }

        // Resolve the actual file path from storage URL
        $filePath = storage_path('app/public/' . $slide->storage_url);

        if (!file_exists($filePath)) {
            return response()->json(['error' => 'Video file not found in storage.'], 404);
        }

        // Dispatch as a background job for large files
        \App\Jobs\GenerateCaptionsJob::dispatch($slideId, $filePath);

        return response()->json([
            'message'  => 'Caption generation queued. Check back in a few minutes.',
            'slide_id' => $slideId,
        ], 202);
    }
}
