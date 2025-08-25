import { api } from '@/shared/api/fetcher';
import { AnalyzeRequest, AnalyzeResponse } from './schemas';

export async function analyzePhoto(imageUrl: string) {
  const requestData: AnalyzeRequest = { imageUrl };
  const json = await api('/api/analyze', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(requestData) 
  });
  return AnalyzeResponse.parse(json);
}

export function useAnalyze() {
  return { analyzePhoto };
}
