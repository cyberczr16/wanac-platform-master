<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\GroqEvaluationService;
use App\Services\GroqSummaryService;

/**
 * EvaluateSessionJob
 *
 * Orchestrates the full AI evaluation pipeline after a session ends.
 * Triggered when the room's activeSlide reaches slideType 11 (processingData).
 *
 * Pipeline:
 *   1. GroqEvaluationService::evaluateSession()  — Bloom's scores per student per rubric
 *   2. GroqSummaryService::generateSessionSummary() — Instructor markdown summary
 *   3. GroqSummaryService::generateInsightTags()    — Conversation map tags
 *
 * Queue: 'ai'
 * Timeout: 10 minutes (large sessions with many students can take a while)
 */
class EvaluateSessionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 2;
    public int $timeout = 600;  // 10 minutes

    public function __construct(
        private readonly int $sessionId,
    ) {
        $this->onQueue('ai');
    }

    public function handle(
        GroqEvaluationService $evaluationService,
        GroqSummaryService    $summaryService,
    ): void {
        logger()->info("EvaluateSessionJob: starting evaluation for session {$this->sessionId}");

        // Step 1: Bloom's Taxonomy evaluation (core feature)
        $result = $evaluationService->evaluateSession($this->sessionId);

        logger()->info("EvaluateSessionJob: evaluation complete", [
            'session_id' => $this->sessionId,
            'evaluated'  => $result['evaluated'],
            'failed'     => $result['failed'],
        ]);

        // Step 2: Session summary for instructors (Feature C)
        try {
            $summaryService->generateSessionSummary($this->sessionId);
            logger()->info("EvaluateSessionJob: summary generated for session {$this->sessionId}");
        } catch (\Throwable $e) {
            // Summary failure is non-critical — don't fail the whole job
            logger()->warning("EvaluateSessionJob: summary generation failed (non-critical)", [
                'session_id' => $this->sessionId,
                'error'      => $e->getMessage(),
            ]);
        }

        // Step 3: Insight tags for Conversation Map (Feature F)
        try {
            $tags = $summaryService->generateInsightTags($this->sessionId);
            logger()->info("EvaluateSessionJob: generated " . count($tags) . " insight tags for session {$this->sessionId}");
        } catch (\Throwable $e) {
            logger()->warning("EvaluateSessionJob: insight tag generation failed (non-critical)", [
                'session_id' => $this->sessionId,
                'error'      => $e->getMessage(),
            ]);
        }

        logger()->info("EvaluateSessionJob: pipeline complete for session {$this->sessionId}");
    }

    public function backoff(): array
    {
        return [120]; // Wait 2 minutes before retry
    }

    public function failed(\Throwable $exception): void
    {
        logger()->error("EvaluateSessionJob permanently failed for session {$this->sessionId}", [
            'error' => $exception->getMessage(),
        ]);

        // TODO: Notify instructor that evaluation failed and results will be delayed
        // NotifyInstructorJob::dispatch($this->sessionId, 'evaluation_failed');
    }
}
