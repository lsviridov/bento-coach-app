# adapto-user-flow\.md — пользовательские флоу (MDC)

Документ описывает **сквозные сценарии** (flows) для ADAPTO PWA: шаги, экраны, данные, события аналитики, ветвления и критерии успеха. Формат соответствует FSD и правилам из `adapto-mdc-pages.md`.

---

## 0) Конвенции

* **Страницы:** см. маршруты в `adapto-mdc-pages.md` (`/app`, `/camera`, `/diary`, …).
* **Слои FSD:** `app → processes → widgets → features → entities → shared`.
* **События аналитики (пример):** `page_view`, `analyze_started`, `meal_saved`, `checkout_paid`.
* **CRUD-таблицы:** Supabase — `profiles`, `meals`, `meal_photos`, `nutrients_daily_summary`, `protocols`, `products`, `orders`, `order_items`, `push_subscriptions`.
* **Критерии приёмки (Acceptance):** формулируются в стиле Given/When/Then.
* **Ошибки/офлайн:** в каждом флоу указаны fallback и кэш.

---

## Flow A — Первичный запуск и установка PWA

**Цель:** пользователь видит домашний экран и (по желанию) устанавливает приложение на Домой.

**Вход:** новый пользователь открывает `https://…` (мобильный).
**Шаги:**

1. `/app` → `widgets/header` + `widgets/bottom-nav` (safe areas) → `widgets/install-hint` (если не standalone).
2. Android: слушаем `beforeinstallprompt` → показываем мягкий баннер «Установить».
3. iOS: подсказка «Поделиться → На экран “Домой”».
4. При установке — сохраняем `pwa_installed=true` (localStorage).

**Данные:** нет.
**События:** `home_opened`, `install_prompt_shown`, `pwa_installed`.
**Acceptance:**

* Given первый визит, When пользователь в iOS не standalone, Then видит подсказку установки.
* При повторном визите подсказка не навязчива (snooze в localStorage ≥ 7 дней).
  **Исключения:** запрет на всплывашки/навязчивые модалки; только ненавязчивая плашка.

---

## Flow B — Онбординг (60 сек)

**Цель:** собрать базовые параметры и включить пуши (по желанию).

**Вход:** `/onboarding` (после первого визита или из профиля).
**Шаги:**

1. Приветствие → цель(и) → аллергии/ограничения → рост/вес → разрешения (пуши) → готово.
2. `features/push-subscribe`: запрос разрешения (после явного клика).
3. Сохранить `profiles` + локально тему и единицы измерения (если есть).

**Данные:** `profiles`, `push_subscriptions` (при согласии).
**События:** `onboarding_step`, `push_enabled/denied`, `onboarding_done`.
**Acceptance:**

* When пользователь перезагружает страницу на шаге N, Then он возвращается на шаг N (прогресс хранится).
* Пуши включаются **только** после клика и в standalone (iOS).
  **Исключения:** отказ от пушей — спокойно продолжаем, без деградации.

---

## Flow C — Добавить приём по фото (happy path)

**Цель:** за ≤30 сек добавить приём с фото и нутриентами.

**Вход:** `/camera` или CTA «По фото» на `/app`.
**Шаги:**

1. `features/camera-uploader`: снять/загрузить фото → клиентское сжатие, upload в Storage.
2. `features/analyze-photo`: POST `/api/analyze` с `imageUrl`.
3. UI показывает `labels`, ккал/БЖУ, `defaultGrams` + слайдер граммов.
4. Пользователь корректирует граммы/название → «Сохранить».
5. Создать `meals` + `meal_photos`; обновить `nutrients_daily_summary`.

**Данные:** `meal_photos`, `meals`, `nutrients_daily_summary`.
**События:** `analyze_started/succeeded/failed`, `meal_saved`.
**Acceptance:**

* Given сеть есть, When пользователь жмёт «Сохранить», Then запись видна в `/diary` без reload.
* Картинка ≤2MB после сжатия; большие — получают предупреждение.
  **Исключения:**
* Низкий `confidence` → уточняющий вопрос + всегда ручной ввод.
* Офлайн → создаём **черновик** в IndexedDB, показываем статус «Сохранится при сети».

---

## Flow D — Ручное добавление приёма

**Цель:** за ≤20 сек внести приём без фото.

**Вход:** CTA «Добавить приём» на `/app` или FAB на `/diary`.
**Шаги:**

1. `features/add-meal` модалка: поля «Название», «Граммы/Порция», «Ккал/БЖУ» (автоподсказки).
2. Сохранить `meals` → обновить `nutrients_daily_summary`.

**Данные:** `meals`.
**События:** `meal_saved_manual`.
**Acceptance:**

* Автоподсказки не блокируют ввод; всё редактируемо.
  **Исключения:** офлайн — черновик, см. Flow J.

---

