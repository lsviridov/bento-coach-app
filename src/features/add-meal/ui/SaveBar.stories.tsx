import type { Meta, StoryObj } from '@storybook/react';
import { SaveBar } from './SaveBar';

const meta: Meta<typeof SaveBar> = {
  title: 'Features/SaveBar',
  component: SaveBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSave: { action: 'save-clicked' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '200px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isSaving: false,
    isOffline: false,
  },
};

export const Saving: Story = {
  args: {
    isSaving: true,
    isOffline: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Состояние сохранения',
      },
    },
  },
};

export const Offline: Story = {
  args: {
    isSaving: false,
    isOffline: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Панель в офлайн режиме',
      },
    },
  },
};

export const SavingOffline: Story = {
  args: {
    isSaving: true,
    isOffline: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Сохранение черновика в офлайн режиме',
      },
    },
  },
};
