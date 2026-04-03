<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Services\GroqWhisperService;
use App\Exceptions\GroqApiException;

/**
 * TranscribeAudioJob
 *
 * Background job that sends an audio chunk to Groq Whisper API
 * and stores the transcript text in fireteam.transcripts.
 *
 * Dispatched by: TranscriptionController::store()
 * Queue: 'ai' (separate from default queue so audio jobs don't block)
 *
 * Retry strategy:
 *   - 3 automatic retries with exponential backoff
 *   - On final failure: log error, do NOT crash session (transcript gap is acceptable)
 */
class TranscribeAudioJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int    $tries   = 3;
    public int    $timeout = 90;   // Groq Whisper can take up to 60s for large files

    public function __construct(
        private readonly string $storagePath,   // Relative path in Laravel storage
        private readonly int    $sessionId,
        private readonly int    $slideId,
        private readonly string $userId,
        private readonly int    $chunkIndex = 0,
    ) {
        $this->onQueue('ai');
    }

    public function handle(GroqWhisperService $whisper): void
    {
        $absolutePath = Storage::path($this->storagePath);

        if (!file_exists($absolutePath)) {
            logger()->warning("TranscribeAudioJob: file not found at {$absolutePath}");
            return;
        }

        try {
            $text = $whisper->transcribe($absolutePath);

            if (empty(trim($text))) {
                // Whisper returned empty — silence or noise. Skip storing.
                logger()->info("TranscribeAudioJob: empty transcript for session={$this->sessionId} user={$this->userId} chunk={$this->chunkIndex}");
                return;
            }

            DB::table('fireteam.transcripts')->upsert(
                [
                    'session_id'     => $this->sessionId,
                    'slide_id'       => $this->slideId,
                    'user_id'        => $this->userId,
                    'chunk_index'    => $this->chunkIndex,
                    'transcript_text'=> $text,
                    'whisper_model'  => 'whisper-large-v3',
                    'created_at'     => now(),
                ],
                ['session_id', 'slide_id', 'user_id', 'chunk_index'],
                ['transcript_text']  // update text if re-processed
            );

        } catch (GroqApiException $e) {
            logger()->error("TranscribeAudioJob Groq error: " . $e->getMessage(), [
                'session_id'  => $this->sessionId,
                'user_id'     => $this->userId,
                'chunk_index' => $this->chunkIndex,
            ]);

            // Re-throw to trigger Laravel's retry mechanism
            throw $e;

        } finally {
            // Always clean up the temp audio file after processing
            Storage::delete($this->storagePath);
        }
    }

    /**
     * Exponential backoff between retries (30s, 60s, 120s).
     */
    public function backoff(): array
    {
        return [30, 60, 120];
    }

    /**
     * On final failure, log but don't crash — transcript gaps are acceptable.
     */
    public function failed(\Throwable $exception): void
    {
        logger()->error("TranscribeAudioJob permanently failed", [
            'session_id'  => $this->sessionId,
            'user_id'     => $this->userId,
            'chunk_index' => $this->chunkIndex,
            'error'       => $exception->getMessage(),
        ]);

        // Clean up file even on failure
        Storage::delete($this->storagePath);
    }
}
