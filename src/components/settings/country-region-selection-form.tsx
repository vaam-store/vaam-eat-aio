import { Button } from '@app/components/button';
import { ListBlock } from '@app/components/list-block';
import { ListItem } from '@app/components/list-item';
import { Field, Form, Formik } from 'formik';
import type { ChangeEvent } from 'react';
import * as Zod from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const countryRegionSchema = Zod.object({
  country: Zod.string().nullable(),
  region: Zod.string().nullable(),
});

type CountryRegionSelectionFormProps = {
  country: string | null;
  region: string | null;
  setCountry: (c: string | null) => void;
  setRegion: (r: string | null) => void;
  countryOptions: Array<{ value: string; label: string }>;
  regionOptions: Array<{ value: string; label: string }>;
};

export function CountryRegionSelectionForm({
  country,
  region,
  setCountry,
  setRegion,
  countryOptions,
  regionOptions,
}: CountryRegionSelectionFormProps) {
  return (
    <Formik
      initialValues={{ country, region }}
      enableReinitialize
      validationSchema={toFormikValidationSchema(countryRegionSchema)}
      onSubmit={(values) => {
        setCountry(values.country);
        setRegion(values.region);
      }}>
      {({ errors, touched, values, setFieldValue }) => (
        <Form>
          <ListBlock title='Country/Region Selection'>
            <ListItem title='No orders found.' />
            <ListItem
              title='Country'
              endIcon={
                <Field
                  as='select'
                  name='country'
                  className='select select-bordered w-full'
                  onChange={async (e: ChangeEvent<HTMLSelectElement>) => {
                    await setFieldValue('country', e.target.value);
                    await setFieldValue('region', '');
                  }}>
                  <option value=''>Select Country</option>
                  {countryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              }
              description={
                errors.country && touched.country ? (
                  <span className='text-error'>{errors.country}</span>
                ) : undefined
              }
            />

            <ListItem
              title='Region'
              endIcon={
                <Field
                  as='select'
                  name='region'
                  className='select select-bordered w-full'
                  disabled={!values.country}>
                  <option value=''>Select Region</option>
                  {regionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              }
              description={
                errors.region && touched.region ? (
                  <span className='text-error'>{errors.region}</span>
                ) : undefined
              }
            />

            <ListItem endIcon={<Button type='submit'>Save Selection</Button>} />
          </ListBlock>
        </Form>
      )}
    </Formik>
  );
}
