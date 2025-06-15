"use client";

import { useRedirects } from "@app/components/auth/utils";
import { signIn } from "next-auth/webauthn";
import { Button } from "@app/components/button";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { Form } from "@rjsf/daisyui";
import { LogIn } from "react-feather";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { IChangeEvent } from "@rjsf/core";

const schema: RJSFSchema = {
  title: "Register",
  description:
    "This is the same as the simple form, but with an altered bootstrap grid. Set the theme to default, and try shrinking the browser window to see it in action.",
  type: "object",
  properties: {
    email: {
      type: "string",
      title: "Email",
      format: "email",
    },
  },
  required: ["email"],
};

const uiSchema: UiSchema = {
  "ui:field": "LayoutGridField",
  "ui:classNames": "mb-4",
  "ui:submitButtonOptions": {
    props: {
      className: "btn-block btn-lg",
    },
    norender: false,
    submitText: "Submit",
  },
  "ui:layoutGrid": {
    "ui:col": {
      spacing: 2,
      children: [
        {
          name: "email",
        },
      ],
    },
  },
};

export function Login() {
  const { redirectUrl } = useRedirects();
  const router = useRouter();

  const register = useCallback(
    async ({ formData }: IChangeEvent<{ email: string }>) => {
      await signIn("passkey", {
        action: "register",
        email: formData?.email,
        redirect: false,
      });
      router.push(redirectUrl);
    },
    [router, redirectUrl],
  );

  const login = useCallback(async () => {
    await signIn("passkey", {
      redirect: false,
    });
    router.push(redirectUrl);
  }, [router, redirectUrl]);

  return (
    <div className="flex flex-col">
      <Form
        liveValidate
        showErrorList="bottom"
        schema={schema}
        uiSchema={uiSchema}
        validator={validator}
        onSubmit={register}
      />

      <div className="divider"> Or </div>

      <Button size="lg" onClick={login}>
        <span>Sign in</span>
        <LogIn />
      </Button>
    </div>
  );
}
