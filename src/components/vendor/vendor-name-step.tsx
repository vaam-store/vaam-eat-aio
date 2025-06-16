import React from "react";
import { ErrorMessage, Field } from "formik";
import { Text } from "@app/components/text";

export function VendorNameStep() {
  return (
    <div className="space-y-4">
      <Text bold className="text-xl">
        Vendor Information
      </Text>
      <p className="text-base-content opacity-70">
        Start by providing the basic details for your new vendor.
      </p>
      <div>
        <label htmlFor="name" className="label">
          <span className="label-text">Vendor Name</span>
        </label>
        <Field
          id="name"
          name="name"
          type="text"
          className="input input-bordered w-full"
          autoFocus
        />
        <ErrorMessage
          name="name"
          component="div"
          className="text-error mt-1 text-xs"
        />
      </div>
    </div>
  );
}
