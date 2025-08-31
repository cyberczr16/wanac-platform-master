import axios from 'axios';

const AI_API_KEY = process.env.NEXT_PUBLIC_AI_API_KEY;
const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL;

if (!AI_API_KEY || !AI_API_URL) {
  throw new Error('AI API key or URL is not set in environment variables.');
}

export const aiClient = axios.create({
  baseURL: AI_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AI_API_KEY}`,
  },
});

export async function callAIService(payload: any) {
  // Adjust endpoint and payload as needed for your AI API
  const response = await aiClient.post('/v1/ai-endpoint', payload);
  return response.data;
}




