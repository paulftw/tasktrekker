/**
 * @generated SignedSource<<a08e82cba494f4cb0e00b29ccb75636d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TitleEditorUpdateMutation$variables = {
  number: number;
  title: string;
};
export type TitleEditorUpdateMutation$data = {
  readonly updateissuesCollection: {
    readonly records: ReadonlyArray<{
      readonly nodeId: string;
      readonly title: string;
    }>;
  };
};
export type TitleEditorUpdateMutation = {
  response: TitleEditorUpdateMutation$data;
  variables: TitleEditorUpdateMutation$variables;
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
    "name": "title"
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
            "name": "title",
            "variableName": "title"
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
            "name": "title",
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
    "name": "TitleEditorUpdateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TitleEditorUpdateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d36c9d1761a71f5d1c52ed400aff7f33",
    "id": null,
    "metadata": {},
    "name": "TitleEditorUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation TitleEditorUpdateMutation(\n  $number: Int!\n  $title: String!\n) {\n  updateissuesCollection(set: {title: $title}, filter: {number: {eq: $number}}, atMost: 1) {\n    records {\n      nodeId\n      title\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e496f8234859ae263f99d60fd6e11f84";

export default node;
