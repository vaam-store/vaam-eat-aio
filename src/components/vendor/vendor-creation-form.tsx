'use client';

import { Button } from '@app/components/button';
import {
  VendorContactsStep,
  VendorLocationsStep,
  VendorNameStep,
  VendorStepper,
} from '@app/components/vendor';
import type { Prisma } from '@zenstackhq/runtime/models';
import Decimal from 'decimal.js';
import { Form, Formik, type FormikHelpers } from 'formik';
import { useState } from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const contactInfoValidationSchema = z.object({
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z
    .array(z.string().trim().min(1, 'Phone number cannot be empty'))
    .min(1, 'At least one phone number is required'),
  name: z.string().trim().min(1, 'Contact person name is required'),
});

const contactValidationSchema = z.object({
  type: z.enum(['All', 'Sales', 'Support', 'Billing']),
  contactInfo: contactInfoValidationSchema,
});

// Custom Zod schema for Decimal.js numbers
// It attempts to convert any input to a Decimal instance.
// If the conversion fails, it adds a Zod issue.
const zDecimal = z
  .any()
  .transform((value, ctx) => {
    try {
      return new Decimal(value);
    } catch (e: any) {
      // If Decimal.js constructor throws an error, it's an invalid decimal value
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid decimal value: ${e}`,
      });
      return z.NEVER; // Signal to Zod that the transformation failed
    }
  })
  // After transformation, ensure the value is indeed an instance of Decimal
  .refine((val) => val instanceof Decimal, {
    message: 'Value must be a Decimal instance after validation.',
  });

const addressValidationSchema = z.object({
  street: z.string().optional(),
  city: z.string().min(1, 'City is required').optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  latitude: zDecimal.refine(
    (val) => {
      // Validate latitude range: -90 to 90
      return val.gte(-90) && val.lte(90);
    },
    { message: 'Latitude must be between -90 and 90' },
  ),
  // Use the custom zDecimal schema for longitude
  longitude: zDecimal.refine(
    (val) => {
      // Validate longitude range: -180 to 180
      return val.gte(-180) && val.lte(180);
    },
    { message: 'Longitude must be between -180 and 180' },
  ),
});

const locationValidationSchema = z.object({
  name: z.string().trim().min(1, 'Location name is required').default('Main'),
  address: addressValidationSchema,
});

const vendorCreationValidationSchema = z.object({
  name: z.string().min(1, 'Vendor name is required'),
  contacts: z.object({
    createMany: z.object({
      data: z
        .array(contactValidationSchema)
        .min(1, 'At least one contact is required'),
    }),
  }),
  locations: z.object({
    createMany: z.object({
      data: z
        .array(locationValidationSchema)
        .min(1, 'At least one location is required'),
    }),
  }),
});

export type VendorFormValues = z.infer<typeof vendorCreationValidationSchema>;

const getInitialValues = ({
  name,
  email,
}: Record<'name' | 'userId' | 'email', string>): VendorFormValues => ({
  name: '',
  contacts: {
    createMany: {
      data: [
        {
          type: 'All',
          contactInfo: {
            email: email,
            phone: [''],
            name: name,
          },
        },
      ],
    },
  },
  locations: {
    createMany: {
      data: [
        {
          name: 'Main',
          address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            latitude: Decimal(0),
            longitude: Decimal(0),
          },
        },
      ],
    },
  },
});

type VendorCreationFormProps = {
  onSubmit: (values: Prisma.VendorCreateInput) => Promise<void>;
  initialData: Record<'name' | 'userId' | 'email', string>;
};

export function VendorCreationForm({
  onSubmit,
  initialData,
}: VendorCreationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const formSteps = [
    {
      title: 'Vendor Name',
      component: <VendorNameStep />,
      validationSchema: vendorCreationValidationSchema.pick({ name: true }),
    },
    {
      title: 'Contacts',
      component: (
        <VendorContactsStep
          userId={initialData.userId}
          name={initialData.name}
          email={initialData.email}
        />
      ),
      validationSchema: vendorCreationValidationSchema.pick({ contacts: true }),
    },
    {
      title: 'Locations',
      component: <VendorLocationsStep />,
      validationSchema: vendorCreationValidationSchema.pick({
        locations: true,
      }),
    },
  ];

  const handleFormSubmit = async (
    values: VendorFormValues,
    actions: FormikHelpers<VendorFormValues>,
  ) => {
    await onSubmit(values);
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={getInitialValues(initialData)}
      validationSchema={toFormikValidationSchema(
        formSteps[currentStep]!.validationSchema as any,
      )}
      onSubmit={handleFormSubmit}
      enableReinitialize>
      {({ isSubmitting, handleSubmit, isValid, dirty, validateForm }) => (
        <Form
          onSubmit={handleSubmit}
          className='flex flex-col gap-6 md:flex-row'>
          <div className='md:w-1/3 lg:w-1/5'>
            <VendorStepper currentStep={currentStep} formSteps={formSteps} />
          </div>
          <div className='md:w-2/3 lg:w-4/5'>
            {formSteps[currentStep]?.component}

            <div className='mt-6 flex justify-between'>
              {currentStep > 0 && (
                <Button
                  type='button'
                  variant='outline'
                  color='primary'
                  onClick={() => setCurrentStep((prev) => prev - 1)}>
                  Previous
                </Button>
              )}
              {currentStep < formSteps.length - 1 && (
                <Button
                  type='button'
                  color='primary'
                  onClick={async () => {
                    const errors = await validateForm();
                    const currentStepSchema =
                      formSteps[currentStep]!.validationSchema;
                    const currentStepFields = Object.keys(
                      currentStepSchema.shape,
                    );
                    const hasErrorsInCurrentStep = currentStepFields.some(
                      (field) => errors[field as keyof VendorFormValues],
                    );

                    if (!hasErrorsInCurrentStep && isValid) {
                      setCurrentStep((prev) => prev + 1);
                    } else {
                      // Formik's validateForm will set touched fields,
                      // so errors will be displayed automatically.
                    }
                  }}>
                  Next
                </Button>
              )}
              {currentStep === formSteps.length - 1 && (
                <Button
                  type='submit'
                  color='primary'
                  disabled={isSubmitting || !isValid || !dirty}>
                  Create Vendor
                </Button>
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
