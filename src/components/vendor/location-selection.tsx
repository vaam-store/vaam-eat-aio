import React, { useState } from "react";
import { getIn, useFormikContext } from "formik";
import { Button } from "@app/components/button";
import { Map, Edit } from "react-feather";
import { type VendorFormValues } from "@app/components/vendor/vendor-creation-form";
import { LocationPickerModal } from "@app/components/vendor/location-picker-modal";
import { useManagedCountries } from "@app/hooks/use-managed-countries";
import { ErrorDisplay } from "@app/components/vendor/error-display";

interface LocationSelectionProps {
  locationIndex: number;
  country: string;
  region: string;
}

export function LocationSelection({
  locationIndex,
  country,
  region
}: LocationSelectionProps) {
  const { values, setFieldValue, errors, touched } = useFormikContext<VendorFormValues>();
  const basePath = `locations.createMany.data.${locationIndex}.address`;
  
  // State for controlling address form collapse
  const [isFormCollapsed, setIsFormCollapsed] = useState(true);
  
  // State for the location picker modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { managedCountriesData } = useManagedCountries();
  
  // Get current values from Formik
  const currentLatitude = getIn(values, `${basePath}.latitude`);
  const currentLongitude = getIn(values, `${basePath}.longitude`);
  const currentStreet = getIn(values, `${basePath}.street`);
  const currentCity = getIn(values, `${basePath}.city`);
  const currentZip = getIn(values, `${basePath}.zip`);
  
  const handleConfirmLocation = ({
    lat,
    lng,
  }: {
    lat: number;
    lng: number;
  }) => {
    setFieldValue(`${basePath}.latitude`, lat);
    setFieldValue(`${basePath}.longitude`, lng);
  };
  
  // Error handling
  const latitudeError = getIn(errors, `${basePath}.latitude`);
  const longitudeError = getIn(errors, `${basePath}.longitude`);
  const latitudeTouched = getIn(touched, `${basePath}.latitude`);
  const longitudeTouched = getIn(touched, `${basePath}.longitude`);
  
  return (
    <div className="mt-4">
      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="col-span-2"
        >
          <Map size={16} /> Pick address
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsFormCollapsed(!isFormCollapsed)}
        >
          <Edit size={14} /> Manual
        </Button>
      </div>
      
      {/* Address form (always in DOM, controlled by collapse) */}
      <div className={`collapse ${!isFormCollapsed ? 'collapse-open' : 'collapse-close'}`}>
        <div className="collapse-content">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor={`${basePath}.street`} className="label">
                <span className="label-text">Street Address</span>
              </label>
              <input
                id={`${basePath}.street`}
                name={`${basePath}.street`}
                type="text"
                className="input input-bordered w-full"
                value={currentStreet || ""}
                onChange={(e) => setFieldValue(`${basePath}.street`, e.target.value)}
              />
              <ErrorDisplay name={`${basePath}.street`} />
            </div>
            <div>
              <label htmlFor={`${basePath}.city`} className="label">
                <span className="label-text">City</span>
              </label>
              <input
                id={`${basePath}.city`}
                name={`${basePath}.city`}
                type="text"
                className="input input-bordered w-full"
                value={currentCity || ""}
                onChange={(e) => setFieldValue(`${basePath}.city`, e.target.value)}
              />
              <ErrorDisplay name={`${basePath}.city`} />
            </div>
            <div>
              <label htmlFor={`${basePath}.zip`} className="label">
                <span className="label-text">ZIP/Postal Code</span>
              </label>
              <input
                id={`${basePath}.zip`}
                name={`${basePath}.zip`}
                type="text"
                className="input input-bordered w-full"
                value={currentZip || ""}
                onChange={(e) => setFieldValue(`${basePath}.zip`, e.target.value)}
              />
              <ErrorDisplay name={`${basePath}.zip`} />
            </div>
            
            {/* This empty div helps maintain the 2-column layout */}
            <div></div>
          </div>
        </div>
      </div>
      
      {/* Location coordinates display (always visible) */}
      <div className="mt-4">
        <label className="label">
          <span className="label-text">Location Coordinates</span>
        </label>
        {currentLatitude !== undefined &&
        currentLongitude !== undefined &&
        (currentLatitude !== 0 || currentLongitude !== 0) ? (
          <p className="text-base-content mt-2 text-sm opacity-70">
            Selected: Lat {currentLatitude?.toFixed(4)}, Lng{" "}
            {currentLongitude?.toFixed(4)}
          </p>
        ) : (
          <p className="text-base-content mt-2 text-sm opacity-70">
            No location selected.
          </p>
        )}
        {(latitudeTouched && latitudeError) ||
        (longitudeTouched && longitudeError) ? (
          <ErrorDisplay name={`${basePath}.latitude`} />
        ) : null}
      </div>
      
      {/* Location picker modal (used in both modes) */}
      <LocationPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmLocation}
        initialLocation={
          currentLatitude !== undefined &&
          currentLongitude !== undefined &&
          (currentLatitude !== 0 || currentLongitude !== 0)
            ? { lat: currentLatitude, lng: currentLongitude }
            : undefined
        }
        country={country}
        region={region}
        managedCountriesData={managedCountriesData}
      />
    </div>
  );
}