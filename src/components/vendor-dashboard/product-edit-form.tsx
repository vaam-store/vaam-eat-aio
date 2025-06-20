'use client';

import { useCategories } from '@app/hooks/use-categories';
import { useTags } from '@app/hooks/use-tags';
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  type FormikHelpers,
} from 'formik';
import { Plus, X } from 'react-feather';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

// Define Zod schema for ProductImage
const productImageSchema = z.object({
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  altText: z.string().optional(),
});

// Define Zod schema for Product
const productEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price must be at least 0'),
  available: z.boolean(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()),
  images: z.array(productImageSchema).optional(),
  thumbnail: z.string().url('Invalid URL').optional().nullable(),
});

export type ProductEditFormValues = z.infer<typeof productEditSchema>;

type ProductEditFormProps = {
  initialValues: ProductEditFormValues;
  onSubmit: (values: ProductEditFormValues) => void | Promise<void>;
};

const ProductEditForm: React.FC<ProductEditFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  const { categories } = useCategories();
  const { tags } = useTags();

  return (
    <div className='card border bg-base-100 max-w-xl mx-auto'>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(productEditSchema)}
        onSubmit={async (
          values,
          actions: FormikHelpers<ProductEditFormValues>,
        ) => {
          await onSubmit(values);
          actions.setSubmitting(false);
        }}
        enableReinitialize>
        {({ isSubmitting, errors, touched, values, setFieldValue }) => (
          <Form className='card-body space-y-4'>
            <div>
              <label htmlFor='name' className='block font-semibold mb-1'>
                Name
              </label>
              <Field
                name='name'
                type='text'
                className={`input input-bordered w-full ${
                  touched.name && errors.name ? 'input-error' : ''
                }`}
                autoComplete='off'
                id='name'
              />
              <ErrorMessage
                name='name'
                component='div'
                className='text-error text-sm mt-1'
              />
            </div>

            <div>
              <label htmlFor='slug' className='block font-semibold mb-1'>
                Slug
              </label>
              <Field
                name='slug'
                type='text'
                className={`input input-bordered w-full ${
                  touched.slug && errors.slug ? 'input-error' : ''
                }`}
                autoComplete='off'
                id='slug'
              />
              <ErrorMessage
                name='slug'
                component='div'
                className='text-error text-sm mt-1'
              />
            </div>

            <div>
              <label htmlFor='description' className='block font-semibold mb-1'>
                Description
              </label>
              <Field
                as='textarea'
                name='description'
                className={`textarea textarea-bordered w-full min-h-[80px] ${
                  touched.description && errors.description
                    ? 'textarea-error'
                    : ''
                }`}
                autoComplete='off'
                id='description'
              />
              <ErrorMessage
                name='description'
                component='div'
                className='text-error text-sm mt-1'
              />
            </div>

            <div>
              <label htmlFor='price' className='block font-semibold mb-1'>
                Price
              </label>
              <Field
                name='price'
                type='number'
                min='0'
                step='0.01'
                className={`input input-bordered w-full ${
                  touched.price && errors.price ? 'input-error' : ''
                }`}
                autoComplete='off'
                id='price'
              />
              <ErrorMessage
                name='price'
                component='div'
                className='text-error text-sm mt-1'
              />
            </div>

            <div className='form-control'>
              <label className='label cursor-pointer'>
                <span className='label-text font-semibold'>Available</span>
                <Field
                  name='available'
                  type='checkbox'
                  className='toggle toggle-primary'
                />
              </label>
            </div>

            <div>
              <label htmlFor='categoryId' className='block font-semibold mb-1'>
                Category
              </label>
              <Field
                as='select'
                name='categoryId'
                className={`select select-bordered w-full ${
                  touched.categoryId && errors.categoryId ? 'select-error' : ''
                }`}
                id='categoryId'>
                <option value=''>Select a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name='categoryId'
                component='div'
                className='text-error text-sm mt-1'
              />
            </div>

            <div>
              <label htmlFor='tags' className='block font-semibold mb-1'>
                Tags
              </label>
              <Field
                name='tags'
                as='select'
                multiple
                className={`select select-bordered w-full h-32 ${
                  touched.tags && errors.tags ? 'select-error' : ''
                }`}
                id='tags'
                value={values.tags}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  );
                  setFieldValue('tags', selectedOptions);
                }}>
                {tags?.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name='tags'
                component='div'
                className='text-error text-sm mt-1'
              />
            </div>

            <div>
              <label className='block font-semibold mb-1'>Images</label>
              <FieldArray name='images'>
                {({ push, remove }) => (
                  <div className='space-y-2'>
                    {values.images?.map((image, index) => (
                      <div key={index} className='flex items-center space-x-2'>
                        <div className='flex-grow'>
                          <Field
                            name={`images.${index}.url`}
                            type='text'
                            placeholder='Image URL'
                            className={`input input-bordered w-full ${
                              touched.images &&
                              Array.isArray(touched.images) &&
                              touched.images[index] &&
                              (errors.images as any)?.[index]?.url
                                ? 'input-error'
                                : ''
                            }`}
                          />
                          <ErrorMessage
                            name={`images.${index}.url`}
                            component='div'
                            className='text-error text-sm mt-1'
                          />
                          <Field
                            name={`images.${index}.altText`}
                            type='text'
                            placeholder='Alt Text (optional)'
                            className='input input-bordered w-full mt-1'
                          />
                        </div>
                        <button
                          type='button'
                          onClick={() => remove(index)}
                          className='btn btn-square btn-outline btn-error'
                          title='Remove image'>
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                    <button
                      type='button'
                      onClick={() => push({ url: '', altText: '' })}
                      className='btn btn-outline btn-primary btn-sm'>
                      <Plus size={16} /> Add Image
                    </button>
                  </div>
                )}
              </FieldArray>
              {touched.images && typeof errors.images === 'string' && (
                <div className='text-error text-sm mt-1'>{errors.images}</div>
              )}
            </div>

            <div>
              <label htmlFor='thumbnail' className='block font-semibold mb-1'>
                Thumbnail
              </label>
              <Field
                as='select'
                name='thumbnail'
                className={`select select-bordered w-full ${
                  touched.thumbnail && errors.thumbnail ? 'select-error' : ''
                }`}
                id='thumbnail'>
                <option value=''>Select a thumbnail image</option>
                {values.images?.map(
                  (image, index) =>
                    image.url && (
                      <option key={index} value={image.url}>
                        {image.url} {image.altText ? `(${image.altText})` : ''}
                      </option>
                    ),
                )}
              </Field>
              <ErrorMessage
                name='thumbnail'
                component='div'
                className='text-error text-sm mt-1'
              />
            </div>

            <div className='pt-2'>
              <button
                type='submit'
                className='btn btn-primary w-full'
                disabled={isSubmitting}>
                Save Changes
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductEditForm;
