'use client';

import { useCategories } from '@app/hooks/use-categories';
import { useTags } from '@app/hooks/use-tags';
import { FieldArray, useField, useFormikContext } from 'formik';
import React from 'react';
import { Plus, X } from 'react-feather';
import type { ProductCreateFormValues } from './../product-create-form';

// Generic Select Field
const SelectField: React.FC<{
  name: string;
  label: string;
  options: { value: string; label: string }[];
  multiple?: boolean;
  value?: string | string[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string | undefined;
}> = ({ name, label, options, multiple, value, onChange, error }) => (
  <div>
    <label htmlFor={name} className='block font-semibold mb-1'>
      {label}
    </label>
    <select
      name={name}
      id={name}
      className='select select-bordered w-full'
      multiple={multiple}
      value={value}
      onChange={onChange}>
      {!multiple && <option value=''>Select an option</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error ? <div className='text-error text-sm mt-1'>{error}</div> : null}
  </div>
);

// Category Field
const CategoryField: React.FC = () => {
  const { categories } = useCategories();
  const [field, meta] = useField<string>('category.connect.id');
  return (
    <SelectField
      name='category.connect.id'
      label='Category'
      options={categories?.map((c) => ({ value: c.id, label: c.name })) || []}
      value={field.value}
      onChange={field.onChange}
      error={meta.touched && meta.error ? meta.error : undefined}
    />
  );
};

// Tags Field (multi-select)
const TagsField: React.FC = () => {
  const { tags } = useTags();
  const [field, , helpers] = useField<{ id: string }[]>('tags.connect');
  const selectedIds = field.value?.map((tag) => tag.id) || [];
  return (
    <SelectField
      name='tags.connect'
      label='Tags'
      options={tags?.map((t) => ({ value: t.id, label: t.name })) || []}
      multiple
      value={selectedIds}
      onChange={(e) => {
        const selectedOptions = Array.from(
          e.target.selectedOptions,
          (option) => ({ id: option.value }),
        );
        helpers.setValue(selectedOptions);
      }}
    />
  );
};

// Image Input Field
const ImageField: React.FC<{ index: number }> = ({ index }) => {
  const [urlField, urlMeta] = useField<string>(
    `images.createMany.data.${index}.url`,
  );
  const [altField, altMeta] = useField<string>(
    `images.createMany.data.${index}.altText`,
  );
  const [thumbnailProductIdField] = useField<string>(
    `images.createMany.data.${index}.thumbnailProductId`,
  );
  return (
    <>
      <input
        {...urlField}
        type='text'
        placeholder='Image URL'
        className='input input-bordered w-full'
      />
      {urlMeta.touched && urlMeta.error && (
        <div className='text-error text-sm mt-1'>{urlMeta.error}</div>
      )}
      <input
        {...altField}
        type='text'
        placeholder='Alt Text (optional)'
        className='input input-bordered w-full mt-1'
      />
      {altMeta.touched && altMeta.error && (
        <div className='text-error text-sm mt-1'>{altMeta.error}</div>
      )}
      {/* Hidden field to ensure thumbnailProductId is always present */}
      <input type='hidden' {...thumbnailProductIdField} />
    </>
  );
};

// Images FieldArray block
const ImagesField: React.FC = () => {
  const { values } = useFormikContext<ProductCreateFormValues>();
  const images = values.images?.createMany?.data || [];
  return (
    <div>
      <label className='block font-semibold mb-1'>Images</label>
      <FieldArray name='images.createMany.data'>
        {({ push, remove }) => (
          <div className='space-y-2'>
            {images.map((_image, idx) => (
              <div key={idx} className='flex items-center space-x-2'>
                <div className='flex-grow'>
                  <ImageField index={idx} />
                </div>
                <button
                  type='button'
                  onClick={() => remove(idx)}
                  className='btn btn-square btn-outline btn-error'
                  title='Remove image'>
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={() =>
                push({ url: '', altText: '', thumbnailProductId: '' })
              }
              className='btn btn-outline btn-primary btn-sm'>
              <Plus size={16} /> Add Image
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

// Thumbnail Field
const ThumbnailField: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<ProductCreateFormValues>();
  const images = values.images?.createMany?.data || [];
  const [field] = useField<any>('thumbnail.create');
  return (
    <SelectField
      name='thumbnail.create.url'
      label='Thumbnail'
      options={images
        .filter((img) => img.url)
        .map((img) => ({
          value: img.url,
          label: img.altText ? `${img.url} (${img.altText})` : img.url,
        }))}
      value={field.value?.url ?? ''}
      onChange={async (e) => {
        const selectedUrl = e.target.value;
        const selectedImage = images.find((img) => img.url === selectedUrl);
        await setFieldValue('thumbnail.create', {
          url: selectedImage?.url ?? '',
          altText: selectedImage?.altText ?? '',
        });
        images.forEach((img, idx) => {
          setFieldValue(
            `images.createMany.data.${idx}.thumbnailProductId`,
            img.url === selectedUrl ? 'THUMBNAIL' : '',
          );
        });
      }}
    />
  );
};

export const Step2Media: React.FC = () => (
  <div className='space-y-4'>
    <CategoryField />
    <TagsField />
    <ImagesField />
    <ThumbnailField />
  </div>
);
