# TaskTrekker

A minimal issue tracker built with Next.js, Relay, and Supabase.

## Setup

```bash
git clone <repo-url>
cd TaskTrekker
npm install
```

### Quick start (demo environment)

The repo ships with `.env.example` pointing at a disposable Supabase project pre-loaded with test data. To get running immediately:

```bash
cp .env.example .env.local
npm run dev
```

> **Note:** The demo credentials are publishable (anon) keys with non-sensitive test data only. They are checked in intentionally for reviewer convenience. Do not reuse this infrastructure for anything beyond evaluation.

### Self-hosted setup

To run against your own Supabase project:

1. Create a project at [supabase.com](https://supabase.com) (free tier)
2. Enable the `pg_graphql` extension: Dashboard > Database > Extensions
3. Run the schema migration: paste `supabase/schema.sql` into SQL Editor and run
4. Create `.env.local` with your project's credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```
5. Seed test data and pull the schema:
   ```bash
   node supabase/seed.js         # safe to re-run, truncates first
   npm run fetch-schema          # introspect GraphQL schema from your instance
   npm run relay                 # compile Relay artifacts
   ```

> **RLS Note:** Row Level Security is disabled during development for convenience. In production, enable RLS on all tables and configure proper policies scoped to `auth.uid()`. Never ship with RLS disabled.

### Run

```bash
npm run dev
```

## Relay + pg_graphql

This is the most interesting technical challenge in the project. pg_graphql auto-generates a GraphQL schema from Postgres tables, but its conventions don't align with Relay's compiler expectations out of the box. Here's what I encountered and how I solved each issue.

### Problem 1: Node interface uses `nodeId`, not `id`

Relay's compiler expects the `Node` interface to have a field called `id: ID!`. pg_graphql uses `nodeId: ID!` as the global identifier (base64-encoded composite of table name + primary key) and keeps `id` as the raw database UUID.

**Solution:** Relay compiler v13+ supports `schemaConfig.nodeInterfaceIdField` in `relay.config.json`:

```json
{
  "schemaConfig": {
    "nodeInterfaceIdField": "nodeId",
    "nodeInterfaceIdVariableName": "nodeId"
  }
}
```

This tells the compiler to look for `nodeId` instead of `id` on the `Node` interface. No schema patching needed. The same config ensures that `@refetchable` fragments and Relay's internal node resolution use the correct field name.

### Problem 2: Schema introspection for the Relay compiler

The Relay compiler needs a local `schema.graphql` file. pg_graphql's schema is generated dynamically, so it must be introspected from the running Supabase instance.

**Solution:** `scripts/fetch-schema.js` runs a full introspection query against the Supabase GraphQL endpoint and converts it to SDL using `graphql-js`'s `buildClientSchema` + `printSchema`. This is run manually via `npm run fetch-schema` whenever the database schema changes.

### Problem 3: Custom scalar types

pg_graphql uses custom scalars (`UUID`, `Datetime`, `Cursor`, `Opaque`, `BigInt`, `BigFloat`, `Date`, `Time`) that the Relay compiler doesn't know about. Without explicit mappings, the generated TypeScript types would be `unknown`.

**Solution:** Map all custom scalars to their TypeScript equivalents in `relay.config.json`:

```json
{
  "customScalarTypes": {
    "UUID": "string",
    "Datetime": "string",
    "Cursor": "string"
  }
}
```

### Problem 4: SWC vs Babel for the `graphql` tagged template

Next.js 14+ uses SWC (not Babel), so `babel-plugin-relay` doesn't work. The `graphql` tagged template literal must be transformed at compile time; at runtime it throws an invariant violation.

**Solution:** Next.js has built-in SWC support for Relay via `next.config.ts`:

```ts
compiler: {
  relay: {
    src: "./src",
    language: "typescript",
    artifactDirectory: "./src/__generated__",
  },
}
```

This replaces `babel-plugin-relay` entirely.

### What actually worked well

- pg_graphql's generated schema is surprisingly close to the Relay connection spec. Types are named `*Connection` with `edges`, `node`, and `pageInfo` in the expected shape.
- The `Node` interface exists and all table types implement it.
- Root `node(nodeId: ID!)` query exists for Relay's node resolution.
- Cursor-based pagination with `first`/`after`/`last`/`before` works out of the box.
- Postgres enums (`issue_status`, `issue_priority`) become proper GraphQL enums.

## Architecture Decisions

- **Enums over text columns.** Status and priority are Postgres enums, not plain text. pg_graphql turns these into GraphQL enum types, giving type safety from database to UI with no mapping layer.
- **Centralized Relay artifacts.** All generated files go to `src/__generated__/` rather than co-located `__generated__` folders. Simpler gitignore, easier to inspect.
- **Generated files are committed.** Both `schema.graphql` and `src/__generated__/` are checked in. This means `npm run build` works without network access to Supabase and without running the Relay compiler first. Reviewers can also inspect the generated queries and types directly in the PR. The tradeoff is merge noise on schema changes, which is acceptable at this scale.
- **No schema patching.** The `fetch-schema.js` script outputs the pg_graphql schema verbatim. All Relay compatibility is handled through compiler config, not by rewriting the schema. This means the schema file always matches what the server actually serves.

## TODO

### Must have
- [x] Tailwind design tokens — set up before heavy UI work to avoid restyle pass
- [ ] Issue detail page with co-located Relay fragments — unlocks edit + comments
- [ ] Edit issue: status, priority, title, description, assignee, labels — mutation infrastructure
- [ ] Optimistic update on status change — layers on edit mutations, spec highlight
- [ ] Create issue — reuses mutation patterns from edit
- [ ] Comment thread with cursor-based pagination + add comment — detail page section
- [ ] Issue list filters: status, priority, labels (multi-select) — independent of detail work
- [ ] Issue list cursor-based pagination — independent of detail work
- [ ] Real-time: Supabase Realtime on issue list → Relay store — needs solid list first

### Should have
- [ ] Auth: Supabase Auth with OAuth, RLS policies
- [ ] Deploy to Vercel

### Extra touch
- [ ] Read/unread comment count on issue list items

## Trade-offs

- **`@types/react-relay` lags behind `react-relay`.** The runtime is v20 but DefinitelyTyped only has types up to v18. The API surface is stable enough that the v18 types work, but this is a known gap. If it caused issues, I'd write a local `.d.ts` override.
- _More to come as the project progresses._

## Progress

### Done
- Supabase project setup with pg_graphql enabled
- Database schema: 5 tables (`users`, `issues`, `comments`, `labels`, `issue_labels`) with enums and foreign keys
- Seed data script with realistic test data
- Relay compiler working with pg_graphql schema (the hard part)
- Next.js 16 scaffold with TypeScript strict, Tailwind CSS, SWC Relay transform
- Relay environment with Supabase GraphQL network layer
- Basic issue list rendering (proof of concept -- data flows end-to-end)
- Supabase Realtime enabled on issues table
- Semantic Tailwind design tokens: light/dark via CSS variables, status/priority color system

### Pending
- Issue list: filters (status, priority, labels), cursor-based pagination
- Issue detail page with co-located Relay fragments
- Mutations: edit title, description, status, priority, assignee, labels
- Optimistic updates on status change with rollback + toast
- Comment thread with cursor-based pagination
- Real-time: Supabase Realtime subscriptions bridged into Relay store

### Future (if time permits)
- Auth: Supabase Auth with OAuth (GitHub/Google), RLS policies
- UI polish: Linear-inspired design, transitions, loading states
- Keyboard shortcuts
- Deploy to Vercel

## Tools

Built with [Claude Code](https://claude.ai/code) as a development partner -- used for architectural brainstorming, researching the Relay/pg_graphql integration surface, and accelerating boilerplate. All design decisions and code are my own.
