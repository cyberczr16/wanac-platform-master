/**
 * Groq Connection Test Route
 * GET /api/test-groq
 *
 * Tests both the LLM endpoint (chat) and confirms the API key is valid.
 * Run this after adding GROQ_API_KEY to .env.local.
 *
 * Usage:
 *   curl http://localhost:3000/api/test-groq
 *   or open http://localhost:3000/api/test-groq in the browser
 *
 * Remove or restrict to admin-only in production.
 */

export async function GET() {
  const apiKey  = process.env.GROQ_API_KEY;
  const baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';

  // ── 1. Check key is configured ──────────────────────────────────────
  if (!apiKey || apiKey === 'your-groq-api-key-here') {
    return Response.json({
      ok: false,
      error: 'GROQ_API_KEY is not set in .env.local',
      hint: 'Get a free key at https://console.groq.com → API Keys → Create key',
    }, { status: 500 });
  }

  const results = {
    apiKeyPresent: true,
    apiKeyPrefix:  apiKey.slice(0, 8) + '...',   // Show prefix only, never log full key
    baseUrl,
    llmTest:       null,
    whisperTest:   'skipped (needs audio file — use POST /api/groq/transcribe for live test)',
    modelsAvailable: null,
    timestamp:     new Date().toISOString(),
  };

  // ── 2. Test LLM endpoint (quick hello) ──────────────────────────────
  try {
    const llmResponse = await fetch(`${baseUrl}/chat/completions`, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model:      process.env.GROQ_MODEL_SUMMARY || 'llama-3.1-8b-instant',
        messages:   [{ role: 'user', content: 'Reply with exactly: "Groq connected."' }],
        max_tokens: 10,
        temperature: 0,
      }),
    });

    if (!llmResponse.ok) {
      const errBody = await llmResponse.text();
      results.llmTest = {
        ok:     false,
        status: llmResponse.status,
        error:  errBody,
      };
    } else {
      const llmData = await llmResponse.json();
      results.llmTest = {
        ok:      true,
        model:   llmData.model,
        reply:   llmData.choices?.[0]?.message?.content?.trim(),
        tokens:  llmData.usage,
      };
    }
  } catch (err) {
    results.llmTest = { ok: false, error: err.message };
  }

  // ── 3. List available models (bonus info) ───────────────────────────
  try {
    const modelsResponse = await fetch(`${baseUrl}/models`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });

    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      results.modelsAvailable = (modelsData.data || [])
        .map(m => m.id)
        .filter(id => id.includes('llama') || id.includes('whisper') || id.includes('mixtral'))
        .sort();
    }
  } catch {
    // Non-critical — skip silently
  }

  const allOk = results.llmTest?.ok === true;

  return Response.json({
    ok: allOk,
    message: allOk
      ? '✅ Groq API is connected and working. Ready for Fireteam AI features.'
      : '❌ Groq API connection failed. Check the error details below.',
    ...results,
  }, { status: allOk ? 200 : 500 });
}
