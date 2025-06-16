import { ErrorDisplay } from '@app/components/vendor/error-display';
import { type VendorFormValues } from '@app/components/vendor/vendor-creation-form';
import { useManagedCountries } from '@app/hooks/use-managed-countries';
import { getIn, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';

interface CountryRegionSelectorProps {
  locationIndex: number;
  onSelectionComplete?: (country: string, region: string) => void;
}

const OTHER_COUNTRY_VALUE = '__OTHER__';

export function CountryRegionSelector({
  locationIndex,
  onSelectionComplete,
}: CountryRegionSelectorProps) {
  const { values, setFieldValue } = useFormikContext<VendorFormValues>();
  const basePath = `locations.createMany.data.${locationIndex}.address`;

  const {
    managedCountriesData,
    managedCountriesLoading,
    managedCountriesError,
  } = useManagedCountries();

  const currentCountryFormikValue = getIn(values, `${basePath}.country`);
  const currentStateFormikValue = getIn(values, `${basePath}.state`);

  // Local state for the country dropdown UI selection
  const [dropdownSelectedCountry, setDropdownSelectedCountry] =
    useState<string>('');

  useEffect(() => {
    if (managedCountriesLoading) return; // Wait for data to load

    if (
      currentCountryFormikValue &&
      managedCountriesData?.[currentCountryFormikValue]
    ) {
      setDropdownSelectedCountry(currentCountryFormikValue);
    } else if (currentCountryFormikValue) {
      // Country in Formik but not in managed list (or data not loaded yet)
      setDropdownSelectedCountry(OTHER_COUNTRY_VALUE);
    } else {
      setDropdownSelectedCountry(''); // No country selected in Formik
    }
  }, [
    currentCountryFormikValue,
    managedCountriesData,
    managedCountriesLoading,
  ]);

  useEffect(() => {
    // Notify parent when both country and region are selected
    if (
      onSelectionComplete &&
      currentCountryFormikValue &&
      currentStateFormikValue
    ) {
      onSelectionComplete(currentCountryFormikValue, currentStateFormikValue);
    }
  }, [currentCountryFormikValue, currentStateFormikValue, onSelectionComplete]);

  const handleCountryDropdownChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newDropdownValue = e.target.value;
    setDropdownSelectedCountry(newDropdownValue);
    if (newDropdownValue === OTHER_COUNTRY_VALUE) {
      setFieldValue(`${basePath}.country`, ''); // Clear Formik country, user will type in text input
    } else {
      setFieldValue(`${basePath}.country`, newDropdownValue);
    }
    setFieldValue(`${basePath}.state`, ''); // Always clear state/region when country changes
  };

  const countryOptions = managedCountriesData
    ? Object.keys(managedCountriesData)
    : [];

  const actualSelectedCountryForRegions = currentCountryFormikValue;
  const regionsForActualSelectedCountry =
    managedCountriesData &&
    actualSelectedCountryForRegions &&
    managedCountriesData[actualSelectedCountryForRegions]
      ? Object.keys(managedCountriesData[actualSelectedCountryForRegions])
      : [];

  const showRegionSelect =
    actualSelectedCountryForRegions &&
    managedCountriesData?.[actualSelectedCountryForRegions] &&
    regionsForActualSelectedCountry.length > 0;

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {/* Country Field */}
      <div>
        <label htmlFor={`${basePath}.country-select`} className='label'>
          <span className='label-text'>Country</span>
        </label>
        {managedCountriesLoading && (
          <div className='input input-bordered flex w-full items-center'>
            <span className='loading loading-xs loading-spinner' />
            &nbsp;Loading countries...
          </div>
        )}
        {managedCountriesError && (
          <p className='text-error'>Error loading countries.</p>
        )}
        {!managedCountriesLoading && !managedCountriesError && (
          <select
            id={`${basePath}.country-select`}
            value={dropdownSelectedCountry}
            onChange={handleCountryDropdownChange}
            className='select select-bordered w-full'
            disabled={managedCountriesLoading}>
            <option value='' disabled>
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
        {dropdownSelectedCountry === OTHER_COUNTRY_VALUE &&
          !managedCountriesLoading && (
            <input
              id={`${basePath}.country-text`}
              name={`${basePath}.country`}
              type='text'
              placeholder='Enter country name'
              className='input input-bordered mt-2 w-full'
              onChange={(e) =>
                setFieldValue(`${basePath}.country`, e.target.value)
              }
              value={currentCountryFormikValue ?? ''}
            />
          )}
        <ErrorDisplay name={`${basePath}.country`} />
      </div>

      {/* State/Province Field */}
      <div>
        <label htmlFor={`${basePath}.state`} className='label'>
          <span className='label-text'>State/Province</span>
        </label>
        {showRegionSelect ? (
          <select
            id={`${basePath}.state-select`}
            name={`${basePath}.state`}
            className='select select-bordered w-full'
            disabled={
              managedCountriesLoading || !actualSelectedCountryForRegions
            }
            onChange={(e) => setFieldValue(`${basePath}.state`, e.target.value)}
            value={currentStateFormikValue ?? ''}>
            <option value=''>
              {managedCountriesLoading ? 'Loading...' : 'Select State/Province'}
            </option>
            {regionsForActualSelectedCountry.map((regionName) => (
              <option key={regionName} value={regionName}>
                {regionName}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={`${basePath}.state-text`}
            name={`${basePath}.state`}
            type='text'
            placeholder='Enter state/province'
            className='input input-bordered w-full'
            disabled={
              managedCountriesLoading ||
              (dropdownSelectedCountry !== OTHER_COUNTRY_VALUE &&
                !actualSelectedCountryForRegions)
            }
            onChange={(e) => setFieldValue(`${basePath}.state`, e.target.value)}
            value={currentStateFormikValue ?? ''}
          />
        )}
        <ErrorDisplay name={`${basePath}.state`} />
      </div>
    </div>
  );
}
