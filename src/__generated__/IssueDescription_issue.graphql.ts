/**
 * @generated SignedSource<<47f682d6a6a19a59630b39e4e1532c30>>
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
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "issues",
  "abstractKey": null
};

(node as any).hash = "30b42499b15b3dd7e38726dafdc89bf5";

export default node;
