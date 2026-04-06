/**
 * POST /api/fireteam/evaluate
 *
 * AI Evaluation Pipeline — Bloom's Taxonomy scoring
 *
 * Receives a recording transcript (split by participant) and an array of
 * rubrics, then calls Groq to score each participant on each rubric using
 * Bloom's Taxonomy (0-6 scale). Returns structured rubric_result objects
 * matching the blueprint's schema.
 *
 * Request body:
 * {
 *   experienceId: string,
 *   participants: [{ id, name, transcript: string }],
 *   rubrics: [{ id, rubric, rubricDescription, rubricPrompt, rubricType }],
 *   sessionContext: string   // brief description of the experience topic
 * }
 *
 * Response:
 * {
 *   results: [
 *     {
 *       participantId, participantName,
 *       rubricResults: [
 *         { rubricId, rubricTitle, score, arguments, justification, disagreements }
 *       ]
 *     }
 *   ],
 *   conversationMap: [...],
 *   groupBalanceScore: {...}
 * }
 */

import { NextResponse } from 'next/server';

// ─── Bloom's Taxonomy reference ───────────────────────────────────────────────
const BLOOMS_LEVELS = [
  { score: 0, level: 'Did Not Discuss',  color: '#efefef' },
  { score: 1, level: 'Remembering',      color: '#AEF4FF' },
  { score: 2, level: 'Understanding',    color: '#3BB5C8' },
  { score: 3, level: 'Applying',         color: '#BC9906' },
  { score: 4, level: 'Analyzing',        color: '#FFCA00' },
  { score: 5, level: 'Evaluating',       color: '#D15924' },
  { score: 6, level: 'Creating',         color: '#282828' },
];

function bloomsLevelFor(score) {
  return BLOOMS_LEVELS.find((l) => l.score === score) ?? BLOOMS_LEVELS[0];
}

// ─── Build the evaluation prompt ──────────────────────────────────────────────
function buildEvaluationPrompt({ participant, rubric, sessionContext }) {
  return `You are an educational AI evaluator. Your task is to score a student's discussion contribution using Bloom's Taxonomy.

SESSION CONTEXT:
${sessionContext}

RUBRIC TO EVALUATE:
Title: ${rubric.rubric}
Description: ${rubric.rubricDescription}
Evaluation Prompt: ${rubric.rubricPrompt}

STUDENT TRANSCRIPT:
Student Name: ${participant.name}
---
${participant.transcript || '(No transcript available for this participant)'}
---

BLOOM'S TAXONOMY SCORING SCALE:
0 = Did Not Discuss — No engagement with this topic
1 = Remembering — Recalled facts or basic information
2 = Understanding — Explained or described concepts in their own words
3 = Applying — Applied concepts to a specific scenario or example
4 = Analyzing — Broke down relationships, identified causes, compared perspectives
5 = Evaluating — Critiqued, justified, or defended a position with reasoning
6 = Creating — Generated new ideas, synthesized original solutions, reframed the problem

YOUR TASK:
1. Read the student's transcript carefully
2. Assess their contribution against the rubric
3. Assign a Bloom's Taxonomy score (0-6)
4. Extract 2-4 direct evidence quotes from their transcript (the "arguments")
5. Write a 1-2 sentence justification for the score

Respond ONLY with valid JSON in this exact format:
{
  "score": <number 0-6>,
  "arguments": ["<direct quote or paraphrase from transcript>", "..."],
  "justification": "<1-2 sentence explanation of why this score was assigned>",
  "disagreements": []
}`;
}

// ─── Call Groq ────────────────────────────────────────────────────────────────
async function evaluateWithGroq({ participant, rubric, sessionContext }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set');

  const baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
  const model =
    process.env.GROQ_MODEL_EVALUATION || 'llama-3.3-70b-versatile';

  const prompt = buildEvaluationPrompt({ participant, rubric, sessionContext });

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert educational evaluator. Always respond with valid JSON only. Never include markdown code blocks.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 600,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '{}';

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Groq returned invalid JSON');
  }

  return {
    score: Math.max(0, Math.min(6, Number(parsed.score ?? 0))),
    arguments: Array.isArray(parsed.arguments) ? parsed.arguments : [],
    justification: String(parsed.justification ?? ''),
    disagreements: Array.isArray(parsed.disagreements) ? parsed.disagreements : [],
  };
}

