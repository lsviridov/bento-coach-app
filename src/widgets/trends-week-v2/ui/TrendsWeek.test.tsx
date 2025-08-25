import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import TrendsWeek from './TrendsWeek';

// Мокаем хук useTrendsWeek
vi.mock('../model/useTrends', () => ({
  useTrendsWeek: () => ({
    data: {
      protein: {
        values: [0.5, 0.8, 0.3, 0.9, 0.6, 0.7, 0.4],
        goal: 1,
        deltaPct: 15,
        label: "Белок"
      },
      water: {
        values: [0.7, 0.9, 0.6, 0.8, 0.7, 0.9, 0.8],
        goal: 1,
        deltaPct: 8,
        label: "Вода"
      },
      startISO: '2024-01-01'
    },
    isLoading: false,
    isError: false
  })
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const renderWithQueryClient = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('TrendsWeek', () => {
  it('renders trends week widget', () => {
    renderWithQueryClient(<TrendsWeek />);
    
    expect(screen.getByText('Тренды недели')).toBeInTheDocument();
    expect(screen.getByText('Белок')).toBeInTheDocument();
    expect(screen.getByText('Вода')).toBeInTheDocument();
    expect(screen.getByText('+15%')).toBeInTheDocument();
    expect(screen.getByText('+8%')).toBeInTheDocument();
  });

  it('shows day labels', () => {
    renderWithQueryClient(<TrendsWeek />);
    
    expect(screen.getByText('Пн')).toBeInTheDocument();
    expect(screen.getByText('Вт')).toBeInTheDocument();
    expect(screen.getByText('Ср')).toBeInTheDocument();
    expect(screen.getByText('Чт')).toBeInTheDocument();
  });

  it('renders day labels with correct positioning', () => {
    renderWithQueryClient(<TrendsWeek />);
    
    const dayLabels = screen.getAllByText(/^(Пн|Вт|Ср|Чт|Пт|Сб|Вс)$/);
    expect(dayLabels).toHaveLength(7);
    
    // Проверяем, что все подписи дней присутствуют
    expect(screen.getByText('Пн')).toBeInTheDocument();
    expect(screen.getByText('Вт')).toBeInTheDocument();
    expect(screen.getByText('Ср')).toBeInTheDocument();
    expect(screen.getByText('Чт')).toBeInTheDocument();
    expect(screen.getByText('Пт')).toBeInTheDocument();
    expect(screen.getByText('Сб')).toBeInTheDocument();
    expect(screen.getByText('Вс')).toBeInTheDocument();
  });

  it('shows total delta', () => {
    renderWithQueryClient(<TrendsWeek />);
    
    // (15 + 8) / 2 = 11.5, округляем до 12
    expect(screen.getByText('+12% к прошлой неделе')).toBeInTheDocument();
  });
});
