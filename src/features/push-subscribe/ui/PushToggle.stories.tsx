import type { Meta, StoryObj } from '@storybook/react';
import { PushToggle } from './PushToggle';

const meta: Meta<typeof PushToggle> = {
  title: 'Features/PushToggle',
  component: PushToggle,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    initialEnabled: { control: 'boolean' },
    profileId: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialEnabled: false,
  },
};

export const Enabled: Story = {
  args: {
    initialEnabled: true,
  },
};

export const WithProfileId: Story = {
  args: {
    initialEnabled: false,
    profileId: '550e8400-e29b-41d4-a716-446655440000',
  },
};

export const Disabled: Story = {
  args: {
    initialEnabled: false,
  },
  parameters: {
    mockData: {
      permission: 'denied',
    },
  },
};
