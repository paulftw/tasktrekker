/**
 * @generated SignedSource<<6f38aef541ff79c62807ac3c2930a846>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IssueSidebar_query$data = {
  readonly labelsCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly color: string;
        readonly name: string;
        readonly nodeId: string;
        readonly number: number;
      };
    }>;
  } | null | undefined;
  readonly usersCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly avatar_url: string | null | undefined;
        readonly id: string;
        readonly name: string;
        readonly nodeId: string;
      };
    }>;
  } | null | undefined;
  readonly " $fragmentType": "IssueSidebar_query";
};
export type IssueSidebar_query$key = {
  readonly " $data"?: IssueSidebar_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"IssueSidebar_query">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nodeId",
  "storageKey": null
},
v2 = {
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
  "name": "IssueSidebar_query",
  "selections": [
    {
      "alias": null,
      "args": (v0/*: any*/),
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
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                (v2/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "avatar_url",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "usersCollection(first:100,orderBy:[{\"name\":\"AscNullsLast\"}])"
    },
    {
      "alias": null,
      "args": (v0/*: any*/),
      "concreteType": "labelsConnection",
      "kind": "LinkedField",
      "name": "labelsCollection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "labelsEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "labels",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "number",
                  "storageKey": null
                },
                (v2/*: any*/),
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
      "storageKey": "labelsCollection(first:100,orderBy:[{\"name\":\"AscNullsLast\"}])"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "91c74238f70050338046d22526c9d171";

export default node;
