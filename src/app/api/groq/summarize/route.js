/**
 * POST /api/groq/summarize
 *
 * Session summary generation using Groq LLM (llama-3.1-8b-instant).
 * Supports two modes:
 *   type: 'quick'  — 3-4 sentence summary (fast)
 *   type: 'full'   — Participant + Coach + Admin summaries (MeetingSummary shape)
 *
 * Body (JSON):
 *   type: 'quick' | 'full'
 *   transcript: string
 *   meetingTitle?: string          (for quick)
 *   meetingData?: { ... }          (for full — see groq.service generateMeetingSummaries)
 */

export async function POST(req) {
  const apiKey  = process.env.GROQ_API_KEY;
  const baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
  const model   = process.env.GROQ_MODEL_SUMMARY || 'llama-3.1-8b-instant';

  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.transcript) {
    return Response.json({ error: 'transcript is required' }, { status: 400 });
  }

  const { type = 'quick', transcript, meetingTitle, meetingData } = body;

  // ── Quick summary ──────────────────────────────────────────────────
  if (type === 'quick') {
    const title = meetingTitle || 'Fireteam Session';
    const reply = await groqChat(apiKey, baseUrl, model, [
      {
        role: 'system',
        content: 'You are an AI assistant that summarizes Fireteam learning session transcripts concisely.',
      },
      {
        role: 'user',
        content: `Summarize this Fireteam session "${title}" in 3–4 sentences. Focus on key discussion points and outcomes:\n\n${transcript}`,
      },
    ], { temperature: 0.4, max_tokens: 200 });

    if (reply.error) {
      return Response.json(reply, { status: reply.status || 502 });
    }
    return Response.json({ summary: reply.content });
  }

  // ── Full summary (participant + coach + admin) ─────────────────────
  if (type === 'full') {
    if (!meetingData) {
      return Response.json({ error: 'meetingData required for type=full' }, { status: 400 });
    }

    const agendaText = (meetingData.agenda || [])
      .map((item, i) => `${i + 1}. ${item.title} (${item.duration})`)
      .join('\n');

    const context = `
Meeting: ${meetingData.experienceTitle}
Description: ${meetingData.experienceDescription}
Duration: ${meetingData.duration}
Participants: ${(meetingData.participants || []).map(p => p.name).join(', ')}
Agenda:
${agendaText}

Transcript:
${transcript}`.trim();

    // Run all three summaries in parallel for speed
    const [participantReply, coachReply, adminReply] = await Promise.all([

      groqChat(apiKey, baseUrl, model, [
        { role: 'system', content: 'You are an expert analyzing meeting transcripts for individual participants.' },
        {
          role: 'user',
          content: `${context}\n\nAnalyze for participant: ${meetingData.userName}.\nRespond in JSON: { "engagementLevel": "high|medium|low", "keyContributions": [], "actionItems": [], "overallSummary": "...", "speakingTime": "...", "questionsAsked": 0 }`,
        },
      ], { response_format: { type: 'json_object' }, temperature: 0.5, max_tokens: 600 }),

      groqChat(apiKey, baseUrl, model, [
        { role: 'system', content: 'You are an expert coach analyzing group learning sessions.' },
        {
          role: 'user',
          content: `${context}\n\nAnalyze from the coach perspective.\nRespond in JSON: { "overallEngagement": "...", "participantInsights": [{ "userName": "...", "engagementLevel": "high|medium|low", "notes": "..." }], "sessionObjectivesMet": true, "areasOfConcern": [], "recommendations": [], "keyTakeaways": [] }`,
        },
      ], { response_format: { type: 'json_object' }, temperature: 0.5, max_tokens: 800 }),

      groqChat(apiKey, baseUrl, model, [
        { role: 'system', content: 'You are an expert at analyzing educational programs for administrators.' },
        {
          role: 'user',
          content: `${context}\n\nAnalyze from an admin perspective.\nRespond in JSON: { "sessionMetrics": { "totalParticipants": 0, "averageEngagement": "...", "completionRate": "...", "technicalIssues": [] }, "facilitatorPerformance": "...", "contentEffectiveness": "...", "systemRecommendations": [], "nextSteps": [] }`,
        },
      ], { response_format: { type: 'json_object' }, temperature: 0.5, max_tokens: 600 }),

    ]);

    // Parse JSON responses
    const parseSafe = (reply, fallback) => {
      if (reply.error) return fallback;
      try { return JSON.parse(reply.content); }
      catch { return fallback; }
    };

    const participantSummary = {
      userId: meetingData.userId,
      userName: meetingData.userName,
      ...parseSafe(participantReply, { engagementLevel: 'medium', keyContributions: [], actionItems: [], overallSummary: 'Unable to generate summary.' }),
    };

    const coachSummary = parseSafe(coachReply, {
      overallEngagement: 'Unable to generate.',
      participantInsights: [],
      sessionObjectivesMet: false,
      areasOfConcern: [],
      recommendations: [],
      keyTakeaways: [],
    });

    const adminSummary = parseSafe(adminReply, {
      sessionMetrics: { totalParticipants: meetingData.participants?.length || 0, averageEngagement: 'N/A', completionRate: 'N/A', technicalIssues: [] },
      facilitatorPerformance: 'N/A',
      contentEffectiveness: 'N/A',
      systemRecommendations: [],
      nextSteps: [],
    });

    return Response.json({ participantSummary, coachSummary, adminSummary });
  }

  return Response.json({ error: 'type must be "quick" or "full"' }, { status: 400 });
}

// ── Shared Groq chat helper ────────────────────────────────────────────────

async function groqChat(apiKey, baseUrl, model, messages, options = {}) {
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, temperature: 0.5, max_tokens: 500, ...options }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { error: true, status: res.status, details: errText };
    }

    const data = await res.json();
    return { content: data.choices?.[0]?.message?.content || '' };
  } catch (err) {
    return { error: true, details: err.message };
  }
}
