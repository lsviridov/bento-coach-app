# Logs

## 2025-01-25 - A2HS Blocker Implementation

### Создан слайс `a2hs-blocker` для блокировки UI до установки PWA

**Файлы созданы:**
- `src/features/a2hs-blocker/useA2HS.ts` - хук для определения состояния установки PWA
- `src/features/a2hs-blocker/InstallBlocker.tsx` - компонент полноэкранного оверлея
- `src/features/a2hs-blocker/types.ts` - TypeScript типы для PWA установки
- `src/features/a2hs-blocker/index.ts` - экспорты слайса
- `src/features/a2hs-blocker/useA2HS.test.ts` - unit тесты

**Файлы изменены:**
- `src/shared/ui/page-layout.tsx` - добавлен `InstallBlocker` для блокировки всех страниц с таббаром
- `src/features/index.ts` - добавлен экспорт `InstallBlocker`
- `README.md` - добавлена информация о настройке A2HS блокировки

**Функциональность:**
- Полноэкранная блокировка UI до установки PWA
- Автоопределение платформы (iOS/Android/другие)
- Обнаружение in-app браузеров с инструкциями
- Dev-обход через `?dev-bypass=1`
- Автоматическое определение установки через `display-mode: standalone`
- Блокировка скролла и фокуса через `inert` и `aria-hidden`

**Конфигурация:**
- Переменная окружения `VITE_FORCE_A2HS=1` (по умолчанию включено)
- Возможность отключения через `VITE_FORCE_A2HS=0`

**Тестирование:**
- Все unit тесты проходят (6/6)
- TypeScript компилируется без ошибок
- ESLint проходит без ошибок
- Сборка работает корректно

**Документация:**
- Создан подробный гайд по настройке в `docs/a2hs-blocker-setup.md`
- Обновлен README с инструкциями по переменным окружения