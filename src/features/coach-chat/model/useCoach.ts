import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { CoachRequest, CoachResponse, Session, Message } from './schemas';
import { api } from '@shared/api/fetcher';

export const useSessions = () =>
  useQuery({
    queryKey: ['coach', 'sessions'],
    queryFn: async () => {
      const res = await api('/api/coach/sessions');
      return z.array(Session).parse(res);
    },
    staleTime: 60000
  });

export const useMessages = (sessionId: string) =>
  useQuery({
    queryKey: ['coach', 'messages', sessionId],
    queryFn: async () => {
      const res = await api(`/api/coach/messages?sessionId=${sessionId}`);
      return z.array(Message).parse(res);
    },
    enabled: !!sessionId
  });

export const useSend = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: unknown) => {
      const valid = CoachRequest.parse(payload);
      const res = await api('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valid)
      });
      return CoachResponse.parse(res);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['coach', 'messages', data.sessionId] });
      qc.invalidateQueries({ queryKey: ['coach', 'sessions'] });
    }
  });
};
