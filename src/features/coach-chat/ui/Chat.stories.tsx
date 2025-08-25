import type { Meta, StoryObj } from '@storybook/react';
import { Chat } from './Chat';
import { MessageT } from '../model/schemas';

const meta: Meta<typeof Chat> = {
  title: 'Features/CoachChat/Chat',
  component: Chat,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockMessages: MessageT[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Привет! Я твой персональный нутрициолог. Чем могу помочь?',
    createdAt: new Date(Date.now() - 60000).toISOString(),
    intents: ['explainNutrient', 'suggestMeal']
  },
  {
    id: '2',
    role: 'user',
    content: 'Что мне есть на ужин?',
    createdAt: new Date(Date.now() - 30000).toISOString()
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Отличный вопрос! Учитывая твои цели, рекомендую белковый ужин с овощами. Можешь добавить куриную грудку или рыбу.',
    createdAt: new Date().toISOString(),
    intents: ['suggestMeal', 'addMeal']
  }
];

export const Default: Story = {
  args: {
    messages: mockMessages,
  },
};

export const Loading: Story = {
  args: {
    messages: [],
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    messages: [],
    error: 'Ошибка загрузки чата',
  },
};

export const Empty: Story = {
  args: {
    messages: [],
  },
};
