-- TaskTrekker schema
-- Paste into Supabase SQL Editor

create type issue_status as enum ('backlog', 'todo', 'in_progress', 'done', 'cancelled');
create type issue_priority as enum ('none', 'low', 'medium', 'high', 'urgent');

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text
);

create table issues (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  status issue_status not null default 'backlog',
  priority issue_priority not null default 'none',
  assignee_id uuid references users(id),
  created_at timestamptz not null default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issues(id) on delete cascade,
  body text not null,
  author_id uuid not null references users(id),
  created_at timestamptz not null default now()
);

create table labels (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null
);

create table issue_labels (
  issue_id uuid not null references issues(id) on delete cascade,
  label_id uuid not null references labels(id) on delete cascade,
  primary key (issue_id, label_id)
);

alter publication supabase_realtime add table issues;
