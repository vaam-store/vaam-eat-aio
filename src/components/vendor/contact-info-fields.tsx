import { ErrorDisplay } from '@app/components/vendor/error-display';
import { PhoneNumberArray } from '@app/components/vendor/phone-number-array';
import { Field } from 'formik';

interface ContactInfoFieldsProps {
  contactIndex: number;
}

export function ContactInfoFields({ contactIndex }: ContactInfoFieldsProps) {
  const namePath = `contacts.createMany.data.${contactIndex}.contactInfo.name`;
  const emailPath = `contacts.createMany.data.${contactIndex}.contactInfo.email`;

  return (
    <div className='space-y-3'>
      <h4 className='label-text font-medium'>Contact Details</h4>
      <div>
        <label htmlFor={namePath} className='label'>
          <span className='label-text'>Contact Person Name</span>
        </label>
        <Field
          id={namePath}
          name={namePath}
          type='text'
          className='input input-bordered w-full'
        />
        <ErrorDisplay name={namePath} />
      </div>
      <div>
        <label htmlFor={emailPath} className='label'>
          <span className='label-text'>Email Address</span>
        </label>
        <Field
          id={emailPath}
          name={emailPath}
          type='email'
          className='input input-bordered w-full'
        />
        <ErrorDisplay name={emailPath} />
      </div>
      <PhoneNumberArray contactIndex={contactIndex} />
    </div>
  );
}
