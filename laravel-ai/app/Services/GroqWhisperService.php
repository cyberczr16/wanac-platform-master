<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use App\Exceptions\GroqApiException;

/**
 * GroqWhisperService
 *
 * Handles all speech-to-text transcription via Groq's Whisper API.
 * Used for:
 *   - Live session audio chunk transcription (Feature A)
 *   - Instructor video caption generation with timestamps (Feature E)
 *
 * Groq Whisper API: POST https://api.groq.com/openai/v1/audio/transcriptions
 * Max file size: 25MB per request
 * Free tier: ~2,000 requests/day, 20 RPM
 */
class GroqWhisperService
{
    private string $apiKey;
    private string $baseUrl;
    private string $model;
    private int    $timeout;

    public function __construct()
    {
        $this->apiKey  = config('groq.api_key');
        $this->baseUrl = config('groq.base_url');
        $this->model   = config('groq.models.whisper', 'whisper-large-v3');
        $this->timeout = config('groq.timeouts.transcription', 60);
    }

    /**
     * Transcribe an audio file and return the plain text transcript.
     *
     * Used for: live session 30-second audio chunks (Feature A)
     *
     * @param  string  $filePath  Absolute path to the audio file (webm, mp4, wav, ogg, m4a)
     * @param  string  $language  ISO 639-1 language code (default: 'en')
     * @return string  Transcribed text
     *
     * @throws GroqApiException
     */
    public function transcribe(string $filePath, string $language = 'en'): string
    {
        $this->validateFile($filePath);

        $response = $this->sendRequest($filePath, [
            'model'           => $this->model,
            'response_format' => 'text',
            'language'        => $language,
            // Prompt helps Whisper stay on topic for business case studies
            'prompt'          => 'Business case study discussion. Students discussing entrepreneurship, market research, finance.',
        ]);

        return trim($response->body());
    }

    /**
     * Transcribe a video/audio file and return timed caption segments.
     *
     * Used for: instructor video caption seeding (Feature E)
     * Returns segments with start/end times matching the slide_captions schema.
     *
     * @param  string  $filePath  Absolute path to the video/audio file
     * @param  string  $language  ISO 639-1 language code
     * @return array<int, array{text: string, start: float, end: float}>
     *
     * @throws GroqApiException
     */
    public function transcribeWithTimestamps(string $filePath, string $language = 'en'): array
    {
        $this->validateFile($filePath);

        $response = $this->sendRequest($filePath, [
            'model'                   => $this->model,
            'response_format'         => 'verbose_json',
            'timestamp_granularities' => 'segment',  // sentence-level segments
            'language'                => $language,
            'prompt'                  => 'Business case study lecture. Professor explaining concepts.',
        ]);

        $data = $response->json();

        if (!isset($data['segments'])) {
            throw new GroqApiException('Whisper response missing segments: ' . $response->body());
        }

        // Normalize to our schema shape
        return array_map(fn(array $seg) => [
            'text'  => trim($seg['text']),
            'start' => (float) $seg['start'],
            'end'   => (float) $seg['end'],
        ], $data['segments']);
    }

    /**
     * Transcribe a large video file by splitting it into chunks first.
     *
     * Use this when the video file exceeds 25MB (Groq's limit).
     * Requires ffmpeg installed on the server.
     *
     * @param  string  $filePath   Path to the large video file
     * @param  int     $chunkSecs  Seconds per chunk (default: 600 = 10 minutes)
     * @return array<int, array{text: string, start: float, end: float}>
     */
    public function transcribeLargeFile(string $filePath, int $chunkSecs = 600): array
    {
        $tmpDir   = sys_get_temp_dir() . '/groq_chunks_' . uniqid();
        mkdir($tmpDir);

        try {
            // Split with ffmpeg
            $chunkPattern = $tmpDir . '/chunk_%03d.mp3';
            exec("ffmpeg -i " . escapeshellarg($filePath)
                . " -f segment -segment_time {$chunkSecs}"
                . " -c:a libmp3lame -q:a 4"
                . " " . escapeshellarg($chunkPattern) . " 2>/dev/null");

            $chunks = glob($tmpDir . '/chunk_*.mp3');
            sort($chunks);

            $allSegments    = [];
            $timeOffset     = 0.0;

            foreach ($chunks as $chunk) {
                $segments = $this->transcribeWithTimestamps($chunk);

                // Adjust timestamps by the cumulative offset
                foreach ($segments as $seg) {
                    $allSegments[] = [
                        'text'  => $seg['text'],
                        'start' => $seg['start'] + $timeOffset,
                        'end'   => $seg['end']   + $timeOffset,
                    ];
                }

                // Get duration of this chunk for next offset
                $duration = $this->getAudioDuration($chunk);
                $timeOffset += $duration;

                // Respect Groq rate limit (20 RPM = 3s between calls)
                usleep(3_100_000); // 3.1 seconds
            }

            return $allSegments;

        } finally {
            // Cleanup temp files
            array_map('unlink', glob($tmpDir . '/*'));
            rmdir($tmpDir);
        }
    }

    // ─────────────────────────────────────────────
    //  Private helpers
    // ─────────────────────────────────────────────

    /**
     * Send a multipart request to the Groq Whisper endpoint.
     */
    private function sendRequest(string $filePath, array $fields): Response
    {
        $attempts   = 0;
        $maxRetries = 3;

        while ($attempts < $maxRetries) {
            $response = Http::withToken($this->apiKey)
                ->timeout($this->timeout)
                ->attach('file', file_get_contents($filePath), basename($filePath))
                ->post($this->baseUrl . '/audio/transcriptions', $fields);

            if ($response->successful()) {
                return $response;
            }

            if ($response->status() === 429) {
                // Rate limited — wait for Retry-After header (or 60s default)
                $waitSeconds = (int) $response->header('Retry-After', 60);
                sleep($waitSeconds);
                $attempts++;
                continue;
            }

            throw new GroqApiException(
                "Groq Whisper API error ({$response->status()}): " . $response->body(),
                $response->status()
            );
        }

        throw new GroqApiException('Groq Whisper API: max retries exceeded after rate limiting');
    }

    /**
     * Validate file exists and is within Groq's 25MB limit.
     */
    private function validateFile(string $filePath): void
    {
        if (!file_exists($filePath)) {
            throw new \InvalidArgumentException("Audio file not found: {$filePath}");
        }

        $maxBytes = 25 * 1024 * 1024; // 25MB
        if (filesize($filePath) > $maxBytes) {
            throw new \InvalidArgumentException(
                "File exceeds Groq 25MB limit. Use transcribeLargeFile() instead."
            );
        }
    }

    /**
     * Get audio duration in seconds using ffprobe.
     */
    private function getAudioDuration(string $filePath): float
    {
        $output = shell_exec(
            "ffprobe -v quiet -show_entries format=duration "
            . "-of default=noprint_wrappers=1:nokey=1 "
            . escapeshellarg($filePath)
        );
        return (float) trim($output ?? '0');
    }
}
