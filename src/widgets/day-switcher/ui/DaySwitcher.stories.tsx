import type { Meta, StoryObj } from '@storybook/react';
import { DaySwitcher } from './DaySwitcher';

const meta: Meta<typeof DaySwitcher> = {
  title: 'Widgets/DaySwitcher',
  component: DaySwitcher,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onPrev: { action: 'prev' },
    onNext: { action: 'next' },
    onDateSelect: { action: 'dateSelect' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Today: Story = {
  args: {
    dateISO: new Date().toISOString().split('T')[0],
  },
};

export const Yesterday: Story = {
  args: {
    dateISO: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
};

export const Tomorrow: Story = {
  args: {
    dateISO: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
};

export const CustomDate: Story = {
  args: {
    dateISO: '2024-01-15',
  },
};
