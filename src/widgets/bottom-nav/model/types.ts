export type BottomTab = {
  key: 'home' | 'camera' | 'diary' | 'shop' | 'profile' | 'coach';
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

export type BottomNavProps = {
  items: BottomTab[];
  activeKey?: BottomTab['key'];      // если не задан — вычисляем по pathname
  onChange?: (key: BottomTab['key']) => void;
};
