import { apiClient } from './config';

// ── API-accurate types ────────────────────────────────────────────────────────
// Confirmed from https://api.wanac.org/docs
// Events do NOT store title, description, user_id, or community_id.
// Type values must be "Physical" or "Online" (capital first letter).
export interface EventPayload {
  type: 'Physical' | 'Online';
  date: string;           // YYYY-MM-DD
  time: string;           // HH:MM
  location?: string;      // required when type=Physical
  link?: string;          // required when type=Online
}

// Fetch all events for the authenticated user
export async function getEvents() {
  const res = await apiClient.get('/api/v1/events');
  return res.data;
}

// Add a new event — only the four documented fields are sent
export async function addEvent(data: EventPayload) {
  const res = await apiClient.post('/api/v1/events/add', data);
  return res.data;
}

// Update an event by ID
export async function updateEvent(eventId: number | string, data: EventPayload) {
  const res = await apiClient.put(`/api/v1/events/update/${eventId}`, data);
  return res.data;
}

// Delete an event by ID
export async function deleteEvent(eventId: number | string) {
  const res = await apiClient.delete(`/api/v1/events/delete/${eventId}`);
  return res.data;
}
