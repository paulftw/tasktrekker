/**
 * @generated SignedSource<<71f55c31fd10184bfd092799d2eafc5f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IssueComments_issue$data = {
  readonly commentsCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly author: {
          readonly name: string;
        };
        readonly body: string;
        readonly created_at: string;
        readonly nodeId: string;
        readonly number: number;
      };
    }>;
  } | null | undefined;
  readonly " $fragmentType": "IssueComments_issue";
};
export type IssueComments_issue$key = {
  readonly " $data"?: IssueComments_issue$data;
  readonly " $fragmentSpreads": FragmentRefs<"IssueComments_issue">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IssueComments_issue",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 50
        },
        {
          "kind": "Literal",
          "name": "orderBy",
          "value": [
            {
              "number": "AscNullsLast"
            }
          ]
        }
      ],
      "concreteType": "commentsConnection",
      "kind": "LinkedField",
      "name": "commentsCollection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "commentsEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "comments",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
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
                  "name": "body",
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
                  "alias": "author",
                  "args": null,
                  "concreteType": "users",
                  "kind": "LinkedField",
                  "name": "users",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "name",
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
      "storageKey": "commentsCollection(first:50,orderBy:[{\"number\":\"AscNullsLast\"}])"
    }
  ],
  "type": "issues",
  "abstractKey": null
};

(node as any).hash = "3e4761947ab126e6c5c773c4dd04bad6";

export default node;
