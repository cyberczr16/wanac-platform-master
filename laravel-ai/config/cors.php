<?php

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
|
| Allows the Next.js frontend (localhost:3000 in dev, your production domain
| in prod) to make requests to this Laravel API backend.
|
| In production, update FRONTEND_URL in .env to your real Next.js domain.
|
*/

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Set to true if your Next.js app sends cookies (Sanctum session auth)
    'supports_credentials' => true,

];
