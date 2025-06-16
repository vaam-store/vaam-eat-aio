import { Button } from '@app/components/button';
import { ErrorDisplay } from '@app/components/vendor/error-display';
import { Field } from 'formik';
import { X } from 'react-feather';

interface PhoneNumberInputProps {
  baseFieldPath: string;
  phoneIndex: number;
  removePhone: (index: number) => void;
}

export function PhoneNumberInput({
  baseFieldPath,
  phoneIndex,
  removePhone,
}: PhoneNumberInputProps) {
  return (
    <div className='flex items-center gap-2'>
      <Field
        name={`${baseFieldPath}.${phoneIndex}`}
        type='text'
        className='input input-bordered w-full'
      />
      <Button
        type='button'
        shape='circle'
        variant='soft'
        color='error'
        size='sm'
        onClick={() => removePhone(phoneIndex)}
        aria-label='Remove phone number'>
        <X />
      </Button>
      <ErrorDisplay name={`${baseFieldPath}.${phoneIndex}`} />
    </div>
  );
}
