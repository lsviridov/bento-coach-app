import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useActiveTab } from './useActiveTab';
import type { BottomTab } from './types';

// Mock для react-router-dom
const mockUseLocation = vi.fn();
vi.mock('react-router-dom', () => ({
  useLocation: () => mockUseLocation(),
}));

const mockItems: BottomTab[] = [
  { key: 'home', href: '/', icon: () => null, label: 'Главная' },
  { key: 'camera', href: '/camera', icon: () => null, label: 'Камера' },
  { key: 'diary', href: '/diary', icon: () => null, label: 'Дневник' },
  { key: 'shop', href: '/shop', icon: () => null, label: 'Магазин' },
  { key: 'profile', href: '/profile', icon: () => null, label: 'Профиль' },
  { key: 'coach', href: '/coach', icon: () => null, label: 'Коуч' },
];

describe('useActiveTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('возвращает explicit ключ если передан', () => {
    mockUseLocation.mockReturnValue({ pathname: '/camera' });
    
    const { result } = renderHook(() => useActiveTab(mockItems, 'diary'));
    
    expect(result.current).toBe('diary');
  });

  it('вычисляет активный таб по pathname - точное совпадение', () => {
    mockUseLocation.mockReturnValue({ pathname: '/camera' });
    
    const { result } = renderHook(() => useActiveTab(mockItems));
    
    expect(result.current).toBe('camera');
  });

  it('вычисляет активный таб по pathname - начало совпадает', () => {
    mockUseLocation.mockReturnValue({ pathname: '/camera/upload' });
    
    const { result } = renderHook(() => useActiveTab(mockItems));
    
    expect(result.current).toBe('camera');
  });

  it('возвращает первый таб если путь не найден', () => {
    mockUseLocation.mockReturnValue({ pathname: '/unknown' });
    
    const { result } = renderHook(() => useActiveTab(mockItems));
    
    expect(result.current).toBe('home');
  });

  it('возвращает home если массив пустой', () => {
    mockUseLocation.mockReturnValue({ pathname: '/camera' });
    
    const { result } = renderHook(() => useActiveTab([]));
    
    expect(result.current).toBe('home');
  });

  it('работает с корневым путем', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' });
    
    const { result } = renderHook(() => useActiveTab(mockItems));
    
    expect(result.current).toBe('home');
  });
});
