import { Title } from '@app/components/text';
import { ErrorMessage, Field } from 'formik';

export function VendorNameStep() {
  return (
    <div className='space-y-4'>
      <Title>Vendor Information</Title>
      <p className='text-base-content opacity-70'>
        Start by providing the basic details for your new vendor.
      </p>
      <div>
        <label htmlFor='name' className='label'>
          <span className='label-text'>Vendor Name</span>
        </label>
        <Field
          id='name'
          name='name'
          type='text'
          className='input input-bordered w-full'
          autoFocus
        />
        <ErrorMessage
          name='name'
          component='div'
          className='text-error mt-1 text-xs'
        />
      </div>
    </div>
  );
}
