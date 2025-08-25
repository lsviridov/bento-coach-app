# Настройка блокировщика зума для PWA

## Описание

Глобальный блокировщик зума отключает масштабирование страницы везде: pinch-zoom, double-tap, Ctrl+wheel. Поведение включается только при установке переменной окружения `VITE_DISABLE_ZOOM=1`.

## Функциональность

- **Pinch-zoom** - отключен на iOS/Android
- **Double-tap zoom** - отключен на мобильных устройствах
- **Ctrl+колесо** - не масштабирует страницу на desktop
- **Фокус на инпутах** - экран не увеличивается на iOS

## Настройка

### 1. Переменные окружения

Создайте файл `.env.local` в корне проекта:

```bash
VITE_DISABLE_ZOOM=1
```

### 2. Проверка работы

После установки переменной окружения:

1. Перезапустите dev сервер
2. Откройте приложение на мобильном устройстве
3. Попробуйте сделать pinch-zoom - он должен быть заблокирован
4. Попробуйте двойной тап - zoom не должен срабатывать

### 3. Отключение

Для отключения блокировщика зума:

```bash
VITE_DISABLE_ZOOM=0
```

Или просто удалите переменную из `.env.local`.

## Технические детали

### Файлы

- `src/app/disableZoom.ts` - основная логика блокировки
- `src/main.tsx` - инициализация при запуске
- `src/index.css` - CSS стили для предотвращения зума
- `index.html` - meta viewport настройки

### События

Блокируются следующие события:

- `gesturestart`, `gesturechange`, `gestureend` (iOS Safari)
- `wheel` с `ctrlKey` (desktop)
- `dblclick` (double-click)
- `touchend` с временным интервалом (double-tap)

### CSS свойства

- `touch-action: manipulation` - убирает delay/double-tap-zoom
- `font-size: 16px` - предотвращает iOS zoom при фокусе
- `-webkit-text-size-adjust: 100%` - фиксирует размер текста

## Совместимость

- ✅ iOS Safari 12+
- ✅ Chrome Mobile 60+
- ✅ Firefox Mobile 60+
- ✅ Desktop Chrome/Firefox/Safari
- ✅ PWA режим (standalone)

## Отладка

В консоли браузера можно увидеть:

```
Zoom blocker installed
Meta viewport updated
```

При возникновении проблем проверьте:

1. Переменная `VITE_DISABLE_ZOOM=1` установлена
2. Dev сервер перезапущен после изменения `.env.local`
3. Нет конфликтов с другими обработчиками событий
