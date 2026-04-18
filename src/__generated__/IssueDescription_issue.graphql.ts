/**
 * @generated SignedSource<<c62ce97db7d0bb02007976967690f145>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IssueDescription_issue$data = {
  readonly description: string;
  readonly nodeId: string;
  readonly number: number;
  readonly " $fragmentType": "IssueDescription_issue";
};
export type IssueDescription_issue$key = {
  readonly " $data"?: IssueDescription_issue$data;
  readonly " $fragmentSpreads": FragmentRefs<"IssueDescription_issue">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IssueDescription_issue",
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
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "issues",
  "abstractKey": null
};

(node as any).hash = "6fe4eb44650c9e5b254b1644b0157920";

export default node;
