# TrendsWeek v2 Widget

Виджет трендов недели с мини-чартами для отображения прогресса по белку и воде за 7 дней.

## Особенности

- **Мини-чарты**: 7 крупных столбиков для каждой метрики
- **Зона цели**: визуальное отображение целевого диапазона
- **Маркер "сегодня"**: круглый индикатор текущего дня
- **Интерактивность**: тап по дню подсвечивает соответствующую колонку
- **Синхронизация**: фокус на день применяется к обоим рядам одновременно
- **Дельта**: показ изменений к прошлой неделе для каждой метрики

## Структура

```
src/widgets/trends-week-v2/
├── model/
│   ├── schemas.ts      # Zod схемы данных
│   └── useTrends.ts    # React Query хук
├── ui/
│   ├── chart-7-const.ts # Константы сетки для 7 столбиков
│   ├── MiniBars7.tsx   # Компонент мини-чарта
│   ├── DayLabels7.tsx  # Подписи дней недели
│   ├── TrendsWeek.tsx  # Основной виджет
│   └── *.stories.tsx   # Storybook stories
├── index.ts            # Публичный API
└── README.md           # Документация
```

## Использование

```tsx
import { TrendsWeek } from '@widgets/trends-week-v2';

function HomePage() {
  return (
    <div>
      <TrendsWeek />
    </div>
  );
}
```

## Константы сетки

```ts
import { BARS7, WIDTH, SLOT_CENTER } from '@widgets/trends-week-v2';

// Размеры столбиков
BARS7.BAR_W = 14;    // ширина столбика
BARS7.GAP = 12;       // промежуток между столбиками
BARS7.HEIGHT = 56;    // высота чарта

// Общая ширина
WIDTH = 170;          // 7 × 14 + 6 × 12

// Центр i-го слота
SLOT_CENTER(i)        // позиция для выравнивания подписей
```

## API

### MiniBars7

```tsx
<MiniBars7
  values={[0.5, 0.8, 0.3, 0.9, 0.6, 0.7, 0.4]}
  color="hsl(var(--brand))"
  targetBand={[0.8, 1]}
  todayIndex={2}
  height={52}
/>
```

**Props:**
- `values`: массив из 7 значений 0..1 (доля от цели)
- `color`: CSS цвет для баров
- `targetBand`: опциональная зона цели [min, max]
- `todayIndex`: индекс сегодняшнего дня (0-6)
- `height`: высота компонента (44-56px)

### DayLabels7

```tsx
<DayLabels7 />
```

Компонент подписей дней недели, автоматически выровненных по центрам столбиков.

### TrendsWeek

Основной виджет, который автоматически:
- Загружает данные через `useTrendsWeek`
- Отображает loading/error состояния
- Управляет фокусом на дни недели
- Показывает общую дельту
- Выравнивает столбики и подписи по фиксированной сетке

## Данные

Виджет ожидает данные в формате:

```ts
interface TrendsWeek {
  protein: WeekSeries;
  water: WeekSeries;
  startISO: string; // понедельник недели
}

interface WeekSeries {
  values: number[];     // 7 значений 0..1
  goal: number;         // целевое значение
  deltaPct: number;     // дельта к прошлой неделе
  label: string;        // название метрики
}
```

## Стилизация

Использует CSS переменные из дизайн-системы:
- `--brand`: цвет для белка
- `--accent`: цвет для воды
- `--surface`: фон карточки
- `--border`: границы и оси

## Тестирование

```bash
# Запуск тестов
npm test -- --run src/widgets/trends-week-v2

# Запуск Storybook
npm run storybook
```

## Миграция с TrendsMini

Замените импорт в главной странице:

```tsx
// Было
import { TrendsMini } from '@/widgets/trends-mini';

// Стало
import { TrendsWeek } from '@/widgets/trends-week-v2';
```

Новый виджет полностью совместим по API и автоматически загружает данные.
