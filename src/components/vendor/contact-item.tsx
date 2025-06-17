import { Button } from '@app/components/button';
import { Title } from '@app/components/text';
import { ContactInfoFields } from '@app/components/vendor/contact-info-fields';
import { ErrorDisplay } from '@app/components/vendor/error-display';
import { Field } from 'formik';
import { X } from 'react-feather';

interface ContactItemProps {
  index: number;
  remove: (index: number) => void;
}

export function ContactItem({ index, remove }: ContactItemProps) {
  const typePath = `contacts.createMany.data.${index}.type`;

  return (
    <div className='card card-border'>
      <div className='card-body'>
        <div className='flex items-center justify-between'>
          <Title>Contact #{index + 1}</Title>
          <Button
            type='button'
            shape='circle'
            variant='soft'
            color='error'
            size='sm'
            onClick={() => remove(index)}
            aria-label='Remove contact'>
            <X />
          </Button>
        </div>
        <div>
          <label htmlFor={typePath} className='label'>
            <span className='label-text'>Contact Type</span>
          </label>
          <Field
            as='select'
            id={typePath}
            name={typePath}
            className='select select-bordered w-full'>
            <option value='All'>All</option>
            <option value='Sales'>Sales</option>
            <option value='Support'>Support</option>
            <option value='Billing'>Billing</option>
          </Field>
          <ErrorDisplay name={typePath} />
        </div>
        <ContactInfoFields contactIndex={index} />
      </div>
    </div>
  );
}
