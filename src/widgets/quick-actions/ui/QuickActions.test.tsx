import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuickActions } from './QuickActions';

// Mock the API calls
jest.mock('@/shared/api/fetcher', () => ({
  api: jest.fn()
}));

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('QuickActions', () => {
  it('renders all three action buttons', () => {
    renderWithProviders(<QuickActions />);
    
    expect(screen.getByText('+250 мл')).toBeInTheDocument();
    expect(screen.getByText('По фото')).toBeInTheDocument();
    expect(screen.getByText('Добавить вручную')).toBeInTheDocument();
  });

  it('shows loading state when adding water', () => {
    renderWithProviders(<QuickActions />);
    
    const waterButton = screen.getByText('+250 мл');
    fireEvent.click(waterButton);
    
    expect(screen.getByText('Добавляю...')).toBeInTheDocument();
  });
});
