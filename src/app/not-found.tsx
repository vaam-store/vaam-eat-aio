'use client';

import { Button } from '@app/components/button';
import { Section } from '@app/components/section';
import { Text, Title } from '@app/components/text';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Corrected import
import { ArrowLeft, Home } from 'react-feather';

export default function NotFound() {
  const router = useRouter();

  return (
    <Section as='main'>
      <div className='flex min-h-[calc(100vh-200px)] flex-col items-center justify-center gap-4 py-12 text-center'>
        <Title as='h1' heading className='text-primary'>
          404
        </Title>
        <Text as='h2' size='4xl' bold>
          Page Not Found
        </Text>
        <Text size='lg' className='text-base-content/80 max-w-md'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved, deleted, or maybe you just mistyped the URL.
        </Text>

        {/* Optional: Add a search input or links to popular sections */}
        {/* <div className="mt-4">
          <SearchInput />
        </div> */}

        <div className='mt-8 flex flex-wrap justify-center gap-4'>
          <Button onClick={() => router.back()} type='button' variant='outline'>
            <ArrowLeft size={18} className='mr-2' />
            <span>Go Back</span>
          </Button>
          <Button as={Link} href='/'>
            <Home size={18} className='mr-2' />
            <span>Go to Homepage</span>
          </Button>
        </div>
        <Text size='sm' className='text-base-content/60 mt-8'>
          If you believe this is an error, please contact support.
        </Text>
      </div>
    </Section>
  );
}
