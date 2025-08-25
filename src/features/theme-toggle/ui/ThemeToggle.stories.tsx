import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Features/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    initialTheme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'auto'],
    },
    profileId: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialTheme: 'auto',
  },
};

export const Light: Story = {
  args: {
    initialTheme: 'light',
  },
};

export const Dark: Story = {
  args: {
    initialTheme: 'dark',
  },
};

export const WithProfileId: Story = {
  args: {
    initialTheme: 'auto',
    profileId: '550e8400-e29b-41d4-a716-446655440000',
  },
};
