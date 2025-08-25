import { useMemo } from 'react';

export function useToday() {
  return useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);
}
