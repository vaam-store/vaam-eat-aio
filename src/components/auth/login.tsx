"use client";

import { useRedirects } from "@app/components/auth/utils";
import { signIn } from "next-auth/webauthn";
import { Button } from "@app/components/button";
import { Section } from "../section/section";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/core";
import type { FormProps } from "@rjsf/core";

const schema: RJSFSchema = {
  title: "Login",
  type: "object",
  properties: {
    email: {
      type: "string",
      title: "Email",
      format: "email",
    },
  },
  required: ["username"],
};

const uiSchema: FormProps<any>["uiSchema"] = {
  email: {
    "ui:widget": "text",
    "ui:options": {
      classNames: "input input-bordered input-primary w-full",
      placeholder: "e.g. rustacean_42",
    },
  },
  slug: {
    "ui:widget": "text",
    "ui:options": {
      classNames: "input input-bordered input-secondary w-full",
      placeholder: "e.g. my-awesome-blog",
    },
  },
};

export function Login() {
  const { redirectUrl } = useRedirects();

  return (
    <Section className="flex flex-col gap-4">
      <Form
        schema={schema}
        uiSchema={uiSchema}
        validator={validator}
        onSubmit={async ({ formData }) => {
          await signIn("passkey", {
            action: "register",
            email: formData.email,
            redirectTo: redirectUrl,
          });
        }}
      />

      <hr />

      <Button onClick={() => signIn("passkey")}>Sign in with Passkey</Button>
    </Section>
  );
}
