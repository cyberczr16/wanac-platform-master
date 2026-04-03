/**
 * POST /api/groq/transcribe
 *
 * Server-side Groq Whisper transcription endpoint.
 * Receives an audio file (WebM/WAV/MP4) and returns the transcript text.
 *
 * Used during Fireteam live sessions — browser sends 30s audio chunks
 * from LiveKit participant audio tracks.
 *
 * Body: multipart/form-data
 *   file      — audio blob (max 25MB)
 *   language  — ISO 639-1 code (optional, default: 'en')
 *   timestamps — 'true' to get segment timestamps (for slide_captions)
 */

export async function POST(req) {
  const apiKey  = process.env.GROQ_API_KEY;
  const baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
  const model   = process.env.GROQ_MODEL_WHISPER || 'whisper-large-v3';

  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
  }

  let formData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: 'Request must be multipart/form-data' }, { status: 400 });
  }

  const file       = formData.get('file');
  const language   = formData.get('language') || 'en';
  const timestamps = formData.get('timestamps') === 'true';

  if (!file || typeof file === 'string') {
    return Response.json({ error: 'No audio file provided' }, { status: 400 });
  }

  // Check 25MB Groq limit
  if (file.size > 25 * 1024 * 1024) {
    return Response.json({
      error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Groq Whisper limit is 25MB.`,
      hint:  'Split the audio into chunks before sending.',
    }, { status: 413 });
  }

  // Build the FormData for Groq
  const groqForm = new FormData();
  groqForm.append('file', file);
  groqForm.append('model', model);
  groqForm.append('language', language);
  groqForm.append(
    'response_format',
    timestamps ? 'verbose_json' : 'text'
  );
  // Prompt helps Whisper recognise business/education vocabulary
  groqForm.append(
    'prompt',
    'Fireteam learning session. Students discussing business case studies, entrepreneurship, market research, finance.'
  );

  const groqResponse = await fetch(`${baseUrl}/audio/transcriptions`, {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body:    groqForm,
  });

  if (!groqResponse.ok) {
    const errText = await groqResponse.text();
    console.error('Groq Whisper error:', groqResponse.status, errText);

    if (groqResponse.status === 429) {
      return Response.json({
        error:      'Groq rate limit hit. Try again in 60 seconds.',
        retryAfter: groqResponse.headers.get('retry-after') || '60',
      }, { status: 429 });
    }

    return Response.json({ error: 'Groq Whisper API error', details: errText }, { status: 502 });
  }

  if (timestamps) {
    // verbose_json response — includes segments with timestamps
    const data = await groqResponse.json();
    return Response.json({
      text:     data.text,
      language: data.language,
      duration: data.duration,
      segments: (data.segments || []).map(seg => ({
        text:  seg.text.trim(),
        start: seg.start,
        end:   seg.end,
      })),
    });
  } else {
    // Plain text response
    const text = await groqResponse.text();
    return Response.json({ text: text.trim() });
  }
}
