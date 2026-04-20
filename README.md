# TaskTrekker

> **Live:** https://tasktrekker-drab.vercel.app
> **Repo:** https://github.com/paulftw/tasktrekker

A minimal issue tracker. Next.js, Relay, Supabase/pg_graphql, TypeScript strict, Tailwind.

## Setup

```bash
git clone https://github.com/paulftw/tasktrekker.git
cd TaskTrekker
npm install
```

### Quick start (demo environment)

`.env.example` points at a disposable Supabase project pre-loaded with test data. To get running:

```bash
cp .env.example .env.local
npm run dev
```

> The demo credentials are publishable (anon) keys with non-sensitive test data only. Checked in for reviewer convenience. Do not reuse this infrastructure beyond evaluation.

### Self-hosted setup

1. Create a project at [supabase.com](https://supabase.com) (free tier).
2. Enable `pg_graphql`: Dashboard > Database > Extensions.
3. Paste `supabase/schema.sql` into SQL Editor and run.
4. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```
5. Seed data and pull the schema:
   ```bash
   node supabase/seed.js         # safe to re-run, truncates first
   npm run fetch-schema          # introspect GraphQL schema
   npm run relay                 # compile Relay artifacts
   ```

> **RLS.** Row Level Security is disabled during development for convenience. In production, enable RLS on all tables with policies scoped to `auth.uid()`. Never ship with RLS disabled.

### Run

```bash
npm run dev
```

## Relay + pg_graphql

pg_graphql auto-generates a GraphQL schema from Postgres tables, but it does not follow Relay conventions.

### Problem 1: Node interface uses `nodeId`, not `id`

Relay expects the `Node` interface to have `id: ID!`. pg_graphql uses `nodeId: ID!` as the global identifier (encoded table name + PK).

Fix: Tell Relay to use `nodeId` instead. File `relay.config.json`:

```json
{
  "schemaConfig": {
    "nodeInterfaceIdField": "nodeId",
    "nodeInterfaceIdVariableName": "nodeId"
  }
}
```

### Problem 2: Schema introspection

The Relay compiler needs a local `schema.graphql`, but pg_graphql generates it dynamically. Fix: `scripts/fetch-schema.js` runs a full introspection query and converts to SDL via `graphql-js`'s `buildClientSchema` + `printSchema`. Run `npm run fetch-schema` whenever the DB schema changes.

### Problem 3: Custom scalar types

pg_graphql uses custom scalars (`UUID`, `Datetime`, `Cursor`, `Opaque`, `BigInt`, `BigFloat`, `Date`, `Time`). Without mappings, generated TS types would be `unknown`. Fix: map scalars in `relay.config.json`:

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

Next.js 14+ uses SWC, so `babel-plugin-relay` doesn't work. The `graphql` tagged template must be transformed at compile time or it throws an invariant at runtime.

Fix: Next.js has built-in SWC support for Relay via `next.config.ts`:

```ts
compiler: {
  relay: {
    src: "./src",
    language: "typescript",
    artifactDirectory: "./src/__generated__",
  },
}
```

### Problem 5: Runtime store keys records by path, not `nodeId`

Problem 1's `nodeInterfaceIdField` tells the compiler what to emit for `node(...)` lookups but does not tell the runtime normalizer how to extract an identifier from a record during store writes. Symptom: mutations succeed server-side, but the UI doesn't update until a full reload.

Fix: supply `getDataID` to the Environment so any record with a `nodeId` field is keyed by its value:

```ts
new Environment({
  ...
  getDataID: (record) => {
    const nodeId = record.nodeId;
    return typeof nodeId === "string" ? nodeId : undefined;
  },
});
```

## Architecture Decisions

- **Enums over text columns.** Status and priority are Postgres enums. pg_graphql turns them into GraphQL enums, giving type safety from DB to UI with no mapping layer.
- **Centralized Relay artifacts.** All generated files go to `src/__generated__/` rather than co-located `__generated__` folders. Simpler gitignore, easier to inspect.
- **Generated files are committed.** Both `schema.graphql` and `src/__generated__/` are checked in, so `npm run build` works without network access to Supabase and without running the Relay compiler first. Tradeoff: merge noise on schema changes, acceptable at this scale.
- **No schema patching.** `fetch-schema.js` outputs pg_graphql verbatim. Relay compatibility is handled through compiler config, not schema rewriting. The file always matches what the server serves.

### Deviations from the spec schema

Spec says `id uuid PK` on every table and explicitly allows type adjustments. I kept two UUIDs and changed three PKs; each deviation is reasoned below.

The short-ID and per-issue numbering work (`/issues/3`, `#comment-3`) is where I put extra effort. Issues and comments are the centerpiece of an issue tracker, and short human-readable IDs are table stakes. The implementation sits entirely on the Postgres side (compound PK + trigger), so no client-side complexity or new failure modes. In a real project I'd confirm the call with PM/UX. Here I made it because it felt right for a tracker.

- **`issues.id`: uuid → `integer generated always as identity`.** Sequential IDs give clean URLs (`/issues/3` vs `/issues/4dc7b80b-...`) and recognizable identifiers in the UI. Guessable IDs aren't a risk without auth or multi-tenancy. `bigint` maps to a GraphQL string scalar in pg_graphql (JS `number` can't safely go past 2^53), so `integer` keeps the native `Int` and 2B is more than enough.
- **`comments`: compound PK `(issue_id, number)` with a `BEFORE INSERT` trigger that assigns `number` per-issue.** Enables deep links like `/issues/13#comment-3`. The trigger locks the parent issue row (`FOR UPDATE`), so concurrent inserts on the same issue serialize atomically with no client-side race risk. Compound PK is also the more natural representation of "comment N on issue X."
- **`labels.id`: uuid → integer.** Consistency with issues, and anticipating a future `/labels/3` filter page. Not in the spec but a natural extension.
- **`users.id`, `author_id`, `assignee_id`: kept as uuid.** Sized for future Supabase Auth. `auth.users.id` is UUID, so `public.users.id = auth.users.id` can be bridged by an `AFTER INSERT` trigger with no type coercion. FK columns follow.
- **Renamed `id` to `number` in GraphQL for `issues` and `labels`.** Relay's runtime normalizer requires `id` fields to be strings on Node types. Integer PKs break that. Fix: pg_graphql column directive renames the field in GraphQL only; SQL column stays `id`. Options considered: per-query alias, SQL column rename, pg_graphql directive, revert to UUID.

  ```sql
  comment on column issues.id is e'@graphql({"name": "number"})';
  comment on column labels.id is e'@graphql({"name": "number"})';
  ```

