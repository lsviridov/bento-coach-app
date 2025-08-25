# adapto-mdc-pages.md — правила (MDC) для страниц

**MDC = Minimum Deliverable Contract** — единые правила для экранов: состав блоков, функционал, состояния, критерии приёмки. Форм-фактор: **PWA** (mobile-first, 375–430px). Архитектура: **FSD** (app → processes → widgets → features → entities → shared).

---

## Глобальные правила

* **Каркас:** `widgets/header` (sticky) + `widgets/bottom-nav` (safe-area), контейнер `p-4` (min 16px), сетка 8/16/24.
* **Темы:** light/dark из `adapto-colors.md`. Контраст AA+.
* **Типографика:** `font-display` для H1/Hero, `font-sans` остальное. H1: 32–40, H2: 18–20, body: 15–16.
* **Состояния:** loading skeletons, empty, error, offline (`/offline` fallback).
* **Доступность:** hit-area ≥44×44, видимый focus, aria-лейблы, поддержка клавиатуры.
* **Производительность:** ≤230KB gz initial JS, ≤3 одновременных `backdrop-filter`.
* **Аналитика (пример):** `page_view`, `cta_click`, `intent_executed`, `added_to_cart`, `order_paid`.

---

## Карта роутинга

* `/app` Дом/Коуч
* `/camera` Камера/Анализ
* `/diary` Дневник
* `/protocols` Протоколы
* `/shop` Каталог
* `/shop/[slug]` Карточка товара
* `/orders` Мои заказы
* `/orders/[id]` Детали заказа
* `/profile` Профиль и настройки
* `/checkout` Обзор заказа → оплата (redirect)
* `/offline` Офлайн-страница

---

## 1) Дом / Коуч — `/app`

**Цель:** ежедневные показатели и быстрые действия.

**Блоки (FSD):**

* `widgets/header` (ADAPTO, переключатель темы)
* `widgets/daily-summary` — 3 кольца: Вода/Белок/Протокол
* `features/analyze-photo` — **Primary CTA** «По фото» + Secondary «Добавить приём»
* `widgets/coach-teaser` — ответ коуча + кнопки-интенты
* `widgets/shop-highlight` — товар дня «В корзину»

**Данные:** `/api/me/day`, `/api/products/featured`, `/api/coach` (teaser).

**Состояния:** skeleton (кольца/товар), empty (нулевые метрики), offline (последний кэш).

**Acceptance:**

* Клики по кольцам ведут на соответствующие разделы.
* Интент `addMeal` создаёт черновик приёма.
* Без сети показывается кэш за сегодня.

**События:** `home_opened`, `analyze_cta`, `coach_intent_executed`, `featured_add_to_cart`.

---

## 2) Камера / Анализ — `/camera`

**Цель:** добавить приём по фото.

**Блоки:**

* `features/camera-uploader` (capture/upload + preview)
* `features/analyze-photo` (POST `/api/analyze`)
* `features/add-meal` (ползунок граммов, поля БЖУ, «Сохранить»)

**Функционал:** сжатие >10MB, прогресс-индикатор, retry, уточняющий вопрос при низком `confidence`.

**Состояния:** loading (анализ), editable (перед сохранением), error, offline (черновик в IndexedDB).

**Acceptance:**

* После «Сохранить» появляется запись в `/diary` без перезагрузки.
* Фото/черновик синкается при появлении сети.
* Можно «Переснять» и «Изменить граммы».

**События:** `camera_opened`, `analyze_started/succeeded/failed`, `meal_saved`.

---

## 3) Дневник — `/diary`

**Цель:** список приёмов за день/неделю.

**Блоки:**

* `widgets/day-switcher` (сегодня/←/→ календарь)
* `widgets/day-totals` (ккал, БЖУ, вода)
* `entities/meal/MealCard` (фото, нутриенты, время)
* `features/add-meal-fab` (плавающая кнопка)

**Функционал:** редактировать/удалять приём, фильтр по типу (завтрак/обед/ужин/перекус), поиск по заметке.

**Состояния:** skeleton, empty (пустой день), offline (последние 7 дней из IndexedDB).

**Acceptance:**

* Totals корректно пересчитываются при CRUD.
* Удаление подтверждается диалогом.
* Навигация по датам не сбрасывает скролл.

**События:** `diary_opened`, `meal_edited/deleted`.

---

## 4) Протоколы — `/protocols`

**Цель:** циклы приёма пептидов и напоминания.

**Блоки:**

* Список активных протоколов
* `features/create-protocol` (мастер: цель → длительность → кратность/день)
* Календарь отметок «выполнено сегодня»
* `features/push-subscribe` (включить пуш-напоминания)

**Функционал:** расчёт расписания, «принял»/«пропустил», нотификации (Web Push).

**Состояния:** empty (нет протоколов → предложение пресета), offline (календарь доступен из локальных данных).

