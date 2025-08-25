import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TrendsWeek from './TrendsWeek';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const meta: Meta<typeof TrendsWeek> = {
  title: 'Widgets/TrendsWeek',
  component: TrendsWeek,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Виджет трендов недели с мини-чартами для белка и воды. Показывает прогресс за 7 дней с возможностью фокуса на конкретный день.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithMockData: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        // Здесь можно добавить MSW handlers для мока API
      ],
    },
  },
};
