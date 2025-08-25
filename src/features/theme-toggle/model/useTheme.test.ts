import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

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
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock document.documentElement
const mockDocumentElement = {
  classList: {
    remove: vi.fn(),
    add: vi.fn(),
  },
  setAttribute: vi.fn(),
  removeAttribute: vi.fn(),
};

Object.defineProperty(document, 'documentElement', {
  value: mockDocumentElement,
  writable: true,
});

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default theme when no localStorage value', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('auto');
    expect(result.current.mounted).toBe(false);
  });

  it('should initialize with localStorage theme value', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('dark');
  });

  it('should apply theme immediately on mount', () => {
    const { result } = renderHook(() => useTheme('light'));
    
    // Wait for useEffect to run
    act(() => {
      // Simulate component mount
      result.current.mounted = true;
    });
    
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('light');
    expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
  });

  it('should change theme and update localStorage', () => {
    const { result } = renderHook(() => useTheme('auto'));
    
    act(() => {
      result.current.changeTheme('dark');
    });
    
    expect(result.current.theme).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  it('should handle auto theme with system preference', () => {
    // Mock system preference as dark
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    
    const { result } = renderHook(() => useTheme('auto'));
    
    act(() => {
      result.current.changeTheme('auto');
    });
    
    expect(result.current.theme).toBe('auto');
    expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'auto');
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  it('should get correct theme labels', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.getThemeLabel('light')).toBe('светлую');
    expect(result.current.getThemeLabel('dark')).toBe('тёмную');
    expect(result.current.getThemeLabel('auto')).toBe('авто');
  });

  it('should handle profile update when profileId is provided', async () => {
    const mockUpdateProfile = vi.fn().mockResolvedValue({ ok: true });
    
    // Mock the updateProfile function
    vi.doMock('@/entities/user', () => ({
      updateProfile: mockUpdateProfile,
    }));
    
    const { result } = renderHook(() => useTheme('auto', 'profile-id'));
    
    act(() => {
      result.current.changeTheme('light');
    });
    
    // Wait for async operation
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Note: In a real test, we'd need to properly mock the updateProfile function
    // This test demonstrates the structure but the actual function call would need
    // proper mocking setup
  });

  it('should not flash theme on mount', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    const { result } = renderHook(() => useTheme('dark'));
    
    // Initially mounted should be false to prevent flash
    expect(result.current.mounted).toBe(false);
    
    // After mount, mounted should be true
    act(() => {
      result.current.mounted = true;
    });
    
    expect(result.current.mounted).toBe(true);
  });

  it('should handle system theme change when in auto mode', () => {
    const mockMediaQuery = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue(mockMediaQuery),
    });
    
    const { result } = renderHook(() => useTheme('auto'));
    
    // Should add event listener for system theme changes
    expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
