/**
 * @generated SignedSource<<3bd54bd3934671912ff31202265e37d7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DescriptionEditorUpdateMutation$variables = {
  description: string;
  number: number;
};
export type DescriptionEditorUpdateMutation$data = {
  readonly updateissuesCollection: {
    readonly records: ReadonlyArray<{
      readonly description: string;
      readonly nodeId: string;
    }>;
  };
};
export type DescriptionEditorUpdateMutation = {
  response: DescriptionEditorUpdateMutation$data;
  variables: DescriptionEditorUpdateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "description"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "number"
},
v2 = [
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
            "name": "description",
            "variableName": "description"
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
            "name": "description",
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
    "name": "DescriptionEditorUpdateMutation",
    "selections": (v2/*: any*/),
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
    "name": "DescriptionEditorUpdateMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "214d9ab33520e587a0852fec1caf2dcf",
    "id": null,
    "metadata": {},
    "name": "DescriptionEditorUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation DescriptionEditorUpdateMutation(\n  $number: Int!\n  $description: String!\n) {\n  updateissuesCollection(set: {description: $description}, filter: {number: {eq: $number}}, atMost: 1) {\n    records {\n      nodeId\n      description\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "17f3c592d51fc921da066517e4c8ee66";

export default node;
