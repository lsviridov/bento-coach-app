# 1) СХЕМЫ (читабельный формат)

## `profiles` — профиль пользователя

| Поле        | Тип                      | Обяз. | По умолчанию | Описание                   |
| ----------- | ------------------------ | ----: | ------------ | -------------------------- |
| id          | uuid (PK, FK→auth.users) |     ✔ | —            | ID пользователя = auth.uid |
| created\_at | timestamptz              |     ✔ | now()        | Когда создан               |
| updated\_at | timestamptz              |     ✔ | now()        | Когда изменён (триггер)    |
| full\_name  | text                     |       |              | Имя                        |
| birthdate   | date                     |       |              | Д.р.                       |
| height\_cm  | int                      |       |              | Рост (см)                  |
| weight\_kg  | numeric(6,2)             |       |              | Вес (кг)                   |
| allergies   | text\[]                  |       |              | Аллергии                   |
| goals       | text\[]                  |       |              | Цели                       |

## `meals` — приёмы пищи (итоги по приёму)

| Поле        | Тип                  | Обяз. | По умолчанию        | Описание      |
| ----------- | -------------------- | ----: | ------------------- | ------------- |
| id          | uuid (PK)            |     ✔ | gen\_random\_uuid() |               |
| user\_id    | uuid (FK→auth.users) |     ✔ |                     | Владелец      |
| created\_at | timestamptz          |     ✔ | now()               |               |
| updated\_at | timestamptz          |     ✔ | now()               |               |
| taken\_at   | timestamptz          |     ✔ | now()               | Время приёма  |
| note        | text                 |       |                     | Заметка       |
| calories    | int                  |       | 0                   | Ккал за приём |
| protein\_g  | numeric(6,2)         |       | 0                   | Белки         |
| fat\_g      | numeric(6,2)         |       | 0                   | Жиры          |
| carbs\_g    | numeric(6,2)         |       | 0                   | Углеводы      |

## `meal_photos` — фото и вывод CV

| Поле           | Тип             | Обяз. | По умолчанию        | Описание          |
| -------------- | --------------- | ----: | ------------------- | ----------------- |
| id             | uuid (PK)       |     ✔ | gen\_random\_uuid() |                   |
| meal\_id       | uuid (FK→meals) |     ✔ |                     | Связь с приёмом   |
| created\_at    | timestamptz     |     ✔ | now()               |                   |
| storage\_path  | text            |     ✔ |                     | Путь в Storage    |
| ai\_labels     | text\[]         |       |                     | Классы блюда      |
| ai\_confidence | numeric\[]      |       |                     | Уверенности       |
| grams          | int             |       |                     | Граммы порции     |
| calories\_est  | int             |       |                     | Оценка ккал       |
| protein\_g     | numeric(6,2)    |       |                     | Белки (оценка)    |
| fat\_g         | numeric(6,2)    |       |                     | Жиры (оценка)     |
| carbs\_g       | numeric(6,2)    |       |                     | Углеводы (оценка) |

## `water_intakes` — учёт воды (опционально для кольца «Вода»)

| Поле        | Тип                  | Обяз. | По умолчанию        | Описание        |
| ----------- | -------------------- | ----: | ------------------- | --------------- |
| id          | uuid (PK)            |     ✔ | gen\_random\_uuid() |                 |
| user\_id    | uuid (FK→auth.users) |     ✔ |                     | Владелец        |
| created\_at | timestamptz          |     ✔ | now()               | Когда выпил     |
| ml          | int                  |     ✔ |                     | Миллилитры (>0) |

## `nutrients_daily_summary` — суточные сводки

