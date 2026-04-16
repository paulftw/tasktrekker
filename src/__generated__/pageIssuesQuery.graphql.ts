/**
 * @generated SignedSource<<ac533c632a0672eda3ee864030297bab>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type issue_priority = "high" | "low" | "medium" | "none" | "urgent" | "%future added value";
export type issue_status = "backlog" | "cancelled" | "done" | "in_progress" | "todo" | "%future added value";
export type pageIssuesQuery$variables = {
  first: number;
};
export type pageIssuesQuery$data = {
  readonly issuesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly nodeId: string;
        readonly priority: issue_priority;
        readonly status: issue_status;
        readonly title: string;
      };
    }>;
  } | null | undefined;
};
export type pageIssuesQuery = {
  response: pageIssuesQuery$data;
  variables: pageIssuesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "first"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "first",
        "variableName": "first"
      },
      {
        "kind": "Literal",
        "name": "orderBy",
        "value": [
          {
            "created_at": "DescNullsLast"
          }
        ]
      }
    ],
    "concreteType": "issuesConnection",
    "kind": "LinkedField",
    "name": "issuesCollection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "issuesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "issues",
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
                "name": "priority",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "pageIssuesQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "pageIssuesQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "aa332442408c915dc477d28bd91666ba",
    "id": null,
    "metadata": {},
    "name": "pageIssuesQuery",
    "operationKind": "query",
    "text": "query pageIssuesQuery(\n  $first: Int!\n) {\n  issuesCollection(first: $first, orderBy: [{created_at: DescNullsLast}]) {\n    edges {\n      node {\n        nodeId\n        title\n        status\n        priority\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "40f6ef2c24dd8e88528a1800cf46f278";

export default node;
