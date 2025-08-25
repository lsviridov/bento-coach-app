export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), 15000);
  
  try {
    // In development, use relative paths so MSW can intercept them
    const baseUrl = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');
    const fullUrl = `${baseUrl}${path}`;
    console.log('API request to:', fullUrl);
    console.log('API request method:', init?.method || 'GET');
    console.log('API request headers:', init?.headers);
    
    const res = await fetch(fullUrl, { 
      ...init, 
      signal: ctrl.signal 
    });
    
    console.log('API response status:', res.status, res.statusText);
    console.log('API response headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      throw new Error(`API ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('API response data:', data);
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  } finally { 
    clearTimeout(id); 
  }
}
