# adapto-env.md

## Зачем

Этот файл — единый источник правды по переменным окружения ADAPTO (Next.js PWA + Supabase + CV + Assistant + оплаты + пуши). Он описывает: что за переменная, где используется, обязательна ли она, и чем заполнять в `dev/staging/prod`.

> **Важно:** всё, что начинается с `NEXT_PUBLIC_`, доступно в браузере. Никогда не клади туда секреты.

---

## Быстрый чек-лист настройки (dev)

1. Скопируй `.env.local` из шаблона ниже в корень репозитория.
2. Создай проект в Supabase → возьми `URL` и `ANON KEY`.
3. Сгенерируй VAPID-ключи (Web Push):

   ```bash
   npx web-push generate-vapid-keys
   ```

   Заполни `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, и прокинь публичный ключ в `NEXT_PUBLIC_VAPID_PUBLIC_KEY`.
4. Поставь Redis (локально или в Docker) → заполни `REDIS_URL`.
5. Настрой bePaid (sandbox) → `BEPAY_*` + URLs возврата/вебхука.
6. Укажи базовые URL сервисов (`NEXT_PUBLIC_SITE_URL`, `API_BASE_URL`, `CV_BASE_URL`, `ASSISTANT_BASE_URL`).
7. (Опционально) Sentry/analytics ключи.
8. `pnpm dev` и проверь `/app`, `/offline`, установку PWA и мок-эндпоинты.

---

## Переменные (сводная таблица)

| Ключ                            | Scope  | Обязательно | Назначение / где используется                              |                               |              |
| ------------------------------- | ------ | ----------: | ---------------------------------------------------------- | ----------------------------- | ------------ |
| `NODE_ENV`                      | server |          да | \`development                                              | production\` для Next.js/Node |              |
| `NEXT_PUBLIC_SITE_URL`          | client |          да | Базовый публичный URL PWA (для ссылок/манкостей)           |                               |              |
| `NEXT_PUBLIC_ENV`               | client |          да | Метка окружения в UI/аналитике: \`dev                      | staging                       | prod\`       |
| `NEXT_PUBLIC_API_BASE_URL`      | client |          да | Базовый URL BFF (обычно тот же домен)                      |                               |              |
| `NEXT_PUBLIC_SUPABASE_URL`      | client |          да | URL проекта Supabase                                       |                               |              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client |          да | Анонимный ключ Supabase (публичный)                        |                               |              |
| `SUPABASE_SERVICE_ROLE_KEY`     | server |      желат. | Сервис-роль (только на сервере: вебхуки/скрипты)           |                               |              |
| `SUPABASE_JWT_SECRET`           | server |         нет | Если проверяешь JWT или подписываешь токены                |                               |              |
| `SUPABASE_STORAGE_BUCKET`       | both   |          да | Имя бакета (напр. `meal-photos`)                           |                               |              |
| `OPENAI_API_KEY`                | server |      желат. | Ключ для ассистента/визуального анализа (MVP)              |                               |              |
| `ASSISTANT_BASE_URL`            | server |         нет | Если ассистент вынесен в отдельный сервис                  |                               |              |
| `CV_BASE_URL`                   | server |         нет | База для сервиса CV (FastAPI), если вынесен                |                               |              |
| `REDIS_URL`                     | server |      желат. | Очереди BullMQ / кеш                                       |                               |              |
| `VAPID_PUBLIC_KEY`              | server |          да | Публичный ключ Web Push                                    |                               |              |
| `VAPID_PRIVATE_KEY`             | server |          да | Приватный ключ Web Push                                    |                               |              |
| `VAPID_SUBJECT`                 | server |          да | `mailto:you@example.com` или URL                           |                               |              |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY`  | client |          да | Для подписки браузера на Web Push                          |                               |              |
| `BEPAY_ENDPOINT`                | server |          да | `https://gate.bepaid.by` (prod) / sandbox URL              |                               |              |
| `BEPAY_SHOP_ID`                 | server |          да | Идентификатор магазина                                     |                               |              |
| `BEPAY_SECRET_KEY`              | server |          да | Секрет для подписи/HMAC                                    |                               |              |
| `PAYMENT_RETURN_URL`            | server |          да | URL возврата после оплаты (успех/ошибка)                   |                               |              |
| `PAYMENT_WEBHOOK_URL`           | server |          да | Путь вебхука в нашем BFF                                   |                               |              |
| `PAYMENT_WEBHOOK_SECRET`        | server |      желат. | Секрет верификации вебхука (если провайдер даёт отдельный) |                               |              |
| `SENTRY_DSN`                    | both   |         нет | Мониторинг ошибок                                          |                               |              |
| `SENTRY_ENV`                    | both   |         нет | \`development                                              | staging                       | production\` |
| `NEXT_PUBLIC_ANALYTICS_KEY`     | client |         нет | Ключ аналитики (PostHog/Plausible и т.п.)                  |                               |              |
| `ALLOWED_ORIGINS`               | server |         нет | Список доменов для CORS, CSV                               |                               |              |
| `IMAGE_MAX_BYTES`               | server |         нет | Ограничение размера исходника (байт), напр. `5000000`      |                               |              |
| `IMAGE_MAX_WIDTH`               | server |         нет | Пресет ресайза до анализа, напр. `1600`                    |                               |              |
| `RATE_LIMIT_WINDOW_MS`          | server |         нет | Окно rate-limit (мс)                                       |                               |              |
| `RATE_LIMIT_MAX`                | server |         нет | Запросов за окно                                           |                               |              |

> Для клиента дублируй **только** то, что действительно нужно в браузере, с префиксом `NEXT_PUBLIC_`.

---

## Рекомендации по окружениям

* **.env.local** — разработка (локально), add в `.gitignore`.
* **.env.staging** — предпрод, хранить в CI/CD секрет-хранилище.
* **.env.production** — прод, держать только в менеджере секретов (1Password/Doppler).

Разные домены:

* `NEXT_PUBLIC_SITE_URL`: `http://localhost:3000` / `https://staging.adapto.app` / `https://adapto.app`
* Возвраты/вебхуки платежей должны точно совпадать с настройками провайдера.

