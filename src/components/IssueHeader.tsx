"use client";

import { graphql, useFragment } from "react-relay";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StatusPicker } from "./StatusPicker";
import { TitleEditor } from "./TitleEditor";
import type { IssueHeader_issue$key } from "@/__generated__/IssueHeader_issue.graphql";

const fragment = graphql`
  fragment IssueHeader_issue on issues {
    nodeId
    number
    title
    status
    created_at
  }
`;

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function IssueHeader({ issue }: { issue: IssueHeader_issue$key }) {
  const data = useFragment(fragment, issue);

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text transition-colors"
        >
          <ArrowLeft className="size-4" />
          Issues
        </Link>
      </div>
      <div className="flex items-start gap-3">
        <StatusPicker
          nodeId={data.nodeId}
          number={data.number}
          status={data.status}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-text flex items-start gap-2">
            <span className="text-text-muted tabular-nums pt-0.5">
              #{data.number}
            </span>
            <span className="flex-1 min-w-0">
              <TitleEditor
                nodeId={data.nodeId}
                number={data.number}
                title={data.title}
              />
            </span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Created {DATE_FORMAT.format(new Date(data.created_at))}
          </p>
        </div>
      </div>
    </div>
  );
}
