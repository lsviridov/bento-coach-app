import type { Meta, StoryObj } from '@storybook/react';
import { MealCard } from './MealCard';
import { MealT } from '../model/schemas';

const meta: Meta<typeof MealCard> = {
  title: 'Entities/Meal/MealCard',
  component: MealCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onEdit: { action: 'edit' },
    onDelete: { action: 'delete' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultMeal: MealT = {
  id: '1',
  takenAt: '2024-01-15T08:00:00.000Z',
  title: 'Овсянка с ягодами',
  grams: 250,
  calories: 320,
  protein_g: 12.5,
  fat_g: 8.2,
  carbs_g: 52.3,
};

export const Default: Story = {
  args: {
    meal: defaultMeal,
  },
};

export const WithPhoto: Story = {
  args: {
    meal: {
      ...defaultMeal,
      photoUrl: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=200&h=200&fit=crop',
    },
  },
};

export const LongTitle: Story = {
  args: {
    meal: {
      ...defaultMeal,
      title: 'Очень длинное название приёма пищи с множеством слов для проверки обрезки текста',
    },
  },
};

export const HighCalories: Story = {
  args: {
    meal: {
      ...defaultMeal,
      title: 'Стейк с картошкой',
      grams: 400,
      calories: 850,
      protein_g: 65.2,
      fat_g: 45.8,
      carbs_g: 78.3,
    },
  },
};