**Acceptance:**

* Включение пушей сохраняет подписку в БД; выключение — удаляет.
* Отметка «выполнено» обновляет прогресс дня.

**События:** `protocol_created`, `protocol_done`, `push_enabled/disabled`.

---

## 5) Магазин — `/shop`

**Цель:** подобрать и купить продукт.

**Блоки:**

* `widgets/product-filters` (цели/теги, поиск)
* Grid 2-колонки `entities/product/ProductCard`
* Пагинация/инфинит-скролл

**Карточка товара — `/shop/[slug]`:**

* Галерея, название, цена, состав/описание
* `features/add-to-cart` (qty), бандлы по цели, отзывы (заглушка)

**Состояния:** skeleton плиток, empty (нет результатов), error.

**Acceptance:**

* Фильтры применяются без перезагрузки; URL содержит query.
* Добавление в корзину показывает `CartDrawer`.
* Детальная страница грузится из slug.

**События:** `product_viewed`, `filter_applied`, `added_to_cart`.

---

## 6) Корзина/Чекаут — `/checkout` (+ `CartDrawer`)

**Цель:** оформить заказ и уйти на оплату.

**Блоки:**

* `CartDrawer` (мини-обзор, изменить qty/удалить)
* Страница `/checkout`: список позиций, промежуточный итог, промокод (заглушка), кнопка **Оплатить**
* Системные страницы: `/orders/success`, `/orders/failed`

**Функционал:** `/api/pay` → `redirectUrl` в новом окне; `/api/webhooks/payment` меняет статус заказа.

**Acceptance:**

* Итого = сумма позиций, пересчёт при изменениях.
* После вебхука `/orders/[id]` переходит в `paid/failed`.
* На iOS standalone redirect открывается в top-level окне.

**События:** `checkout_started`, `checkout_paid/failed`.

---

## 7) Заказы — `/orders`, `/orders/[id]`

**Цель:** история покупок.

**Блоки:**

* Лист заказов (дата, сумма, статус)
* Детали заказа: позиции, статус, кнопка «Повторить заказ» (клонирует в корзину)

**Состояния:** empty (ещё нет заказов), skeleton, error.

**Acceptance:**

* Статусы совпадают с БД.
* «Повторить» создаёт новую корзину с тем же набором.

**События:** `orders_opened`, `reorder_clicked`.

---

## 8) Профиль — `/profile`

**Цель:** персональные настройки.

**Блоки:**

* Аккаунт (имя/email), выход
* Цели/аллергии/рост/вес
* Темы (light/dark/auto), `features/push-subscribe`
* Экспорт/удаление данных (тикет в поддержку, MVP)
* Юр. страницы: Политика/Условия

**Acceptance:**

* Тема сохраняется и применяется до рендера (без «мигания»).
* Выключение пушей удаляет подписку.

**События:** `profile_opened`, `theme_changed`, `push_toggled`.

---

## 9) Онбординг — `/onboarding` (process)

**Цель:** за 60 секунд собрать базовые параметры.

**Шаги:** приветствие → цели → аллергии/ограничения → рост/вес → разрешения (пуши) → готово.

**Acceptance:**

* Прогресс сохраняется по шагам; «Назад» работает; можно пропустить.
* Завершение ведёт на `/app` с заполненными сводками по нулям.

**События:** `onboarding_step`, `onboarding_done`.

---

## 10) Офлайн — `/offline`

**Цель:** корректно вести себя без сети.

**Блоки:**

* Сообщение и кнопка «Повторить»
* Список последних кэшированных дней/заказов (read-only)

**Acceptance:**

* Доступ из SW `navigateFallback` при offline; кнопка «Повторить» перезагружает текущий URL.

---

# Приложение A — карта FSD для ключевых блоков

* `widgets/header`, `widgets/bottom-nav`, `widgets/daily-summary`, `widgets/shop-highlight`, `widgets/day-switcher`, `widgets/day-totals`
* `features/analyze-photo`, `features/add-meal`, `features/add-to-cart`, `features/checkout`, `features/push-subscribe`, `features/create-protocol`
* `entities/meal`, `entities/product`, `entities/order`, `entities/protocol`, `entities/user`

Каждый слайс экспортирует **только** через свой `index.ts`. Запрещены deep-imports.

---

# Приложение B — DoD (Definition of Done) для страницы

1. Все заявленные блоки присутствуют и связаны по данным.
2. Loading/Empty/Error/Offline состояния реализованы.
3. Primary/secondary CTA доступны с клавиатуры и имеют aria-лейблы.
4. Метрики/события шлются.
5. Экран укладывается в производственный бюджет (см. глобальные правила).
6. В тёмной/светлой темах визуально корректен (скриншоты в Storybook).

---

Этот документ — чек-лист для верстки, логики и QA. Если добавляется новая страница, копируй структуру MDC из любого раздела и заполняй по аналогии.
