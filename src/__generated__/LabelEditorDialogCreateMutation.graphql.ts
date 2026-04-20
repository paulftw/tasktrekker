/**
 * @generated SignedSource<<c36e2cdb719d9993fd15494be05d5da5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type labelsInsertInput = {
  color?: string | null | undefined;
  name?: string | null | undefined;
};
export type LabelEditorDialogCreateMutation$variables = {
  objects: ReadonlyArray<labelsInsertInput>;
};
export type LabelEditorDialogCreateMutation$data = {
  readonly insertIntolabelsCollection: {
    readonly records: ReadonlyArray<{
      readonly color: string;
      readonly name: string;
      readonly nodeId: string;
      readonly number: number;
    }>;
  } | null | undefined;
};
export type LabelEditorDialogCreateMutation = {
  response: LabelEditorDialogCreateMutation$data;
  variables: LabelEditorDialogCreateMutation$variables;
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
    "concreteType": "labelsInsertResponse",
    "kind": "LinkedField",
    "name": "insertIntolabelsCollection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "labels",
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
            "name": "color",
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
    "name": "LabelEditorDialogCreateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LabelEditorDialogCreateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "53e2540f3c6d0d2565d5e3811b8883be",
    "id": null,
    "metadata": {},
    "name": "LabelEditorDialogCreateMutation",
    "operationKind": "mutation",
    "text": "mutation LabelEditorDialogCreateMutation(\n  $objects: [labelsInsertInput!]!\n) {\n  insertIntolabelsCollection(objects: $objects) {\n    records {\n      nodeId\n      number\n      name\n      color\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6f8cc8ef345e86679083943aa7d6d75c";

export default node;
