/**
 * Shared enum types mirroring the Postgres enums.
 *
 * Defined here rather than imported from a specific Relay query artifact
 * so that shared UI components (StatusIcon, PriorityIcon) stay decoupled
 * from individual operations. Relay-generated types are structurally
 * identical, so TypeScript compatibility is automatic.
 */

export type IssueStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "done"
  | "cancelled"
  | "%future added value";

export type IssuePriority =
  | "high"
  | "low"
  | "medium"
  | "urgent"
  | "%future added value";
