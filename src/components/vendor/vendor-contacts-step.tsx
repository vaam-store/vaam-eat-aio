import { Button } from '@app/components/button';
import { Title } from '@app/components/text';
import { ContactItem } from '@app/components/vendor/contact-item';
import { ErrorDisplay } from '@app/components/vendor/error-display';
import { type VendorFormValues } from '@app/components/vendor/vendor-creation-form';
import { FieldArray, getIn, useFormikContext } from 'formik';
import { Plus } from 'react-feather';

interface VendorContactsStepProps {
  userId: string;
  name: string;
  email: string;
}

export function VendorContactsStep({ name, email }: VendorContactsStepProps) {
  const { values, errors, touched } = useFormikContext<VendorFormValues>();
  return (
    <div className='space-y-4'>
      <Title>Vendor Contacts</Title>
      <p className='text-base-content opacity-70'>
        Manage vendor contact information.
      </p>
      <FieldArray name='contacts.createMany.data'>
        {({ remove, push }) => (
          <div className='space-y-4'>
            {values.contacts.createMany.data.map((_contactItem, index) => (
              <ContactItem key={index} index={index} remove={remove} />
            ))}
            <Button
              type='button'
              variant='outline'
              color='primary'
              className='mt-2'
              onClick={() =>
                push({
                  type: 'All',
                  contactInfo: { email, phone: [''], name },
                })
              }
              aria-label='Add contact'>
              <Plus /> Add Contact
            </Button>
            {(() => {
              const contactDataError = getIn(
                errors,
                'contacts.createMany.data',
              );
              const contactDataTouched = getIn(
                touched,
                'contacts.createMany.data',
              );
              if (contactDataTouched && typeof contactDataError === 'string') {
                return <ErrorDisplay name='contacts.createMany.data' />;
              }
              return null;
            })()}
          </div>
        )}
      </FieldArray>
    </div>
  );
}
