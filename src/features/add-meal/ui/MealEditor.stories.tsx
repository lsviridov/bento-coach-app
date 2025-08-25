import type { Meta, StoryObj } from '@storybook/react';
import { MealEditor } from './MealEditor';

const meta: Meta<typeof MealEditor> = {
  title: 'Features/MealEditor',
  component: MealEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'meal-changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultMealData = {
  title: 'Овсянка с ягодами',
  grams: 250,
  calories: 320,
  protein_g: 12.5,
  fat_g: 8.2,
  carbs_g: 52.3,
  takenAt: new Date().toISOString(),
  photoUrl: 'https://example.com/photo.jpg'
};

export const Default: Story = {
  args: {
    data: defaultMealData,
    isOffline: false,
  },
};

export const Offline: Story = {
  args: {
    data: defaultMealData,
    isOffline: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Редактор в офлайн режиме',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    data: {
      title: '',
      grams: 250,
      calories: 0,
      protein_g: 0,
      fat_g: 0,
      carbs_g: 0,
      takenAt: new Date().toISOString(),
    },
    isOffline: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Редактор с пустыми данными',
      },
    },
  },
};
