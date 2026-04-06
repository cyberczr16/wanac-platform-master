<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Fireteam Laravel Backend
|--------------------------------------------------------------------------
|
| This is the main API route file for the Fireteam Laravel backend.
| All Groq AI routes are loaded from api_ai.php.
|
*/

// Health check (no auth required — for uptime monitoring)
Route::get('/health', function () {
    return response()->json([
        'status'    => 'ok',
        'service'   => 'Fireteam API',
        'timestamp' => now()->toISOString(),
    ]);
});

// Groq AI routes (auth required — defined in api_ai.php)
require __DIR__ . '/api_ai.php';
