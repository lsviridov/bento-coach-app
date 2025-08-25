import type { Meta, StoryObj } from '@storybook/react';
import { ProfileForm } from './ProfileForm';
import type { ProfileT } from '../model/schemas';

const mockProfile: ProfileT = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  user_id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'user@example.com',
  full_name: 'Иван Иванов',
  birthdate: '1990-05-15',
  height_cm: 175,
  weight_kg: 70.5,
  allergies: ['Лактоза', 'Глютен'],
  goals: ['Энергия и бодрость', 'Поддержание формы'],
  theme: 'auto',
  push_enabled: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const emptyProfile: ProfileT = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  user_id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'user@example.com',
  full_name: null,
  birthdate: null,
  height_cm: null,
  weight_kg: null,
  allergies: [],
  goals: [],
  theme: 'auto',
  push_enabled: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const meta: Meta<typeof ProfileForm> = {
  title: 'Features/ProfileForm',
  component: ProfileForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    profile: { control: 'object' },
    onUpdate: { action: 'update' },
    isUpdating: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    profile: mockProfile,
    onUpdate: (data) => console.log('Profile update:', data),
    isUpdating: false,
  },
};

export const Empty: Story = {
  args: {
    profile: emptyProfile,
    onUpdate: (data) => console.log('Profile update:', data),
    isUpdating: false,
  },
};

export const Loading: Story = {
  args: {
    profile: mockProfile,
    onUpdate: (data) => console.log('Profile update:', data),
    isUpdating: true,
  },
};

export const WithManyGoals: Story = {
  args: {
    profile: {
      ...mockProfile,
      goals: [
        'Энергия и бодрость',
        'Восстановление мышц',
        'Похудение',
        'Набор массы',
        'Поддержание формы',
        'Улучшение сна',
        'Детоксикация',
        'Иммунитет'
      ],
    },
    onUpdate: (data) => console.log('Profile update:', data),
    isUpdating: false,
  },
};

export const WithManyAllergies: Story = {
  args: {
    profile: {
      ...mockProfile,
      allergies: [
        'Глютен',
        'Лактоза',
        'Орехи',
        'Морепродукты',
        'Яйца',
        'Соя',
        'Рыба',
        'Мед'
      ],
    },
    onUpdate: (data) => console.log('Profile update:', data),
    isUpdating: false,
  },
};
