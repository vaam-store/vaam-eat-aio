import React, { useEffect, useState } from "react";
import { useLocationMap } from "@app/hooks/use-location-map";
import { type ManagedCountries } from "@app/hooks/use-managed-countries";
import { RecenterMapButton } from "./recenter-map-button";

interface LocationPickerProps {
  previousCoordinates?: { lat: number; lng: number }; // Renamed from initialLocation and made optional
  onLocationChange: (location: { lat: number; lng: number }) => void;
  initialArea?: string; // Kept for potential direct use, but overridden by region if provided
  onAreaChange?: (area: string) => void;
  country?: string; // The selected country from AddressFields
  region?: string; // The selected region/area from AddressFields, will be prioritized for initialArea
  managedCountriesData?: ManagedCountries; // Passed from AddressFields -> LocationPickerModal
  disabled?: boolean;
}

export function LocationPicker({
  previousCoordinates,
  onLocationChange,
  initialArea, // This is the prop from LocationPickerModal, which might be undefined
  onAreaChange,
  country, // Country from AddressFields
  region, // Region from AddressFields (will be used as selectedArea if present)
  managedCountriesData, // Data from AddressFields
  disabled = false,
}: LocationPickerProps) {
  // Prioritize `region` prop for initial selected area, then `initialArea`, then fallback logic
  const [selectedArea, setSelectedArea] = useState<string | undefined>(() => {
    if (region) return region;
    if (initialArea) return initialArea;
    // Fallback to first available area if no specific region/initialArea is provided
    if (managedCountriesData && country && managedCountriesData[country]) {
      const countryRegions = Object.keys(managedCountriesData[country]);
      if (countryRegions.length > 0) return countryRegions[0];
    } else if (
      managedCountriesData &&
      Object.keys(managedCountriesData).length > 0
    ) {
      const firstCountry = Object.keys(managedCountriesData)[0];
      if (firstCountry && managedCountriesData[firstCountry]) {
        const firstCountryRegions = Object.keys(
          managedCountriesData[firstCountry],
        );
        if (firstCountryRegions.length > 0) return firstCountryRegions[0];
      }
    }
    return undefined;
  });

  useEffect(() => {
    // If a region is explicitly passed and it's different from current selectedArea, update.
    // This handles cases where the modal re-opens with a new region from AddressFields.
    if (region && region !== selectedArea) {
      setSelectedArea(region);
      if (onAreaChange) onAreaChange(region);
    } else if (!region && initialArea && initialArea !== selectedArea) {
      // Fallback to initialArea if region is not provided
      setSelectedArea(initialArea);
      if (onAreaChange) onAreaChange(initialArea);
    }
  }, [region, initialArea, selectedArea, onAreaChange]);

  const {
    mapContainerRef,
    selectedLocation,
    handleAreaChange: handleMapAreaChange,
    recenterMapToUserLocation,
  } = useLocationMap({
    initialLocation: previousCoordinates,
    onLocationChange,
    selectedArea, // This will be the effectively selected area
    managedCountries: managedCountriesData || {},
    country, // Pass country to useLocationMap
    disabled,
  });

  const handleRecenterClick = () => {
    if (recenterMapToUserLocation) {
      recenterMapToUserLocation();
    }
  };

  const handleAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newArea = event.target.value;
    setSelectedArea(newArea);
    onAreaChange?.(newArea);
    handleMapAreaChange(newArea);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Select Zone/Area</span>
        </label>
        <select
          className="select select-bordered"
          value={selectedArea ?? ""}
          onChange={handleAreaChange}
          aria-label="Select Zone/Area"
          disabled={disabled}
        >
          <option value="" disabled>
            Select an area
          </option>
          {Object.entries(managedCountriesData || {}).map(
            ([countryCode, areas]) => (
              <optgroup key={countryCode} label={countryCode.toUpperCase()}>
                {Object.keys(areas).map((areaName) => (
                  <option key={areaName} value={areaName}>
                    {areaName}
                  </option>
                ))}
              </optgroup>
            ),
          )}
        </select>
      </div>
      <div className="relative">
        {" "}
        {/* Added relative positioning for the button */}
        <div ref={mapContainerRef} className="rounded-box h-96 w-full" />
        {!disabled && (
          <RecenterMapButton
            onClick={handleRecenterClick}
            className="absolute right-2 bottom-12 z-10" // Positioning classes
          />
        )}
      </div>
      <div className="py-4">
        {selectedLocation ? (
          <p>
            Selected: Lat {selectedLocation.lat.toFixed(4)}, Lng{" "}
            {selectedLocation.lng.toFixed(4)}
          </p>
        ) : (
          <p>
            {disabled
              ? "Location is set."
              : "Drag the marker to select a location."}
          </p>
        )}
      </div>
    </div>
  );
}
