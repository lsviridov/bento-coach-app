import type { Meta, StoryObj } from '@storybook/react';
import { Message } from './Message';
import { MessageT } from '../model/schemas';

const meta: Meta<typeof Message> = {
  title: 'Features/CoachChat/Message',
  component: Message,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  args: {
    message: {
      id: '1',
      role: 'user',
      content: 'Что мне есть на ужин?',
      createdAt: new Date().toISOString(),
    },
  },
};

export const AssistantMessage: Story = {
  args: {
    message: {
      id: '2',
      role: 'assistant',
      content: 'Отличный вопрос! Учитывая твои цели, рекомендую белковый ужин с овощами. Можешь добавить куриную грудку или рыбу.',
      createdAt: new Date().toISOString(),
      intents: ['suggestMeal', 'addMeal']
    },
  },
};

export const LongMessage: Story = {
  args: {
    message: {
      id: '3',
      role: 'assistant',
      content: 'Это очень длинное сообщение, которое демонстрирует, как компонент обрабатывает текст, который может не помещаться в одну строку и требует переноса на несколько строк для лучшей читаемости.',
      createdAt: new Date().toISOString(),
    },
  },
};