## Flow E — Кольца прогресса (вода/белок/протокол)

**Цель:** пользователь видит дневной прогресс и дорабатывает до цели.

**Вход:** `/app`.
**Шаги:**

1. `widgets/daily-summary` запрашивает `/api/me/day` (или кэш).
2. Tap по кольцу «Вода» открывает быстрый плюс воды; «Белок» — подсказка еды/коуч; «Протокол» — отметка приёма.

**Данные:** `nutrients_daily_summary`, `protocols` (event).
**События:** `ring_tapped`, `water_added`, `protocol_marked`.
**Acceptance:**

* Обновление прогресса отражается визуально ≤200ms.
  **Исключения:** офлайн — плюсы пишутся в локальную очередь (sync позже).

---

## Flow F — Коуч: вопрос → действие (intent)

**Цель:** превратить короткий ответ коуча в конкретное действие.

**Вход:** блок коуча на `/app` или отдельный экран чата (позже).
**Шаги:**

1. Пользователь вводит вопрос → `/api/coach`.
2. Ответ ≤2–3 строки + `intent` (напр. `addMeal`, `suggestBundle`, `scheduleReminder`).
3. Tap по кнопке интента → BFF выполняет действие (создаёт черновик `meal`, добавляет товар в корзину, включает пуш).

**Данные:** в зависимости от интента (см. `modules/assistant`).
**События:** `coach_message_sent/replied`, `intent_executed`.
**Acceptance:**

* Интент всегда «безопасный»: ничто не списывается и не оплачивается автоматически.
  **Исключения:** нет сети → очередь интентов (помечаются «отложено»).

---

## Flow G — Протокол: создание и день напоминаний

**Цель:** настроить цикл приёма пептидов и соблюдать его в течение дня.

**Вход:** `/protocols` → «Создать протокол».
**Шаги:**

1. Мастер: цель → длительность → раз/день → «отдельно от еды» (по умолчанию).
2. Сохранить `protocols`.
3. `features/push-subscribe`: включить пуши (если ещё нет).
4. В день Х: приходят N пушей в выбранные окна; в карточке дня → кнопка «Принял».

**Данные:** `protocols`, `push_subscriptions`.
**События:** `protocol_created`, `push_scheduled`, `protocol_done`.
**Acceptance:**

* Пуши не дублируются, «тишина» соблюдается (если задаём quiet hours).
  **Исключения:** отказ от пушей → показываем локальные напоминания в приложении (in-app toasts).

---

## Flow H — Витрина → корзина → чекаут

**Цель:** купить продукт за 2–3 тапа.

**Вход:** `/app` (товар дня) или `/shop`.
**Шаги:**

1. Tap «В корзину» → `CartDrawer` (qty +/-).
2. «Оформить» → `/checkout` (список позиций, итог).
3. Tap «Оплатить» → `/api/pay` → `redirectUrl` → открыть **в новом окне**.
4. Возврат: `/orders/success|failed` (или `/orders/[id]`).

**Данные:** `orders`, `order_items`.
**События:** `added_to_cart`, `checkout_started`, `checkout_redirected`.
**Acceptance:**

* Итого пересчитывается мгновенно при qty.
* На iOS standalone redirect открывается стабильно (top-level).
  **Исключения:** отказ оплаты → `/orders/failed` с CTA «Повторить».

---

## Flow I — Подтверждение оплаты (webhook)

**Цель:** синхронно отразить статус заказа в UI.

**Вход:** провайдер бьёт `/api/webhooks/payment`.
**Шаги:**

1. BFF валидирует подпись → `orders.status=paid|failed`.
2. UI на `/orders/[id]` слушает SSE/пуллит статус до 30 сек.
3. Показываем «Спасибо» + CTA «Повторить заказ».

**Данные:** `orders`.
**События:** `checkout_paid/failed`.
**Acceptance:**

* Given заказ оплачен, When webhook дошёл, Then UI обновляется ≤5 c.
  **Исключения:** webhook задержался → кнопка «Обновить статус» (ручной запрос).

---

## Flow J — Офлайн: создание черновика и синхронизация

**Цель:** не терять данные без сети.

**Вход:** любой CRUD в офлайне (камера/ручной приём, вода, протокол).
**Шаги:**

1. Пишем в IndexedDB очередь `pendingOps` + UI-лейбл «Сохранится при сети».
2. SW Background Sync/поллинг: при сети — отправить пачку → подтверждение → удалить из очереди.

**Данные:** черновики в IndexedDB → потом `meals`, `meal_photos`, `nutrients_daily_summary`.
**События:** `offline_op_queued`, `sync_succeeded/failed`.
**Acceptance:**

* Дубликаты не создаются (идемпотентные ключи операций).
  **Исключения:** конфликт (данные устарели) → показать дифф и предложить «перезаписать/объединить».

---

## Flow K — Подписка/отписка от пушей

