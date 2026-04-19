/**
 * @generated SignedSource<<a532e8a1ed15853081f1e45bdad7399d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LabelsPickerAddMutation$variables = {
  issue_id: number;
  label_id: number;
};
export type LabelsPickerAddMutation$data = {
  readonly insertIntoissue_labelsCollection: {
    readonly records: ReadonlyArray<{
      readonly issue_id: number;
      readonly label_id: number;
      readonly labels: {
        readonly color: string;
        readonly name: string;
        readonly nodeId: string;
        readonly number: number;
      };
      readonly nodeId: string;
    }>;
  } | null | undefined;
};
export type LabelsPickerAddMutation = {
  response: LabelsPickerAddMutation$data;
  variables: LabelsPickerAddMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "issue_id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "label_id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nodeId",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "items": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "issue_id",
                "variableName": "issue_id"
              },
              {
                "kind": "Variable",
                "name": "label_id",
                "variableName": "label_id"
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
    "concreteType": "issue_labelsInsertResponse",
    "kind": "LinkedField",
    "name": "insertIntoissue_labelsCollection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "issue_labels",
        "kind": "LinkedField",
        "name": "records",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "issue_id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "label_id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "labels",
            "kind": "LinkedField",
            "name": "labels",
            "plural": false,
            "selections": [
              (v1/*: any*/),
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
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LabelsPickerAddMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LabelsPickerAddMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "4772d514ba5156c0f29535cb7e8d6130",
    "id": null,
    "metadata": {},
    "name": "LabelsPickerAddMutation",
    "operationKind": "mutation",
    "text": "mutation LabelsPickerAddMutation(\n  $issue_id: Int!\n  $label_id: Int!\n) {\n  insertIntoissue_labelsCollection(objects: [{issue_id: $issue_id, label_id: $label_id}]) {\n    records {\n      nodeId\n      issue_id\n      label_id\n      labels {\n        nodeId\n        number\n        name\n        color\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "188bd89d4e3df63af97936feebd05627";

export default node;
