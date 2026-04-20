/**
 * @generated SignedSource<<82b2094914ba481614ad1b0666b84acd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type issue_priority = "high" | "low" | "medium" | "urgent" | "%future added value";
export type issue_status = "backlog" | "cancelled" | "done" | "in_progress" | "todo" | "%future added value";
export type issuesInsertInput = {
  assignee_id?: string | null | undefined;
  created_at?: string | null | undefined;
  description?: string | null | undefined;
  priority?: issue_priority | null | undefined;
  status?: issue_status | null | undefined;
  title?: string | null | undefined;
};
export type CreateIssueModalCreateMutation$variables = {
  objects: ReadonlyArray<issuesInsertInput>;
};
export type CreateIssueModalCreateMutation$data = {
  readonly insertIntoissuesCollection: {
    readonly records: ReadonlyArray<{
      readonly nodeId: string;
      readonly number: number;
    }>;
  } | null | undefined;
};
export type CreateIssueModalCreateMutation = {
  response: CreateIssueModalCreateMutation$data;
  variables: CreateIssueModalCreateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "objects"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "objects",
        "variableName": "objects"
      }
    ],
    "concreteType": "issuesInsertResponse",
    "kind": "LinkedField",
    "name": "insertIntoissuesCollection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "issues",
        "kind": "LinkedField",
        "name": "records",
        "plural": true,
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
    "name": "CreateIssueModalCreateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateIssueModalCreateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d46819898775932f3a2a803ed2be349c",
    "id": null,
    "metadata": {},
    "name": "CreateIssueModalCreateMutation",
    "operationKind": "mutation",
    "text": "mutation CreateIssueModalCreateMutation(\n  $objects: [issuesInsertInput!]!\n) {\n  insertIntoissuesCollection(objects: $objects) {\n    records {\n      nodeId\n      number\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ae90da6883f8e0d4a6e35728c07aab62";

export default node;