**Цель:** прозрачно управлять уведомлениями.

**Вход:** `/profile` или CTA при онбординге/протоколе.
**Шаги:**

1. Enable: запрос разрешения → создать `push_subscriptions`.
2. Disable: отозвать разрешение/удалить запись из БД.

**Данные:** `push_subscriptions`.
**События:** `push_enabled/disabled`.
**Acceptance:**

* На iOS пуши только при установленной PWA (проверка `navigator.standalone`).
  **Исключения:** запрет на уровне ОС → показываем инструкцию, не зацикливаем запрос.

---

## Flow L — Просмотр/редактирование истории заказов

**Цель:** найти прошлый заказ и повторить.

**Вход:** `/orders`.
**Шаги:**

1. Список заказов → тап → `/orders/[id]`.
2. «Повторить заказ» → создать новую корзину с тем же набором → `CartDrawer`.

**Данные:** `orders`, `order_items`.
**События:** `orders_opened`, `reorder_clicked`.
**Acceptance:**

* При удалённых товарах — подсказка «товар недоступен», частичное добавление.

---

## Flow M — Тема (light/dark) и сохранение

**Цель:** стабильное переключение без «мигания».

**Вход:** тумблер темы в `widgets/header`.
**Шаги:**

1. Сохраняем `theme=light|dark` в localStorage.
2. На SSR/First Paint используем класс темы до загрузки JS.

**Данные:** localStorage.
**События:** `theme_changed`.
**Acceptance:**

* Нет «фликера» темы при перезагрузке.

---

## Flow N — Обновление версии (Service Worker)

**Цель:** безопасно применять обновления.

**Вход:** новый SW найден.
**Шаги:**

1. SW сообщает клиенту «Доступно обновление».
2. Баннер «Обновить» (soft) → `skipWaiting` → `clients.claim()` → перезагрузка.

**События:** `sw_update_available`, `sw_updated`.
**Acceptance:**

* Критические операции (чекаут, анализ) не прерываются — обновление откладывается до бездействия.

---

## Flow O — Ошибки и восстановление

**Цель:** ясные сообщения, не теряем данные.

**Случаи:**

* `/api/analyze` 413/500 → показать «Не удалось распознать, внесите вручную» + сохранить фото.
* Платёж `failed` → страница «Оплата не прошла» + CTA «Повторить».
* 401/403 → «Сессия истекла» → мягкий ре-логин без потери state.

**События:** `error_shown_{code}`, `retry_clicked`.
**Acceptance:**

* Пользователь всегда имеет путь «назад» и не теряет введённое.

---

## Приложение 1 — Мини-граф состояний

**Meal Creation (photo/manual):**
`idle → uploading? → analyzing? → editable → saving → done | error → editable`

* Офлайн ветка: `editable (draft) → queued → syncing → done | conflict`

**Order:**
`cart → checkout → redirect → (webhook) pending → paid | failed`

**Push:**
`unknown → prompt_shown → granted | denied → enabled(record) | disabled(record removed)`

---

## Приложение 2 — Сводка событий аналитики по флоу

* A: `home_opened`, `install_prompt_shown`, `pwa_installed`
* B: `onboarding_step`, `onboarding_done`, `push_enabled/denied`
* C/D: `analyze_started/succeeded/failed`, `meal_saved(_manual)`
* E: `ring_tapped`, `water_added`, `protocol_marked`
* F: `coach_message_sent/replied`, `intent_executed`
* G: `protocol_created`, `push_scheduled`, `protocol_done`
* H/I: `added_to_cart`, `checkout_started`, `checkout_redirected`, `checkout_paid/failed`
* J: `offline_op_queued`, `sync_succeeded/failed`
* K: `push_enabled/disabled`
* L: `orders_opened`, `reorder_clicked`
* M: `theme_changed`
* N: `sw_update_available`, `sw_updated`
* O: `error_shown_*`, `retry_clicked`

---

## Приложение 3 — Acceptance кратко (по-странично)

* `/app`: кэш метрик без сети; CTA работают; витрина добавляет в корзину.
* `/camera`: большие файлы сжимаются; низкая уверенность → уточнение; офлайн → черновик.
* `/diary`: сумма пересчитывается после CRUD; неделя в кэше.
* `/protocols`: пуши без дублей; отметки обновляют прогресс.
* `/shop`/`/shop/[slug]`: фильтры без reload; карточка из slug.
* `/checkout`: итог корректен; redirect в новом окне; статус обновляется по вебхуку.
* `/orders`: «Повторить» создаёт новую корзину с доступными товарами.
* `/profile`: тема без фликера; пуш-тумблер синхронизирован.

---

Этот `adapto-user-flow.md` — чек-лист для разработки и QA. Изменения вносим через PR с пометкой, каких флоу касается правка и какие события/таблицы затрагиваются.
