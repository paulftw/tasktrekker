/**
 * @generated SignedSource<<1afd5957f85d0bb8616ee367fbbf4dfd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IssueComments_query$data = {
  readonly firstUser: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
      };
    }>;
  } | null | undefined;
  readonly " $fragmentType": "IssueComments_query";
};
export type IssueComments_query$key = {
  readonly " $data"?: IssueComments_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"IssueComments_query">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IssueComments_query",
  "selections": [
    {
      "alias": "firstUser",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        },
        {
          "kind": "Literal",
          "name": "orderBy",
          "value": [
            {
              "name": "AscNullsLast"
            }
          ]
        }
      ],
      "concreteType": "usersConnection",
      "kind": "LinkedField",
      "name": "usersCollection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "usersEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "users",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "usersCollection(first:1,orderBy:[{\"name\":\"AscNullsLast\"}])"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "eb2d7cadebeb1bcdd7ac2e4e7cd5bc01";

export default node;
