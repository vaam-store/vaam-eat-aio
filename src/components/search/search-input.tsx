'use client';

import { useGeolocation } from '@app/hooks/use-geolocation';
import { handleGenericError } from '@app/utils/error-handler';
import { Form, Formik, type FormikHelpers, useFormikContext } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { MapPin, Search } from 'react-feather';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Button } from '../button';

export type SearchLocationParams = {
  query: string;
  latitude?: number;
  longitude?: number;
};

export interface SearchInputProps {
  checkLocationDelivery?: boolean;
  onSearch?: (data: SearchLocationParams) => void;
}

const searchValidationSchema = z.object({
  query: z.string().optional(), // Query can be optional if location is used
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const initialValues: SearchLocationParams = {
  query: '',
  latitude: undefined,
  longitude: undefined,
};

// Custom Search Bar component to encapsulate the input and geolocation logic
function FormikSearchBar() {
  const { values, setFieldValue, submitForm } =
    useFormikContext<SearchLocationParams>();
  const { latitude, longitude, getLocation, isLoading } = useGeolocation();
  const [localQuery, setLocalQuery] = useState(values.query);
  const submitButtonRef = useRef<any>(null); // Changed to any to resolve type conflict

  // Update Formik's query field when localQuery changes
  useEffect(() => {
    setFieldValue('query', localQuery);
  }, [localQuery, setFieldValue]);

  // Update Formik's lat/lng when geolocation hook provides them
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setFieldValue('latitude', latitude);
      setFieldValue('longitude', longitude);
    }
  }, [latitude, longitude, setFieldValue]);

  useEffect(() => {
    // If we got new geo-coordinates and the location button was clicked (isLoading is false after true)
    // we might want to auto-submit or update the search.
    // Here, we can call submitForm() or onSearch directly if needed.
    if (
      latitude !== null &&
      longitude !== null &&
      !isLoading &&
      values.latitude === latitude
    ) {
      // Check if formik values are updated
      // This effect might be tricky if it causes too many re-renders or submissions.
      // A more controlled approach might be to have a separate "search with current location" button
      // or make the getLocation button also trigger a search.
      // For now, let's try to replicate the auto-submit idea carefully.
      // Check if the location data has just been updated
      if (values.latitude !== undefined && values.longitude !== undefined) {
        // Check if the current query is empty, if so, we can assume the user wants to search by location
        if (!values.query) {
          // Programmatically click the submit button
          submitButtonRef.current?.click();
        }
      }
    }
  }, [
    latitude,
    longitude,
    isLoading,
    values.latitude,
    values.longitude,
    values.query,
    submitForm,
  ]);

  const handleGetLocation = async () => {
    try {
      // Explicitly handle the Promise
      const locationPromise = getLocation();
      if (locationPromise instanceof Promise) {
        await locationPromise;
      }
      // After getLocation, latitude/longitude will update, triggering the above useEffect
      // which then calls handleGeolocationSearch if conditions are met.
    } catch (error) {
      handleGenericError(error, 'Could not get location.');
    }
  };

  return (
    <div className='input input-primary input-bordered input-xl flex w-full items-center gap-2'>
      <Button
        type='button'
        shape='circle'
        variant='soft'
        aria-label='Use current location'
        onClick={() => void handleGetLocation()}
        loading={isLoading}
        className='flex-shrink-0'>
        <MapPin className='h-6 w-6 stroke-current' />
      </Button>

      <input
        type='text'
        placeholder='Search for food…'
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission if inside a larger form
            submitForm();
          }
        }}
        className='grow bg-transparent outline-none'
      />

      <Button
        type='submit'
        shape='circle'
        variant='soft'
        className='flex-shrink-0'
        ref={submitButtonRef}>
        <Search className='h-6 w-6 stroke-current' />
      </Button>
    </div>
  );
}

export function SearchInput({ onSearch, _onClear }: SearchInputProps) {
  const handleFormSubmit = (
    values: SearchLocationParams,
    { setSubmitting }: FormikHelpers<SearchLocationParams>,
  ) => {
    onSearch?.(values);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(searchValidationSchema)}
      onSubmit={handleFormSubmit}
      enableReinitialize // Important if initialValues could change externally
    >
      {() => (
        <Form className='w-full'>
          <FormikSearchBar />
        </Form>
      )}
    </Formik>
  );
}
