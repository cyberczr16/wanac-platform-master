/**
 * groq.service.ts
 *
 * Drop-in replacement for openai.service.ts using Groq's free tier.
 * Groq is OpenAI API-compatible — same request/response shape, different base URL.
 *
 * Features:
 *   - transcribeAudio()          → Groq Whisper (whisper-large-v3)
 *   - generateMeetingSummaries() → llama-3.3-70b-versatile (matches openai.service interface)
 *   - evaluateBloomsLevel()       → Bloom's Taxonomy scoring per participant
 *   - generateQuickSummary()      → llama3-8b-8192 (fast + cheap)
 *   - generateQuizExplanation()   → llama3-8b-8192
 *   - generateInsightTags()       → llama3-8b-8192
 *
 * Setup:
 *   Add to .env.local:
 *     GROQ_API_KEY=gsk_xxxxxxxx
 *     GROQ_BASE_URL=https://api.groq.com/openai/v1
 *
 * IMPORTANT: GROQ_API_KEY (without NEXT_PUBLIC_) stays server-side only.
 * All calls go through /api/groq/* Next.js API routes, not directly from the browser.
 */

import axios from 'axios';

// ──────────────────────────────────────────────────────────────────────────────
//  Types (extends existing openai.service interfaces)
// ──────────────────────────────────────────────────────────────────────────────

export interface TranscriptionResult {
  text: string;
  duration?: number;
  language?: string;
  segments?: Array<{ text: string; start: number; end: number }>;
}

export interface BloomsEvaluationResult {
  rubricId: number;
  rubric: string;
  score: number;          // 0–6
  scoreLabel: string;     // "Did Not Discuss" | "Remembering" | ... | "Creating"
  arguments: string[];    // Direct quotes from transcript
  justification: string;
}

export interface ParticipantEvaluation {
  userId: string;
  userName: string;
  rubricResults: BloomsEvaluationResult[];
  overallBloomsScore: number;       // Average across rubrics
  engagementLevel: 'high' | 'medium' | 'low';
}

export interface InsightTag {
  insightType: 'theme' | 'missed_concept' | 'strong_point' | 'question_raised';
  label: string;
  relevanceScore: number;  // 0.0–1.0
}

// Re-export to stay compatible with components using openai.service types
export type { MeetingSummary } from './openai.service';

// ──────────────────────────────────────────────────────────────────────────────
//  Bloom's Taxonomy reference
// ──────────────────────────────────────────────────────────────────────────────

export const BLOOMS_LABELS: Record<number, string> = {
  0: 'Did Not Discuss',
  1: 'Remembering',
  2: 'Understanding',
  3: 'Applying',
  4: 'Analyzing',
  5: 'Evaluating',
  6: 'Creating',
};

export const BLOOMS_COLORS: Record<number, string> = {
  0: '#efefef',
  1: '#AEF4FF',
  2: '#3BB5C8',
  3: '#BC9906',
  4: '#FFCA00',
  5: '#D15924',
  6: '#282828',
};

// ──────────────────────────────────────────────────────────────────────────────
//  Client-side service (calls your own Next.js API routes)
//  This is what React components should import and use.
// ──────────────────────────────────────────────────────────────────────────────

export const groqService = {

  /**
   * Transcribe audio using Groq Whisper API (via server-side API route).
   *
   * Drop-in replacement for openaiService.transcribeAudio().
   * Handles 30-second discussion slide chunks during live Fireteam sessions.
   */
  async transcribeAudio(audioFile: File | Blob): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append('file', audioFile, 'audio.webm');

    const response = await fetch('/api/groq/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error('Groq transcription failed: ' + (err.error ?? response.statusText));
    }

    return response.json();
  },

  /**
   * Evaluate a participant's transcript against Fireteam rubrics using Bloom's Taxonomy.
   *
   * @param transcript  Full transcript text for one participant
   * @param rubrics     Array of rubric objects from the experience
   * @param experience  Experience (slide deck) metadata for context
   * @param userId      Participant user ID
   * @param userName    Participant display name
   */
  async evaluateBloomsLevel(
    transcript: string,
    rubrics: Array<{ id: number; rubric: string; rubricPrompt: string }>,
    experience: { name: string; keyConcepts?: string[]; learningObjectives?: string[] },
    userId: string,
    userName: string,
  ): Promise<ParticipantEvaluation> {
    const response = await fetch('/api/groq/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, rubrics, experience, userId, userName }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error('Groq evaluation failed: ' + (err.error ?? response.statusText));
    }

    return response.json();
  },

  /**
   * Generate meeting summaries (participant, coach, admin views).
   *
   * Drop-in replacement for openaiService.generateMeetingSummaries().
   * Uses llama-3.3-70b-versatile instead of GPT-4o.
   */
  async generateMeetingSummaries(
    transcript: string,
    meetingData: {
      experienceTitle: string;
      experienceDescription: string;
      agenda: Array<{ title: string; duration: string }>;
      participants: Array<{ id: string; name: string; role?: string }>;
      duration: string;
      userId: string;
      userName: string;
    }
  ) {
    const response = await fetch('/api/groq/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, meetingData, type: 'full' }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error('Groq summarization failed: ' + (err.error ?? response.statusText));
    }

    return response.json();
  },

  /**
   * Quick 3–4 sentence summary. Cheaper than full analysis.
   * Uses llama3-8b-8192 for speed.
   */
  async generateQuickSummary(transcript: string, meetingTitle: string): Promise<string> {
    const response = await fetch('/api/groq/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, meetingTitle, type: 'quick' }),
    });

    if (!response.ok) {
      throw new Error('Groq quick summary failed');
    }

    const data = await response.json();
    return data.summary;
  },

  /**
   * Generate explanation for a wrong quiz answer.
   * Shown to students when they pick an incorrect option.
   */
  async generateQuizExplanation(
    questionText: string,
    correctAnswer: string,
    wrongAnswers: string[],
    experienceName?: string,
  ): Promise<string> {
    const response = await fetch('/api/groq/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionText, correctAnswer, wrongAnswers, experienceName }),
    });

    if (!response.ok) {
      throw new Error('Groq explanation generation failed');
    }

    const data = await response.json();
    return data.explanation;
  },

  /**
   * Extract insight tags from a group discussion transcript.
   * Powers the Conversation Map analytics view.
   */
  async generateInsightTags(
    groupTranscript: string,
    keyConcepts: string[],
  ): Promise<InsightTag[]> {
    const response = await fetch('/api/groq/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupTranscript, keyConcepts }),
    });

    if (!response.ok) {
      throw new Error('Groq insight generation failed');
    }

    const data = await response.json();
    return data.tags ?? [];
  },
};
