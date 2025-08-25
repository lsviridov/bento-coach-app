import type { Meta, StoryObj } from '@storybook/react';
import { MiniBars7 } from './MiniBars7';

const meta: Meta<typeof MiniBars7> = {
  title: 'Components/MiniBars7',
  component: MiniBars7,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Мини-чарт с 7 барами для отображения трендов за неделю. Поддерживает зону цели, маркер сегодняшнего дня и кастомизацию цветов.',
      },
    },
  },
  argTypes: {
    values: {
      control: 'object',
      description: 'Массив из 7 значений от 0 до 1',
    },
    color: {
      control: 'color',
      description: 'Цвет баров',
    },
    targetBand: {
      control: 'object',
      description: 'Зона цели [min, max]',
    },
    todayIndex: {
      control: { type: 'number', min: 0, max: 6 },
      description: 'Индекс сегодняшнего дня (0-6)',
    },
    height: {
      control: { type: 'number', min: 44, max: 56 },
      description: 'Высота компонента',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    values: [0.5, 0.8, 0.3, 0.9, 0.6, 0.7, 0.4],
    color: 'hsl(var(--brand))',
    todayIndex: 2,
  },
};

export const WithTargetBand: Story = {
  args: {
    values: [0.5, 0.8, 0.3, 0.9, 0.6, 0.7, 0.4],
    color: 'hsl(var(--accent))',
    targetBand: [0.8, 1],
    todayIndex: 3,
  },
};

export const HighValues: Story = {
  args: {
    values: [0.9, 0.95, 0.85, 1.0, 0.9, 0.95, 0.88],
    color: 'hsl(var(--success))',
    targetBand: [0.8, 1],
    todayIndex: 5,
  },
};

export const LowValues: Story = {
  args: {
    values: [0.2, 0.1, 0.3, 0.15, 0.25, 0.2, 0.18],
    color: 'hsl(var(--warning))',
    targetBand: [0.8, 1],
    todayIndex: 1,
  },
};

export const CustomHeight: Story = {
  args: {
    values: [0.5, 0.8, 0.3, 0.9, 0.6, 0.7, 0.4],
    color: 'hsl(var(--brand))',
    todayIndex: 4,
    height: 60,
  },
};

export const WithTargetBand: Story = {
  args: {
    values: [0.5, 0.8, 0.3, 0.9, 0.6, 0.7, 0.4],
    color: 'hsl(var(--accent))',
    targetBand: [0.8, 1],
    todayIndex: 3,
  },
};
