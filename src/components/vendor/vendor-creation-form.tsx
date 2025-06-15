"use client";

import { useState } from "react"; // Added useState
import { type Prisma } from "@prisma/client";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldArray,
  type FormikHelpers,
  useFormikContext,
  getIn,
} from "formik";
import type {
  FormikValues,
  FieldArrayRenderProps,
  FormikHandlers,
  FormikState,
} from "formik";
import { z } from "zod";
import { Button } from "@app/components/button";
import { PlusCircle, XCircle } from "react-feather";
import React from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Text } from "@app/components/text";

const contactInfoValidationSchema = z.object({
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .array(z.string().trim().min(1, "Phone number cannot be empty"))
    .min(1, "At least one phone number is required"),
  name: z.string().trim().min(1, "Contact person name is required"),
});

const contactValidationSchema = z.object({
  type: z.enum(["All", "Sales", "Support", "Billing"]),
  contactInfo: contactInfoValidationSchema,
  createdById: z.string().min(1, "User ID is required for contact"),
});

const addressValidationSchema = z.object({
  street: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  latitude: z.coerce.number({
    required_error: "Latitude is required",
    invalid_type_error: "Latitude must be a number",
  }),
  longitude: z.coerce.number({
    required_error: "Longitude is required",
    invalid_type_error: "Longitude must be a number",
  }),
});

const locationValidationSchema = z.object({
  name: z.string().trim().min(1, "Location name is required").default("Main"),
  address: addressValidationSchema,
  createdById: z.string().min(1, "User ID is required for location"),
});

const vendorCreationValidationSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  contacts: z.object({
    createMany: z.object({
      data: z
        .array(contactValidationSchema)
        .min(1, "At least one contact is required"),
    }),
  }),
  locations: z.object({
    createMany: z.object({
      data: z
        .array(locationValidationSchema)
        .min(1, "At least one location is required"),
    }),
  }),
});

type VendorFormValues = z.infer<typeof vendorCreationValidationSchema>;

// const initialValues: VendorFormValues = { // This was incorrect and is replaced by getInitialValues
//   name: "",
// };

// Function to create initial values dynamically based on userId
const getInitialValues = (userId: string): VendorFormValues => ({
  name: "",
  contacts: {
    createMany: {
      data: [
        {
          type: "All",
          contactInfo: {
            email: "",
            phone: [""],
            name: "",
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
          name: "Main",
          address: {
            street: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            latitude: 0,
            longitude: 0,
          },
          createdById: userId,
        },
      ],
    },
  },
});

// --- Helper Components Start ---

const VendorNameInput = () => {
  return (
    <div>
      <label htmlFor="name" className="label">
        <span className="label-text">Vendor Name</span>
      </label>
      <Field
        id="name"
        name="name"
        type="text"
        className="input input-bordered w-full"
        autoFocus
      />
      <ErrorMessage
        name="name"
        component="div"
        className="text-error mt-1 text-xs"
      />
    </div>
  );
};

interface PhoneNumberInputProps {
  baseFieldPath: string;
  phoneIndex: number;
  removePhone: (index: number) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  baseFieldPath,
  phoneIndex,
  removePhone,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Field
        name={`${baseFieldPath}.${phoneIndex}`}
        type="text"
        className="input input-bordered w-full"
      />
      <Button
        type="button"
        shape="circle"
        variant="soft"
        color="error"
        size="sm"
        onClick={() => removePhone(phoneIndex)}
        aria-label="Remove phone number"
      >
        <XCircle size={16} />
      </Button>
    </div>
  );
};

interface PhoneNumberArrayProps {
  contactIndex: number;
}

