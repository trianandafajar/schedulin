-- EXTENSION
create extension if not exists "pgcrypto";

---------------------------------------------------
-- USERS
---------------------------------------------------
create table users (
  id text primary key, -- clerk user id
  email text not null unique,
  full_name text,
  avatar_url text,
  role text default 'user', -- user | admin
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

---------------------------------------------------
-- BUSINESS CATEGORIES MASTER
---------------------------------------------------
create table business_categories_master (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

---------------------------------------------------
-- BUSINESS
---------------------------------------------------
create table business (
  id uuid primary key default gen_random_uuid(),
  owner_id text references users(id) on delete cascade unique not null,
  name text not null,
  slug text unique not null,
  description text,
  address text,
  logo_url text,
  category_id uuid references business_categories_master(id),
  is_public_enabled boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index idx_business_owner on business(owner_id);
create index idx_business_slug on business(slug);

---------------------------------------------------
-- SERVICES
---------------------------------------------------
create table services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references business(id) on delete cascade,
  name text not null,
  duration_minutes int not null,
  price int not null,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index idx_services_business on services(business_id);

---------------------------------------------------
-- APPOINTMENT SLOTS
---------------------------------------------------
create table appointment_slots (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references business(id) on delete cascade,
  date date not null,
  time time not null,
  is_booked boolean default false,
  is_disabled boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (business_id, date, time)
);

create index idx_slots_business on appointment_slots(business_id);
create index idx_slots_date on appointment_slots(date);

---------------------------------------------------
-- BOOKINGS
---------------------------------------------------
create table bookings (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(id) on delete set null,
  business_id uuid references business(id) on delete cascade,
  service_id uuid references services(id),
  slot_id uuid references appointment_slots(id),
  status text default 'pending', -- pending | confirmed | cancelled
  customer_name text not null,
  customer_phone text not null,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index idx_bookings_business on bookings(business_id);
create index idx_bookings_user on bookings(user_id);

---------------------------------------------------
-- BUSINESS SCHEDULES 
---------------------------------------------------
create table business_schedules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references business(id) on delete cascade,
  day_of_week text not null, -- 'Monday', 'Tuesday', dll
  is_open boolean default true,
  start_time time,
  end_time time,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (business_id, day_of_week)
);

create index idx_schedules_business on business_schedules(business_id);

---------------------------------------------------
-- BUSINESS HOLIDAYS 
---------------------------------------------------
create table business_holidays (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references business(id) on delete cascade,
  date date not null,
  name text,
  created_at timestamp with time zone default now(),
  unique (business_id, date)
);

create index idx_holidays_business on business_holidays(business_id);

---------------------------------------------------
-- CALENDAR EVENTS
---------------------------------------------------
create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone,
  event_level text not null default 'Primary',
  created_at timestamp with time zone default now()
);

alter table public.calendar_events enable row level security;
create policy "Enable full access for all users" on public.calendar_events for all using (true) with check (true);

---------------------------------------------------
-- SEED DATA
---------------------------------------------------
insert into business_categories_master (name) values
('Barber'),
('Salon'),
('Tattoo'),
('Nail Art'),
('Massage');

alter table public.calendar_events 
add column user_id text references public.users(id) on delete cascade;

alter table public.calendar_events 
add column is_all_day boolean default false;