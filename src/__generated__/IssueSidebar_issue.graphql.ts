/**
 * @generated SignedSource<<7b2545129688796b21ecfd2283de9600>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type issue_priority = "high" | "low" | "medium" | "urgent" | "%future added value";
export type issue_status = "backlog" | "cancelled" | "done" | "in_progress" | "todo" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type IssueSidebar_issue$data = {
  readonly assignee: {
    readonly avatar_url: string | null | undefined;
    readonly name: string;
  } | null | undefined;
  readonly created_at: string;
  readonly issue_labelsCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly labels: {
          readonly color: string;
          readonly name: string;
          readonly nodeId: string;
        };
      };
    }>;
  } | null | undefined;
  readonly nodeId: string;
  readonly number: number;
  readonly priority: issue_priority;
  readonly status: issue_status;
  readonly " $fragmentType": "IssueSidebar_issue";
};
export type IssueSidebar_issue$key = {
  readonly " $data"?: IssueSidebar_issue$data;
  readonly " $fragmentSpreads": FragmentRefs<"IssueSidebar_issue">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nodeId",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IssueSidebar_issue",
  "selections": [
    (v0/*: any*/),
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
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "priority",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "created_at",
      "storageKey": null
    },
    {
      "alias": "assignee",
      "args": null,
      "concreteType": "users",
      "kind": "LinkedField",
      "name": "users",
      "plural": false,
      "selections": [
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "avatar_url",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
        }
      ],
      "concreteType": "issue_labelsConnection",
      "kind": "LinkedField",
      "name": "issue_labelsCollection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "issue_labelsEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "issue_labels",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "labels",
                  "kind": "LinkedField",
                  "name": "labels",
                  "plural": false,
                  "selections": [
                    (v0/*: any*/),
                    (v1/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "color",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "issue_labelsCollection(first:20)"
    }
  ],
  "type": "issues",
  "abstractKey": null
};
})();

(node as any).hash = "846882d5b1812ec337dfde76eae9e5a4";

export default node;
