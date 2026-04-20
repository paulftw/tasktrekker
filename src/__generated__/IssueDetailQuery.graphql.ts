/**
 * @generated SignedSource<<6d3602cf32df6fc701904a1252d63942>>
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
  readonly " $fragmentSpreads": FragmentRefs<"IssueComments_query" | "IssueSidebar_query">;
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
v1 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v2 = [
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
  (v1/*: any*/)
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
  "name": "created_at",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatar_url",
  "storageKey": null
},
v9 = [
  (v3/*: any*/),
  (v6/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/)
],
v10 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v11 = [
  (v10/*: any*/)
],
v12 = [
  (v3/*: any*/),
  (v4/*: any*/),
  (v7/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "color",
    "storageKey": null
  }
],
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endCursor",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasNextPage",
  "storageKey": null
},
v17 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 30
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
v18 = {
  "kind": "Literal",
  "name": "orderBy",
  "value": [
    {
      "name": "AscNullsLast"
    }
  ]
},
v19 = [
  (v10/*: any*/),
  (v18/*: any*/)
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
      },
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "IssueComments_query"
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
                  (v5/*: any*/),
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
                    "selections": (v9/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v11/*: any*/),
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
                                "selections": (v12/*: any*/),
                                "storageKey": null
                              },
                              (v13/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v14/*: any*/)
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
                          (v15/*: any*/),
                          (v16/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "issue_labelsCollection(first:100)"
                  },
                  {
                    "alias": null,
                    "args": (v11/*: any*/),
                    "filters": null,
                    "handle": "connection",
                    "key": "IssueSidebar_issue__issue_labelsCollection",
                    "kind": "LinkedHandle",
                    "name": "issue_labelsCollection"
                  },
                  {
                    "alias": null,
                    "args": (v17/*: any*/),
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
                              (v3/*: any*/),
                              (v4/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "body",
                                "storageKey": null
                              },
                              (v5/*: any*/),
                              {
                                "alias": "author",
                                "args": null,
                                "concreteType": "users",
                                "kind": "LinkedField",
                                "name": "users",
                                "plural": false,
                                "selections": [
                                  (v7/*: any*/),
                                  (v8/*: any*/),
                                  (v3/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v13/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v14/*: any*/)
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
                          (v16/*: any*/),
                          (v15/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "commentsCollection(first:30,orderBy:[{\"number\":\"AscNullsLast\"}])"
                  },
                  {
                    "alias": null,
                    "args": (v17/*: any*/),
                    "filters": [],
                    "handle": "connection",
                    "key": "IssueComments_issue__commentsCollection",
                    "kind": "LinkedHandle",
                    "name": "commentsCollection"
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
        "args": (v19/*: any*/),
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
                "selections": (v9/*: any*/),
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
        "args": (v19/*: any*/),
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
                "selections": (v12/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "labelsCollection(first:100,orderBy:[{\"name\":\"AscNullsLast\"}])"
      },
      {
        "alias": "firstUser",
        "args": [
          (v1/*: any*/),
          (v18/*: any*/)
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
                  (v6/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "usersCollection(first:1,orderBy:[{\"name\":\"AscNullsLast\"}])"
      }
    ]
  },
  "params": {
    "cacheID": "84001e541f1ba64832c2874f66f594e9",
    "id": null,
    "metadata": {},
    "name": "IssueDetailQuery",
    "operationKind": "query",
    "text": "query IssueDetailQuery(\n  $number: Int!\n) {\n  issuesCollection(filter: {number: {eq: $number}}, first: 1) {\n    edges {\n      node {\n        nodeId\n        ...IssueHeader_issue\n        ...IssueDescription_issue\n        ...IssueSidebar_issue\n        ...IssueComments_issue\n      }\n    }\n  }\n  ...IssueSidebar_query\n  ...IssueComments_query\n}\n\nfragment IssueComments_issue on issues {\n  nodeId\n  number\n  commentsCollection(first: 30, orderBy: [{number: AscNullsLast}]) {\n    edges {\n      node {\n        nodeId\n        number\n        body\n        created_at\n        author: users {\n          name\n          avatar_url\n          nodeId\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nfragment IssueComments_query on Query {\n  firstUser: usersCollection(first: 1, orderBy: [{name: AscNullsLast}]) {\n    edges {\n      node {\n        id\n        nodeId\n      }\n    }\n  }\n}\n\nfragment IssueDescription_issue on issues {\n  nodeId\n  number\n  description\n}\n\nfragment IssueHeader_issue on issues {\n  nodeId\n  number\n  title\n}\n\nfragment IssueSidebar_issue on issues {\n  nodeId\n  number\n  status\n  priority\n  created_at\n  assignee_id\n  assignee: users {\n    nodeId\n    id\n    name\n    avatar_url\n  }\n  issue_labelsCollection(first: 100) {\n    edges {\n      node {\n        nodeId\n        labels {\n          nodeId\n          number\n          name\n          color\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment IssueSidebar_query on Query {\n  usersCollection(first: 100, orderBy: [{name: AscNullsLast}]) {\n    edges {\n      node {\n        nodeId\n        id\n        name\n        avatar_url\n      }\n    }\n  }\n  labelsCollection(first: 100, orderBy: [{name: AscNullsLast}]) {\n    edges {\n      node {\n        nodeId\n        number\n        name\n        color\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "131b82cd6557af365986da05c5f2eef9";

export default node;
