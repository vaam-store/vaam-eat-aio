"use client";

import { type GeolocationState } from "@app/hooks/use-geolocation";
import { Form } from "@rjsf/daisyui";
import type { RJSFSchema } from "@rjsf/utils";
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

export function SearchInput({ onSearch }: SearchInputProps) {
  return (
    <Form
      schema={schema}
      validator={validator}
      onSubmit={async ({ formData }) => {
        onSearch!(formData.query);
      }}
    />
  );
}
