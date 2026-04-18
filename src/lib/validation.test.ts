import { describe, expect, it } from "vitest";
import { issueDescriptionSchema, issueTitleSchema } from "./validation";

// Invariant: client schemas line up with the server check constraints in
// supabase/schema.sql. If the Postgres check changes, these tests fail and
// force the client to follow — stopping silent drift between UI and DB.

describe("issueTitleSchema", () => {
  it("rejects empty string", () => {
    expect(issueTitleSchema.safeParse("").success).toBe(false);
  });

  it("rejects whitespace-only string", () => {
    expect(issueTitleSchema.safeParse("   ").success).toBe(false);
  });

  it("accepts a normal title", () => {
    const result = issueTitleSchema.safeParse("Fix the login bug");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("Fix the login bug");
  });

  it("trims surrounding whitespace", () => {
    const result = issueTitleSchema.safeParse("  hi  ");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("hi");
  });

  it("accepts exactly 200 characters", () => {
    expect(issueTitleSchema.safeParse("a".repeat(200)).success).toBe(true);
  });

  it("rejects 201 characters", () => {
    expect(issueTitleSchema.safeParse("a".repeat(201)).success).toBe(false);
  });
});

describe("issueDescriptionSchema", () => {
  it("accepts empty string", () => {
    expect(issueDescriptionSchema.safeParse("").success).toBe(true);
  });

  it("accepts normal prose", () => {
    expect(issueDescriptionSchema.safeParse("Multi\nline body").success).toBe(
      true,
    );
  });

  it("accepts exactly 10000 characters", () => {
    expect(issueDescriptionSchema.safeParse("a".repeat(10000)).success).toBe(
      true,
    );
  });

  it("rejects 10001 characters", () => {
    expect(issueDescriptionSchema.safeParse("a".repeat(10001)).success).toBe(
      false,
    );
  });
});
