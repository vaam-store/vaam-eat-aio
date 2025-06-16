'use client';

import { Button } from '@app/components/button';
import {
  VendorContactsStep,
  VendorLocationsStep,
  VendorNameStep,
  VendorStepper,
} from '@app/components/vendor';
import { type Prisma } from '@prisma/client';
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
  createdById: z.string().min(1, 'User ID is required for contact'),
});

const addressValidationSchema = z.object({
  street: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  latitude: z.coerce.number({
    required_error: 'Latitude is required',
    invalid_type_error: 'Latitude must be a number',
  }),
  longitude: z.coerce.number({
    required_error: 'Longitude is required',
    invalid_type_error: 'Longitude must be a number',
  }),
});

const locationValidationSchema = z.object({
  name: z.string().trim().min(1, 'Location name is required').default('Main'),
  address: addressValidationSchema,
  createdById: z.string().min(1, 'User ID is required for location'),
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
  userId,
  name,
}: Record<'name' | 'userId', string>): VendorFormValues => ({
  name: '',
  contacts: {
    createMany: {
      data: [
        {
          type: 'All',
          contactInfo: {
            email: '',
            phone: [''],
            name: name,
          },
          createdById: userId,
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
            latitude: 0,
            longitude: 0,
          },
          createdById: userId,
        },
      ],
    },
  },
});

type VendorCreationFormProps = {
  onSubmit: (values: Prisma.VendorCreateInput) => Promise<void>;
  initialData: Record<'name' | 'userId', string>;
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
        />
      ),
      validationSchema: vendorCreationValidationSchema.pick({ contacts: true }),
    },
    {
      title: 'Locations',
      component: <VendorLocationsStep userId={initialData.userId} />,
      validationSchema: vendorCreationValidationSchema.pick({
        locations: true,
      }),
    },
  ];

  const handleFormSubmit = async (
    values: VendorFormValues,
    actions: FormikHelpers<VendorFormValues>,
  ) => {
    const vendorData: Prisma.VendorCreateInput = {
      name: values.name,
      contacts: {
        createMany: {
          data: values.contacts.createMany.data.map((contact) => ({
            type: contact.type,
            contactInfo: contact.contactInfo,
            createdById: contact.createdById,
          })),
        },
      },
      locations: {
        createMany: {
          data: values.locations.createMany.data.map((loc) => ({
            name: loc.name,
            address: loc.address,
            createdById: loc.createdById,
          })),
        },
      },
    };
    await onSubmit(vendorData);
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
      {({
        isSubmitting,
        handleSubmit,
        isValid,
        dirty,
        validateForm,
        values,
        errors,
      }) => (
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

          <pre className='overflow-x'>
            {JSON.stringify({ values, dirty, isValid, errors }, null, 4)}
          </pre>
        </Form>
      )}
    </Formik>
  );
}
