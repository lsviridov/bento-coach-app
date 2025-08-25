import type { Meta, StoryObj } from '@storybook/react';
import { IntentBar } from './IntentBar';
import { IntentT } from '../model/schemas';

const meta: Meta<typeof IntentBar> = {
  title: 'Features/CoachChat/IntentBar',
  component: IntentBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    intents: ['suggestMeal', 'addMeal', 'logWater'],
  },
};

export const SingleIntent: Story = {
  args: {
    intents: ['explainNutrient'],
  },
};

export const MultipleIntents: Story = {
  args: {
    intents: ['suggestMeal', 'addMeal', 'logWater', 'explainNutrient', 'suggestBundle'],
  },
};

export const NoIntents: Story = {
  args: {
    intents: [],
  },
};
