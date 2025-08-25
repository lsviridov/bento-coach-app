import type { Meta, StoryObj } from '@storybook/react';
import { LiveCamera } from './LiveCamera';

const meta: Meta<typeof LiveCamera> = {
  title: 'Features/LiveCamera',
  component: LiveCamera,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onCapture: { action: 'photo-captured' },
    onClose: { action: 'camera-closed' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Полноэкранная камера с возможностью съёмки фото',
      },
    },
  },
};

export const WithError: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Камера с ошибкой доступа',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Мокаем ошибку доступа к камере
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = () => 
      Promise.reject(new Error('Permission denied'));
    
    // Восстанавливаем оригинальную функцию после теста
    setTimeout(() => {
      navigator.mediaDevices.getUserMedia = originalGetUserMedia;
    }, 1000);
  },
};
