import React, { useState, useEffect } from "react";
import { Field, getIn, useFormikContext } from "formik";
import { Button } from "@app/components/button";
import { ErrorDisplay } from "@app/components/vendor/error-display";
import { type VendorFormValues } from "@app/components/vendor/vendor-creation-form";
import { LocationPickerModal } from "@app/components/vendor/location-picker-modal";
import { useManagedCountries } from "@app/hooks/use-managed-countries";

interface AddressFieldsProps {
  locationIndex: number;
}

const OTHER_COUNTRY_VALUE = "__OTHER__";

export function AddressFields({ locationIndex }: AddressFieldsProps) {
  const { values, setFieldValue, errors, touched, handleChange } =
    useFormikContext<VendorFormValues>();
  const basePath = `locations.createMany.data.${locationIndex}.address`;

  const { managedCountriesData, managedCountriesLoading, managedCountriesError } =
    useManagedCountries();

  const currentCountryFormikValue = getIn(values, `${basePath}.country`);
  const currentStateFormikValue = getIn(values, `${basePath}.state`);

  // Local state for the country dropdown UI selection
  const [dropdownSelectedCountry, setDropdownSelectedCountry] = useState<string>("");

  useEffect(() => {
    if (managedCountriesLoading) return; // Wait for data to load

    if (currentCountryFormikValue && managedCountriesData?.[currentCountryFormikValue]) {
      setDropdownSelectedCountry(currentCountryFormikValue);
    } else if (currentCountryFormikValue) { // Country in Formik but not in managed list (or data not loaded yet)
      setDropdownSelectedCountry(OTHER_COUNTRY_VALUE);
    } else {
      setDropdownSelectedCountry(""); // No country selected in Formik
    }
  }, [currentCountryFormikValue, managedCountriesData, managedCountriesLoading]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentLatitude = getIn(values, `${basePath}.latitude`);
  const currentLongitude = getIn(values, `${basePath}.longitude`);

  const handleConfirmLocation = ({ lat, lng }: { lat: number; lng: number }) => {
    setFieldValue(`${basePath}.latitude`, lat);
    setFieldValue(`${basePath}.longitude`, lng);
  };

  const handleCountryDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDropdownValue = e.target.value;
    setDropdownSelectedCountry(newDropdownValue);
    if (newDropdownValue === OTHER_COUNTRY_VALUE) {
      setFieldValue(`${basePath}.country`, ""); // Clear Formik country, user will type in text input
    } else {
      setFieldValue(`${basePath}.country`, newDropdownValue);
    }
    setFieldValue(`${basePath}.state`, ""); // Always clear state/region when country changes
  };

  const countryOptions = managedCountriesData ? Object.keys(managedCountriesData) : [];
  
  const actualSelectedCountryForRegions = currentCountryFormikValue;
  const regionsForActualSelectedCountry =
    managedCountriesData && actualSelectedCountryForRegions && managedCountriesData[actualSelectedCountryForRegions]
      ? Object.keys(managedCountriesData[actualSelectedCountryForRegions])
      : [];

  const showRegionSelect =
    actualSelectedCountryForRegions &&
    managedCountriesData &&
    managedCountriesData[actualSelectedCountryForRegions] &&
    regionsForActualSelectedCountry.length > 0;

  const latitudeError = getIn(errors, `${basePath}.latitude`);
  const longitudeError = getIn(errors, `${basePath}.longitude`);
  const latitudeTouched = getIn(touched, `${basePath}.latitude`);
  const longitudeTouched = getIn(touched, `${basePath}.longitude`);

  return (
    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label htmlFor={`${basePath}.street`} className="label">
          <span className="label-text">Street Address</span>
        </label>
        <Field
          id={`${basePath}.street`}
          name={`${basePath}.street`}
          type="text"
          className="input input-bordered w-full"
        />
        <ErrorDisplay name={`${basePath}.street`} />
      </div>
      <div>
        <label htmlFor={`${basePath}.city`} className="label">
          <span className="label-text">City</span>
        </label>
        <Field
          id={`${basePath}.city`}
          name={`${basePath}.city`}
          type="text"
          className="input input-bordered w-full"
        />
        <ErrorDisplay name={`${basePath}.city`} />
      </div>

      {/* Country Field */}
      <div>
        <label htmlFor={`${basePath}.country-select`} className="label">
          <span className="label-text">Country</span>
        </label>
        {managedCountriesLoading && <div className="input input-bordered w-full flex items-center"><span className="loading loading-xs loading-spinner" />&nbsp;Loading countries...</div>}
        {managedCountriesError && <p className="text-error">Error loading countries.</p>}
        {!managedCountriesLoading && !managedCountriesError && (
          <select
            id={`${basePath}.country-select`}
            value={dropdownSelectedCountry}
            onChange={handleCountryDropdownChange}
            className="select select-bordered w-full"
            disabled={managedCountriesLoading}
          >
            <option value="" disabled>
              Select Country
            </option>
            {countryOptions.map((countryName) => (
              <option key={countryName} value={countryName}>
                {countryName}
              </option>
            ))}
            <option value={OTHER_COUNTRY_VALUE}>Other (Specify)</option>
          </select>
        )}
        {dropdownSelectedCountry === OTHER_COUNTRY_VALUE && !managedCountriesLoading && (
          <Field
            id={`${basePath}.country-text`}
            name={`${basePath}.country`}
            type="text"
            placeholder="Enter country name"
            className="input input-bordered mt-2 w-full"
          />
        )}
        <ErrorDisplay name={`${basePath}.country`} />
      </div>

      {/* State/Province Field */}
      <div>
        <label htmlFor={`${basePath}.state`} className="label">
          <span className="label-text">State/Province</span>
        </label>
        {showRegionSelect ? (
          <Field
            as="select"
            id={`${basePath}.state-select`}
            name={`${basePath}.state`}
            className="select select-bordered w-full"
            disabled={managedCountriesLoading || !actualSelectedCountryForRegions}
          >
            <option value="">
              {managedCountriesLoading ? 'Loading...' : 'Select State/Province'}
            </option>
            {regionsForActualSelectedCountry.map((regionName) => (
              <option key={regionName} value={regionName}>
                {regionName}
              </option>
            ))}
          </Field>
        ) : (
          <Field
            id={`${basePath}.state-text`}
            name={`${basePath}.state`}
            type="text"
            placeholder="Enter state/province"
            className="input input-bordered w-full"
            disabled={managedCountriesLoading || (dropdownSelectedCountry !== OTHER_COUNTRY_VALUE && !actualSelectedCountryForRegions)}
          />
        )}
        <ErrorDisplay name={`${basePath}.state`} />
      </div>
      
      <div>
        <label htmlFor={`${basePath}.zip`} className="label">
          <span className="label-text">ZIP/Postal Code</span>
        </label>
        <Field
          id={`${basePath}.zip`}
          name={`${basePath}.zip`}
          type="text"
          className="input input-bordered w-full"
        />
        <ErrorDisplay name={`${basePath}.zip`} />
      </div>
      
      {/* This empty div helps maintain the 2-column layout for the ZIP code field if others wrap */}
      <div></div>

      <div className="col-span-full">
        <label className="label">
          <span className="label-text">Location Coordinates</span>
        </label>
        <Button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn-outline btn-primary"
        >
          Pick Location on Map
        </Button>
        {currentLatitude !== undefined && currentLongitude !== undefined && (currentLatitude !== 0 || currentLongitude !== 0) ? (
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
      <LocationPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmLocation}
        initialLocation={
          currentLatitude !== undefined && currentLongitude !== undefined && (currentLatitude !== 0 || currentLongitude !== 0)
            ? { lat: currentLatitude, lng: currentLongitude }
            : undefined
        }
        country={currentCountryFormikValue && managedCountriesData?.[currentCountryFormikValue] ? currentCountryFormikValue : undefined}
        region={currentCountryFormikValue && managedCountriesData?.[currentCountryFormikValue] && regionsForActualSelectedCountry.includes(currentStateFormikValue) ? currentStateFormikValue : undefined}
        managedCountriesData={managedCountriesData}
      />
    </div>
  );
}
