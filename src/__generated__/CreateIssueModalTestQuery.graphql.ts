/**
 * @generated SignedSource<<345811809092e889f06c57b9db99545d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateIssueModalTestQuery$variables = Record<PropertyKey, never>;
export type CreateIssueModalTestQuery$data = {
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
};
export type CreateIssueModalTestQuery = {
  response: CreateIssueModalTestQuery$data;
  variables: CreateIssueModalTestQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nodeId",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      (v0/*: any*/)
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
              },
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "avatar_url",
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "usersCollection(first:100)"
  },
  {
    "alias": null,
    "args": [
      (v0/*: any*/),
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "number",
                "storageKey": null
              },
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "color",
                "storageKey": null
              },
              (v2/*: any*/)
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
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v5 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateIssueModalTestQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CreateIssueModalTestQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "73d14fb2fc9ad0c755bbf0530520def4",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "labelsCollection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "labelsConnection"
        },
        "labelsCollection.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "labelsEdge"
        },
        "labelsCollection.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "labels"
        },
        "labelsCollection.edges.node.color": (v4/*: any*/),
        "labelsCollection.edges.node.name": (v4/*: any*/),
        "labelsCollection.edges.node.nodeId": (v5/*: any*/),
        "labelsCollection.edges.node.number": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "usersCollection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "usersConnection"
        },
        "usersCollection.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "usersEdge"
        },
        "usersCollection.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "users"
        },
        "usersCollection.edges.node.avatar_url": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        },
        "usersCollection.edges.node.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "UUID"
        },
        "usersCollection.edges.node.name": (v4/*: any*/),
        "usersCollection.edges.node.nodeId": (v5/*: any*/)
      }
    },
    "name": "CreateIssueModalTestQuery",
    "operationKind": "query",
    "text": "query CreateIssueModalTestQuery {\n  usersCollection(first: 100) {\n    edges {\n      node {\n        id\n        name\n        avatar_url\n        nodeId\n      }\n    }\n  }\n  labelsCollection(first: 100, orderBy: [{name: AscNullsLast}]) {\n    edges {\n      node {\n        number\n        name\n        color\n        nodeId\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fe247b02ea0f3d151cf3d76885f3b0fb";

export default node;
