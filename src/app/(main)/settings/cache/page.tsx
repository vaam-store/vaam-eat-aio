'use client';

import { Section } from '@app/components/section';
import { useManagedCountries } from '@app/hooks/use-managed-countries';
import useMapCacheStore from '@app/store/map-cache';

import { CountryRegionSelectionForm } from '@app/components/settings/country-region-selection-form';
import { DownloadSection } from '@app/components/settings/download-section';
import { EnableOfflineMapsToggle } from '@app/components/settings/enable-offline-maps-toggle';

const CacheSettingsPage = () => {
  const {
    enabled,
    toggleEnabled,
    country,
    setCountry,
    region,
    setRegion,
    downloadStatus,
    progress,
    triggerDownload,
  } = useMapCacheStore();

  const {
    managedCountriesData,
    managedCountriesLoading,
    managedCountriesError,
  } = useManagedCountries();

  if (managedCountriesLoading) {
    return <div>Loading...</div>;
  }

  if (managedCountriesError) {
    return <div>Error loading managed countries</div>;
  }

  if (!managedCountriesData) {
    return <div>No managed countries data available</div>;
  }

  const countryOptions = Object.keys(managedCountriesData).map(
    (countryCode) => ({
      value: countryCode,
      label: countryCode,
    }),
  );

  const regionOptions =
    country && managedCountriesData[country]
      ? Object.keys(managedCountriesData[country]).map((regionCode) => ({
          value: regionCode,
          label: regionCode,
        }))
      : [];

  return (
    <Section>
      <EnableOfflineMapsToggle enabled={enabled} onToggle={toggleEnabled} />
      {enabled && (
        <>
          <CountryRegionSelectionForm
            country={country}
            region={region}
            setCountry={setCountry}
            setRegion={setRegion}
            countryOptions={countryOptions}
            regionOptions={regionOptions}
          />
          <DownloadSection
            downloadStatus={downloadStatus}
            progress={progress}
            onDownload={triggerDownload}
          />
        </>
      )}
    </Section>
  );
};

export default CacheSettingsPage;
