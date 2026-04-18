/**
 * @generated SignedSource<<82892685fcdce2d13733da280d1c5a10>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type issue_status = "backlog" | "cancelled" | "done" | "in_progress" | "todo" | "%future added value";
export type StatusPickerUpdateMutation$variables = {
  number: number;
  status: issue_status;
};
export type StatusPickerUpdateMutation$data = {
  readonly updateissuesCollection: {
    readonly records: ReadonlyArray<{
      readonly nodeId: string;
      readonly status: issue_status;
    }>;
  };
};
export type StatusPickerUpdateMutation = {
  response: StatusPickerUpdateMutation$data;
  variables: StatusPickerUpdateMutation$variables;
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
    "name": "status"
  }
],
v1 = [
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
            "name": "status",
            "variableName": "status"
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
            "name": "status",
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
    "name": "StatusPickerUpdateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "StatusPickerUpdateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4c406bf5ed5bed50282ecf64b656a0b5",
    "id": null,
    "metadata": {},
    "name": "StatusPickerUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation StatusPickerUpdateMutation(\n  $number: Int!\n  $status: issue_status!\n) {\n  updateissuesCollection(set: {status: $status}, filter: {number: {eq: $number}}, atMost: 1) {\n    records {\n      nodeId\n      status\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c343c86cc1e7073c0f6f054aef545791";

export default node;
