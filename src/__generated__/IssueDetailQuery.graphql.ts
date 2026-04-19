/**
 * @generated SignedSource<<850b82e97ac92eafe9b2fb0f4dbe68ba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IssueDetailQuery$variables = {
  number: number;
};
export type IssueDetailQuery$data = {
  readonly issuesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly nodeId: string;
        readonly " $fragmentSpreads": FragmentRefs<"IssueComments_issue" | "IssueDescription_issue" | "IssueHeader_issue" | "IssueSidebar_issue">;
      };
    }>;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"IssueSidebar_query">;
};
export type IssueDetailQuery = {
  response: IssueDetailQuery$data;
  variables: IssueDetailQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "number"
  }
],
v1 = [
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "eq",
            "variableName": "number"
          }
        ],
        "kind": "ObjectValue",
        "name": "number"
      }
    ],
    "kind": "ObjectValue",
    "name": "filter"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nodeId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "number",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created_at",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
    "storageKey": null
  },
  (v5/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "avatar_url",
    "storageKey": null
  }
],
v7 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v8 = [
  (v7/*: any*/)
],
v9 = [
  (v2/*: any*/),
  (v3/*: any*/),
  (v5/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "color",
    "storageKey": null
  }
],
v10 = [
  (v7/*: any*/),
  {
    "kind": "Literal",
    "name": "orderBy",
    "value": [
      {
        "name": "AscNullsLast"
      }
    ]
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "IssueDetailQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  (v2/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "IssueHeader_issue"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "IssueDescription_issue"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "IssueSidebar_issue"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "IssueComments_issue"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "IssueDetailQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/),
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
                    "name": "description",
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
                  (v4/*: any*/),
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
                    "selections": (v6/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v8/*: any*/),
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
                              (v2/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "labels",
                                "kind": "LinkedField",
                                "name": "labels",
                                "plural": false,
                                "selections": (v9/*: any*/),
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
                    "args": (v8/*: any*/),
                    "filters": null,
                    "handle": "connection",
                    "key": "IssueSidebar_issue__issue_labelsCollection",
                    "kind": "LinkedHandle",
                    "name": "issue_labelsCollection"
                  },
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
                              (v2/*: any*/),
                              (v3/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "body",
                                "storageKey": null
                              },
                              (v4/*: any*/),
                              {
                                "alias": "author",
                                "args": null,
                                "concreteType": "users",
                                "kind": "LinkedField",
                                "name": "users",
                                "plural": false,
                                "selections": [
                                  (v5/*: any*/),
                                  (v2/*: any*/)
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
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v10/*: any*/),
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
                "selections": (v6/*: any*/),
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
        "args": (v10/*: any*/),
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
                "selections": (v9/*: any*/),
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
    "cacheID": "d5a86b00116ac266a2124be0d1b67adb",
    "id": null,
    "metadata": {},
    "name": "IssueDetailQuery",
    "operationKind": "query",
    "text": "query IssueDetailQuery(\n  $number: Int!\n) {\n  issuesCollection(filter: {number: {eq: $number}}, first: 1) {\n    edges {\n      node {\n        nodeId\n        ...IssueHeader_issue\n        ...IssueDescription_issue\n        ...IssueSidebar_issue\n        ...IssueComments_issue\n      }\n    }\n  }\n  ...IssueSidebar_query\n}\n\nfragment IssueComments_issue on issues {\n  commentsCollection(first: 50, orderBy: [{number: AscNullsLast}]) {\n    edges {\n      node {\n        nodeId\n        number\n        body\n        created_at\n        author: users {\n          name\n          nodeId\n        }\n      }\n    }\n  }\n}\n\nfragment IssueDescription_issue on issues {\n  nodeId\n  number\n  description\n}\n\nfragment IssueHeader_issue on issues {\n  nodeId\n  number\n  title\n}\n\nfragment IssueSidebar_issue on issues {\n  nodeId\n  number\n  status\n  priority\n  created_at\n  assignee_id\n  assignee: users {\n    nodeId\n    id\n    name\n    avatar_url\n  }\n  issue_labelsCollection(first: 100) {\n    edges {\n      node {\n        nodeId\n        labels {\n          nodeId\n          number\n          name\n          color\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment IssueSidebar_query on Query {\n  usersCollection(first: 100, orderBy: [{name: AscNullsLast}]) {\n    edges {\n      node {\n        nodeId\n        id\n        name\n        avatar_url\n      }\n    }\n  }\n  labelsCollection(first: 100, orderBy: [{name: AscNullsLast}]) {\n    edges {\n      node {\n        nodeId\n        number\n        name\n        color\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c4fd63d12843325090229adbf2c455a0";

export default node;
