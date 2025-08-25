import type { Meta, StoryObj } from '@storybook/react';
import { CameraUploader } from './CameraUploader';

const meta: Meta<typeof CameraUploader> = {
  title: 'Features/CameraUploader',
  component: CameraUploader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onImageSelect: { action: 'image-selected' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Processing: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Состояние обработки изображения',
      },
    },
  },
};
