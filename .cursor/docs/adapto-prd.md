# 1) Обзор

**Миссия:** помочь пользователю ежедневно питаться осознанно: быстро логировать еду (в т.ч. по фото), получать персональные советы и удобно покупать продукцию Adaptogenzz.

**Форм-фактор:** мобильное **PWA** (установка «На Домой»), web-first.

**Названия и стиль:**

* Бренд: **ADAPTO**
* Цвета (light): Mint `#CBF3F0`, Light sea green `#2EC4B6`, Accent Orange `#FF9F1C`
* Цвета (dark): Midnight `#023436`, Pine `#03B5AA`, Accent Coral `#FF8552`
* Шрифты: **Unbounded** (display), **Manrope** (text), кириллица

---

# 2) Цели и KPI

**Цели MVP**

1. Лог еды (по фото и вручную) + дневные сводки.
2. ИИ-коуч с actionable-кнопками.
3. Магазин: каталог → корзина → платёж (redirect) → обработка вебхука.
4. Напоминания (Web Push) и установка PWA на iOS/Android.

**KPI (первые 8 недель)**

* D1/D7 retention ≥ 35% / 15%
* ≥ 60% сессий завершаются успешным логом приёма
* CR магазина из рекомендаций коуча ≥ 3%
* NPS ≥ 40

---

# 3) Не-цели (MVP)

* Нет телемедицины/диагностики; советы — образовательные.
* Нет офлайн-оплат; только redirect на провайдера.
* CV точность «production-OK», но не медицинская; всегда ручная правка.

---

# 4) Персоны (сценарии)

1. **Анна, 28** — «здоровое питание»: лог по фото + кольца («вода/белок/протокол»), мягкие напоминания.
2. **Игорь, 36** — «регулярные тренировки»: быстрый лог, рекомендации по белку, автозаказ бандла.
3. **Ольга, 45** — «восстановление»: протоколы, напоминания «отдельно от еды», покупки по целям.

---

# 5) UX принципы

* **Bento-grid** карточки (1×1, 2×1, 2×2), большие «pill» CTA.
* **Крупная типографика** в заголовках, простой body-текст.
* Контраст AA+, hit-area ≥ 44×44, safe areas (iOS).
* Тёмная/светлая темы; лёгкие неон-акценты без тяжёлых эффектов.

---

# 6) Информационная архитектура

* **Дом (Коуч):** прогресс дня, CTA «По фото», подсказки, витрина товара.
* **Камера:** съёмка/загрузка → анализ → правка граммов → сохранить.
* **Дневник:** список приёмов за день/неделю, редактирование.
* **Протоколы:** цикл приёма (напоминания, отметки).
* **Магазин:** каталог → карточка → корзина → оплата → статус заказа.
* **Профиль:** цели, аллергии, уведомления, темы.
* **Онбординг:** 60 сек, сбор базовых параметров.

Нижняя навигация: Дом, Камера, Дневник, Магазин, Профиль.

---

# 7) Основные фичи и **критерии приёмки**

## 7.1 Дом (Коуч)

**Требования**

* Три кольца прогресса: Вода/Белок/Протокол (данные за сегодня).
* Блок коуча (чат): ответы до 2–3 строк + кнопки действий (интенты).
* Витрина товара (1 товар дня) с кнопкой «В корзину».

**Acceptance**

* При загрузке без сети отображаются последние сводки из кэша.
* Тап по кольцу ведёт на соответствующий экран/якорь.
* Интент коуча `addMeal` добавляет черновик записи и ведёт на подтверждение.

## 7.2 Камера / Анализ по фото

**Требования**

* Захват с камеры **или** загрузка; предпросмотр; отправка в `/api/analyze`.
* Возврат: labels\[], confidence\[], ккал, Б/Ж/У; слайдер граммов, ручная правка.
* Сохранение как приём + фото.

**Acceptance**