---

## Платежи (bePaid/ЕРИП)

* `BEPAY_ENDPOINT` — укажи Sandbox или Prod.
* `PAYMENT_RETURN_URL` — страница успеха/ошибки в приложении, напр. `https://…/orders/success`.
* `PAYMENT_WEBHOOK_URL` — наш серверный маршрут (напр. `/api/webhooks/payment`).
* Провайдер должен уметь дернуть этот URL из интернета → в dev используй туннель (ngrok/Cloudflare Tunnel).

---

## Web Push (VAPID)

* Генерация: `npx web-push generate-vapid-keys`.
* Сервер хранит `VAPID_PRIVATE_KEY` и `VAPID_SUBJECT`.
* Клиент получает `NEXT_PUBLIC_VAPID_PUBLIC_KEY`.
* iOS пуши работают только для **установленной** PWA (A2HS).

---

## Примеры политики безопасности

* Не логируй `BEPAY_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VAPID_PRIVATE_KEY`.
* `ALLOWED_ORIGINS` (через запятую): `http://localhost:3000,https://staging.adapto.app,https://adapto.app`.
* Для CORS/CSRF ограничивай методы и источники.

---

## Быстрая проверка конфигурации

* `/offline` открывается без сети (SW работает).
* Подписка на пуши создаётся и сохраняется в БД.
* Платёж редиректит в провайдера и webhook меняет статус заказа.
* Фото > лимита — сжимается/отклоняется по настройке `IMAGE_MAX_*`.

---

# .env.local (шаблон для DEV)

```dotenv
# ───── App / Next.js ───────────────────────────────────────────────────────────
NODE_ENV=development
NEXT_PUBLIC_ENV=dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# ───── Supabase ───────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=pk_anon_changeme
SUPABASE_SERVICE_ROLE_KEY=service_role_changeme
SUPABASE_JWT_SECRET=changeme_optional
SUPABASE_STORAGE_BUCKET=meal-photos

# ───── Web Push (VAPID) ───────────────────────────────────────────────────────
# Generate with: npx web-push generate-vapid-keys
VAPID_PUBLIC_KEY=BPUBLICKEY_CHANGEME
VAPID_PRIVATE_KEY=PRIVATEKEY_CHANGEME
VAPID_SUBJECT=mailto:you@example.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BPUBLICKEY_CHANGEME

# ───── Redis / Queues ─────────────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ───── AI / Assistant / CV ────────────────────────────────────────────────────
OPENAI_API_KEY=sk_changeme
ASSISTANT_BASE_URL=http://localhost:8080     # если ассистент в отдельном сервисе (опционально)
CV_BASE_URL=http://localhost:8000            # если CV в отдельном сервисе (опционально)

# ───── Payments (bePaid) ──────────────────────────────────────────────────────
# Use sandbox endpoint for dev if available from provider
BEPAY_ENDPOINT=https://sandbox-gate.bepaid.by
BEPAY_SHOP_ID=changeme
BEPAY_SECRET_KEY=changeme
# Return/notify URLs must be reachable by provider (use tunnel in dev)
PAYMENT_RETURN_URL=http://localhost:3000/orders/success
PAYMENT_WEBHOOK_URL=http://localhost:3000/api/webhooks/payment
PAYMENT_WEBHOOK_SECRET=changeme_optional

# ───── Analytics / Monitoring ────────────────────────────────────────────────
SENTRY_DSN=
SENTRY_ENV=development
NEXT_PUBLIC_ANALYTICS_KEY=                    # PostHog/Plausible/etc.

# ───── Security / CORS / Limits ──────────────────────────────────────────────
ALLOWED_ORIGINS=http://localhost:3000
IMAGE_MAX_BYTES=5000000                       # 5MB
IMAGE_MAX_WIDTH=1600
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=90
```

---