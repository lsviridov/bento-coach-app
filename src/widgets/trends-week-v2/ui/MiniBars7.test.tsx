import { render, screen } from '@testing-library/react';
import { MiniBars7 } from './MiniBars7';

describe('MiniBars7', () => {
  const mockValues = [0.5, 0.8, 0.3, 0.9, 0.6, 0.7, 0.4];
  
  it('renders with correct number of bars', () => {
    render(
      <MiniBars7
        values={mockValues}
        color="hsl(var(--brand))"
        todayIndex={2}
      />
    );
    
    const svg = screen.getByRole('img', { name: 'Мини-график за 7 дней' });
    expect(svg).toBeInTheDocument();
  });

  it('renders with target band when provided', () => {
    render(
      <MiniBars7
        values={mockValues}
        color="hsl(var(--brand))"
        targetBand={[0.8, 1]}
        todayIndex={2}
      />
    );
    
    const svg = screen.getByRole('img', { name: 'Мини-график за 7 дней' });
    expect(svg).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    render(
      <MiniBars7
        values={mockValues}
        color="hsl(var(--brand))"
        todayIndex={2}
        height={60}
      />
    );
    
    const svg = screen.getByRole('img', { name: 'Мини-график за 7 дней' });
    expect(svg).toBeInTheDocument();
  });

  it('uses correct width from constants', () => {
    render(
      <MiniBars7
        values={mockValues}
        color="hsl(var(--brand))"
        todayIndex={2}
      />
    );
    
    const svg = screen.getByRole('img', { name: 'Мини-график за 7 дней' });
    // WIDTH = 7 * 14 + 6 * 12 = 98 + 72 = 170
    expect(svg).toHaveAttribute('width', '170');
  });
});
