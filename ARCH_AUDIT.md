# Architecture Audit - TaskTrekker

Full sweep of components, functions, and constants as of 2026-04-20.

## Component Audit

| File | Component | Exported | Description | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `AppShell.tsx` | `AppShell` | Yes | Main responsive layout wrapper. | |
| `AppShell.tsx` | `Topbar` | No | Internal top navigation bar. | |
| `AssigneePicker.tsx` | `AssigneePicker` | Yes | Dropdown to change issue assignee. | |
| `CreateIssueLauncher.tsx` | `CreateIssueLauncher` | Yes | Keyboard/Button trigger for the modal. | |
| `CreateIssueLauncher.tsx` | `CreateIssueLauncherModal` | No | Internal wrapper that fetches data before modal. | |
| `CreateIssueLauncher.tsx` | `NewIssueButton` | No | Internal top-bar styled button. | |
| `CreateIssueModal.tsx` | `CreateIssueModal` | Yes | Large form component for new issues. | **Bloated** |
| `CreateIssueModal.tsx` | `SearchMenuInput` | No | Internal filtered input for dropdowns. | **Duplicate** |
| `DescriptionEditor.tsx` | `DescriptionEditor` | Yes | Inline textarea editor for descriptions. | |
| `Dropdown.tsx` | `Dropdown` | Yes | Compound component (Radix wrapper). | Excellent abstraction. |
| `FilterBar.tsx` | `FilterBar` | Yes | Top filter strip for the list view. | |
| `FilterBar.tsx` | `FilterChip` | No | Internal styled button for filters. | |
| `FilterBar.tsx` | `SearchMenuInput` | No | Internal filtered input for dropdowns. | **Duplicate** |
| `IssueComments.tsx` | `IssueComments` | Yes | Comment thread with pagination. | |
| `IssueDescription.tsx` | `IssueDescription` | Yes | Render-only description body. | |
| `IssueDetail.tsx` | `IssueDetail` | Yes | Top-level detail page orchestrator. | |
| `IssueDetail.tsx` | `IssueNotFound` | Yes | Simple empty state for 404s. | |
| `IssueHeader.tsx` | `IssueHeader` | Yes | Breadcrumb/Title section of detail view. | |
| `IssueList.tsx` | `IssueList` | Yes | List view with infinite scroll. | |
| `IssueList.tsx` | `IssueListContent` | No | Internal paginated content renderer. | |
| `IssueList.tsx` | `IssueRow` | No | Individual row in the issue list. | |
| `IssueList.tsx` | `InfiniteScrollTrigger` | No | Intersection observer wrapper. | |
| `IssueSidebar.tsx` | `IssueSidebar` | Yes | Property sidebar (right column). | |
| `IssueSidebar.tsx` | `SectionHead` | No | Internal styled label for sidebar sections. | |
| `IssueSidebar.tsx` | `PropertyRow` | No | Internal layout helper for properties. | |
| `LabelEditorDialog.tsx` | `LabelEditorDialog` | Yes | Dialog to manage label metadata. | |
| `LabelEditorDialog.tsx` | `LabelEditorDialogInner` | No | Internal form logic for the dialog. | |
| `LabelPill.tsx` | `LabelPill` | Yes | Atomic visual unit for labels. | |
| `LabelsField.tsx` | `LabelsField` | Yes | List of pills with add/remove capability. | |
| `LabelsField.tsx` | `SelectedLabel` | No | Internal pill wrapper with remove logic. | |
| `LabelsField.tsx` | `SearchMenuInput` | No | Internal filtered input for dropdowns. | **Duplicate** |
| `LabelsPicker.tsx` | `LabelsPicker` | Yes | Dropdown to add/remove labels. | |
| `PriorityIcon.tsx` | `PriorityIcon` | Yes | Switcher for priority SVG icons. | |
| `PriorityPicker.tsx` | `PriorityPicker` | Yes | Dropdown to change issue priority. | |
| `RealtimeIndicator.tsx` | `RealtimeIndicator` | Yes | Connection status dot. | |
| `ShortcutTextarea.tsx` | `ShortcutTextarea` | Yes | Input with Cmd+Enter submission logic. | |
| `StatusIcon.tsx` | `StatusIcon` | Yes | Switcher for status SVG icons. | |
| `StatusPicker.tsx` | `StatusPicker` | Yes | Dropdown to change issue status. | |
| `TitleEditor.tsx` | `TitleEditor` | Yes | Inline title input with validation. | |
| `UserAvatar.tsx` | `UserAvatar` | Yes | User image/initials circle. | |

## Logic & Constants Audit

| File | Name | Type | Exported | Description |
| :--- | :--- | :--- | :--- | :--- |
| `src/lib/labelStore.ts` | `upsertRootLabel` | func | Yes | Manually updates Relay root for new labels. |
| `src/lib/labelStore.ts` | `removeRootLabel` | func | Yes | Manually removes label from Relay root. |
| `src/lib/realtimeStatus.ts` | `useRealtimeStatus` | hook | Yes | Reactive Supabase connection status. |
| `src/lib/relay-environment.ts`| `getCurrentEnvironment` | func | Yes | Shared environment getter. |
| `src/lib/useRealtimeRefetch.ts`| `useRealtimeRefetch` | hook | Yes | The heart of cross-tab sync. |
| `src/lib/validation.ts` | `issueTitleSchema` | const | Yes | Zod schema for title (1-255 chars). |
| `src/lib/validation.ts` | `labelColorSchema`| const | Yes | Zod schema for hex colors (6 chars). |
| `src/types/enums.ts` | `IssueStatus` | type | Yes | Union of valid status strings. |
| `src/components/StatusIcon.tsx`| `STATUS_CONFIG` | const | Yes | Icon, label, color mapping for statuses. |
| `src/components/IssueList.tsx` | `GROUP_ORDER` | const | No | Defines status vertical sort order. |

## Strategic Technical Debt (The "Crap" List)

### 1. Component Duplication (High Priority)
- `SearchMenuInput` and `focusFirstMenuItem` are duplicated identically across **3 files** (`CreateIssueModal.tsx`, `FilterBar.tsx`, `LabelsField.tsx`). They should be extracted to `src/components/Dropdown.tsx` or a shared utility.

### 2. File Organization
- `StatusIcon.tsx` and `PriorityIcon.tsx` contain significant **Configuration Data** (`STATUS_CONFIG`, `PRIORITY_CONFIG`) that is imported by many other components. These should probably live in `src/config` or `src/types` to avoid importing React components into pure logic layers.

### 3. Naming Weakness
- `RealtimeIndicator`: Good, but the underlying state is managed in `src/lib/realtimeStatus.ts` - consistency is okay, but `Status` vs `Indicator` is a slight mental shift.
- `LabelsField` vs `LabelsPicker`: `Field` implies a form field, `Picker` implies a selection interaction. They overlap significantly in `CreateIssueModal`.

### 4. Over-bloated Components
- `CreateIssueModal.tsx`: At ~480 lines, it handles its own internal state, multi-step mutations (issue + label links), validation, and custom keyboard navigation for multiple dropdowns. It's a prime candidate for decomposition.
- `IssueList.tsx`: Handles infinite scroll logic, status grouping, collapsed state, and the row rendering.

### 5. Magic Strings
- Assignee filters use `unassigned` and `assigned-to-me` as hardcoded strings. These should be moved to a shared constant or enum.