* Фото >10MB сжимается клиентом до целевого (например, <2MB).
* При `confidence < threshold` — уточняющий вопрос; всегда можно руками.
* Без сети: создаётся локальный черновик; при появлении сети — фоновой sync.

## 7.3 Дневник

**Требования**

* Лента приёмов за день (суммы БЖУ/ккал), фильтр по датам.
* Редактирование и удаление.
* Пустое состояние с CTA «По фото»/«Добавить приём».

**Acceptance**

* Списки и суммы корректны после редактирования/удаления без перезагрузки.
* В офлайне доступна история последних 7 дней из IndexedDB.

## 7.4 Протоколы

**Требования**

* Создание протокола (название, старт, длительность, раз/день).
* Напоминания (Web Push) «отдельно от еды», чек-марки «выполнено».

**Acceptance**

* Пользователь получает пуш только при установленной PWA-иконке (iOS), разрешение — явное.
* Уведомления приходят в заданные окна, без дубликатов.

## 7.5 Магазин и оплата

**Требования**

* Каталог, карточка товара, корзина (добавить/удалить), checkout.
* Платёж — redirect в новом окне; webhook меняет статус заказа.
* Экран «заказ оплачен» с деталями.

**Acceptance**

* Сумма заказа = сумма позиций; при изменении qty пересчитывается.
* После успешного вебхука заказ в БД = `paid`; UI обновлён без перезагрузки.
* На iOS (standalone) редирект открывается стабильно (top-level window).

## 7.6 Профиль/настройки

**Требования**

* Темы (light/dark, автопамять), цели/аллергии, включение пушей.
* Экспорт/удаление данных (заглушка MVP: заявка в поддержку).

**Acceptance**

* Тема сохраняется в localStorage и SSR-фликера нет.
* Выключение пушей удаляет подписку из БД.

---

# 8) Технические требования

## 8.1 Архитектура

* **Frontend:** Next.js 14 (App Router), React, Tailwind, **PWA**.
* **FSD слои:** `app → processes → widgets → features → entities → shared`.
* **BFF:** Next.js API routes (payments, webhooks, coach proxy, analyze proxy).
* **CV-сервис:** FastAPI/ONNX (контейнер), v1 можно облачный VLM через BFF.
* **Assistant-сервис:** Node/FastAPI, LLM + function-calling.
* **DB:** Supabase (Postgres + Auth + Storage), **RLS** везде.
* **Очереди:** Redis + BullMQ (cv/analyze, push/send).
* **Пуши:** Web Push (VAPID), iOS 16.4+ — только у установленной PWA.

## 8.2 PWA

* `manifest.webmanifest` (`display: "standalone"`, maskable icons).
* Service Worker (Workbox):

  * `CacheFirst` — шрифты/иконки,
  * `StaleWhileRevalidate` — `/api/products`, `/api/me/day`,
  * `NetworkFirst` — навигация/страницы,
  * `/offline` fallback.
* Установка: Android `beforeinstallprompt`; iOS — гайд внутри приложения.
* IndexedDB: черновики meals/photos, последние сводки.

## 8.3 Дизайн-система

* Цветовые токены из палитр выше (CSS variables + Tailwind).
* Радиусы: 24px; кнопки pill 9999px; мягкие тени; неон-акценты умеренно.
* Шрифты через `next/font` (Unbounded, Manrope).

---

# 9) Схема данных (Postgres / Supabase)

