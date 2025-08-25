import type { Meta, StoryObj } from '@storybook/react';
import { AddMealModal } from './AddMealModal';
import { MealT } from '@entities/meal';

const meta: Meta<typeof AddMealModal> = {
  title: 'Features/AddMeal/AddMealModal',
  component: AddMealModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submit' },
    onClose: { action: 'close' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AddNew: Story = {
  args: {
    isOpen: true,
    isLoading: false,
  },
};

export const EditExisting: Story = {
  args: {
    isOpen: true,
    isLoading: false,
    meal: {
      id: '1',
      takenAt: '2024-01-15T08:00:00.000Z',
      title: 'Овсянка с ягодами',
      grams: 250,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3,
      photoUrl: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=200&h=200&fit=crop',
    } as MealT,
  },
};

export const Loading: Story = {
  args: {
    isOpen: true,
    isLoading: true,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    isLoading: false,
  },
};
