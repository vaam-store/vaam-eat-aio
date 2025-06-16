import { Text } from '@app/components/text';
import { ThemeToggle } from '@app/components/theme-toggle';
import Link from 'next/link';

const AuthHeader = () => {
  return (
    <div className='flex flex-row items-center justify-between gap-4'>
      <Text as={Link} href='/' className='text-xl normal-case'>
        VAAM EAT
      </Text>
      <ThemeToggle />
    </div>
  );
};

export { AuthHeader };
