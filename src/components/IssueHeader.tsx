'use client';

import { graphql, useFragment } from 'react-relay';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TitleEditor } from './TitleEditor';
import type { IssueHeader_issue$key } from '@/__generated__/IssueHeader_issue.graphql';

const fragment = graphql`
  fragment IssueHeader_issue on issues {
    nodeId
    number
    title
  }
`;

export function IssueHeader({ issue }: { issue: IssueHeader_issue$key }) {
  const data = useFragment(fragment, issue);

  return (
    <div>
      <div className="flex items-center gap-1.5 text-[12px] text-text-secondary mb-3">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-text transition-colors">
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          Issues
        </Link>
        <span className="text-text-muted">/</span>
        <span className="mono text-text-muted">#{data.number}</span>
      </div>
      <h1 className="text-[22px] font-semibold text-text leading-[1.25] tracking-[-0.02em]">
        <TitleEditor nodeId={data.nodeId} number={data.number} title={data.title} />
      </h1>
    </div>
  );
}
