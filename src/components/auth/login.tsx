'use client';

import { useRedirects } from '@app/components/auth/utils';
import { Button } from '@app/components/button';
import {
  ErrorCategory,
  ErrorSeverity,
  handleGenericError,
} from '@app/utils/error-handler';
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import { signIn } from 'next-auth/webauthn'; // Assuming this signIn is correct, not from 'next-auth/react' for webauthn
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { LogIn } from 'react-feather';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const loginValidationSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

type LoginFormValues = z.infer<typeof loginValidationSchema>;

const initialValues: LoginFormValues = {
  email: '',
};

export function Login() {
  const { redirectUrl } = useRedirects();
  const router = useRouter();
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleRegister = useCallback(
    async (
      values: LoginFormValues,
      { setSubmitting, setErrors }: FormikHelpers<LoginFormValues>,
    ) => {
      setSubmitting(true);
      try {
        await signIn('passkey', {
          action: 'register',
          email: values.email,
          redirect: false,
        });
        router.push(redirectUrl);
      } catch (error) {
        handleGenericError(
          error,
          'Registration failed. Please try again.',
          ErrorSeverity.Error, // Corrected argument
          ErrorCategory.Authentication,
        );
        // Optionally, set form errors here if the error is a validation error from the server
        if (error instanceof Error && error.message.includes('validation')) {
          setErrors({
            email: 'This email might already be registered or is invalid.',
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
    [router, redirectUrl],
  );

  const handleLogin = useCallback(async () => {
    setIsLoginLoading(true);
    try {
      await signIn('passkey', {
        redirect: false,
      });
      router.push(redirectUrl);
    } catch (error) {
      handleGenericError(
        error,
        'Login failed. Please ensure you have a passkey set up or try registering.',
        ErrorSeverity.Error, // Corrected argument
        ErrorCategory.Authentication,
      );
    } finally {
      setIsLoginLoading(false);
    }
  }, [router, redirectUrl]);

  return (
    <div className='flex flex-col'>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(loginValidationSchema)}
        onSubmit={handleRegister}>
        {({ isSubmitting }) => (
          <Form className='mb-4 space-y-4'>
            <div>
              <label htmlFor='email' className='label sr-only'>
                {' '}
                {/* Assuming label is visually hidden but present for a11y */}
                <span className='label-text'>Email</span>
              </label>
              <Field
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email to register with passkey'
                className='input input-bordered input-lg w-full'
                autoFocus
              />
              <ErrorMessage
                name='email'
                component='div'
                className='text-error mt-1 text-xs'
              />
            </div>
            <Button
              type='submit'
              className='btn-block btn-lg'
              disabled={isSubmitting}
              loading={isSubmitting} // Changed isLoading to loading
            >
              {isSubmitting ? (
                <span className='loading loading-spinner' />
              ) : (
                'Register with Email & Passkey'
              )}
            </Button>
          </Form>
        )}
      </Formik>

      <div className='divider'> Or</div>

      <Button
        size='lg'
        block
        onClick={handleLogin}
        loading={isLoginLoading}
        disabled={isLoginLoading}>
        {isLoginLoading ? (
          <span className='loading loading-spinner' />
        ) : (
          <>
            <span>Sign in with Passkey</span>
            <LogIn className='ml-2' />
          </>
        )}
      </Button>
    </div>
  );
}
