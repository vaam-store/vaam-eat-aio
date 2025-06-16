import React from "react";
import { Field } from "formik";
import { Button } from "@app/components/button";
import { X } from "react-feather";
import { ErrorDisplay } from "@app/components/vendor/error-display";

interface PhoneNumberInputProps {
  baseFieldPath: string;
  phoneIndex: number;
  removePhone: (index: number) => void;
}

export function PhoneNumberInput({
  baseFieldPath,
  phoneIndex,
  removePhone,
}: PhoneNumberInputProps) {
  return (
    <div className="flex items-center gap-2">
      <Field
        name={`${baseFieldPath}.${phoneIndex}`}
        type="text"
        className="input input-bordered w-full"
      />
      <Button
        type="button"
        shape="circle"
        variant="soft"
        color="error"
        size="sm"
        onClick={() => removePhone(phoneIndex)}
        aria-label="Remove phone number"
      >
        <X />
      </Button>
      <ErrorDisplay name={`${baseFieldPath}.${phoneIndex}`} />
    </div>
  );
}
