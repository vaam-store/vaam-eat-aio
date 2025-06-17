import { Button } from '@app/components/button';
import { Title } from '@app/components/text';
import { ErrorDisplay } from '@app/components/vendor/error-display';
import { LocationItem } from '@app/components/vendor/location-item';
import { type VendorFormValues } from '@app/components/vendor/vendor-creation-form';
import { FieldArray, getIn, useFormikContext } from 'formik';
import { Plus } from 'react-feather';

export function VendorLocationsStep() {
  const { values, errors, touched } = useFormikContext<VendorFormValues>();
  return (
    <div className='space-y-4'>
      <Title>Vendor Locations</Title>
      <p className='text-base-content opacity-70'>
        Define the physical locations associated with your vendor. For each
        location, you will need to:
      </p>
      <ol className='text-base-content mt-2 mb-4 list-inside list-decimal opacity-70'>
        <li>Select a country and region</li>
        <li>Use the map picker to select precise coordinates (default), or</li>
        <li>Manually enter address details if preferred</li>
      </ol>
      <FieldArray name='locations.createMany.data'>
        {({ remove, push }) => (
          <div className='space-y-4'>
            {values.locations.createMany.data.map((_locationItem, index) => (
              <LocationItem key={index} index={index} remove={remove} />
            ))}
            <Button
              type='button'
              variant='outline'
              color='primary'
              className='mt-2'
              onClick={() =>
                push({
                  name: 'Main',
                  address: {
                    street: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: '',
                    latitude: 0,
                    longitude: 0,
                  },
                })
              }
              aria-label='Add location'>
              <Plus /> Add Location
            </Button>
            {(() => {
              const locationDataError = getIn(
                errors,
                'locations.createMany.data',
              );
              const locationDataTouched = getIn(
                touched,
                'locations.createMany.data',
              );
              if (
                locationDataTouched &&
                typeof locationDataError === 'string'
              ) {
                return <ErrorDisplay name='locations.createMany.data' />;
              }
              return null;
            })()}
          </div>
        )}
      </FieldArray>
    </div>
  );
}
