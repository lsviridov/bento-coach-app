import type { Meta, StoryObj } from '@storybook/react';
import { ProfileHeader } from './ProfileHeader';

const meta: Meta<typeof ProfileHeader> = {
  title: 'Widgets/ProfileHeader',
  component: ProfileHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    email: { control: 'text' },
    fullName: { control: 'text' },
    onLogout: { action: 'logout' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    email: 'user@example.com',
    fullName: 'Иван Иванов',
  },
};

export const NoName: Story = {
  args: {
    email: 'user@example.com',
    fullName: null,
  },
};

export const LongName: Story = {
  args: {
    email: 'user@example.com',
    fullName: 'Александр Александрович Александров',
  },
};

export const LongEmail: Story = {
  args: {
    email: 'very.long.email.address@very.long.domain.example.com',
    fullName: 'Иван Иванов',
  },
};
