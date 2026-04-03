<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * GroqApiException
 *
 * Thrown when the Groq API returns an error response.
 * Carries the HTTP status code for retry logic decisions.
 */
class GroqApiException extends RuntimeException
{
    public function __construct(
        string          $message,
        private int     $httpStatus = 0,
        ?\Throwable     $previous = null,
    ) {
        parent::__construct($message, $httpStatus, $previous);
    }

    public function getHttpStatus(): int
    {
        return $this->httpStatus;
    }

    public function isRateLimited(): bool
    {
        return $this->httpStatus === 429;
    }

    public function isServerError(): bool
    {
        return $this->httpStatus >= 500;
    }
}
