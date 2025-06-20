'use client';

import { useField } from 'formik';
import React from 'react';

const TextField: React.FC<{ name: string; label: string; type?: string }> = ({
  name,
  label,
  type = 'text',
}) => {
  const [field, meta] = useField<any>(name);
  return (
    <div>
      <label htmlFor={name} className='block font-semibold mb-1'>
        {label}
      </label>
      <input
        {...field}
        type={type}
        className='input input-bordered w-full'
        id={name}
      />
      {meta.touched && meta.error && (
        <div className='text-error text-sm mt-1'>{meta.error}</div>
      )}
    </div>
  );
};

const TextAreaField: React.FC<{ name: string; label: string }> = ({
  name,
  label,
}) => {
  const [field, meta] = useField<string>(name);
  return (
    <div>
      <label htmlFor={name} className='block font-semibold mb-1'>
        {label}
      </label>
      <textarea
        {...field}
        className='textarea textarea-bordered w-full min-h-[80px]'
        id={name}
      />
      {meta.touched && meta.error && (
        <div className='text-error text-sm mt-1'>{meta.error}</div>
      )}
    </div>
  );
};

export const Step1BasicInfo: React.FC = () => (
  <div className='space-y-4'>
    <TextField name='name' label='Name' />
    <TextAreaField name='description' label='Description' />
    <TextField name='price' label='Price' type='number' />
    {/* Status field has been removed; status is always 'DRAFT' */}
  </div>
);
