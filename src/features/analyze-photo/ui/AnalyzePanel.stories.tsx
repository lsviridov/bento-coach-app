import type { Meta, StoryObj } from '@storybook/react';
import { AnalyzePanel } from './AnalyzePanel';

const meta: Meta<typeof AnalyzePanel> = {
  title: 'Features/AnalyzePanel',
  component: AnalyzePanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onComplete: { action: 'analysis-complete' },
    onError: { action: 'analysis-error' },
    setIsLoading: { action: 'set-loading' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    imageFile: new File([''], 'test.jpg', { type: 'image/jpeg' }),
    isLoading: true,
    setIsLoading: () => {},
  },
};

export const Processing: Story = {
  args: {
    imageFile: new File([''], 'test.jpg', { type: 'image/jpeg' }),
    isLoading: false,
    setIsLoading: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Состояние обработки изображения',
      },
    },
  },
};
