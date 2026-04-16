export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) {
      return new Response(JSON.stringify({ error: 'No message provided' }), { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
    const model = process.env.GROQ_MODEL_CHAT || 'llama-3.1-8b-instant';

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GROQ_API_KEY not configured' }), { status: 500 });
    }

    const groqRes = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await groqRes.json();
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ reply: data.choices[0].message.content }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
