import { Button } from '@app/components/button';
import { LocationPicker } from '@app/components/location-picker/location-picker';
import { Modal } from '@app/components/modal';
import { type ManagedCountries } from '@app/hooks/use-managed-countries';
import React, { useState } from 'react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: { lat: number; lng: number }, area?: string) => void;
  initialLocation?: { lat: number; lng: number };
  initialArea?: string;
  country?: string;
  region?: string;
  managedCountriesData?: ManagedCountries;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialLocation,
  initialArea,
  country,
  region,
  managedCountriesData,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<
    { lat: number; lng: number } | undefined
  >(initialLocation);
  const [selectedArea, setSelectedArea] = useState<string | undefined>(
    initialArea,
  );

  const handleConfirm = () => {
    if (selectedLocation) {
      onConfirm(selectedLocation, selectedArea);
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onCloseAction={onClose}
      title='Pick Location'
      position='bottom'>
      <div>
        <LocationPicker
          previousCoordinates={initialLocation}
          onLocationChange={setSelectedLocation}
          initialArea={initialArea}
          onAreaChange={setSelectedArea}
          country={country}
          region={region}
          managedCountriesData={managedCountriesData}
        />
      </div>
      <div className='modal-action'>
        <Button onClick={onClose} className='btn-ghost'>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedLocation}
          className='btn-primary'>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
