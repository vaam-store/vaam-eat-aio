'use client';

import { ErrorMessage, Field } from 'formik';
import React, { useId } from 'react';

const TextField: React.FC<{ name: string; label: string; type?: string }> = ({
  name,
  label,
  type = 'text',
}) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={name} className='block font-semibold mb-1'>
        {label}
      </label>
      <Field
        id={id}
        name={name}
        type={type}
        className='input input-bordered w-full'
        autoFocus
      />
      <ErrorMessage
        name={name}
        component='div'
        className='text-error mt-1 text-xs'
      />
    </div>
  );
};

const TextAreaField: React.FC<{ name: string; label: string }> = ({
  name,
  label,
}) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={name} className='block font-semibold mb-1'>
        {label}
      </label>
      <Field
        as='textarea'
        id={id}
        name={name}
        className='textarea textarea-bordered w-full min-h-[80px]'
        autoFocus
      />
      <ErrorMessage
        name={name}
        component='div'
        className='text-error mt-1 text-xs'
      />
    </div>
  );
};

const Step1BasicInfo: React.FC = () => (
  <div className='space-y-4'>
    <TextField name='name' label='Name' />
    <TextAreaField name='description' label='Description' />
    <TextField name='price' label='Price' type='number' />
  </div>
);

export default Step1BasicInfo;
