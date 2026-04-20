/**
 * @generated SignedSource<<d3af50e62a5257ca2b100b83df0eb8f7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LabelEditorDialogDeleteMutation$variables = {
  number: number;
};
export type LabelEditorDialogDeleteMutation$data = {
  readonly deleteFromlabelsCollection: {
    readonly records: ReadonlyArray<{
      readonly nodeId: string;
      readonly number: number;
    }>;
  };
};
export type LabelEditorDialogDeleteMutation = {
  response: LabelEditorDialogDeleteMutation$data;
  variables: LabelEditorDialogDeleteMutation$variables;
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
      }
    ],
    "concreteType": "labelsDeleteResponse",
    "kind": "LinkedField",
    "name": "deleteFromlabelsCollection",
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
    "name": "LabelEditorDialogDeleteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LabelEditorDialogDeleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "67f6b88326e8d57862969cbd2ee10b9a",
    "id": null,
    "metadata": {},
    "name": "LabelEditorDialogDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation LabelEditorDialogDeleteMutation(\n  $number: Int!\n) {\n  deleteFromlabelsCollection(filter: {number: {eq: $number}}, atMost: 1) {\n    records {\n      nodeId\n      number\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2aeeb9b774ddd1044486b34ebefb0f4d";

export default node;
