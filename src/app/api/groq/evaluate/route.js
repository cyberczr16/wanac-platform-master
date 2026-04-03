/**
 * POST /api/groq/evaluate
 *
 * Bloom's Taxonomy evaluation using Groq LLM (llama-3.3-70b-versatile).
 * Triggered when a Fireteam session reaches the processing slide (slideType 11).
 *
 * Body (JSON):
 * {
 *   transcript: string,          — Full discussion transcript for one participant
 *   rubrics: [{ id, rubric, rubricPrompt }],
 *   experience: { name, keyConcepts?, learningObjectives? },
 *   userId: string,
 *   userName: string,
 * }
 *
 * Returns:
 * {
 *   userId, userName,
 *   rubricResults: [{ rubricId, rubric, score (0-6), scoreLabel, arguments[], justification }],
 *   overallBloomsScore: number,
 *   engagementLevel: 'high'|'medium'|'low'
 * }
 */

const BLOOMS_LABELS = {
  0: 'Did Not Discuss',
  1: 'Remembering',
  2: 'Understanding',
  3: 'Applying',
  4: 'Analyzing',
  5: 'Evaluating',
  6: 'Creating',
};

export async function POST(req) {
  const apiKey  = process.env.GROQ_API_KEY;
  const baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
  const model   = process.env.GROQ_MODEL_EVALUATION || 'llama-3.3-70b-versatile';

  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.transcript || !body?.rubrics || !body?.userId) {
    return Response.json({
      error: 'Required fields: transcript, rubrics (array), userId',
    }, { status: 400 });
  }

  const { transcript, rubrics, experience = {}, userId, userName = 'Student' } = body;

  // Build evaluation prompt
  const keyConcepts        = Array.isArray(experience.keyConcepts)
    ? experience.keyConcepts.join(', ')
    : (experience.keyConcepts || '');
  const learningObjectives = Array.isArray(experience.learningObjectives)
    ? experience.learningObjectives.map((o, i) => `${i + 1}. ${o}`).join('\n')
    : '';

  const systemPrompt = `You are an educational AI evaluator trained in Bloom's Taxonomy for business case study discussions.

Evaluate the student's participation using ONLY evidence from their transcript.

BLOOM'S TAXONOMY SCORING (0–6):
0=Did Not Discuss, 1=Remembering, 2=Understanding, 3=Applying, 4=Analyzing, 5=Evaluating, 6=Creating

RULES:
- Score 0 if the student never discussed the topic.
- Be conservative. Don't assume implied understanding.
- arguments[] must be direct quotes or close paraphrases from the transcript.
- Return valid JSON only, no markdown formatting.

Response format:
{
  "results": [
    {
      "rubric_id": <number>,
      "score": <0-6>,
      "arguments": ["quote from transcript", ...],
      "justification": "One paragraph explaining the score."
    }
  ]
}`;

  const userMessage = `CASE STUDY: ${experience.name || 'Fireteam Experience'}
Key Concepts: ${keyConcepts}
${learningObjectives ? `Learning Objectives:\n${learningObjectives}` : ''}

STUDENT: ${userName}
TRANSCRIPT:
${transcript || '[No transcript captured]'}

RUBRICS TO EVALUATE (score each one):
${JSON.stringify(
  rubrics.map(r => ({ id: r.id, rubric: r.rubric, rubricPrompt: r.rubricPrompt })),
  null, 2
)}

Score ${userName} on every rubric above. Return results for all ${rubrics.length} rubric(s).`;

  const groqResponse = await fetch(`${baseUrl}/chat/completions`, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage },
      ],
      temperature:     0.1,
      max_tokens:      2048,
      response_format: { type: 'json_object' },
    }),
  });

  if (!groqResponse.ok) {
    const errText = await groqResponse.text();
    if (groqResponse.status === 429) {
      return Response.json({ error: 'Rate limited', retryAfter: groqResponse.headers.get('retry-after') }, { status: 429 });
    }
    return Response.json({ error: 'Groq evaluation error', details: errText }, { status: 502 });
  }

  const groqData  = await groqResponse.json();
  const rawContent = groqData.choices?.[0]?.message?.content || '{}';

  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    return Response.json({ error: 'Could not parse Groq JSON response', raw: rawContent }, { status: 502 });
  }

  const rawResults = parsed.results || [];

  // Enrich with score labels, clamp scores, match rubric names
  const rubricResults = rawResults.map(r => {
    const score    = Math.max(0, Math.min(6, parseInt(r.score) || 0));
    const rubricDef = rubrics.find(rb => rb.id === r.rubric_id);
    return {
      rubricId:      r.rubric_id,
      rubric:        rubricDef?.rubric || `Rubric ${r.rubric_id}`,
      score,
      scoreLabel:    BLOOMS_LABELS[score],
      arguments:     Array.isArray(r.arguments) ? r.arguments : [],
      justification: r.justification || '',
    };
  });

  // Compute derived fields
  const scores             = rubricResults.map(r => r.score);
  const overallBloomsScore = scores.length
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    : 0;

  const engagementLevel =
    overallBloomsScore >= 4 ? 'high' :
    overallBloomsScore >= 2 ? 'medium' : 'low';

  return Response.json({
    userId,
    userName,
    rubricResults,
    overallBloomsScore,
    engagementLevel,
    model: groqData.model,
    usage: groqData.usage,
  });
}
