import { z } from 'zod';
import type { IssuePriority, IssueStatus } from '@/types/enums';

// Validates URL query params before casting to enums. Without this, a link
// like `?priority=urgen` would crash the issue list via PRIORITY_CONFIG[undefined].
// Enum lists are inlined here (not imported from StatusIcon/PriorityIcon) so
// this helper stays free of React and SVG dependencies.

const statusSchema = z.enum(['backlog', 'todo', 'in_progress', 'done', 'cancelled']);
const prioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export function parseStatuses(params: URLSearchParams): IssueStatus[] {
  return params.getAll('status').filter((s): s is IssueStatus => statusSchema.safeParse(s).success);
}

export function parsePriority(params: URLSearchParams): IssuePriority | null {
  const raw = params.get('priority');
  if (!raw) return null;
  const result = prioritySchema.safeParse(raw);
  return result.success ? (result.data as IssuePriority) : null;
}
