import React, { useState } from "react";
import { Field, useFormikContext } from "formik";
import { Button } from "@app/components/button";
import { X } from "react-feather";
import { Text } from "@app/components/text";
import { ErrorDisplay } from "@app/components/vendor/error-display";
import { CountryRegionSelector } from "@app/components/vendor/country-region-selector";
import { LocationSelection } from "@app/components/vendor/location-selection";
import { type VendorFormValues } from "@app/components/vendor/vendor-creation-form";

interface LocationItemProps {
  index: number;
  remove: (index: number) => void;
}

export function LocationItem({ index, remove }: LocationItemProps) {
  const { values } = useFormikContext<VendorFormValues>();
  const namePath = `locations.createMany.data.${index}.name`;
  const basePath = `locations.createMany.data.${index}.address`;
  
  // State to track if country and region have been selected
  const [countryRegionSelected, setCountryRegionSelected] = useState(false);
  
  // Get current country and region values
  const country = values.locations.createMany.data[index]?.address.country || "";
  const region = values.locations.createMany.data[index]?.address.state || "";
  
  // Handler for when country and region selection is complete
  const handleCountryRegionComplete = (country: string, region: string) => {
    if (country && region) {
      setCountryRegionSelected(true);
    }
  };

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
            <X />
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
        
        {/* Step 1: Country and Region Selection */}
        <div className="mt-4">
          <Text bold className="mb-2">Step 1: Select Country and Region</Text>
          <CountryRegionSelector
            locationIndex={index}
            onSelectionComplete={handleCountryRegionComplete}
          />
        </div>
        
        {/* Step 2: Location Selection (only shown after country/region are selected) */}
        {countryRegionSelected && (
          <div className="mt-4">
            <Text bold className="mb-2">Step 2: Select Location</Text>
            <LocationSelection
              locationIndex={index}
              country={country}
              region={region}
            />
          </div>
        )}
      </div>
    </div>
  );
}
