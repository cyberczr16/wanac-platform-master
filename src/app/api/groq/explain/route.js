/**
 * POST /api/groq/explain
 *
 * Generate a quiz question explanation using Groq LLM.
 * Shown to students when they pick the wrong answer in the pre-work quiz.
 *
 * Body (JSON):
 *   questionText:    string  — The quiz question
 *   correctAnswer:   string  — The correct option text
 *   wrongAnswers:    string[] — The incorrect option texts
 *   experienceName?: string  — Case study title for context
 */

export async function POST(req) {
  const apiKey  = process.env.GROQ_API_KEY;
  const baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
  const model   = process.env.GROQ_MODEL_SUMMARY || 'llama3-8b-8192';

  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.questionText || !body?.correctAnswer) {
    return Response.json({ error: 'questionText and correctAnswer are required' }, { status: 400 });
  }

  const { questionText, correctAnswer, wrongAnswers = [], experienceName = '' } = body;
  const wrongList = wrongAnswers.join('; ') || 'other options';

  const prompt = `You are a learning coach for a business case study${experienceName ? ` titled "${experienceName}"` : ''}.

Quiz question: "${questionText}"
Correct answer: "${correctAnswer}"
Incorrect options: ${wrongList}

Write 2–3 clear, encouraging sentences that:
1. Explain WHY the correct answer is right
2. Address a common misconception from the wrong options (if obvious)
3. Connect the answer to the case study context

Keep it friendly, educational, and under 60 words. Do NOT start with "The correct answer is".`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages:    [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens:  150,
    }),
  });

  if (!res.ok) {
    return Response.json({ error: 'Groq explain API error' }, { status: 502 });
  }

  const data        = await res.json();
  const explanation = data.choices?.[0]?.message?.content?.trim() || '';

  return Response.json({ explanation });
}
