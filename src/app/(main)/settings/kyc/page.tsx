'use client';

import { SettingCard } from '@app/components/settings/setting-card';
import { api } from '@app/trpc/react';
import { showErrorToast } from '@app/utils/error-handler';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { Check, Mail } from 'react-feather';
import toast from 'react-hot-toast';

export default function Page() {
  const { data: session } = useSession();
  const isEmailVerified = session?.user?.emailVerified !== null;
  const [isLoading, setIsLoading] = useState(false);

  const sendVerificationEmailMutation =
    api.user.sendVerificationEmail.useMutation();

  const handleSendVerificationEmail = useCallback(async () => {
    setIsLoading(true);
    try {
      await sendVerificationEmailMutation.mutateAsync();
      toast.success('Verification email sent successfully!');
    } catch (error) {
      showErrorToast(error, 'Failed to send verification email.');
    } finally {
      setIsLoading(false);
    }
  }, [sendVerificationEmailMutation]);

  return (
    <SettingCard title='KYC (Email Setup)'>
      <p className='mb-4'>
        Current Email Verification Status:{' '}
        {isEmailVerified ? (
          <Check size={16} className='text-success inline' />
        ) : (
          'Not Verified'
        )}
      </p>
      {!isEmailVerified && (
        <button
          className='btn btn-primary btn-sm'
          onClick={handleSendVerificationEmail}
          disabled={isLoading}>
          {isLoading ? (
            <span className='loading loading-spinner' />
          ) : (
            <Mail size={16} />
          )}{' '}
          Send verification email
        </button>
      )}
    </SettingCard>
  );
}