const PhoneNumberArray: React.FC<PhoneNumberArrayProps> = ({
  contactIndex,
}) => {
  const { values } = useFormikContext<VendorFormValues>();
  const phonePath = `contacts.createMany.data.${contactIndex}.contactInfo.phone`;
  const contactItem = getIn(values, `contacts.createMany.data.${contactIndex}`);
  const phones = getIn(contactItem, "contactInfo.phone") || [];

  return (
    <div>
      <label className="label">
        <span className="label-text">Phone Numbers</span>
      </label>
      <FieldArray name={phonePath}>
        {({ remove: removePhone, push: pushPhone }: FieldArrayRenderProps) => (
          <div className="space-y-2">
            {phones.map((_phoneNumber: string, phoneIndex: number) => (
              <PhoneNumberInput
                key={phoneIndex}
                baseFieldPath={phonePath}
                phoneIndex={phoneIndex}
                removePhone={removePhone}
              />
            ))}
            <ErrorMessage
              name={phonePath}
              component="div"
              className="text-error mt-1 text-xs"
            />
            <Button
              type="button"
              shape="circle"
              variant="soft"
              color="primary"
              size="sm"
              className="mt-1"
              onClick={() => pushPhone("")}
              aria-label="Add phone number"
            >
              <PlusCircle size={16} />
            </Button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

interface ContactInfoFieldsProps {
  contactIndex: number;
}

const ContactInfoFields: React.FC<ContactInfoFieldsProps> = ({
  contactIndex,
}) => {
  const namePath = `contacts.createMany.data.${contactIndex}.contactInfo.name`;
  const emailPath = `contacts.createMany.data.${contactIndex}.contactInfo.email`;

  return (
    <div className="space-y-3">
      <h4 className="label-text font-medium">Contact Details</h4>
      <div>
        <label htmlFor={namePath} className="label">
          <span className="label-text">Contact Person Name</span>
        </label>
        <Field
          id={namePath}
          name={namePath}
          type="text"
          className="input input-bordered w-full"
        />
        <ErrorMessage
          name={namePath}
          component="div"
          className="text-error mt-1 text-xs"
        />
      </div>
      <div>
        <label htmlFor={emailPath} className="label">
          <span className="label-text">Email Address</span>
        </label>
        <Field
          id={emailPath}
          name={emailPath}
          type="email"
          className="input input-bordered w-full"
        />
        <ErrorMessage
          name={emailPath}
          component="div"
          className="text-error mt-1 text-xs"
        />
      </div>
      <PhoneNumberArray contactIndex={contactIndex} />
    </div>
  );
};

interface ContactItemProps {
  index: number;
  remove: (index: number) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ index, remove }) => {
  const typePath = `contacts.createMany.data.${index}.type`;

  return (
    <div className="card card-border">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <Text bold>Contact #{index + 1}</Text>
          <Button
            type="button"
            shape="circle"
            variant="soft"
            color="error"
            size="sm"
            onClick={() => remove(index)}
            aria-label="Remove contact"
          >
            <XCircle size={18} />
          </Button>
        </div>
        <div>
          <label htmlFor={typePath} className="label">
            <span className="label-text">Contact Type</span>
          </label>
          <Field
            as="select"
            id={typePath}
            name={typePath}
            className="select select-bordered w-full"
          >
            <option value="All">All</option>
            <option value="Sales">Sales</option>
            <option value="Support">Support</option>
            <option value="Billing">Billing</option>
          </Field>
          <ErrorMessage
            name={typePath}
            component="div"
            className="text-error mt-1 text-xs"
          />
        </div>
        <ContactInfoFields contactIndex={index} />
      </div>
    </div>
  );
};

interface ContactSectionProps {
  userId: string;
}
const ContactSection: React.FC<ContactSectionProps> = ({ userId }) => {
  const { values, errors, touched } = useFormikContext<VendorFormValues>();
  return (
    <>
      <h2 className="mb-1 text-xl font-semibold">Vendor Contacts</h2>
      <p className="text-base-content mb-4 text-sm opacity-70">
        Manage vendor contact information.
      </p>
      <FieldArray name="contacts.createMany.data">
        {({ remove, push }: FieldArrayRenderProps) => (
          <div className="space-y-4">
            {values.contacts.createMany.data.map((_contactItem, index) => (
              <ContactItem key={index} index={index} remove={remove} />
            ))}
            <Button
              type="button"
              variant="outline"
              color="primary"
              className="mt-2"
              onClick={() =>
                push({
                  type: "All",
                  contactInfo: { email: "", phone: [""], name: "" },
                  createdById: userId,
                })
              }
              aria-label="Add contact"
            >
              <PlusCircle size={18} className="mr-2" /> Add Contact
            </Button>
            {(() => {
              const contactDataError = getIn(
                errors,
                "contacts.createMany.data",
              );
              const contactDataTouched = getIn(
                touched,
                "contacts.createMany.data",
              );
              if (contactDataTouched && typeof contactDataError === "string") {
                return (
                  <ErrorMessage
                    name="contacts.createMany.data"
                    component="div"
                    className="text-error mt-1 text-xs"
                  />
                );
              }

              return null;
            })()}
          </div>
        )}
      </FieldArray>
    </>
  );
};

interface AddressFieldsProps {
  locationIndex: number;
}

const AddressFields: React.FC<AddressFieldsProps> = ({ locationIndex }) => {
  const basePath = `locations.createMany.data.${locationIndex}.address`;
  return (
    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label htmlFor={`${basePath}.street`} className="label">
          <span className="label-text">Street Address</span>
        </label>
        <Field
          id={`${basePath}.street`}
          name={`${basePath}.street`}
          type="text"
          className="input input-bordered w-full"
        />
        <ErrorMessage
          name={`${basePath}.street`}
          component="div"
          className="text-error mt-1 text-xs"
        />
      </div>
      <div>
        <label htmlFor={`${basePath}.city`} className="label">
          <span className="label-text">City</span>
        </label>
        <Field
          id={`${basePath}.city`}
          name={`${basePath}.city`}
          type="text"
          className="input input-bordered w-full"
        />
        <ErrorMessage
          name={`${basePath}.city`}
          component="div"
          className="text-error mt-1 text-xs"
        />
      </div>
      <div>
        <label htmlFor={`${basePath}.state`} className="label">
          <span className="label-text">State/Province</span>
        </label>
        <Field
          id={`${basePath}.state`}
          name={`${basePath}.state`}
          type="text"
          className="input input-bordered w-full"
        />
        <ErrorMessage
          name={`${basePath}.state`}
          component="div"
          className="text-error mt-1 text-xs"
        />
      </div>
      <div>
        <label htmlFor={`${basePath}.zip`} className="label">
          <span className="label-text">ZIP/Postal Code</span>
        </label>
        <Field
          id={`${basePath}.zip`}
          name={`${basePath}.zip`}
          type="text"
          className="input input-bordered w-full"
        />
        <ErrorMessage
          name={`${basePath}.zip`}
          component="div"
          className="text-error mt-1 text-xs"
        />
      </div>
      <div>
        <label htmlFor={`${basePath}.country`} className="label">
          <span className="label-text">Country</span>
        </label>
        <Field
          id={`${basePath}.country`}
          name={`${basePath}.country`}
          type="text"
          className="input input-bordered w-full"
        />
        <ErrorMessage
          name={`${basePath}.country`}
          component="div"
          className="text-error mt-1 text-xs"
        />
      </div>
      <div>
        <label htmlFor={`${basePath}.latitude`} className="label">
          <span className="label-text">Latitude</span>
        </label>
        <Field
          id={`${basePath}.latitude`}
          name={`${basePath}.latitude`}
          type="number"
          className="input input-bordered w-full"
        />
        <ErrorMessage
          name={`${basePath}.latitude`}
          component="div"
          className="text-error mt-1 text-xs"
        />
      </div>
      <div>
        <label htmlFor={`${basePath}.longitude`} className="label">
          <span className="label-text">Longitude</span>
        </label>
        <Field
          id={`${basePath}.longitude`}
          name={`${basePath}.longitude`}
          type="number"
          className="input input-bordered w-full"
        />
        <ErrorMessage
          name={`${basePath}.longitude`}
          component="div"
          className="text-error mt-1 text-xs"
        />
      </div>
    </div>
  );
};

interface LocationItemProps {
  index: number;
  remove: (index: number) => void;
}

const LocationItem: React.FC<LocationItemProps> = ({ index, remove }) => {
  const namePath = `locations.createMany.data.${index}.name`;
  return (
    <div className="border-base-300 space-y-3 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <Text bold>Location #{index + 1}</Text>
        <Button
          type="button"
          shape="circle"
          variant="soft"
          color="error"
          size="sm"
          onClick={() => remove(index)}
          aria-label="Remove location"
        >
          <XCircle size={18} />
        </Button>
      </div>
      <div>
        <label htmlFor={namePath} className="label">
          <span className="label-text">
            Location Name (e.g., Main Office, Downtown Branch)
          </span>
        </label>
        <Field
          id={namePath}
          name={namePath}
          type="text"
          className="input input-bordered w-full"
        />
        <ErrorMessage
          name={namePath}
          component="div"
          className="text-error mt-1 text-xs"
        />
      </div>
      <AddressFields locationIndex={index} />
    </div>
  );
};

interface LocationSectionProps {
  userId: string;
}

const LocationSection: React.FC<LocationSectionProps> = ({ userId }) => {
  const { values, errors, touched } = useFormikContext<VendorFormValues>();
  return (
    <>
      <h2 className="mb-1 text-xl font-semibold">Vendor Locations</h2>
      <p className="text-base-content mb-4 text-sm opacity-70">
        Manage vendor office or store locations.
      </p>
      <FieldArray name="locations.createMany.data">
        {({ remove, push }: FieldArrayRenderProps) => (
          <div className="space-y-4">
            {values.locations.createMany.data.map((_locationItem, index) => (
              <LocationItem key={index} index={index} remove={remove} />
            ))}
            <Button
              type="button"
              variant="outline"
              color="primary"
              className="mt-2"
              onClick={() =>
                push({
                  name: "Main",
                  address: {
                    street: "",
                    city: "",
                    state: "",
                    zip: "",
                    country: "",
                    latitude: 0,
                    longitude: 0,
                  },
                  createdById: userId,
                })
              }
              aria-label="Add location"
            >
              <PlusCircle size={18} className="mr-2" /> Add Location
            </Button>
            {(() => {
              const locationDataError = getIn(
                errors,
                "locations.createMany.data",
              );
              const locationDataTouched = getIn(
                touched,
                "locations.createMany.data",
              );
              if (
                locationDataTouched &&
                typeof locationDataError === "string"
              ) {
                return (
                  <ErrorMessage
                    name="locations.createMany.data"
                    component="div"
                    className="text-error mt-1 text-xs"
                  />
                );
              }

              return null;
            })()}
          </div>
        )}
      </FieldArray>
    </>
  );
};

// --- Helper Components End ---
type VendorCreationFormProps = {
  onSubmit: (values: Prisma.VendorCreateInput) => Promise<void>;
  userId: string; // Add userId as a required prop
};

export function VendorCreationForm({
  onSubmit,
  userId,
}: VendorCreationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const formSteps = ["Vendor Info", "Contacts", "Locations", "Submit"];

  const handleFormSubmit = async (
    values: VendorFormValues,
    { setSubmitting }: FormikHelpers<VendorFormValues>,
  ) => {
    const submissionValues: Prisma.VendorCreateInput = {
      ...values,
      // createdById for the Vendor itself might be handled by the parent onSubmit or backend
      // Or it could be added here if the Vendor model also requires it directly from the form's perspective
      // For now, focusing on nested createdById as per the error
      contacts: {
        createMany: {
          data: values.contacts.createMany.data.map((contact) => ({
            ...contact,
            createdById: userId, // Ensure userId is correctly passed
          })),
        },
      },
      locations: {
        createMany: {
          data: values.locations.createMany.data.map((loc) => ({
            ...loc,
            address: {
              ...loc.address,
              latitude: Number(loc.address.latitude),
              longitude: Number(loc.address.longitude),
            },
            createdById: userId, // Ensure userId is correctly passed
          })),
        },
      },
    };
    await onSubmit(submissionValues);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={getInitialValues(userId)}
      validationSchema={toFormikValidationSchema(
        vendorCreationValidationSchema,
      )}
      onSubmit={handleFormSubmit}
      enableReinitialize // Important if userId prop could change, though unlikely for this form
    >
      {({
        values,
        isSubmitting,
        // errors, // Not explicitly used, ErrorMessage component handles this
        // touched, // Not explicitly used, ErrorMessage component handles this
        // handleChange, // Handled by Field component
        // handleBlur, // Handled by Field component
        handleSubmit, // Used for the Form's onSubmit
      }: FormikState<VendorFormValues> &
        FormikHandlers & {
          values: VendorFormValues;
          isSubmitting: boolean;
        }) => (
        <Form onSubmit={handleSubmit} className="space-y-6">
          <ul className="steps mb-8 w-full">
            {formSteps.map((step, index) => (
              <li
                key={step}
                className={`step ${index <= currentStep ? "step-primary" : ""}`}
              >
                {step}
              </li>
            ))}
          </ul>

          {currentStep === 0 && <VendorNameInput />}

          {currentStep === 1 && <ContactSection userId={userId} />}

          {currentStep === 2 && <LocationSection userId={userId} />}

          <div className="mt-8 flex justify-between">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="soft"
                onClick={() => setCurrentStep((s) => s - 1)}
              >
                Previous
              </Button>
            )}
            {currentStep < formSteps.length - 1 && (
              <Button
                type="button"
                className="btn btn-primary"
                onClick={() => setCurrentStep((s) => s + 1)}
              >
                Next
              </Button>
            )}
            {currentStep === formSteps.length - 1 && (
              <Button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Create Vendor"
                )}
              </Button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
