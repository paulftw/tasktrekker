"use client";

import { useEffect, useRef, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { toast } from "sonner";
import { issueTitleSchema } from "@/lib/validation";
import type { TitleEditorUpdateMutation } from "@/__generated__/TitleEditorUpdateMutation.graphql";

const mutation = graphql`
  mutation TitleEditorUpdateMutation($number: Int!, $title: String!) {
    updateissuesCollection(
      set: { title: $title }
      filter: { number: { eq: $number } }
      atMost: 1
    ) {
      records {
        nodeId
        title
      }
    }
  }
`;

export function TitleEditor({
  nodeId,
  number,
  title,
}: {
  nodeId: string;
  number: number;
  title: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [commit, isInFlight] = useMutation<TitleEditorUpdateMutation>(mutation);

  useEffect(() => {
    if (!editing) setValue(title);
  }, [title, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  // Auto-grow textarea to fit multi-line titles without scrollbars.
  useEffect(() => {
    if (editing && inputRef.current) {
      // "auto" will force recalculation; otherwise, it won't shrink when text is deleted.
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [value, editing]);

  function cancel() {
    setValue(title);
    setEditing(false);
    setError(null);
  }

  function save() {
    const parsed = issueTitleSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid title");
      return;
    }
    setEditing(false);
    setError(null);
    if (parsed.data === title) return;
    commit({
      variables: { number, title: parsed.data },
      optimisticResponse: {
        updateissuesCollection: {
          records: [{ nodeId, title: parsed.data }],
        },
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Unknown error";
        toast.error("Failed to update title", { description: msg });
        console.error("Title update failed:", err);
      },
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label="Edit title"
        className="text-left w-full rounded -mx-1 px-1 py-0.5 hover:bg-bg-hover transition-colors cursor-text"
      >
        {title}
      </button>
    );
  }

  return (
    <div className="-mx-1">
      <textarea
        ref={inputRef}
        rows={1}
        value={value}
        onChange={(e) => {
          setValue(e.target.value.replace(/\r?\n/g, " "));
          if (error) setError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            save();
          } else if (e.key === "Escape") {
            e.preventDefault();
            cancel();
          }
        }}
        onBlur={save}
        disabled={isInFlight}
        aria-label="Title"
        aria-invalid={error !== null}
        className="block w-full rounded px-1 py-0.5 bg-bg-inset text-xl font-semibold text-text border border-border focus:border-text-secondary focus:outline-none disabled:opacity-60 resize-none overflow-hidden"
      />
      {error && (
        <p role="alert" className="mt-1 px-1 text-xs text-status-cancelled">
          {error}
        </p>
      )}
    </div>
  );
}
