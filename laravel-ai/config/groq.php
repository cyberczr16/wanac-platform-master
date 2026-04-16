<?php

/**
 * Groq API Configuration
 *
 * Sign up for free at: https://console.groq.com
 * Free tier covers all Fireteam AI features at typical session volumes.
 *
 * Add to .env:
 *   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
 */

return [

    /*
    |--------------------------------------------------------------------------
    | API Credentials
    |--------------------------------------------------------------------------
    */
    'api_key'  => env('GROQ_API_KEY'),
    'base_url' => env('GROQ_BASE_URL', 'https://api.groq.com/openai/v1'),

    /*
    |--------------------------------------------------------------------------
    | Model Selection
    |
    | Use llama-3.3-70b-versatile for complex reasoning (Bloom's evaluation).
    | Use llama3-8b-8192 for simpler tasks (summaries, explanations, tags).
    | Use whisper-large-v3 for speech-to-text.
    |
    | Switch models here without touching service code.
    |--------------------------------------------------------------------------
    */
    'models' => [
        'evaluation' => env('GROQ_MODEL_EVALUATION', 'llama-3.3-70b-versatile'),
        'summary'    => env('GROQ_MODEL_SUMMARY',    'llama3-8b-8192'),
        'whisper'    => env('GROQ_MODEL_WHISPER',    'whisper-large-v3'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Request Timeouts (seconds)
    |--------------------------------------------------------------------------
    */
    'timeouts' => [
        'transcription' => env('GROQ_TIMEOUT_WHISPER',     60),
        'evaluation'    => env('GROQ_TIMEOUT_EVALUATION',  120),
        'summary'       => env('GROQ_TIMEOUT_SUMMARY',      60),
    ],

    /*
    |--------------------------------------------------------------------------
    | Audio Chunk Settings
    |--------------------------------------------------------------------------
    */
    'audio' => [
        'chunk_seconds' => env('AUDIO_CHUNK_SECONDS', 30),
        'max_mb'        => env('AUDIO_MAX_MB',         25),
    ],

    /*
    |--------------------------------------------------------------------------
    | Free Tier Limits (for monitoring / alerting)
    | These are not enforced in code — they're here for reference.
    |--------------------------------------------------------------------------
    */
    'free_tier_limits' => [
        'whisper_rpm'          => 20,
        'whisper_rpd'          => 2000,
        'llama_70b_rpm'        => 30,
        'llama_70b_tpm'        => 6000,
        'llama_70b_rpd'        => 1000,
        'llama_8b_rpm'         => 30,
        'llama_8b_tpm'         => 14400,
        'llama_8b_rpd'         => 14400,
    ],

];