```sql
-- USERS
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  full_name text,
  birthdate date,
  height_cm int,
  weight_kg numeric(6,2),
  allergies text[],
  goals text[]
);

-- MEALS
create table public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  taken_at timestamptz not null default now(),
  note text,
  calories int,
  protein_g numeric(6,2),
  fat_g numeric(6,2),
  carbs_g numeric(6,2)
);

create table public.meal_photos (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  storage_path text not null,
  labels text[],
  confidence numeric[],
  grams int
);

-- DAILY SUMMARY
create table public.nutrients_daily_summary (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  water_ml int default 0,
  calories int default 0,
  protein_g numeric(6,2) default 0,
  fat_g numeric(6,2) default 0,
  carbs_g numeric(6,2) default 0,
  primary key (user_id, date)
);

-- PROTOCOLS
create table public.protocols (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  start_date date not null,
  end_date date,
  times_per_day int not null default 2,
  separate_from_food boolean default true
);

-- SHOP
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text,
  price_byn numeric(10,2) not null,
  image_url text,
  tags text[]
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  created_at timestamptz default now(),
  status text check (status in ('pending','paid','failed','shipped')) default 'pending',
  total_byn numeric(10,2) not null default 0
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  qty int not null check (qty > 0),
  price_byn numeric(10,2) not null
);

-- PUSH SUBSCRIPTIONS
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

-- RLS включить на пользовательских таблицах
```

**RLS политика (пример):**

```sql
alter table public.meals enable row level security;
create policy "meals_owner"
on public.meals using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Аналогично для meal_photos, orders, push_subscriptions, protocols, summaries
```

---

# 10) API-контракты (BFF)

## `/api/analyze` (POST)

**Body**

```json
{ "imageUrl": "https://..." }
```

**200 OK**

```json
{
  "labels": ["buckwheat","chicken"],
  "confidence": [0.91, 0.76],
  "calories": 380,
  "protein": 28,
  "fat": 9,
  "carbs": 45,
  "defaultGrams": 250
}
```

**Ошибки:** `413` (слишком большой файл), `422` (невалидный URL), `500`.

## `/api/coach` (POST)

**Body**

```json
{ "message": "Что съесть на ужин?" }
```

**200 OK**

```json
{
  "reply": "Возьмите гречку с курицей и салат. Белок добьём до 40 г.",
  "intent": { "type": "addMeal", "payload": { "template": "гречка+курица" } }
}
```

## `/api/pay` (POST)

**Body**

```json
{ "orderId": "uuid" }
```

**200 OK**

```json
{ "redirectUrl": "https://payment-gateway/..." }
```

## `/api/webhooks/payment` (POST)

**Body** — провайдерская; валидация HMAC.
**200 OK** → перевести `orders.status` в `paid|failed`.

---

# 11) Архитектура кода (**FSD** + правила)

```
src/
  app/(app)/{app,camera,diary,protocols,shop,orders,offline}/page.tsx
  processes/{checkout,onboarding}/
  widgets/{header,bottom-nav,daily-summary,shop-highlight}/
  features/{analyze-photo,add-meal,checkout,push-subscribe}/
  entities/{meal,product,order,protocol,user}/
  shared/{ui,api,config,lib,hooks,store,styles}/
```

**Правила:**

* Импорт только через `index.ts` каждого слайса.
* Слои — только «вниз» (app→…→shared).
* ESLint: `import/no-internal-modules`, `boundaries/element-types`.
* Состояние: глобально — `zustand` (auth/cart/flags); данные — `@tanstack/query`.
* MSW: моки `/api/me/day`, `/api/products/featured`, `/api/orders/:id`.

---

# 12) Безопасность и приватность

* **CSP**, `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`.
* **CORS** — только доверенные домены.
* Хранить минимум PII; фото — приватное хранилище, срок хранения настраиваемый.
* Экспорт/удаление по GDPR — через тикет (MVP).
* Вебхуки — проверка HMAC + allow-list IP (если доступно).

---

# 13) Доступность (a11y)

* Все кнопки/ссылки — фокус-стили, aria-лейблы.
* Контраст AA+ (WCAG 2.1), масштабирование шрифта ≥ 200% без потери функционала.
* Навигация с клавиатуры и поддержка screen readers.

---

# 14) Наблюдаемость и аналитика

**События (пример):**

* `app_opened`, `pwa_installed`, `push_subscribed/denied`,
* `meal_added`, `analyze_started/succeeded/failed`,
* `coach_message_sent/replied`, `intent_executed`,
* `product_viewed`, `added_to_cart`, `checkout_started`, `order_paid/failed`.

