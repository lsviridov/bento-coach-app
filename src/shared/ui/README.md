# UI Components - Bento Coach

Библиотека переиспользуемых UI компонентов для приложения Bento Coach, построенная на современной дизайн-системе.

## Цветовая палитра

Проект использует современную, гармоничную цветовую палитру с полной поддержкой светлой и темной тем:

### Основные цвета
- **Brand**: Современный синий (#3B82F6) - основной брендинг, CTA
- **Accent**: Теплый оранжевый (#F97316) - вторичные акценты, уведомления
- **Surface**: Нейтральные серые тона для фонов и карточек
- **Status**: Семантические цвета для успеха, предупреждений и ошибок

### Доступность
- Все цвета соответствуют WCAG AA+ стандартам
- Высокий контраст для отличной читабельности
- Поддержка цветовой слепоты

Подробная документация: [docs/color-palette.md](../../docs/color-palette.md)

## Компоненты

### SectionCard
Универсальная карточка с множественными вариантами стилизации:

```tsx
import { SectionCard } from '@shared/ui';

// Базовый вариант
<SectionCard>Содержимое</SectionCard>

// Варианты
<SectionCard variant="elevated">Приподнятая карточка</SectionCard>
<SectionCard variant="glass">Стеклянная карточка</SectionCard>
<SectionCard variant="brand">Брендинговая карточка</SectionCard>
<SectionCard variant="accent">Акцентная карточка</SectionCard>

// Размеры
<SectionCard size="sm">Маленькая</SectionCard>
<SectionCard size="md">Средняя</SectionCard>
<SectionCard size="lg">Большая</SectionCard>

// Свечение
<SectionCard glow>С подсветкой</SectionCard>
```

### Button
Кнопка с множественными вариантами и состояниями:

```tsx
import { Button } from '@/components/ui/button';

// Варианты
<Button variant="default">Основная</Button>
<Button variant="secondary">Вторичная</Button>
<Button variant="outline">Контурная</Button>
<Button variant="ghost">Призрачная</Button>
<Button variant="accent">Акцентная</Button>
<Button variant="success">Успех</Button>
<Button variant="warning">Предупреждение</Button>
<Button variant="danger">Ошибка</Button>

// Размеры
<Button size="sm">Маленькая</Button>
<Button size="default">Обычная</Button>
<Button size="lg">Большая</Button>
<Button size="pill">Пилюля</Button>
<Button size="icon">Иконка</Button>
```

### Card
Стандартная карточка с заголовком, содержимым и футером:

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Заголовок карточки</CardTitle>
    <CardDescription>Описание карточки</CardDescription>
  </CardHeader>
  <CardContent>
    Основное содержимое карточки
  </CardContent>
  <CardFooter>
    Действия или дополнительная информация
  </CardFooter>
</Card>
```

## Утилиты

### Цвета
```tsx
// Основные цвета
className="bg-brand text-white"           // Основной брендинг
className="bg-accent text-white"          // Акцентный цвет
className="bg-surface text-ink"           // Поверхность

// Оттенки
className="bg-brand-50 text-brand-900"    // Светлый брендинг
className="bg-surface-100 text-ink"       // Светлая поверхность
className="text-muted-500"                // Вторичный текст

// Статусы
className="bg-success text-white"         // Успех
className="bg-warning text-white"         // Предупреждение
className="bg-danger text-white"          // Ошибка
```

### Тени
```tsx
className="shadow-soft"                   // Мягкая тень
className="shadow-md"                     // Средняя тень
className="shadow-lg"                     // Большая тень
className="shadow-xl"                     // Очень большая тень
className="shadow-neon"                   // Неоновая тень (brand)
className="shadow-accent"                 // Акцентная тень
```

### Градиенты
```tsx
className="gradient-brand"                // Градиент брендинга
className="gradient-accent"               // Градиент акцента
className="gradient-surface"              // Градиент поверхности
```

### Переходы
```tsx
className="transition-smooth"             // Быстрый переход (200ms)
className="transition-medium"             // Средний переход (300ms)
className="transition-slow"               // Медленный переход (500ms)
```

### Стеклянные эффекты
```tsx
className="glass"                         // Стеклянный эффект (светлая тема)
className="glass-dark"                    // Стеклянный эффект (темная тема)
```

## Темная тема

Все компоненты автоматически адаптируются к темной теме через CSS переменные. Переключение происходит через `data-theme="dark"` на элементе `<html>`.

## Доступность

- Все интерактивные элементы имеют видимый фокус
- Цвета не являются единственным способом передачи информации
- Поддержка клавиатурной навигации
- ARIA-атрибуты для скринридеров

## Тестирование

Компоненты покрыты Storybook историями для визуального тестирования:

```bash
pnpm storybook
```

## Миграция

При обновлении цветовой палитры:

1. Обновите CSS переменные в `src/index.css`
2. Обновите Tailwind конфигурацию
3. Проверьте все компоненты на соответствие новой палитре
4. Обновите Storybook истории
5. Проведите тестирование доступности

## Вклад в развитие

При создании новых компонентов:

1. Следуйте существующим паттернам именования
2. Используйте только цвета из дизайн-системы
3. Добавьте Storybook историю
4. Обеспечьте поддержку темной темы
5. Проверьте доступность
