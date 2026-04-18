import { z } from "zod";

// Zod schemas for mutable issue fields. Mirror the server check constraints in
// supabase/schema.sql so the client rejects the same inputs the DB would.
// Duplication is deliberate: the UI gives immediate feedback, the server is
// still the source of truth. If the two drift, integration tests catch it.

// schema.sql: check (length(trim(title)) > 0 and length(title) <= 200).
// We trim first, then enforce 1..200 — stricter than the server (it allows
// whitespace padding) but closer to what users actually want.
export const issueTitleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(200, "Title must be 200 characters or fewer");

// schema.sql: check (length(description) <= 10000). Empty is allowed.
export const issueDescriptionSchema = z
  .string()
  .max(10000, "Description must be 10000 characters or fewer");

export type IssueTitle = z.infer<typeof issueTitleSchema>;
export type IssueDescription = z.infer<typeof issueDescriptionSchema>;
