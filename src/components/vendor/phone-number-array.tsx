import React from "react";
import { FieldArray, getIn, useFormikContext } from "formik";
import { Button } from "@app/components/button";
import { Plus } from "react-feather";
import { PhoneNumberInput } from "@app/components/vendor/phone-number-input";
import { ErrorDisplay } from "@app/components/vendor/error-display";
import { type VendorFormValues } from "@app/components/vendor/vendor-creation-form"; // Import VendorFormValues

interface PhoneNumberArrayProps {
  contactIndex: number;
}

export function PhoneNumberArray({ contactIndex }: PhoneNumberArrayProps) {
  const { values } = useFormikContext<VendorFormValues>();
  const phonePath = `contacts.createMany.data.${contactIndex}.contactInfo.phone`;
  const contactItem = getIn(values, `contacts.createMany.data.${contactIndex}`);
  const phones = getIn(contactItem, "contactInfo.phone") ?? [];

  return (
    <div>
      <label className="label">
        <span className="label-text">Phone Numbers</span>
      </label>
      <FieldArray name={phonePath}>
        {({ remove: removePhone, push: pushPhone }) => (
          <div className="space-y-2">
            {phones.map((_phoneNumber: string, phoneIndex: number) => (
              <PhoneNumberInput
                key={phoneIndex}
                baseFieldPath={phonePath}
                phoneIndex={phoneIndex}
                removePhone={removePhone}
              />
            ))}
            <ErrorDisplay name={phonePath} />
            <Button
              type="button"
              shape="circle"
              variant="soft"
              color="primary"
              size="sm"
              className="mt-1"
              onClick={() => pushPhone("")}
              aria-label="Add phone number"
            >
              <Plus />
            </Button>
          </div>
        )}
      </FieldArray>
    </div>
  );
}
