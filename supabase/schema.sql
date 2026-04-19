-- TaskTrekker schema
-- Paste into Supabase SQL Editor

create type issue_status as enum ('backlog', 'todo', 'in_progress', 'done', 'cancelled');
create type issue_priority as enum ('low', 'medium', 'high', 'urgent');

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null
    check (length(trim(name)) > 0 and length(name) <= 100),
  avatar_url text
    check (length(avatar_url) <= 2048)
);

create table issues (
  id integer generated always as identity primary key,
  title text not null
    check (length(trim(title)) > 0 and length(title) <= 200),
  description text not null default ''
    check (length(description) <= 10000),
  status issue_status not null default 'backlog',
  priority issue_priority not null default 'low',
  assignee_id uuid references users(id),
  created_at timestamptz not null default now()
);

-- Rename `id` to `number` in the GraphQL schema. Relay's runtime normalizer
-- hardcodes "field literally named id must be a string" for Node types; our
-- integer PK trips that check. SQL column stays `id`.
comment on column issues.id is e'@graphql({"name": "number"})';

-- Compound PK (issue_id, number) enables per-issue sequential identifiers
-- for deep-link ergonomics: /issues/13#comment-3 instead of a global id.
create table comments (
  issue_id integer not null references issues(id) on delete cascade,
  -- default 0 makes `number` optional in the generated insert input; the
  -- BEFORE INSERT trigger overwrites it with the real per-issue sequence.
  number integer not null default 0,
  body text not null
    check (length(trim(body)) > 0 and length(body) <= 10000),
  author_id uuid not null references users(id),
  created_at timestamptz not null default now(),
  primary key (issue_id, number)
);

-- Locks the parent issue row so concurrent comment inserts on the same issue
-- serialize. Concurrent inserts on different issues don't block each other.
create function set_comment_number()
returns trigger as $$
begin
  perform 1 from issues where id = new.issue_id for update;
  new.number := coalesce(
    (select max(number) from comments where issue_id = new.issue_id),
    0
  ) + 1;
  return new;
end;
$$ language plpgsql;

create trigger comments_set_number
  before insert on comments
  for each row execute function set_comment_number();

-- Comments have a compound identity (issue_id, number). The insert trigger
-- assigns it; this guard prevents clients from rewriting it via update.
create function guard_comment_identity()
returns trigger as $$
begin
  if new.issue_id <> old.issue_id or new.number <> old.number then
    raise exception 'comment identity is immutable';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger comments_guard_identity
  before update on comments
  for each row execute function guard_comment_identity();

-- Server-managed created_at: forces server time on insert, rejects updates.
-- Applied to issues and comments via the triggers below.
create function guard_created_at()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    new.created_at := now();
    return new;
  end if;
  if new.created_at <> old.created_at then
    raise exception 'created_at is immutable';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger issues_guard_created_at
  before insert or update on issues
  for each row execute function guard_created_at();

create trigger comments_guard_created_at
  before insert or update on comments
  for each row execute function guard_created_at();

create table labels (
  id integer generated always as identity primary key,
  name text not null unique
    check (length(trim(name)) > 0 and length(name) <= 50),
  -- 6-digit lowercase hex without the leading '#'; UI prepends it on render.
  color text not null check (color ~ '^[0-9a-f]{6}$')
);

comment on column labels.id is e'@graphql({"name": "number"})';

create table issue_labels (
  issue_id integer not null references issues(id) on delete cascade,
  label_id integer not null references labels(id) on delete cascade,
  primary key (issue_id, label_id)
);

alter publication supabase_realtime add table issues;
alter publication supabase_realtime add table comments;

-- RLS disabled for demo. In production, enable RLS on all tables and scope
-- policies to auth.uid(). Flagged in README.
alter table users disable row level security;
alter table issues disable row level security;
alter table comments disable row level security;
alter table labels disable row level security;
alter table issue_labels disable row level security;