**Тех. метрики:** TTFB, LCP, INP, CLS, ошибки (Sentry), время ответа `/api/analyze` (p95).

---

# 15) Производительность

* Бюджеты: JS ≤ 230KB gz (initial), LCP ≤ 2.5s на 4G, INP ≤ 200ms.
* Изображения через `next/image`, lazy, `srcset`.
* Ограничить одновременные `backdrop-filter` ≤ 3.

---

# 16) Локализация

* RU по умолчанию; ключи — через простой dictionary (MVP).
* Текст коуча — RU.

---

# 17) Тест-план

**Unit:** утилы, маппинг CV→нутриенты, интенты коуча (Vitest/Jest).
**Component/Storybook:** карточки, кольца, CTA.
**E2E (Playwright):**

1. Онбординг → Дом → «По фото» (заглушка) → сохранить приём → проверить дневник.
2. Дом → витрина → «В корзину» → checkout (mock) → статус «paid».
3. Протокол → включить напоминания (симуляция пуш-подписки).
4. Офлайн: выключить сеть → открыть Дом → видеть кэш; сохранить черновик → включить сеть → синк.
   **Manual:** установка PWA и пушей на iOS/Android реальных девайсах.

**Definition of Done (общий):**

* Приёмка по Acceptance для фичи.
* Покрытие тестами ≥ 60% важной логики.
* Линтеры/типизация зелёные; бандл-бюджеты соблюдены.
* Доступность (клавиатура/фокус) проверена.
* Документация в README.

---

# 18) План релиза (6 недель)

**Нед.1:** каркас (Next+Tailwind+PWA), темы, FSD, ESLint, MSW; Дом (UI).
**Нед.2:** Supabase схемы + RLS, сущности meal/product/order; Дневник CRUD.
**Нед.3:** Загрузка фото, `/api/analyze` (заглушка VLM), слайдер граммов, сохранение.
**Нед.4:** Коуч (`/api/coach` + интенты), витрина, корзина.
**Нед.5:** Оплата (`/api/pay`), вебхуки, заказы; офлайн и SW-стратегии.
**Нед.6:** Web Push + напоминания, iOS/Android установка, E2E, прод-деплой.

---

# 19) Риски и смягчение

* **iOS PWA ограничения:** платежи — только top-level окна; тесты на реальных устройствах.
* **CV точность:** всегда ручная правка; логировать дельту; дообучать датасет.
* **Пуши iOS:** работают только у установленной иконки; в UI явно просим установку и разрешение.
* **Производительность:** жёсткие бюджеты и лэйзи-лоад.

---

# 20) Открытые вопросы

1. Способы доставки/адреса в заказе — в MVP или пост-MVP?
2. Глубина протоколов: только напоминания или ещё «чек-листы» ощущений?
3. Подписочная модель магазина (auto-refill) — этап 2?

---

# 21) Приложение A — Tailwind токены (пример)

```ts
// tailwind.config.ts (фрагмент)
theme: {
  extend: {
    colors: {
      bg: 'var(--bg)',
      surface: 'var(--surface)',
      ink: 'var(--ink)',
      muted: 'var(--muted)',
      brand: {
        DEFAULT: 'var(--brand)',
        50: 'var(--brand-50)',
        900: 'var(--brand-900)'
      },
      accent: 'var(--accent)'
    },
    borderRadius: { xl: '24px', pill: '9999px' },
    fontFamily: {
      sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      display: ['var(--font-display)', 'sans-serif']
    }
  }
}
```

---

# 22) Приложение B — правила для **Cursor**

* Всегда указывай слой/слайс и **публичный API** при создании файлов.
* Не делай deep-imports; линтер упадёт.
* Новая фича → `features/<name>/{model,ui,index.ts}` + сториз.
* Изменения API — сначала обнови zod-схемы/типы.
* Для моков используй MSW-хэндлеры; E2E не должен ходить во внешний интернет.