import type { Meta, StoryObj } from '@storybook/react';
import { DataPrivacyCard } from './DataPrivacyCard';

const meta: Meta<typeof DataPrivacyCard> = {
  title: 'Features/DataPrivacyCard',
  component: DataPrivacyCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithTicket: Story = {
  args: {},
  parameters: {
    mockData: {
      lastTicketId: 'TCK123456',
    },
  },
};