| Поле                                                                               | Тип                  | Обяз. | По умолчанию | Описание         |
| ---------------------------------------------------------------------------------- | -------------------- | ----: | ------------ | ---------------- |
| user\_id                                                                           | uuid (FK→auth.users) |     ✔ |              | Владелец         |
| date                                                                               | date                 |     ✔ |              | Дата (UTC)       |
| updated\_at                                                                        | timestamptz          |     ✔ | now()        |                  |
| water\_ml                                                                          | int                  |     ✔ | 0            | Вода за день     |
| calories                                                                           | int                  |     ✔ | 0            | Ккал за день     |
| protein\_g                                                                         | numeric(6,2)         |     ✔ | 0            | Белки за день    |
| fat\_g                                                                             | numeric(6,2)         |     ✔ | 0            | Жиры за день     |
| carbs\_g                                                                           | numeric(6,2)         |     ✔ | 0            | Углеводы за день |
| **PK:** (user\_id, date) — поддерживается триггерами из `meals` и `water_intakes`. |                      |       |              |                  |

## `protocols` — протоколы приёма пептидов

| Поле                 | Тип                  | Обяз. | По умолчанию        |
| -------------------- | -------------------- | ----: | ------------------- |
| id                   | uuid (PK)            |     ✔ | gen\_random\_uuid() |
| user\_id             | uuid (FK→auth.users) |     ✔ |                     |
| created\_at          | timestamptz          |     ✔ | now()               |
| updated\_at          | timestamptz          |     ✔ | now()               |
| title                | text                 |     ✔ |                     |
| start\_date          | date                 |     ✔ |                     |
| end\_date            | date                 |       |                     |
| times\_per\_day      | int                  |     ✔ | 2                   |
| separate\_from\_food | boolean              |     ✔ | true                |

## `protocol_events` — расписание/отметки по протоколам

| Поле          | Тип                 | Обяз. | По умолчанию        | Описание                           |
| ------------- | ------------------- | ----: | ------------------- | ---------------------------------- |
| id            | uuid (PK)           |     ✔ | gen\_random\_uuid() |                                    |
| protocol\_id  | uuid (FK→protocols) |     ✔ |                     | Связь                              |
| scheduled\_at | timestamptz         |     ✔ |                     | План                               |
| done\_at      | timestamptz         |       |                     | Факт                               |
| status        | text (check)        |     ✔ | 'scheduled'         | 'scheduled' \| 'done' \| 'skipped' |

## `products` — каталог

| Поле        | Тип           | Обяз. | По умолчанию        |
| ----------- | ------------- | ----: | ------------------- |
| id          | uuid (PK)     |     ✔ | gen\_random\_uuid() |
| created\_at | timestamptz   |     ✔ | now()               |
| updated\_at | timestamptz   |     ✔ | now()               |
| slug        | text (UNIQUE) |     ✔ |                     |
| title       | text          |     ✔ |                     |
| description | text          |       |                     |
| price\_byn  | numeric(10,2) |     ✔ |                     |
| image\_url  | text          |       |                     |
| tags        | text\[]       |       |                     |
| is\_active  | boolean       |     ✔ | true                |

## `carts` / `cart_items` — корзины (по пользователю)

**carts**

| Поле        | Тип                  | Обяз. | По умолчанию        |
| ----------- | -------------------- | ----: | ------------------- |
| id          | uuid (PK)            |     ✔ | gen\_random\_uuid() |
| user\_id    | uuid (FK→auth.users) |     ✔ |                     |
| created\_at | timestamptz          |     ✔ | now()               |
| updated\_at | timestamptz          |     ✔ | now()               |
| status      | text (check)         |     ✔ | 'open'              |

**cart\_items**

| Поле                                | Тип                |
| ----------------------------------- | ------------------ |
| id                                  | uuid (PK)          |
| cart\_id                            | uuid (FK→carts)    |
| product\_id                         | uuid (FK→products) |
| qty                                 | int (>0)           |
| price\_byn                          | numeric(10,2)      |
| **UNIQUE:** (cart\_id, product\_id) |                    |

## `orders` / `order_items` — заказы

**orders**

| Поле          | Тип                  | Обяз. | По умолчанию        |
| ------------- | -------------------- | ----: | ------------------- |
| id            | uuid (PK)            |     ✔ | gen\_random\_uuid() |
| user\_id      | uuid (FK→auth.users) |     ✔ |                     |
| created\_at   | timestamptz          |     ✔ | now()               |
| updated\_at   | timestamptz          |     ✔ | now()               |
| status        | text (check)         |     ✔ | 'pending'           |
| total\_byn    | numeric(10,2)        |     ✔ | 0                   |
| provider\_ref | text                 |       |                     |

