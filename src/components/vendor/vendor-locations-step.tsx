import React from "react";
import { FieldArray, getIn, useFormikContext } from "formik";
import { Button } from "@app/components/button";
import { Plus } from "react-feather";
import { Text } from "@app/components/text";
import { LocationItem } from "@app/components/vendor/location-item";
import { ErrorDisplay } from "@app/components/vendor/error-display";
import { type VendorFormValues } from "@app/components/vendor/vendor-creation-form";

interface VendorLocationsStepProps {
  userId: string;
}

export function VendorLocationsStep({ userId }: VendorLocationsStepProps) {
  const { values, errors, touched } = useFormikContext<VendorFormValues>();
  return (
    <div className="space-y-4">
      <Text bold className="text-xl">
        Vendor Locations
      </Text>
      <p className="text-base-content opacity-70">
        Define the physical locations associated with your vendor. For each location, you'll need to:
      </p>
      <ol className="list-decimal list-inside mt-2 mb-4 text-base-content opacity-70">
        <li>Select a country and region</li>
        <li>Use the map picker to select precise coordinates (default), or</li>
        <li>Manually enter address details if preferred</li>
      </ol>
      <FieldArray name="locations.createMany.data">
        {({ remove, push }) => (
          <div className="space-y-4">
            {values.locations.createMany.data.map((_locationItem, index) => (
              <LocationItem key={index} index={index} remove={remove} />
            ))}
            <Button
              type="button"
              variant="outline"
              color="primary"
              className="mt-2"
              onClick={() =>
                push({
                  name: "Main",
                  address: {
                    street: "",
                    city: "",
                    state: "",
                    zip: "",
                    country: "",
                    latitude: 0,
                    longitude: 0,
                  },
                  createdById: userId,
                })
              }
              aria-label="Add location"
            >
              <Plus /> Add Location
            </Button>
            {(() => {
              const locationDataError = getIn(
                errors,
                "locations.createMany.data",
              );
              const locationDataTouched = getIn(
                touched,
                "locations.createMany.data",
              );
              if (
                locationDataTouched &&
                typeof locationDataError === "string"
              ) {
                return <ErrorDisplay name="locations.createMany.data" />;
              }
              return null;
            })()}
          </div>
        )}
      </FieldArray>
    </div>
  );
}
