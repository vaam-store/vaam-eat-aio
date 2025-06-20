'use client';

import { Button } from '@app/components/button';
import { FieldArray, useField, useFormikContext } from 'formik';
import React from 'react';
import { Plus, X } from 'react-feather';
import type { ProductCreateFormValues } from './../product-create-form';

const OptionNameField: React.FC<{ index: number }> = ({ index }) => {
  const [field, meta] = useField<string>(
    `options.createMany.data.${index}.name`,
  );
  return (
    <div>
      <input
        {...field}
        type='text'
        className='input input-bordered w-full'
        placeholder='Option Name'
        id={`options.createMany.data.${index}.name`}
      />
      {meta.touched && meta.error && (
        <div className='text-error text-sm mt-1'>{meta.error}</div>
      )}
    </div>
  );
};

const OptionValueField: React.FC<{
  optionIndex: number;
  valueIndex: number;
}> = ({ optionIndex, valueIndex }) => {
  const [field, meta] = useField<string>(
    `options.createMany.data.${optionIndex}.values.${valueIndex}`,
  );
  return (
    <div>
      <input
        {...field}
        type='text'
        className='input input-bordered flex-grow'
        placeholder={`Value ${valueIndex + 1}`}
        id={`options.createMany.data.${optionIndex}.values.${valueIndex}`}
      />
      {meta.touched && meta.error && (
        <div className='text-error text-sm mt-1'>{meta.error}</div>
      )}
    </div>
  );
};

const OptionValuesError: React.FC<{ optionIndex: number }> = ({
  optionIndex,
}) => {
  const [, meta] = useField<string[]>(
    `options.createMany.data.${optionIndex}.values`,
  );
  return meta.touched && meta.error ? (
    <div className='text-error text-sm mt-1'>{meta.error}</div>
  ) : null;
};

const OptionsError: React.FC = () => {
  const [, meta] = useField<string[]>('options.createMany.data');
  return meta.touched && meta.error ? (
    <div className='text-error text-sm mt-1'>{meta.error}</div>
  ) : null;
};

export const Step4Options: React.FC = () => {
  const { values } = useFormikContext<ProductCreateFormValues>();
  const options = values.options.createMany.data;

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold'>Product Options</h3>
      <FieldArray name='options.createMany.data'>
        {({ push, remove }) => (
          <div className='space-y-4'>
            {options.map((option, optionIndex) => (
              <div key={optionIndex} className='card border bg-base-200 p-4'>
                <div className='flex justify-between items-center mb-2'>
                  <h4 className='font-semibold'>Option {optionIndex + 1}</h4>
                  <Button
                    type='button'
                    variant='outline'
                    color='error'
                    size='sm'
                    onClick={() => remove(optionIndex)}
                    title='Remove option'>
                    <X size={16} /> Remove Option
                  </Button>
                </div>
                <div className='form-control mb-2'>
                  <label className='label'>
                    <span className='label-text'>
                      Option Name (e.g., Color, Size)
                    </span>
                  </label>
                  <OptionNameField index={optionIndex} />
                </div>
                <FieldArray
                  name={`options.createMany.data.${optionIndex}.values`}>
                  {({ push: pushValue, remove: removeValue }) => (
                    <div className='space-y-2'>
                      <label className='label'>
                        <span className='label-text'>Option Values</span>
                      </label>
                      {option.values.map((_value, valueIndex) => (
                        <div
                          key={valueIndex}
                          className='flex items-center space-x-2'>
                          <OptionValueField
                            optionIndex={optionIndex}
                            valueIndex={valueIndex}
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            color='error'
                            size='sm'
                            onClick={() => removeValue(valueIndex)}
                            title='Remove value'>
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                      <OptionValuesError optionIndex={optionIndex} />
                      <Button
                        type='button'
                        variant='outline'
                        color='primary'
                        size='sm'
                        onClick={() => pushValue('')}>
                        <Plus size={16} /> Add Value
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>
            ))}
            <Button
              type='button'
              variant='outline'
              color='primary'
              onClick={() => push({ name: '', values: [''] })}>
              <Plus size={16} /> Add Option
            </Button>
            <OptionsError />
          </div>
        )}
      </FieldArray>
    </div>
  );
};
