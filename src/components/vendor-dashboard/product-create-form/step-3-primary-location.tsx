'use client';

import { useField } from 'formik';
import React from 'react';

const TextField: React.FC<{
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
}> = ({ name, placeholder, label, type = 'text' }) => {
  const [field, meta] = useField<any>(name);
  return (
    <div>
      {label && (
        <label htmlFor={name} className='block font-semibold mb-1'>
          {label}
        </label>
      )}
      <input
        {...field}
        type={type}
        placeholder={placeholder}
        className='input input-bordered w-full'
        id={name}
      />
      {meta.touched && meta.error && (
        <div className='text-error text-sm mt-1'>{meta.error}</div>
      )}
    </div>
  );
};

const Step3PrimaryLocation: React.FC = () => (
  <div className='space-y-4'>
    <TextField
      name='primaryLocation.create.data.name'
      label='Location Name'
      placeholder='Location Name'
    />
    <div>
      <label className='block font-semibold mb-1'>Address</label>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <TextField
          name='primaryLocation.create.data.address.street'
          placeholder='Street'
        />
        <TextField
          name='primaryLocation.create.data.address.city'
          placeholder='City'
        />
        <TextField
          name='primaryLocation.create.data.address.state'
          placeholder='State'
        />
        <TextField
          name='primaryLocation.create.data.address.zip'
          placeholder='ZIP'
        />
        <TextField
          name='primaryLocation.create.data.address.country'
          placeholder='Country'
        />
        <TextField
          name='primaryLocation.create.data.address.latitude'
          placeholder='Latitude'
          type='number'
        />
        <TextField
          name='primaryLocation.create.data.address.longitude'
          placeholder='Longitude'
          type='number'
        />
      </div>
    </div>
  </div>
);

export default Step3PrimaryLocation;
