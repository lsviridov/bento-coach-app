import type { Meta, StoryObj } from '@storybook/react';
import { DayLabels7 } from './DayLabels7';

const meta: Meta<typeof DayLabels7> = {
  title: 'Components/DayLabels7',
  component: DayLabels7,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Подписи дней недели, выровненные по центрам столбиков мини-чарта.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithBackground: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="p-4 bg-card border rounded-lg">
        <Story />
      </div>
    ),
  ],
};
