/**
 * @generated SignedSource<<7d6e6833d4ebbc99f1d1c07e2e2d6c14>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type issue_priority = "high" | "low" | "medium" | "none" | "urgent" | "%future added value";
export type PriorityPickerUpdateMutation$variables = {
  number: number;
  priority: issue_priority;
};
export type PriorityPickerUpdateMutation$data = {
  readonly updateissuesCollection: {
    readonly records: ReadonlyArray<{
      readonly nodeId: string;
      readonly priority: issue_priority;
    }>;
  };
};
export type PriorityPickerUpdateMutation = {
  response: PriorityPickerUpdateMutation$data;
  variables: PriorityPickerUpdateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "number"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "priority"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
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
            "name": "priority",
            "variableName": "priority"
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
            "name": "priority",
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
    "name": "PriorityPickerUpdateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PriorityPickerUpdateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0287a9db515db91fda98405d81205052",
    "id": null,
    "metadata": {},
    "name": "PriorityPickerUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation PriorityPickerUpdateMutation(\n  $number: Int!\n  $priority: issue_priority!\n) {\n  updateissuesCollection(set: {priority: $priority}, filter: {number: {eq: $number}}) {\n    records {\n      nodeId\n      priority\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "193c066f7e2da6001182bd3d7bd0574b";

export default node;
