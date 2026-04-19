/**
 * @generated SignedSource<<249ab7fc4a24628d38283cfd30313225>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type FilterIs = "NOT_NULL" | "NULL" | "%future added value";
export type issue_priority = "high" | "low" | "medium" | "urgent" | "%future added value";
export type issue_status = "backlog" | "cancelled" | "done" | "in_progress" | "todo" | "%future added value";
export type issuesFilter = {
  and?: ReadonlyArray<issuesFilter> | null | undefined;
  assignee_id?: UUIDFilter | null | undefined;
  created_at?: DatetimeFilter | null | undefined;
  description?: StringFilter | null | undefined;
  nodeId?: IDFilter | null | undefined;
  not?: issuesFilter | null | undefined;
  number?: IntFilter | null | undefined;
  or?: ReadonlyArray<issuesFilter> | null | undefined;
  priority?: issue_priorityFilter | null | undefined;
  status?: issue_statusFilter | null | undefined;
  title?: StringFilter | null | undefined;
};
export type IntFilter = {
  eq?: number | null | undefined;
  gt?: number | null | undefined;
  gte?: number | null | undefined;
  in?: ReadonlyArray<number> | null | undefined;
  is?: FilterIs | null | undefined;
  lt?: number | null | undefined;
  lte?: number | null | undefined;
  neq?: number | null | undefined;
};
export type StringFilter = {
  eq?: string | null | undefined;
  gt?: string | null | undefined;
  gte?: string | null | undefined;
  ilike?: string | null | undefined;
  in?: ReadonlyArray<string> | null | undefined;
  iregex?: string | null | undefined;
  is?: FilterIs | null | undefined;
  like?: string | null | undefined;
  lt?: string | null | undefined;
  lte?: string | null | undefined;
  neq?: string | null | undefined;
  regex?: string | null | undefined;
  startsWith?: string | null | undefined;
};
export type issue_statusFilter = {
  eq?: issue_status | null | undefined;
  in?: ReadonlyArray<issue_status> | null | undefined;
  is?: FilterIs | null | undefined;
  neq?: issue_status | null | undefined;
};
export type issue_priorityFilter = {
  eq?: issue_priority | null | undefined;
  in?: ReadonlyArray<issue_priority> | null | undefined;
  is?: FilterIs | null | undefined;
  neq?: issue_priority | null | undefined;
};
export type UUIDFilter = {
  eq?: string | null | undefined;
  in?: ReadonlyArray<string> | null | undefined;
  is?: FilterIs | null | undefined;
  neq?: string | null | undefined;
};
export type DatetimeFilter = {
  eq?: string | null | undefined;
  gt?: string | null | undefined;
  gte?: string | null | undefined;
  in?: ReadonlyArray<string> | null | undefined;
  is?: FilterIs | null | undefined;
  lt?: string | null | undefined;
  lte?: string | null | undefined;
  neq?: string | null | undefined;
};
export type IDFilter = {
  eq?: string | null | undefined;
};
export type IssueListQuery$variables = {
  filter?: issuesFilter | null | undefined;
  first: number;
};
export type IssueListQuery$data = {
  readonly issuesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly assignee: {
          readonly avatar_url: string | null | undefined;
          readonly name: string;
        } | null | undefined;
        readonly issue_labelsCollection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly labels: {
                readonly color: string;
                readonly name: string;
                readonly nodeId: string;
                readonly number: number;
              };
              readonly nodeId: string;
            };
          }>;
        } | null | undefined;
        readonly nodeId: string;
        readonly number: number;
        readonly priority: issue_priority;
        readonly status: issue_status;
        readonly title: string;
      };
    }>;
  } | null | undefined;
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
export type IssueListQuery = {
  response: IssueListQuery$data;
  variables: IssueListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "filter"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v2 = [
  {
    "kind": "Variable",
    "name": "filter",
    "variableName": "filter"
  },
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nodeId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "number",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "priority",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatar_url",
  "storageKey": null
},
v10 = [
  (v3/*: any*/),
  (v4/*: any*/),
  (v8/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "color",
    "storageKey": null
  }
],
v11 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "first",
      "value": 10
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
            (v3/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "labels",
              "kind": "LinkedField",
              "name": "labels",
              "plural": false,
              "selections": (v10/*: any*/),
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "issue_labelsCollection(first:10)"
},
v12 = {
  "kind": "Literal",
  "name": "orderBy",
  "value": [
    {
      "name": "AscNullsLast"
    }
  ]
},
v13 = {
  "alias": null,
  "args": [
    (v12/*: any*/)
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
          "selections": (v10/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "labelsCollection(orderBy:[{\"name\":\"AscNullsLast\"}])"
},
v14 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "first",
      "value": 100
    },
    (v12/*: any*/)
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
            (v3/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "id",
              "storageKey": null
            },
            (v8/*: any*/),
            (v9/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "usersCollection(first:100,orderBy:[{\"name\":\"AscNullsLast\"}])"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "IssueListQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
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
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  {
                    "alias": "assignee",
                    "args": null,
                    "concreteType": "users",
                    "kind": "LinkedField",
                    "name": "users",
                    "plural": false,
                    "selections": [
                      (v8/*: any*/),
                      (v9/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v11/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v13/*: any*/),
      (v14/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "IssueListQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
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
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  {
                    "alias": "assignee",
                    "args": null,
                    "concreteType": "users",
                    "kind": "LinkedField",
                    "name": "users",
                    "plural": false,
                    "selections": [
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v11/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v13/*: any*/),
      (v14/*: any*/)
    ]
  },
  "params": {
    "cacheID": "b988172f3339be1b84f39c44c630873d",
    "id": null,
    "metadata": {},
    "name": "IssueListQuery",
    "operationKind": "query",
    "text": "query IssueListQuery(\n  $first: Int!\n  $filter: issuesFilter\n) {\n  issuesCollection(first: $first, filter: $filter, orderBy: [{created_at: DescNullsLast}]) {\n    edges {\n      node {\n        nodeId\n        number\n        title\n        status\n        priority\n        assignee: users {\n          name\n          avatar_url\n          nodeId\n        }\n        issue_labelsCollection(first: 10) {\n          edges {\n            node {\n              nodeId\n              labels {\n                nodeId\n                number\n                name\n                color\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  labelsCollection(orderBy: [{name: AscNullsLast}]) {\n    edges {\n      node {\n        nodeId\n        number\n        name\n        color\n      }\n    }\n  }\n  usersCollection(first: 100, orderBy: [{name: AscNullsLast}]) {\n    edges {\n      node {\n        nodeId\n        id\n        name\n        avatar_url\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4f22fe637b5aa06c09022d1c62626974";

export default node;