## Trade-offs

- **`@types/react-relay` lags behind `react-relay`.** Runtime is v20, DefinitelyTyped only has v18. The API surface is stable enough that v18 types work, but it's a known gap. If it caused issues I'd write a local `.d.ts` override.

## Status

### Done

- Supabase + pg_graphql, 5-table schema (`users`, `issues`, `comments`, `labels`, `issue_labels`) with enums and FKs, idempotent seed script.
- Relay compiler working with pg_graphql (the hard part).
- Next.js 16 scaffold: TypeScript strict, Tailwind, SWC Relay transform, Relay environment on Supabase GraphQL.
- Semantic Tailwind tokens: light/dark via CSS variables, status/priority color system.
- Issue list rendering (data flows end-to-end).
- Issue detail page at `/issues/[number]` with co-located Relay fragments.
- Inline title and description editors with Zod validation mirroring DB constraints.
- Error toasts on mutation failure using Sonner.
- Status mutation with optimistic update. Relay auto-rolls back on server error.
- Real-time across browser windows: Supabase Realtime subscriptions on `issues`, `comments`, and `issue_labels` (list + detail) bridged into the Relay store via `fetchQuery` refetch on event. Status, priority, title, description, new comments, and label add/remove all propagate without reload. Refetch over hand-patching the store from raw row payloads: payloads carry SQL column values but not the encoded `nodeId`, joined fields (e.g. `comment.author.name`), or connection-edge plumbing — patching means re-implementing pieces of pg_graphql client-side. Refetch is one path that handles all cases. Cost is real at scale: one DB write fans out to N refetches across N open tabs, each a full query. Fine for an MVP serving small teams; at Linear scale I'd patch scalar UPDATEs from the payload and reserve refetch for joins and inserts.
- Test suite, component layer: Vitest + Testing Library + `relay-test-utils`, SWC transform (same as production, no babel fork). StatusPicker commit contract + `getDataID` normalization regression pin (README Problem 5).
- Test suite, integration layer: hits demo Supabase directly. Comment-numbering trigger assigns 1..N per issue; StatusPickerUpdateMutation round-trips through pg_graphql; `labels.color` check rejects non-hex. Leaves rows behind — demo DB, no cleanup. Not property-based: we're demonstrating it works, not stress-testing concurrency. Runs via `npm test`.
- Test suite, E2E layer: nine Playwright tests across four specs. Golden path: list → issue detail → change status, plus add comment. Filters: URL syncing, label search, assignee combinations, and the temporary "Assigned to me" shortcut behavior. Create issue: topbar modal creates an issue, adds labels, and lands on detail. Realtime: two browser contexts prove status and comment propagation. Runs via `npm run test:e2e`; dev server auto-spawns. Unit layer skipped — no pure business logic to pin.
- Claude Design applied - layout, icons, grouped view.
- Shared `LabelPill` component drives the sidebar, list rows, and the remove-label dropdown item — one source of truth for the dot+name pill. Realtime extended to subscribe to `issue_labels` so cross-window add/remove propagates.
- Add comment widget with optimistic updates, cross-window realtime propagation, and platform-aware keyboard shortcut handling.
- Create issue flow: topbar `+ New issue` launches a modal wired to Relay mutations, `C` opens it, `Cmd/Ctrl+Enter` submits it, and successful create navigates straight to the new detail page. Status / priority / assignee / labels all live in the modal; add-label menus are searchable.
- Issue list filters: status, labels, assignee, and single-select priority, synced with URL state. Labels and assignees have inline search, and the assignee menu exposes temporary "Assigned to me" / "Unassigned" shortcuts above the user list.
- UI way to create new label via the label picker dropdown, integrated with Relay mutations and caching.
- Issue list cursor-based pagination via `usePaginationFragment` with an `IntersectionObserver`-based infinite scroll trigger.
- Comment thread cursor-based pagination via `usePaginationFragment` with a "Load more" button.

