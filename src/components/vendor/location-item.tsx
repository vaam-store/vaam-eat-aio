import React from "react";
import { Field } from "formik";
import { Button } from "@app/components/button";
import { XCircle } from "react-feather";
import { Text } from "@app/components/text";
import { AddressFields } from "@app/components/vendor/address-fields";
import { ErrorDisplay } from "@app/components/vendor/error-display";

interface LocationItemProps {
  index: number;
  remove: (index: number) => void;
}

export function LocationItem({ index, remove }: LocationItemProps) {
  const namePath = `locations.createMany.data.${index}.name`;

  return (
    <div className="card card-border">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <Text bold>Location #{index + 1}</Text>
          <Button
            type="button"
            shape="circle"
            variant="soft"
            color="error"
            size="sm"
            onClick={() => remove(index)}
            aria-label="Remove location"
          >
            <XCircle size={18} />
          </Button>
        </div>
        <div>
          <label htmlFor={namePath} className="label">
            <span className="label-text">Location Name</span>
          </label>
          <Field
            id={namePath}
            name={namePath}
            type="text"
            className="input input-bordered w-full"
          />
          <ErrorDisplay name={namePath} />
        </div>
        <AddressFields locationIndex={index} />
      </div>
    </div>
  );
}
