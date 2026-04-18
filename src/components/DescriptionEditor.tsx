"use client";

import { useEffect, useRef, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { toast } from "sonner";
import { issueDescriptionSchema } from "@/lib/validation";
import type { DescriptionEditorUpdateMutation } from "@/__generated__/DescriptionEditorUpdateMutation.graphql";

const mutation = graphql`
  mutation DescriptionEditorUpdateMutation(
    $number: Int!
    $description: String!
  ) {
    updateissuesCollection(
      set: { description: $description }
      filter: { number: { eq: $number } }
      atMost: 1
    ) {
      records {
        nodeId
        description
      }
    }
  }
`;

export function DescriptionEditor({
  nodeId,
  number,
  description,
}: {
  nodeId: string;
  number: number;
  description: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(description);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [commit, isInFlight] =
    useMutation<DescriptionEditorUpdateMutation>(mutation);

  useEffect(() => {
    if (!editing) setValue(description);
  }, [description, editing]);

  useEffect(() => {
    if (editing) {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [editing]);

  function cancel() {
    setValue(description);
    setEditing(false);
    setError(null);
  }

  function save() {
    const parsed = issueDescriptionSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid description");
      return;
    }
    setEditing(false);
    setError(null);
    if (parsed.data === description) return;
    commit({
      variables: { number, description: parsed.data },
      optimisticResponse: {
        updateissuesCollection: {
          records: [{ nodeId, description: parsed.data }],
        },
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Unknown error";
        toast.error("Failed to update description", { description: msg });
        console.error("Description update failed:", err);
      },
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label="Edit description"
        className="block text-left w-full rounded -mx-2 px-2 py-1.5 hover:bg-bg-hover transition-colors cursor-text"
      >
        {description ? (
          <span className="text-sm text-text whitespace-pre-wrap">
            {description}
          </span>
        ) : (
          <span className="text-sm text-text-muted italic">
            No description provided.
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="-mx-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            save();
          } else if (e.key === "Escape") {
            e.preventDefault();
            cancel();
          }
        }}
        onBlur={save}
        disabled={isInFlight}
        aria-label="Description"
        aria-invalid={error !== null}
        rows={6}
        className="block w-full rounded px-2 py-1.5 bg-bg-inset text-sm text-text border border-border focus:border-text-secondary focus:outline-none resize-y disabled:opacity-60"
      />
      <div className="mt-1 flex items-center justify-between px-2">
        {error ? (
          <p role="alert" className="text-xs text-status-cancelled">
            {error}
          </p>
        ) : (
          <p className="text-xs text-text-muted">
            <kbd>⌘</kbd>+<kbd>Enter</kbd> to save, <kbd>Esc</kbd> to cancel
          </p>
        )}
      </div>
    </div>
  );
}
