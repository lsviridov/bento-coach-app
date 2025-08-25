import type { Meta, StoryObj } from '@storybook/react';
import { SectionCard } from './section-card';
import { Badge } from '@/components/ui/badge';
import { Flame, Droplets, Zap } from 'lucide-react';

const meta: Meta<typeof SectionCard> = {
  title: 'UI/SectionCard',
  component: SectionCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'glass'],
    },
    glow: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium text-ink mb-2">Обычная карточка</h3>
        <p className="text-muted">Текст с правильным контрастом</p>
      </div>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium text-ink mb-2">Карточка с тенью</h3>
        <p className="text-muted">С неоновым свечением</p>
      </div>
    ),
  },
};

export const WithGlow: Story = {
  args: {
    variant: 'elevated',
    glow: true,
    children: (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium text-ink mb-2">Карточка со свечением</h3>
        <p className="text-muted">Фоновое свечение под контентом</p>
      </div>
    ),
  },
};

export const Glass: Story = {
  args: {
    variant: 'glass',
    children: (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium text-ink mb-2">Стеклянная карточка</h3>
        <p className="text-muted">С эффектом backdrop-blur</p>
      </div>
    ),
  },
};

export const StatsCard: Story = {
  args: {
    variant: 'elevated',
    glow: true,
    children: (
      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="w-5 h-5 text-accent" />
          <span className="text-sm text-muted">Калории</span>
        </div>
        <div className="text-2xl font-bold text-ink">1850</div>
        <div className="text-xs text-muted">ккал</div>
      </div>
    ),
  },
};

export const BadgeExample: Story = {
  args: {
    children: (
      <div className="p-4">
        <h3 className="text-lg font-medium text-ink mb-3">Примеры бейджей</h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-brand-50 text-ink">250г</Badge>
          <Badge className="bg-accent/15 text-ink">320 ккал</Badge>
          <Badge className="bg-success/15 text-ink">Белки</Badge>
        </div>
        <p className="text-sm text-muted mt-3">
          Все бейджи используют text-ink для контраста
        </p>
      </div>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SectionCard>
        <div className="p-4">
          <h4 className="font-medium text-ink mb-2">Default</h4>
          <p className="text-sm text-muted">Обычная карточка</p>
        </div>
      </SectionCard>
      
      <SectionCard variant="elevated">
        <div className="p-4">
          <h4 className="font-medium text-ink mb-2">Elevated</h4>
          <p className="text-sm text-muted">С тенью</p>
        </div>
      </SectionCard>
      
      <SectionCard variant="glass">
        <div className="p-4">
          <h4 className="font-medium text-ink mb-2">Glass</h4>
          <p className="text-sm text-muted">Стеклянная</p>
        </div>
      </SectionCard>
    </div>
  ),
};
