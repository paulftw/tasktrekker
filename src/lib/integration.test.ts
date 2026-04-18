import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";

// Integration layer. Hits the demo Supabase directly (REST for DML, pg_graphql
// for the mutation round-trip). These tests leave rows behind — the demo DB is
// expected to accumulate test trash; no cleanup. Invariants covered are server
// invariants that the UI depends on and that can't be proven from the client:
// the comment-numbering trigger, the pg_graphql mutation shape, and the
// labels.color check constraint.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    "Integration tests need NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
  );
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

async function graphql<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/graphql/v1`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY! },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json();
  if (body.errors) {
    throw new Error(
      body.errors.map((e: { message: string }) => e.message).join("\n"),
    );
  }
  return body.data as T;
}

const stamp = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

let authorId: string;

beforeAll(async () => {
  const { data, error } = await supabase
    .from("users")
    .insert({ name: `integration-${stamp()}` })
    .select("id")
    .single();
  if (error) throw error;
  authorId = data.id;
});

// Invariant: the BEFORE INSERT trigger on comments assigns per-issue
// sequential numbers starting at 1. N sequential inserts on a fresh issue
// return numbers 1..N in insertion order.
describe("comments numbering trigger", () => {
  it("assigns 1..N to N sequential comments on a single issue", async () => {
    const issue = await supabase
      .from("issues")
      .insert({ title: `numbering-${stamp()}` })
      .select("id")
      .single();
    if (issue.error) throw issue.error;

    const N = 5;
    for (let i = 0; i < N; i++) {
      const { error } = await supabase
        .from("comments")
        .insert({ issue_id: issue.data.id, body: `c${i}`, author_id: authorId });
      if (error) throw error;
    }

    const { data, error } = await supabase
      .from("comments")
      .select("number")
      .eq("issue_id", issue.data.id)
      .order("number", { ascending: true });
    if (error) throw error;

    expect(data.map((c) => c.number)).toEqual([1, 2, 3, 4, 5]);
  });
});

// Invariant: the StatusPickerUpdateMutation shape persists a new status
// through pg_graphql. Pins the server-side contract the UI's optimistic
// update relies on.
describe("status mutation round-trip via pg_graphql", () => {
  it("persists the updated status", async () => {
    const issue = await supabase
      .from("issues")
      .insert({ title: `status-${stamp()}`, status: "todo" })
      .select("id")
      .single();
    if (issue.error) throw issue.error;

    await graphql(
      `
        mutation ($number: Int!, $status: issue_status!) {
          updateissuesCollection(
            set: { status: $status }
            filter: { number: { eq: $number } }
            atMost: 1
          ) {
            records { nodeId status }
          }
        }
      `,
      { number: issue.data.id, status: "done" },
    );

    const { data, error } = await supabase
      .from("issues")
      .select("status")
      .eq("id", issue.data.id)
      .single();
    if (error) throw error;
    expect(data.status).toBe("done");
  });
});

// Invariant: the labels.color check constraint rejects non-hex strings and
// accepts 6-digit lowercase hex. The UI trusts the server to validate; this
// pins the server half of that contract.
describe("labels.color check constraint", () => {
  it("rejects non-hex color", async () => {
    const { error } = await supabase
      .from("labels")
      .insert({ name: `bad-${stamp()}`, color: "zzz" });
    expect(error).not.toBeNull();
  });

  it("accepts 6-digit lowercase hex", async () => {
    const { data, error } = await supabase
      .from("labels")
      .insert({ name: `good-${stamp()}`, color: "ff0000" })
      .select("color")
      .single();
    expect(error).toBeNull();
    expect(data?.color).toBe("ff0000");
  });
});
