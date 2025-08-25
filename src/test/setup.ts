import '@testing-library/jest-dom';

// Mock MSW for tests
vi.mock('msw/browser', () => ({
  setupWorker: vi.fn(() => ({
    start: vi.fn(),
    use: vi.fn(),
    resetHandlers: vi.fn(),
  })),
}));

// Mock environment variables
vi.stubEnv('VITE_USE_MSW', '0');
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000');
