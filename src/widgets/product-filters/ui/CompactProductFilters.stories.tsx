import type { Meta, StoryObj } from '@storybook/react';
import { CompactProductFilters } from './CompactProductFilters';

const meta: Meta<typeof CompactProductFilters> = {
  title: 'Widgets/ProductFilters/CompactProductFilters',
  component: CompactProductFilters,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Дополнительные CSS классы',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithActiveFilters: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Компонент с активными фильтрами показывает бейджи и счетчик',
      },
    },
  },
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Адаптивная версия для мобильных устройств',
      },
    },
  },
};
