'use client';

import { Button } from '@app/components/button';
import { FieldArray, useField, useFormikContext } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { X } from 'react-feather';
import type { ProductCreateFormValues } from './../product-create-form';
import { getVariationCombinations } from './utils';

const VariationSkuField: React.FC<{ index: number }> = ({ index }) => {
  const [field, meta] = useField<string>(
    `variations.createMany.data.${index}.sku`,
  );
  return (
    <div>
      <input
        {...field}
        type='text'
        className='input input-bordered w-full'
        placeholder='Variation SKU'
        id={`variations.createMany.data.${index}.sku`}
      />
      {meta.touched && meta.error && (
        <div className='text-error text-sm mt-1'>{meta.error}</div>
      )}
    </div>
  );
};

const VariationPriceAdjustmentField: React.FC<{ index: number }> = ({
  index,
}) => {
  const [field, meta] = useField<number>(
    `variations.createMany.data.${index}.priceAdjustment`,
  );
  return (
    <div>
      <input
        {...field}
        type='number'
        step={0.01}
        className='input input-bordered w-full'
        placeholder='0.00'
        id={`variations.createMany.data.${index}.priceAdjustment`}
      />
      {meta.touched && meta.error && (
        <div className='text-error text-sm mt-1'>{meta.error}</div>
      )}
    </div>
  );
};

const VariationAvailableField: React.FC<{ index: number }> = ({ index }) => {
  const [field] = useField(`variations.createMany.data.${index}.available`);
  return (
    <input
      {...field}
      type='checkbox'
      className='toggle toggle-primary'
      id={`variations.createMany.data.${index}.available`}
    />
  );
};

const VariationStatusField: React.FC<{ index: number }> = ({ index }) => (
  <select
    name={`variations.createMany.data.${index}.status`}
    className='select select-bordered w-full'
    id={`variations.createMany.data.${index}.status`}
    value='DRAFT'
    disabled
    style={{ backgroundColor: '#f3f4f6' }}>
    <option value='DRAFT'>DRAFT</option>
  </select>
);

export const Step5Variations: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<ProductCreateFormValues>();
  const options = useMemo(
    () => values.options?.createMany?.data || [],
    [values],
  );
  const variations = values.variations?.createMany?.data || [];

  // Create a readable label for each variation using option indices.
  const getVariationName = useCallback(
    (optionValueIndices: number[]): string => {
      if (!options || options.length === 0) return 'N/A';
      return optionValueIndices
        .map((valueIndex, optIndex) => {
          const option = options[optIndex];
          if (!option?.values || valueIndex >= option.values.length) {
            return `ErrOptIdx:${optIndex},ValIdx:${valueIndex}`;
          }
          return option.values[valueIndex];
        })
        .join(' / ');
    },
    [options],
  );

  const allPossibleCombinations = useMemo(
    () => getVariationCombinations(options),
    [options],
  );

  const handleAutoGenerateVariations = async () => {
    const newVariations = allPossibleCombinations.map((indices: number[]) => ({
      sku: '',
      priceAdjustment: 0,
      available: true,
      status: 'DRAFT',
      optionValueIndices: indices,
    }));
    await setFieldValue('variations.createMany.data', newVariations);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold'>Product Variations</h3>
        {options.length > 0 &&
          options.every((opt) => opt.values.length > 0) && (
            <Button
              type='button'
              variant='outline'
              color='secondary'
              onClick={handleAutoGenerateVariations}
              disabled={allPossibleCombinations.length === 0}>
              Auto-generate Variations ({allPossibleCombinations.length}{' '}
              possible)
            </Button>
          )}
      </div>

      {options.length === 0 && (
        <p className='text-sm text-neutral-content'>
          Please add product options with values in Step 3 to create variations.
        </p>
      )}
      {options.length > 0 && !options.every((opt) => opt.values.length > 0) && (
        <p className='text-sm text-warning'>
          One or more options have no values. Please add values in Step 3 to
          enable variation generation.
        </p>
      )}
      {options.length > 0 &&
        options.every((opt) => opt.values.length > 0) &&
        allPossibleCombinations.length === 0 && (
          <p className='text-sm text-neutral-content'>
            No variation combinations could be generated. This is unexpected if
            options and values exist.
          </p>
        )}

      <FieldArray name='variations.createMany.data'>
        {({ remove }) => (
          <div className='space-y-4'>
            {variations.map((variation, index) => (
              <div key={index} className='card border bg-base-200 p-4'>
                <div className='flex justify-between items-center mb-3'>
                  <h4 className='font-semibold'>
                    Variation: {getVariationName(variation.optionValueIndices)}
                  </h4>
                  <Button
                    type='button'
                    variant='outline'
                    color='error'
                    size='sm'
                    onClick={() => remove(index)}
                    title='Remove variation'>
                    <X size={16} /> Remove
                  </Button>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor={`variations.createMany.data.${index}.sku`}
                      className='label'>
                      <span className='label-text'>SKU</span>
                    </label>
                    <VariationSkuField index={index} />
                  </div>
                  <div>
                    <label
                      htmlFor={`variations.createMany.data.${index}.priceAdjustment`}
                      className='label'>
                      <span className='label-text'>
                        Price Adjustment (e.g., -5 or +10)
                      </span>
                    </label>
                    <VariationPriceAdjustmentField index={index} />
                  </div>
                  <div className='form-control'>
                    <label className='label cursor-pointer'>
                      <span className='label-text font-semibold'>
                        Available
                      </span>
                      <VariationAvailableField index={index} />
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor={`variations.createMany.data.${index}.status`}
                      className='label'>
                      <span className='label-text'>Status</span>
                    </label>
                    <VariationStatusField index={index} />
                  </div>
                </div>
              </div>
            ))}
            {options.length > 0 &&
              options.every((opt) => opt.values.length > 0) &&
              variations.length === 0 &&
              allPossibleCombinations.length > 0 && (
                <p className='text-warning text-sm'>
                  No variations defined. You can auto-generate them.
                </p>
              )}
          </div>
        )}
      </FieldArray>
    </div>
  );
};
