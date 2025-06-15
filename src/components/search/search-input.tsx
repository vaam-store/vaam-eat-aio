"use client";

import { type GeolocationState } from "@app/hooks/use-geolocation";
import { Form } from "@rjsf/daisyui";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

export type SearchLocationParams = Pick<
  GeolocationState,
  "latitude" | "longitude"
> &
  Record<"query", string>;

export interface SearchInputProps {
  initialValue?: string;
  placeholder?: string;
  checkLocationDelivery?: boolean;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  onMapPin?: (data: SearchLocationParams) => void;
}

const schema: RJSFSchema = {
  title: "Search",
  type: "object",
  properties: {
    query: {
      type: "string",
      title: "Query",
    },
  },
  required: ["query"],
};

const uiSchema: UiSchema = {
  "ui:classNames": "flex flex-row",
  "ui:field": "LayoutGridField",
  "ui:widget": "password",
  "ui:description": "The best password",
  "ui:submitButtonOptions": {
    props: {
      className: "btn btn-square",
    },
    norender: false,
    submitText: "Submit",
  },
  "ui:layoutGrid": {
    "ui:col": {
      spacing: 2,
      children: ["query"],
    },
  },
};

export function SearchInput({ onSearch }: SearchInputProps) {
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={async ({ formData }) => {
        onSearch!(formData.query);
      }}
    />
  );
}
