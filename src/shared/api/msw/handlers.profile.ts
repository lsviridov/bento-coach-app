import { http, HttpResponse } from 'msw';

// Mock profile data
const mockProfile = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  user_id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'user@example.com',
  full_name: 'Иван Иванов',
  birthdate: '1990-05-15',
  height_cm: 175,
  weight_kg: 70.5,
  allergies: ['Лактоза', 'Глютен'],
  goals: ['Энергия и бодрость', 'Поддержание формы'],
  theme: 'auto',
  push_enabled: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const profileHandlers = [
  // GET /api/profile
  http.get('/api/profile', () => {
    return HttpResponse.json(mockProfile);
  }),

  // PUT /api/profile
  http.put('/api/profile', async ({ request }) => {
    const body = await request.json();
    
    // Merge the update with existing profile
    const updatedProfile = {
      ...mockProfile,
      ...body,
      updated_at: new Date().toISOString(),
    };
    
    // Update the mock profile
    Object.assign(mockProfile, updatedProfile);
    
    return HttpResponse.json(updatedProfile);
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ ok: true });
  }),

  // POST /api/push/subscribe
  http.post('/api/push/subscribe', () => {
    // Update profile to enable push
    mockProfile.push_enabled = true;
    mockProfile.updated_at = new Date().toISOString();
    
    return HttpResponse.json({ ok: true });
  }),

  // POST /api/push/unsubscribe
  http.post('/api/push/unsubscribe', () => {
    // Update profile to disable push
    mockProfile.push_enabled = false;
    mockProfile.updated_at = new Date().toISOString();
    
    return HttpResponse.json({ ok: true });
  }),

  // POST /api/support/ticket
  http.post('/api/support/ticket', async ({ request }) => {
    const body = await request.json();
    const { type } = body;
    
    // Generate a mock ticket ID
    const ticketId = `TCK${Date.now().toString().slice(-6)}`;
    
    return HttpResponse.json({
      ok: true,
      id: ticketId,
      type,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
  }),
];
