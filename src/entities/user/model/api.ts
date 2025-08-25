import { api } from '@/shared/api/fetcher';
import type { UserProfile, ProfileUpdateData, SupportTicket } from './types';

export async function getProfile(): Promise<UserProfile> {
  return api<UserProfile>('/api/profile');
}

export async function updateProfile(patch: ProfileUpdateData): Promise<UserProfile> {
  return api<UserProfile>('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}

export async function logout(): Promise<{ ok: boolean }> {
  return api<{ ok: boolean }>('/api/auth/logout', { method: 'POST' });
}

export async function requestDataTicket(type: 'export' | 'delete'): Promise<{ ok: boolean; id: string }> {
  return api<{ ok: boolean; id: string }>('/api/support/ticket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  });
}

export async function subscribePush(): Promise<{ ok: boolean }> {
  return api<{ ok: boolean }>('/api/push/subscribe', { method: 'POST' });
}

export async function unsubscribePush(): Promise<{ ok: boolean }> {
  return api<{ ok: boolean }>('/api/push/unsubscribe', { method: 'POST' });
}
