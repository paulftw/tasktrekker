/**
 * @generated SignedSource<<fb8059dcaa9d48752af1868eb1e06665>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type issue_status = "backlog" | "cancelled" | "done" | "in_progress" | "todo" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type IssueHeader_issue$data = {
  readonly created_at: string;
  readonly nodeId: string;
  readonly number: number;
  readonly status: issue_status;
  readonly title: string;
  readonly " $fragmentType": "IssueHeader_issue";
};
export type IssueHeader_issue$key = {
  readonly " $data"?: IssueHeader_issue$data;
  readonly " $fragmentSpreads": FragmentRefs<"IssueHeader_issue">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IssueHeader_issue",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "nodeId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "number",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "created_at",
      "storageKey": null
    }
  ],
  "type": "issues",
  "abstractKey": null
};

(node as any).hash = "964df0a7f4ddb3a784a9c1a37a25904b";

export default node;