**order\_items**

| Поле        | Тип                |
| ----------- | ------------------ |
| id          | uuid (PK)          |
| order\_id   | uuid (FK→orders)   |
| product\_id | uuid (FK→products) |
| qty         | int (>0)           |
| price\_byn  | numeric(10,2)      |

## `push_subscriptions` — Web Push подписки

| Поле        | Тип                  | Обяз. | По умолчанию        |
| ----------- | -------------------- | ----: | ------------------- |
| id          | uuid (PK)            |     ✔ | gen\_random\_uuid() |
| user\_id    | uuid (FK→auth.users) |     ✔ |                     |
| endpoint    | text (UNIQUE)        |     ✔ |                     |
| p256dh      | text                 |     ✔ |                     |
| auth        | text                 |     ✔ |                     |
| created\_at | timestamptz          |     ✔ | now()               |

---

# 2) SQL ДЛЯ SUPABASE SQL EDITOR

```sql
-- ─────────────────────────────────────────────────────────────────────────────
-- ADAPTO — схема БД для Supabase
-- Таблицы, индексы, комментарии, функции, триггеры, RLS-политики.
-- Безопасно запускать целиком в SQL Editor проекта.
-- ─────────────────────────────────────────────────────────────────────────────

-- 0) Расширения
create extension if not exists "pgcrypto"; -- gen_random_uuid()
create extension if not exists "btree_gin";
create extension if not exists "btree_gist";

-- 1) Вспомогательные функции
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create or replace function public.refresh_daily_summary(uid uuid, d date)
returns void language plpgsql as $$
begin
  insert into public.nutrients_daily_summary as s
    (user_id, "date", water_ml, calories, protein_g, fat_g, carbs_g, updated_at)
  values (
    uid,
    d,
    coalesce((select sum(ml)::int from public.water_intakes
              where user_id = uid and (created_at at time zone 'UTC')::date = d), 0),
    coalesce((select sum(calories)::int from public.meals
              where user_id = uid and (taken_at   at time zone 'UTC')::date = d), 0),
    coalesce((select sum(protein_g) from public.meals
              where user_id = uid and (taken_at   at time zone 'UTC')::date = d), 0),
    coalesce((select sum(fat_g) from public.meals
              where user_id = uid and (taken_at   at time zone 'UTC')::date = d), 0),
    coalesce((select sum(carbs_g) from public.meals
              where user_id = uid and (taken_at   at time zone 'UTC')::date = d), 0),
    now()
  )
  on conflict (user_id, "date") do update
    set water_ml = excluded.water_ml,
        calories = excluded.calories,
        protein_g = excluded.protein_g,
        fat_g     = excluded.fat_g,
        carbs_g   = excluded.carbs_g,
        updated_at= now();
end $$;

create or replace function public.meals_refresh_summary_trg()
returns trigger language plpgsql as $$
declare uid uuid; d date;
begin
  if tg_op = 'DELETE' then
    uid := old.user_id; d := (old.taken_at at time zone 'UTC')::date;
  else
    uid := new.user_id; d := (new.taken_at at time zone 'UTC')::date;
  end if;
  perform public.refresh_daily_summary(uid, d);
  return null;
end $$;

create or replace function public.water_refresh_summary_trg()
returns trigger language plpgsql as $$
declare uid uuid; d date;
begin
  if tg_op = 'DELETE' then
    uid := old.user_id; d := (old.created_at at time zone 'UTC')::date;
  else
    uid := new.user_id; d := (new.created_at at time zone 'UTC')::date;
  end if;
  perform public.refresh_daily_summary(uid, d);
  return null;
end $$;

-- 2) Таблицы

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text,
  birthdate date,
  height_cm int check (height_cm is null or height_cm between 0 and 300),
  weight_kg numeric(6,2) check (weight_kg is null or weight_kg between 0 and 500),
  allergies text[],
  goals text[]
);
comment on table  public.profiles is 'Профили пользователей';
comment on column public.profiles.id is 'auth.users.id';
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- meals
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  taken_at timestamptz not null default now(),
  note text,
  calories int default 0 check (calories >= 0),
  protein_g numeric(6,2) default 0 check (protein_g >= 0),
  fat_g     numeric(6,2) default 0 check (fat_g >= 0),
  carbs_g   numeric(6,2) default 0 check (carbs_g >= 0)
);
create index if not exists meals_user_taken_idx on public.meals(user_id, taken_at desc);
create trigger set_meals_updated_at
  before update on public.meals
  for each row execute function public.set_updated_at();
create trigger meals_refresh_summary_aiud
  after insert or update or delete on public.meals
  for each row execute function public.meals_refresh_summary_trg();

-- meal_photos
create table if not exists public.meal_photos (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  created_at timestamptz not null default now(),
  storage_path text not null,
  ai_labels text[],
  ai_confidence numeric[],
  grams int check (grams is null or grams > 0),
  calories_est int check (calories_est is null or calories_est >= 0),
  protein_g numeric(6,2) check (protein_g is null or protein_g >= 0),
  fat_g     numeric(6,2) check (fat_g     is null or fat_g     >= 0),
  carbs_g   numeric(6,2) check (carbs_g   is null or carbs_g   >= 0)
);
create index if not exists meal_photos_meal_idx on public.meal_photos(meal_id);

-- water_intakes
create table if not exists public.water_intakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  ml int not null check (ml > 0)
);
create index if not exists water_user_created_idx on public.water_intakes(user_id, created_at desc);
create trigger water_refresh_summary_aiud
  after insert or update or delete on public.water_intakes
  for each row execute function public.water_refresh_summary_trg();

-- nutrients_daily_summary
create table if not exists public.nutrients_daily_summary (
  user_id uuid not null references auth.users(id) on delete cascade,
  "date" date not null,
  updated_at timestamptz not null default now(),
  water_ml int not null default 0,
  calories int not null default 0,
  protein_g numeric(6,2) not null default 0,
  fat_g     numeric(6,2) not null default 0,
  carbs_g   numeric(6,2) not null default 0,
  primary key (user_id, "date")
);
create index if not exists summary_user_date_idx on public.nutrients_daily_summary(user_id, "date" desc);

-- protocols
create table if not exists public.protocols (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  start_date date not null,
  end_date date,
  times_per_day int not null default 2 check (times_per_day > 0),
  separate_from_food boolean not null default true
);
create index if not exists protocols_user_idx on public.protocols(user_id);
create trigger set_protocols_updated_at
  before update on public.protocols
  for each row execute function public.set_updated_at();

-- protocol_events
create table if not exists public.protocol_events (
  id uuid primary key default gen_random_uuid(),
  protocol_id uuid not null references public.protocols(id) on delete cascade,
  scheduled_at timestamptz not null,
  done_at timestamptz,
  status text not null default 'scheduled'
    check (status in ('scheduled','done','skipped'))
);
create index if not exists protocol_events_sched_idx on public.protocol_events(protocol_id, scheduled_at);

-- products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  description text,
  price_byn numeric(10,2) not null check (price_byn >= 0),
  image_url text,
  tags text[],
  is_active boolean not null default true
);
create index if not exists products_active_idx on public.products(is_active);
create index if not exists products_tags_gin on public.products using gin (tags);
create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- carts
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'open'
    check (status in ('open','abandoned','converted'))
);
create index if not exists carts_user_status_idx on public.carts(user_id, status);
create trigger set_carts_updated_at
  before update on public.carts
  for each row execute function public.set_updated_at();

-- cart_items
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id),
  qty int not null check (qty > 0),
  price_byn numeric(10,2) not null check (price_byn >= 0),
  unique (cart_id, product_id)
);
create index if not exists cart_items_cart_idx on public.cart_items(cart_id);

-- orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending'
    check (status in ('pending','paid','failed','shipped','canceled')),
  total_byn numeric(10,2) not null default 0 check (total_byn >= 0),
  provider_ref text
);
create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
create index if not exists orders_status_idx on public.orders(status);
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- order_items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  qty int not null check (qty > 0),
  price_byn numeric(10,2) not null check (price_byn >= 0)
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- push_subscriptions
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);
create index if not exists push_user_idx on public.push_subscriptions(user_id);

-- 3) Включим RLS и политики

-- profiles
alter table public.profiles enable row level security;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);
create policy profiles_insert_own on public.profiles
  for insert with check (auth.uid() = id);
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy profiles_delete_own on public.profiles
  for delete using (auth.uid() = id);

-- meals
alter table public.meals enable row level security;
create policy meals_select_own on public.meals
  for select using (auth.uid() = user_id);
create policy meals_cud_own on public.meals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- meal_photos (через родителя)
alter table public.meal_photos enable row level security;
create policy meal_photos_owner_via_meal on public.meal_photos
  for all using (
    exists (select 1 from public.meals m
            where m.id = meal_id and m.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.meals m
            where m.id = meal_id and m.user_id = auth.uid())
  );

-- water_intakes
alter table public.water_intakes enable row level security;
create policy water_select_own on public.water_intakes
  for select using (auth.uid() = user_id);
create policy water_cud_own on public.water_intakes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- nutrients_daily_summary (вставка/обновление делаются нашими триггерами от имени пользователя)
alter table public.nutrients_daily_summary enable row level security;
create policy summary_select_own on public.nutrients_daily_summary
  for select using (auth.uid() = user_id);
create policy summary_upsert_own on public.nutrients_daily_summary
  for insert with check (auth.uid() = user_id);
create policy summary_update_own on public.nutrients_daily_summary
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy summary_delete_own on public.nutrients_daily_summary
  for delete using (auth.uid() = user_id);

-- protocols
alter table public.protocols enable row level security;
create policy protocols_cud_own on public.protocols
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- protocol_events (через родителя)
alter table public.protocol_events enable row level security;
create policy protocol_events_owner_via_protocol on public.protocol_events
  for all using (
    exists (select 1 from public.protocols p
            where p.id = protocol_id and p.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.protocols p
            where p.id = protocol_id and p.user_id = auth.uid())
  );

-- products (публичное чтение, изменения только service_role)
alter table public.products enable row level security;
create policy products_public_read on public.products
  for select using (true);
create policy products_write_service on public.products
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- carts
alter table public.carts enable row level security;
create policy carts_cud_own on public.carts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- cart_items (через корзину)
alter table public.cart_items enable row level security;
create policy cart_items_owner_via_cart on public.cart_items
  for all using (
    exists (select 1 from public.carts c
            where c.id = cart_id and c.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.carts c
            where c.id = cart_id and c.user_id = auth.uid())
  );

-- orders
alter table public.orders enable row level security;
create policy orders_select_own on public.orders
  for select using (auth.uid() = user_id);
create policy orders_insert_own on public.orders
  for insert with check (auth.uid() = user_id);
-- статус меняет вебхук сервис-ключом:
create policy orders_update_service on public.orders
  for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy orders_delete_own on public.orders
  for delete using (auth.uid() = user_id);

-- order_items (через заказ)
alter table public.order_items enable row level security;
create policy order_items_owner_via_order on public.order_items
  for all using (
    exists (select 1 from public.orders o
            where o.id = order_id and o.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.orders o
            where o.id = order_id and o.user_id = auth.uid())
  );

-- push_subscriptions
alter table public.push_subscriptions enable row level security;
create policy push_select_own on public.push_subscriptions
  for select using (auth.uid() = user_id);
create policy push_cud_own on public.push_subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Готово. Таблицы, индексы, RLS и триггеры созданы.
-- Примечание: триггеры суточных сводок считают дни в UTC.
-- При необходимости можно адаптировать под локальную TZ пользователя.
-- ─────────────────────────────────────────────────────────────────────────────
``