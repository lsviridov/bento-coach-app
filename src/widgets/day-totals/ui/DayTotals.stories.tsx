import type { Meta, StoryObj } from '@storybook/react';
import { DayTotals } from './DayTotals';

const meta: Meta<typeof DayTotals> = {
  title: 'Widgets/DayTotals',
  component: DayTotals,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totals: {
      water_ml: 750,
      calories: 1850,
      protein_g: 95.2,
      fat_g: 65.8,
      carbs_g: 180.3,
    },
  },
};

export const LowValues: Story = {
  args: {
    totals: {
      water_ml: 250,
      calories: 450,
      protein_g: 25.5,
      fat_g: 15.2,
      carbs_g: 45.8,
    },
  },
};

export const HighValues: Story = {
  args: {
    totals: {
      water_ml: 2000,
      calories: 3200,
      protein_g: 180.5,
      fat_g: 120.3,
      carbs_g: 350.7,
    },
  },
};

export const ZeroValues: Story = {
  args: {
    totals: {
      water_ml: 0,
      calories: 0,
      protein_g: 0,
      fat_g: 0,
      carbs_g: 0,
    },
  },
};
