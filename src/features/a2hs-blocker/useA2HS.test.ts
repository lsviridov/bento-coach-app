import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useA2HS } from './useA2HS';

// Mock environment variables
vi.stubEnv('VITE_FORCE_A2HS', '1');

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock navigator
Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  configurable: true,
});

describe('useA2HS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should detect iOS platform correctly', () => {
    const { result } = renderHook(() => useA2HS());
    
    expect(result.current.platform).toBe('ios');
  });

  it('should detect Android platform correctly', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
      configurable: true,
    });

    const { result } = renderHook(() => useA2HS());
    
    expect(result.current.platform).toBe('android');
  });

  it('should detect in-app browser correctly', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Instagram 123.0.0.21.114',
      configurable: true,
    });

    const { result } = renderHook(() => useA2HS());
    
    expect(result.current.inApp).toBe(true);
  });

  it('should not block when VITE_FORCE_A2HS is 0', () => {
    vi.stubEnv('VITE_FORCE_A2HS', '0');
    
    const { result } = renderHook(() => useA2HS());
    
    expect(result.current.shouldBlock).toBe(false);
  });

  it('should not block when dev-bypass is in URL', () => {
    // Mock URL with dev-bypass
    Object.defineProperty(window, 'location', {
      value: {
        search: '?dev-bypass=1',
      },
      writable: true,
    });

    const { result } = renderHook(() => useA2HS());
    
    expect(result.current.shouldBlock).toBe(false);
  });

  it('should not block when already installed', () => {
    localStorageMock.getItem.mockReturnValue('1');
    
    const { result } = renderHook(() => useA2HS());
    
    expect(result.current.shouldBlock).toBe(false);
  });
});
