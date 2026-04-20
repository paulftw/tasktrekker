/**
 * @generated SignedSource<<6c4fe75fae8d80a521ec7dc0a06f305c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type labelsUpdateInput = {
  color?: string | null | undefined;
  name?: string | null | undefined;
};
export type LabelEditorDialogUpdateMutation$variables = {
  number: number;
  set: labelsUpdateInput;
};
export type LabelEditorDialogUpdateMutation$data = {
  readonly updatelabelsCollection: {
    readonly records: ReadonlyArray<{
      readonly color: string;
      readonly name: string;
      readonly nodeId: string;
      readonly number: number;
    }>;
  };
};
export type LabelEditorDialogUpdateMutation = {
  response: LabelEditorDialogUpdateMutation$data;
  variables: LabelEditorDialogUpdateMutation$variables;
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
    "name": "set"
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
        "kind": "Variable",
        "name": "set",
        "variableName": "set"
      }
    ],
    "concreteType": "labelsUpdateResponse",
    "kind": "LinkedField",
    "name": "updatelabelsCollection",
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
    "name": "LabelEditorDialogUpdateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LabelEditorDialogUpdateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8269259ab583f12a3cb46eac05484fd7",
    "id": null,
    "metadata": {},
    "name": "LabelEditorDialogUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation LabelEditorDialogUpdateMutation(\n  $number: Int!\n  $set: labelsUpdateInput!\n) {\n  updatelabelsCollection(filter: {number: {eq: $number}}, set: $set, atMost: 1) {\n    records {\n      nodeId\n      number\n      name\n      color\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "52269cc35745e9de9789c7682d3f375a";

export default node;
