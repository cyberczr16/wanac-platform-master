/**
 * POST /api/groq/insights
 *
 * Extract structured insight tags from a group discussion transcript.
 * Powers the Conversation Map analytics view on the results page.
 *
 * Body (JSON):
 *   groupTranscript: string  — Full combined transcript from all participants
 *   keyConcepts:     string[] — Key concepts the group should have covered
 */

export async function POST(req) {
  const apiKey  = process.env.GROQ_API_KEY;
  const baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
  const model   = process.env.GROQ_MODEL_SUMMARY || 'llama-3.1-8b-instant';

  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.groupTranscript) {
    return Response.json({ error: 'groupTranscript is required' }, { status: 400 });
  }

  const { groupTranscript, keyConcepts = [] } = body;
  const conceptsText = keyConcepts.join(', ') || 'general business concepts';

  const prompt = `Analyze this Fireteam group discussion and extract structured insights.

Key Concepts the group should have covered: ${conceptsText}

Group Transcript:
${groupTranscript}

Return a JSON object with a "tags" array of up to 10 insight tags:
{
  "tags": [
    { "insightType": "theme", "label": "Equity dilution risk", "relevanceScore": 0.92 },
    { "insightType": "missed_concept", "label": "Post-money valuation", "relevanceScore": 0.71 },
    { "insightType": "strong_point", "label": "Customer interview design", "relevanceScore": 0.88 },
    { "insightType": "question_raised", "label": "When to pivot vs persist?", "relevanceScore": 0.65 }
  ]
}

insightType values: "theme" | "missed_concept" | "strong_point" | "question_raised"
relevanceScore: 0.0 (barely mentioned) → 1.0 (heavily discussed)`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages:        [{ role: 'user', content: prompt }],
      temperature:     0.2,
      max_tokens:      600,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    return Response.json({ error: 'Groq insights API error' }, { status: 502 });
  }

  const data = await res.json();
  let parsed = {};
  try {
    parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
  } catch {
    return Response.json({ tags: [] });
  }

  // Normalise — Groq may return { tags: [] } or { results: [] } etc.
  const tags = parsed.tags || parsed.results || Object.values(parsed)[0] || [];

  return Response.json({ tags: Array.isArray(tags) ? tags : [] });
}
