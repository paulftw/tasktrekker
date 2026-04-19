/**
 * @generated SignedSource<<bbf9491f1682bde4d51525475032960f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AssigneePickerUpdateMutation$variables = {
  assignee_id?: string | null | undefined;
  number: number;
};
export type AssigneePickerUpdateMutation$data = {
  readonly updateissuesCollection: {
    readonly records: ReadonlyArray<{
      readonly assignee_id: string | null | undefined;
      readonly nodeId: string;
      readonly users: {
        readonly avatar_url: string | null | undefined;
        readonly id: string;
        readonly name: string;
        readonly nodeId: string;
      } | null | undefined;
    }>;
  };
};
export type AssigneePickerUpdateMutation = {
  response: AssigneePickerUpdateMutation$data;
  variables: AssigneePickerUpdateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "assignee_id"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "number"
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
      {
        "kind": "Literal",
        "name": "atMost",
        "value": 1
      },
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
        "fields": [
          {
            "kind": "Variable",
            "name": "assignee_id",
            "variableName": "assignee_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "set"
      }
    ],
    "concreteType": "issuesUpdateResponse",
    "kind": "LinkedField",
    "name": "updateissuesCollection",
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
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "assignee_id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "users",
            "kind": "LinkedField",
            "name": "users",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AssigneePickerUpdateMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "AssigneePickerUpdateMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "568eb9303a4f9629b5581e7bfd4a2f75",
    "id": null,
    "metadata": {},
    "name": "AssigneePickerUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation AssigneePickerUpdateMutation(\n  $number: Int!\n  $assignee_id: UUID\n) {\n  updateissuesCollection(set: {assignee_id: $assignee_id}, filter: {number: {eq: $number}}, atMost: 1) {\n    records {\n      nodeId\n      assignee_id\n      users {\n        nodeId\n        id\n        name\n        avatar_url\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e105217ff6300c34fa7815fcd68b1cdf";

export default node;
