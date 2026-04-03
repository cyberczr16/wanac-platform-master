<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TranscriptionController;

/*
|--------------------------------------------------------------------------
| AI Routes — Add to routes/api.php
|--------------------------------------------------------------------------
|
| Include these in routes/api.php:
|   require __DIR__ . '/api_ai.php';
|
| All routes require authentication (auth:sanctum middleware).
|
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |------------------------------------------------------------------
    | Feature A: Live Session Transcription
    |------------------------------------------------------------------
    | Called by browser every 30s per participant during discussion slides.
    | Receives audio blob, queues TranscribeAudioJob.
    */
    Route::post('/transcribe', [TranscriptionController::class, 'store'])
         ->name('transcribe.store');

    /*
    |------------------------------------------------------------------
    | Feature B: Manually Trigger Evaluation
    |------------------------------------------------------------------
    | Instructors can re-run evaluation from the admin panel.
    | Normally auto-triggered at slideType 11.
    */
    Route::post('/sessions/{sessionId}/evaluate', [TranscriptionController::class, 'triggerEvaluation'])
         ->name('sessions.evaluate')
         ->middleware('role:instructor,admin');  // Only instructors or admins

    /*
    |------------------------------------------------------------------
    | Feature D: Quiz Explanation Generation
    |------------------------------------------------------------------
    | Instructor admin panel button: "✨ Generate Explanation"
    */
    Route::post('/admin/questions/{questionId}/explain', [TranscriptionController::class, 'generateExplanation'])
         ->name('admin.questions.explain')
         ->middleware('role:instructor,admin');

    /*
    |------------------------------------------------------------------
    | Feature E: Video Caption Generation
    |------------------------------------------------------------------
    | Instructor uploads a video → trigger Whisper caption generation
    */
    Route::post('/slides/{slideId}/captions/generate', [TranscriptionController::class, 'generateCaptions'])
         ->name('slides.captions.generate')
         ->middleware('role:instructor,admin');

});
