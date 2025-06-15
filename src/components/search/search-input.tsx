"use client";

import {
  type GeolocationState,
  useGeolocation,
} from "@app/hooks/use-geolocation";
import { Form } from "@rjsf/daisyui";
import type { FieldProps, RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { Search, MapPin } from "react-feather";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../button";

export type SearchLocationParams = Pick<
  GeolocationState,
  "latitude" | "longitude"
> &
  Record<"query", string>;

export interface SearchInputProps {
  checkLocationDelivery?: boolean;
  onSearch?: (data: SearchLocationParams) => void;
  onClear?: () => void;
}

const schema: RJSFSchema = {
  title: "Search",
  type: "object",
  properties: {
    query: {
      type: "string",
    },
    latitude: {
      type: "number",
    },
    longitude: {
      type: "number",
    },
  },
};

const uiSchema: UiSchema = {
  // hide the default submit button (we’ll add our own in the field)
  "ui:submitButtonOptions": { norender: true },
  "ui:field": "SearchBar",
};

/* ---------- Custom Field ---------- */
function SearchBarField({
  formData = {
    query: "",
  },
  onChange,
}: FieldProps<Partial<SearchLocationParams>>) {
  const { latitude, longitude, getLocation, isLoading } = useGeolocation();
  const [query, setQuery] = useState(() => formData.query ?? "");
  const ref = useRef<HTMLButtonElement>(null);

  const update = useCallback(() => {
    const formData: SearchLocationParams = {
      query,
      latitude,
      longitude,
    };
    onChange(formData);
  }, [latitude, longitude, onChange, query]);

  useEffect(() => {
    if (latitude !== null && longitude !== null && !isLoading) {
      update();
      setTimeout(() => {
        ref.current?.click?.();
      }, 5);
    }
  }, [isLoading, latitude, longitude, update]);

  useEffect(() => {
    update();
  }, [update]);

  return (
    <div className="input input-primary input-bordered input-xl w-full">
      <Button
        type="button"
        shape="circle"
        variant="soft"
        aria-label="Use current location"
        onClick={getLocation}
      >
        <MapPin className="h-6 w-6 stroke-current" />
      </Button>

      <input
        type="text"
        placeholder="Search for food…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="grow"
      />

      <Button type="submit" shape="circle" variant="soft" ref={ref as any}>
        <Search className="h-6 w-6 stroke-current" />
      </Button>
    </div>
  );
}

export function SearchInput({ onSearch }: SearchInputProps) {
  return (
    <Form
      validator={validator}
      schema={schema}
      uiSchema={uiSchema}
      fields={{ SearchBar: SearchBarField }}
      onSubmit={({ formData }) => onSearch?.(formData)}
      className="w-full"
      noValidate
    />
  );
}
