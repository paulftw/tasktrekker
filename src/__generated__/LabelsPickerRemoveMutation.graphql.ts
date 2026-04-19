/**
 * @generated SignedSource<<2767c0cc6f489e1f8bb8ed0c166ddd2b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LabelsPickerRemoveMutation$variables = {
  issue_id: number;
  label_id: number;
};
export type LabelsPickerRemoveMutation$data = {
  readonly deleteFromissue_labelsCollection: {
    readonly records: ReadonlyArray<{
      readonly nodeId: string;
    }>;
  };
};
export type LabelsPickerRemoveMutation = {
  response: LabelsPickerRemoveMutation$data;
  variables: LabelsPickerRemoveMutation$variables;
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
                "variableName": "issue_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "issue_id"
          },
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "eq",
                "variableName": "label_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "label_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "filter"
      }
    ],
    "concreteType": "issue_labelsDeleteResponse",
    "kind": "LinkedField",
    "name": "deleteFromissue_labelsCollection",
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "nodeId",
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
    "name": "LabelsPickerRemoveMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LabelsPickerRemoveMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4d975a197abf694bb9218f9103d1efe5",
    "id": null,
    "metadata": {},
    "name": "LabelsPickerRemoveMutation",
    "operationKind": "mutation",
    "text": "mutation LabelsPickerRemoveMutation(\n  $issue_id: Int!\n  $label_id: Int!\n) {\n  deleteFromissue_labelsCollection(filter: {issue_id: {eq: $issue_id}, label_id: {eq: $label_id}}, atMost: 1) {\n    records {\n      nodeId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "be895de1fbb8b909c2f1ad7eab53403d";

export default node;
