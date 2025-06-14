"use client";

import { type Prisma } from "@prisma/client";
import { Form } from "@rjsf/daisyui";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

const schema: RJSFSchema = {
  title: "Search",
  type: "object",
  required: ["name", "contacts", "locations"],
  properties: {
    name: {
      type: "string",
      title: "Name",
    },
    contacts: {
      type: "object",
      required: ["createMany"],
      properties: {
        createMany: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                required: ["type", "contactInfo"],
                properties: {
                  type: {
                    type: "string",
                    default: "All",
                    enum: ["All", "Sales", "Support", "Billing"],
                  },
                  contactInfo: {
                    type: "object",
                    required: ["phone", "name"],
                    properties: {
                      email: {
                        type: "string",
                        format: "email",
                      },
                      phone: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                      name: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    locations: {
      type: "object",
      required: ["createMany"],
      properties: {
        createMany: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "address"],
                properties: {
                  name: {
                    type: "string",
                    default: "Main",
                  },
                  address: {
                    type: "object",
                    required: ["city", "country", "latitude", "longitude"],
                    properties: {
                      street: {
                        type: "string",
                      },
                      city: {
                        type: "string",
                      },
                      state: {
                        type: "string",
                      },
                      zip: {
                        type: "string",
                      },
                      country: {
                        type: "string",
                      },
                      latitude: {
                        type: "number",
                      },
                      longitude: {
                        type: "number",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

type VendorActivationFormProps = {
  onSubmit: (values: Prisma.VendorCreateInput) => Promise<void>;
};

export function VendorCreationForm({ onSubmit }: VendorActivationFormProps) {
  return (
    <Form
      schema={schema}
      validator={validator}
      onSubmit={({ formData }) => onSubmit(formData)}
    />
  );
}