// ─── Generate conversation map ────────────────────────────────────────────────
function buildConversationMap(participants, rubricResults) {
  const colors = ['#002147', '#E87722', '#3BB5C8', '#D15924', '#BC9906'];
  let timestamp = 60;

  const bubbles = [];

  participants.forEach((p, pIdx) => {
    const pResults = rubricResults.filter((r) => r.participantId === p.id);
    pResults.forEach((pr) => {
      pr.rubricResults.forEach((rr) => {
        if (rr.arguments?.length > 0) {
          rr.arguments.slice(0, 2).forEach((arg) => {
            bubbles.push({
              id: `${p.id}-${rr.rubricId}-${timestamp}`,
              participantId: p.id,
              timestamp,
              comment: arg.slice(0, 120),
              understandingDepth: Math.max(1, Math.min(5, Math.ceil(rr.score / 1.2))),
              rubric: rr.rubricTitle,
            });
            timestamp += Math.floor(Math.random() * 120) + 60;
          });
        }
      });
    });
  });

  return {
    bubbles,
    timeline: {
      startTime: '00:00',
      endTime: `${Math.floor(timestamp / 60)}:${String(timestamp % 60).padStart(2, '0')}`,
      duration: timestamp,
    },
  };
}

// ─── Generate group balance score ─────────────────────────────────────────────
function buildGroupBalanceScore(participants, rubricResults) {
  const colors = ['#002147', '#E87722', '#3BB5C8', '#D15924', '#BC9906', '#BC9906'];

  const participantStats = participants.map((p, i) => {
    const pResults = rubricResults.find((r) => r.participantId === p.id);
    const avgScore = pResults
      ? pResults.rubricResults.reduce((sum, r) => sum + r.score, 0) / (pResults.rubricResults.length || 1)
      : 0;

    return {
      id: p.id,
      name: p.name,
      color: colors[i % colors.length],
      talkTimeMinutes: Math.max(1, Math.round(avgScore * 2.5)),
      engagementLevel: avgScore >= 4 ? 'high' : avgScore >= 2 ? 'medium' : 'low',
    };
  });

  const avgTalk = participantStats.reduce((s, p) => s + p.talkTimeMinutes, 0) / (participantStats.length || 1);
  const maxTalk = Math.max(...participantStats.map((p) => p.talkTimeMinutes));
  const isBalanced = maxTalk <= avgTalk * 2;

  return {
    participants: participantStats,
    averageTalkTime: Math.round(avgTalk),
    isBalanced,
    message: isBalanced
      ? 'Great balance! Everyone contributed equally.'
      : 'The conversation was dominated by a few participants.',
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { experienceId, participants, rubrics, sessionContext = '' } = body;

    if (!Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json({ error: 'participants array is required' }, { status: 400 });
    }
    if (!Array.isArray(rubrics) || rubrics.length === 0) {
      return NextResponse.json({ error: 'rubrics array is required' }, { status: 400 });
    }

    // ── Evaluate each participant on each rubric ──────────────────────────────
    const results = [];

    for (const participant of participants) {
      const rubricResults = [];

      for (const rubric of rubrics) {
        let evalResult;
        try {
          evalResult = await evaluateWithGroq({ participant, rubric, sessionContext });
        } catch (err) {
          console.error(`[evaluate] Failed for ${participant.name} / ${rubric.rubric}:`, err.message);
          // Fallback: score 0 with an error note
          evalResult = {
            score: 0,
            arguments: [],
            justification: `Evaluation failed: ${err.message}`,
            disagreements: [],
          };
        }

        const blooms = bloomsLevelFor(evalResult.score);

        rubricResults.push({
          rubricId:    rubric.id,
          rubricTitle: rubric.rubric,
          rubricDescription: rubric.rubricDescription ?? '',
          score:       evalResult.score,
          arguments:   evalResult.arguments,
          justification: evalResult.justification,
          disagreements: evalResult.disagreements,
          // Evaluation page format
          bloomLevel: {
            level: blooms.level,
            score: evalResult.score,
            color: blooms.color,
          },
          contributions: evalResult.arguments,
          summary:      evalResult.justification,
          explanation:  `Bloom's Level: ${blooms.level} (${evalResult.score}/6). ${evalResult.justification}`,
        });
      }

      results.push({
        participantId:   String(participant.id),
        participantName: participant.name,
        rubricResults,
        // Evaluation page format
        evaluations: rubricResults,
      });
    }

    const conversationMap   = buildConversationMap(participants, results);
    const groupBalanceScore = buildGroupBalanceScore(participants, results);

    return NextResponse.json({
      results,
      conversationMap,
      groupBalanceScore,
      sessionInfo: {
        experienceId,
        evaluatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[/api/fireteam/evaluate] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Evaluation failed' },
      { status: 500 }
    );
  }
}