### Pending

- **Authentication:** Replace the temporary authless current-user fallback (first seeded user) — used by the assignee filter's "Assigned to me" shortcut and the comment composer — with proper Supabase Auth + RLS.
- **E2E Test Failures:**
  - `e2e/filters.spec.ts`: **Repeatedly broken**. `Alice Johnson` visibility failure in multi-select combinations.
  - `e2e/pagination.spec.ts`: **Flaky**. Comment count mismatch (10 vs 11) in "Load more" verification.
- Dropdown filters don't close when clicking on an issue. The click lands on the issue link instead.
- **Label Filtering:** Move client-side multi-label filtering to a server-side PG procedure for scalability.
- **Priority Filter:** Multi-select support (spec implies this).
- **Typography:** Standardize the scale; remove fractional pixel font sizes to fix sub-pixel baseline alignment.

### Maybe Later

- Filter on multiple labels is done clientside, it messes with the infinite scroll. Add pg procedure to handle this?
- Group components into folders (FilterTab and components, icons/pills? Dropdowns?)
- CSS Cleanup.
- Alphabetic sorting of labels everywhere in UI lists.
- check if avatar url is used, seems like placeholeder is always generated
- mobile responsiveness
- Change filter by priority to multiselect - spec seems to imply that.


### Punted (would do with more time)

- Auth: Supabase Auth with OAuth, RLS policies. Current TODO on top: remove the first-seeded-user fallback that stands in for "me" until auth exists.
- Read/unread comment count on issue list.
- Create label after search should prepopulate with search text.
- Command palette and a broader keyboard-shortcut layer.

## Tools

Built with Claude Code as a development partner. Used for accelerating boilerplate, researching the Relay/pg_graphql integration, brainstorming.
