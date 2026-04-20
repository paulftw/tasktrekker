/**
 * @generated SignedSource<<7003d4c599f059ab0ec350729d86b521>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type issue_labelsInsertInput = {
  issue_id?: number | null | undefined;
  label_id?: number | null | undefined;
};
export type CreateIssueModalAddLabelsMutation$variables = {
  objects: ReadonlyArray<issue_labelsInsertInput>;
};
export type CreateIssueModalAddLabelsMutation$data = {
  readonly insertIntoissue_labelsCollection: {
    readonly affectedCount: number;
  } | null | undefined;
};
export type CreateIssueModalAddLabelsMutation = {
  response: CreateIssueModalAddLabelsMutation$data;
  variables: CreateIssueModalAddLabelsMutation$variables;
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
    "concreteType": "issue_labelsInsertResponse",
    "kind": "LinkedField",
    "name": "insertIntoissue_labelsCollection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "affectedCount",
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
    "name": "CreateIssueModalAddLabelsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateIssueModalAddLabelsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "bfbb5a1efdce3d7f969f90c2942a8841",
    "id": null,
    "metadata": {},
    "name": "CreateIssueModalAddLabelsMutation",
    "operationKind": "mutation",
    "text": "mutation CreateIssueModalAddLabelsMutation(\n  $objects: [issue_labelsInsertInput!]!\n) {\n  insertIntoissue_labelsCollection(objects: $objects) {\n    affectedCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "c11f1d438213f0b75153a50de52c3077";

export default node;
