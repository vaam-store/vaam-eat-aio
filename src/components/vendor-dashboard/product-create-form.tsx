'use client';

import { Button } from '@app/components/button';
import { Form, Formik, type FormikHelpers } from 'formik';
import { nanoid } from 'nanoid';
import dynamic from 'next/dynamic';
import { Suspense, useMemo, useState } from 'react';
import { Home, Image, MapPin, Settings, Shuffle } from 'react-feather';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const Step1BasicInfo = dynamic(
  () => import('./product-create-form/step-1-basic-info'),
);
const Step2Media = dynamic(() => import('./product-create-form/step-2-media'));
const Step3PrimaryLocation = dynamic(
  () => import('./product-create-form/step-3-primary-location'),
);
const Step4Options = dynamic(
  () => import('./product-create-form/step-4-options'),
);
const Step5Variations = dynamic(
  () => import('./product-create-form/step-5-variations'),
);

// Zod schema for ProductImage
const productImageSchema = z.object({
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  altText: z.string().optional(),
});

const productCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price must be at least 0'),
  available: z.boolean().default(true),
  status: z.enum(['DRAFT']).default('DRAFT'),
  category: z.object({
    connect: z.object({
      id: z.string(),
    }),
  }),
  tags: z.object({
    connect: z.array(
      z.object({
        id: z.string(),
      }),
    ),
  }),
  images: z.object({
    createMany: z.object({
      data: z.array(productImageSchema),
    }),
  }),
  thumbnail: z.object({
    create: productImageSchema,
  }),
  options: z.object({
    createMany: z.object({
      data: z.array(
        z.object({
          name: z.string().min(1, 'Option name is required'),
          values: z
            .array(z.string().min(1, 'Option value is required'))
            .min(1, 'At least one option value is required'),
        }),
      ),
    }),
  }),
  variations: z.object({
    createMany: z.object({
      data: z.array(
        z.object({
          sku: z.string().min(1, 'SKU is required'),
          priceAdjustment: z
            .number({ invalid_type_error: 'Price adjustment must be a number' })
            .default(0),
          available: z.boolean().default(true),
          status: z.enum(['DRAFT']).default('DRAFT'),
          // optionValueIndices will store the index of the value selected for each option
          // e.g., for options: [{name: "Color", values: ["Red", "Blue"]}, {name: "Size", values: ["S", "M"]}]
          // a variation for "Red" and "S" would have optionValueIndices: [0, 0]
          optionValueIndices: z.array(
            z.number().int().min(0, 'Index must be non-negative'),
          ),
        }),
      ),
    }),
  }),
  primaryLocation: z.object({
    create: z.object({
      name: z.string(),
      address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        country: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      }),
    }),
  }),
});

export type ProductCreateFormValues = z.infer<typeof productCreateSchema>;

type ProductCreateFormProps = {
  onSubmit: (values: ProductCreateFormValues) => Promise<void> | void;
  vendorId: string;
};

const getInitialValues = (): ProductCreateFormValues => ({
  name: '',
  slug: nanoid(),
  description: '',
  price: 0,
  available: true,
  status: 'DRAFT',
  category: {
    connect: {
      id: '',
    },
  },
  primaryLocation: {
    create: {
      name: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        latitude: 0,
        longitude: 0,
      },
    },
  },
  tags: {
    connect: [],
  },
  images: {
    createMany: {
      data: [],
    },
  },
  thumbnail: {
    create: {
      url: '',
    },
  },
  options: {
    createMany: {
      data: [],
    },
  },
  variations: {
    createMany: {
      data: [],
    },
  },
});

