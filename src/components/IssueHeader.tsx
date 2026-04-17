"use client";

import { graphql, useFragment } from "react-relay";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StatusIcon } from "./StatusIcon";
import { PriorityIcon } from "./PriorityIcon";
import type { IssueHeader_issue$key } from "@/__generated__/IssueHeader_issue.graphql";

const fragment = graphql`
  fragment IssueHeader_issue on issues {
    number
    title
    status
    priority
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
        <StatusIcon status={data.status} className="mt-1.5" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-text">
            <span className="text-text-muted tabular-nums mr-2">
              #{data.number}
            </span>
            {data.title}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Created {DATE_FORMAT.format(new Date(data.created_at))}
          </p>
        </div>
        <PriorityIcon priority={data.priority} className="mt-2" />
      </div>
    </div>
  );
}
