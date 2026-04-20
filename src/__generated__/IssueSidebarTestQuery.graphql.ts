/**
 * @generated SignedSource<<521703bd676f0028f75a663f1c0f22f3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IssueSidebarTestQuery$variables = Record<PropertyKey, never>;
export type IssueSidebarTestQuery$data = {
  readonly issuesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly " $fragmentSpreads": FragmentRefs<"IssueSidebar_issue">;
      };
    }>;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"IssueSidebar_query">;
};
export type IssueSidebarTestQuery = {
  response: IssueSidebarTestQuery$data;
  variables: IssueSidebarTestQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
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
  "name": "number",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
    "storageKey": null
  },
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "avatar_url",
    "storageKey": null
  }
],
v5 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v6 = [
  (v5/*: any*/)
],
v7 = [
  (v1/*: any*/),
  (v2/*: any*/),
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "color",
    "storageKey": null
  }
],
v8 = [
  (v5/*: any*/),
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
v9 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v10 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "UUID"
},
v11 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v12 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v13 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "labels"
},
v14 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Int"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "IssueSidebarTestQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
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
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "IssueSidebar_issue"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "issuesCollection(first:1)"
      },
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "IssueSidebar_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "IssueSidebarTestQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
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
                  (v1/*: any*/),
                  (v2/*: any*/),
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
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "assignee_id",
                    "storageKey": null
                  },
                  {
                    "alias": "assignee",
                    "args": null,
                    "concreteType": "users",
                    "kind": "LinkedField",
                    "name": "users",
                    "plural": false,
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v6/*: any*/),
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
                              (v1/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "labels",
                                "kind": "LinkedField",
                                "name": "labels",
                                "plural": false,
                                "selections": (v7/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "__typename",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "cursor",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "PageInfo",
                        "kind": "LinkedField",
                        "name": "pageInfo",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "endCursor",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "hasNextPage",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "issue_labelsCollection(first:100)"
                  },
                  {
                    "alias": null,
                    "args": (v6/*: any*/),
                    "filters": null,
                    "handle": "connection",
                    "key": "IssueSidebar_issue__issue_labelsCollection",
                    "kind": "LinkedHandle",
                    "name": "issue_labelsCollection"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "issuesCollection(first:1)"
      },
      {
        "alias": null,
        "args": (v8/*: any*/),
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
                "selections": (v4/*: any*/),
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
        "args": (v8/*: any*/),
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
                "selections": (v7/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "labelsCollection(first:100,orderBy:[{\"name\":\"AscNullsLast\"}])"
      }
    ]
  },
  "params": {
    "cacheID": "82cb9945aa666ddb5890d8128c7684fb",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "issuesCollection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "issuesConnection"
        },
        "issuesCollection.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "issuesEdge"
        },
        "issuesCollection.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "issues"
        },
        "issuesCollection.edges.node.assignee": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "users"
        },
        "issuesCollection.edges.node.assignee.avatar_url": (v9/*: any*/),
        "issuesCollection.edges.node.assignee.id": (v10/*: any*/),
        "issuesCollection.edges.node.assignee.name": (v11/*: any*/),
        "issuesCollection.edges.node.assignee.nodeId": (v12/*: any*/),
        "issuesCollection.edges.node.assignee_id": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "UUID"
        },
        "issuesCollection.edges.node.created_at": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Datetime"
        },
        "issuesCollection.edges.node.issue_labelsCollection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "issue_labelsConnection"
        },
        "issuesCollection.edges.node.issue_labelsCollection.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "issue_labelsEdge"
        },
        "issuesCollection.edges.node.issue_labelsCollection.edges.cursor": (v11/*: any*/),
        "issuesCollection.edges.node.issue_labelsCollection.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "issue_labels"
        },
        "issuesCollection.edges.node.issue_labelsCollection.edges.node.__typename": (v11/*: any*/),
        "issuesCollection.edges.node.issue_labelsCollection.edges.node.labels": (v13/*: any*/),
        "issuesCollection.edges.node.issue_labelsCollection.edges.node.labels.color": (v11/*: any*/),
        "issuesCollection.edges.node.issue_labelsCollection.edges.node.labels.name": (v11/*: any*/),
        "issuesCollection.edges.node.issue_labelsCollection.edges.node.labels.nodeId": (v12/*: any*/),
        "issuesCollection.edges.node.issue_labelsCollection.edges.node.labels.number": (v14/*: any*/),
        "issuesCollection.edges.node.issue_labelsCollection.edges.node.nodeId": (v12/*: any*/),
        "issuesCollection.edges.node.issue_labelsCollection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "issuesCollection.edges.node.issue_labelsCollection.pageInfo.endCursor": (v9/*: any*/),
        "issuesCollection.edges.node.issue_labelsCollection.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "issuesCollection.edges.node.nodeId": (v12/*: any*/),
        "issuesCollection.edges.node.number": (v14/*: any*/),
        "issuesCollection.edges.node.priority": {
          "enumValues": [
            "low",
            "medium",
            "high",
            "urgent"
          ],
          "nullable": false,
          "plural": false,
          "type": "issue_priority"
        },
        "issuesCollection.edges.node.status": {
          "enumValues": [
            "backlog",
            "todo",
            "in_progress",
            "done",
            "cancelled"
          ],
          "nullable": false,
          "plural": false,
          "type": "issue_status"
        },
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
        "labelsCollection.edges.node": (v13/*: any*/),
        "labelsCollection.edges.node.color": (v11/*: any*/),
        "labelsCollection.edges.node.name": (v11/*: any*/),
        "labelsCollection.edges.node.nodeId": (v12/*: any*/),
        "labelsCollection.edges.node.number": (v14/*: any*/),
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
        "usersCollection.edges.node.avatar_url": (v9/*: any*/),
        "usersCollection.edges.node.id": (v10/*: any*/),
        "usersCollection.edges.node.name": (v11/*: any*/),
        "usersCollection.edges.node.nodeId": (v12/*: any*/)
      }
    },
    "name": "IssueSidebarTestQuery",
    "operationKind": "query",
    "text": "query IssueSidebarTestQuery {\n  issuesCollection(first: 1) {\n    edges {\n      node {\n        ...IssueSidebar_issue\n        nodeId\n      }\n    }\n  }\n  ...IssueSidebar_query\n}\n\nfragment IssueSidebar_issue on issues {\n  nodeId\n  number\n  status\n  priority\n  created_at\n  assignee_id\n  assignee: users {\n    nodeId\n    id\n    name\n    avatar_url\n  }\n  issue_labelsCollection(first: 100) {\n    edges {\n      node {\n        nodeId\n        labels {\n          nodeId\n          number\n          name\n          color\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment IssueSidebar_query on Query {\n  usersCollection(first: 100, orderBy: [{name: AscNullsLast}]) {\n    edges {\n      node {\n        nodeId\n        id\n        name\n        avatar_url\n      }\n    }\n  }\n  labelsCollection(first: 100, orderBy: [{name: AscNullsLast}]) {\n    edges {\n      node {\n        nodeId\n        number\n        name\n        color\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "31177850af1554f8ba2b46052a262c0b";

export default node;
