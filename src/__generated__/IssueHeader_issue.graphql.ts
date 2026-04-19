/**
 * @generated SignedSource<<e6f433ab8d5f343ce40e5b8834131498>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IssueHeader_issue$data = {
  readonly nodeId: string;
  readonly number: number;
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
    }
  ],
  "type": "issues",
  "abstractKey": null
};

(node as any).hash = "339703848c4d3bda46008077b88753f6";

export default node;
