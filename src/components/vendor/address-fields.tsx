import React, { useState } from "react";
import { useFormikContext } from "formik";
import { type VendorFormValues } from "@app/components/vendor/vendor-creation-form";
import { CountryRegionSelector } from "@app/components/vendor/country-region-selector";
import { LocationSelection } from "@app/components/vendor/location-selection";
import { Text } from "@app/components/text";

interface AddressFieldsProps {
  locationIndex: number;
}

/**
 * Legacy AddressFields component that now uses the new flow components
 * This maintains backward compatibility with existing code
 */
export function AddressFields({ locationIndex }: AddressFieldsProps) {
  const { values } = useFormikContext<VendorFormValues>();
  
  // State to track if country and region have been selected
  const [countryRegionSelected, setCountryRegionSelected] = useState(false);
  
  // Get current country and region values
  const country = values.locations.createMany.data[locationIndex]?.address.country || "";
  const region = values.locations.createMany.data[locationIndex]?.address.state || "";
  
  // Handler for when country and region selection is complete
  const handleCountryRegionComplete = (country: string, region: string) => {
    if (country && region) {
      setCountryRegionSelected(true);
    }
  };

  return (
    <div className="mt-3">
      {/* Step 1: Country and Region Selection */}
      <div className="mb-4">
        <Text bold className="mb-2">Step 1: Select Country and Region</Text>
        <CountryRegionSelector
          locationIndex={locationIndex}
          onSelectionComplete={handleCountryRegionComplete}
        />
      </div>
      
      {/* Step 2: Location Selection (only shown after country/region are selected) */}
      {countryRegionSelected && (
        <div className="mt-4">
          <Text bold className="mb-2">Step 2: Select Location</Text>
          <LocationSelection
            locationIndex={locationIndex}
            country={country}
            region={region}
          />
        </div>
      )}
    </div>
  );
}