const steps = [
  {
    Icon: Home,
    title: 'Start',
    component: <Step1BasicInfo />,
    validationSchema: productCreateSchema.pick({
      name: true,
      slug: true,
      description: true,
      price: true,
      available: true,
    }),
  },
  {
    Icon: Image,
    title: 'Categorization & Media',
    component: <Step2Media />,
    validationSchema: productCreateSchema.pick({
      category: true,
      tags: true,
      images: true,
      thumbnail: true,
    }),
  },
  {
    Icon: MapPin,
    title: 'Primary Location',
    component: <Step3PrimaryLocation />,
    validationSchema: productCreateSchema.pick({
      primaryLocation: true,
    }),
  },
  {
    Icon: Settings,
    title: 'Options',
    component: <Step4Options />,
    validationSchema: productCreateSchema.pick({
      options: true,
    }),
  },
  {
    Icon: Shuffle,
    title: 'Variations',
    component: <Step5Variations />,
    validationSchema: productCreateSchema
      .pick({
        variations: true,
        // We also need 'options' in the context of this step's validation for the refine function
        options: true,
      })
      .refine(
        (data) => {
          // If there are options and all options have at least one value, then variations array must not be empty.
          if (
            data.options &&
            Array.isArray(data.options?.createMany?.data) &&
            data.options.createMany.data.length > 0 &&
            data.options.createMany.data.every(
              (opt) => opt.values && opt.values.length > 0,
            )
          ) {
            return (
              Array.isArray(data.variations?.createMany?.data) &&
              data.variations.createMany.data.length > 0
            );
          }
          // If no options, or some options have no values, then variations are not strictly required at this stage.
          return true;
        },
        {
          message:
            'At least one variation is required if all defined options have values. Try auto-generating variations.',
          path: ['variations'], // Show the error under the variations field array
        },
      ),
  },
];

// TODO this form get reset from one step to the next one
export const ProductCreateForm: React.FC<ProductCreateFormProps> = ({
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepComponent = steps[currentStep]!.component;

  const handleFormSubmit = async (
    values: ProductCreateFormValues,
    actions: FormikHelpers<ProductCreateFormValues>,
  ) => {
    await onSubmit(values);
    actions.setSubmitting(false);
  };

  const initialValues = useMemo(getInitialValues, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(
        steps[currentStep]!.validationSchema as any,
      )}
      onSubmit={handleFormSubmit}
      enableReinitialize>
      {({
        isSubmitting,
        handleSubmit,
        isValid,
        dirty,
        validateForm,
        values,
        errors,
      }) => (
        <Form onSubmit={handleSubmit}>
          {/* Stepper Titles - Can be enhanced later */}
          <ul className='steps w-full mb-6'>
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={twMerge(
                  'step',
                  index <= currentStep && 'step-primary',
                )}>
                <span className='step-icon'>
                  <step.Icon
                    className={twMerge(
                      index <= currentStep && 'text-primary-content',
                      index > currentStep && 'text-base-content opacity-50',
                    )}
                  />
                </span>
                <span className='hidden md:block'>{step.title}</span>
              </li>
            ))}
          </ul>

          <Suspense
            fallback={
              <>
                <div className='loading loading-lg' />
              </>
            }>
            {currentStepComponent}
          </Suspense>

          <div className='mt-6 flex justify-between pt-4'>
            {currentStep > 0 && (
              <Button
                type='button'
                variant='outline'
                color='primary'
                onClick={() => setCurrentStep((prev) => prev - 1)}>
                Previous
              </Button>
            )}
            <div />
            {/* Spacer */}
            {currentStep < steps.length - 1 && (
              <Button
                type='button'
                color='primary'
                onClick={async () => {
                  const errors = await validateForm();
                  const currentStepSchema =
                    steps[currentStep]!.validationSchema;
                  const currentStepFields = Object.keys(
                    (currentStepSchema as z.ZodObject<any, any>).shape,
                  );
                  const hasErrorsInCurrentStep = currentStepFields.some(
                    (field) => errors[field as keyof ProductCreateFormValues],
                  );

                  if (!hasErrorsInCurrentStep && isValid) {
                    // Check if current step fields are valid
                    setCurrentStep((prev) => prev + 1);
                  }
                }}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                type='submit'
                color='primary'
                disabled={isSubmitting || !isValid || !dirty}>
                Create Product
              </Button>
            )}
          </div>

          <pre className='bg-base-200 mt-8 p-2 h-80 rounded-xl overflow-scroll'>
            {JSON.stringify({ values, errors, dirty }, null, 2)}
          </pre>
        </Form>
      )}
    </Formik>
  );
};
