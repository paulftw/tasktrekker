/**
 * @generated SignedSource<<f09fc799ebee6609d90f62b178a4d565>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type IssueCommentsAddMutation$variables = {
  author_id: string;
  body: string;
  connections: ReadonlyArray<string>;
  issue_id: number;
};
export type IssueCommentsAddMutation$data = {
  readonly insertIntocommentsCollection: {
    readonly records: ReadonlyArray<{
      readonly author: {
        readonly avatar_url: string | null | undefined;
        readonly name: string;
      };
      readonly body: string;
      readonly created_at: string;
      readonly nodeId: string;
      readonly number: number;
    }>;
  } | null | undefined;
};
export type IssueCommentsAddMutation = {
  response: IssueCommentsAddMutation$data;
  variables: IssueCommentsAddMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "author_id"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "body"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "issue_id"
},
v4 = [
  {
    "items": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "author_id",
            "variableName": "author_id"
          },
          {
            "kind": "Variable",
            "name": "body",
            "variableName": "body"
          },
          {
            "kind": "Variable",
            "name": "issue_id",
            "variableName": "issue_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "objects.0"
      }
    ],
    "kind": "ListValue",
    "name": "objects"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nodeId",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "number",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "body",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created_at",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatar_url",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "IssueCommentsAddMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "commentsInsertResponse",
        "kind": "LinkedField",
        "name": "insertIntocommentsCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "comments",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": "author",
                "args": null,
                "concreteType": "users",
                "kind": "LinkedField",
                "name": "users",
                "plural": false,
                "selections": [
                  (v9/*: any*/),
                  (v10/*: any*/)
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
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "IssueCommentsAddMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "commentsInsertResponse",
        "kind": "LinkedField",
        "name": "insertIntocommentsCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "comments",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": "author",
                "args": null,
                "concreteType": "users",
                "kind": "LinkedField",
                "name": "users",
                "plural": false,
                "selections": [
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v5/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendNode",
            "key": "",
            "kind": "LinkedHandle",
            "name": "records",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              },
              {
                "kind": "Literal",
                "name": "edgeTypeName",
                "value": "commentsEdge"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ab5524a8451a1c90d918b5a68e95e897",
    "id": null,
    "metadata": {},
    "name": "IssueCommentsAddMutation",
    "operationKind": "mutation",
    "text": "mutation IssueCommentsAddMutation(\n  $issue_id: Int!\n  $body: String!\n  $author_id: UUID!\n) {\n  insertIntocommentsCollection(objects: [{issue_id: $issue_id, body: $body, author_id: $author_id}]) {\n    records {\n      nodeId\n      number\n      body\n      created_at\n      author: users {\n        name\n        avatar_url\n        nodeId\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9e92c08960712e54faa8fb3fe96a8c33";

export default node;
