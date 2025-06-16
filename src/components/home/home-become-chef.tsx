import { Button } from '@app/components/button';
import { Section } from '@app/components/section/section';
import { Text } from '@app/components/text/text';
import { Title } from '@app/components/text/title';
import Link from 'next/link';

export function HomeBecomeChef() {
  return (
    <div className='bg-primary text-primary-content py-6 md:py-8 md:py-12'>
      <Section className='flex flex-col items-center gap-4 md:gap-8'>
        <Title className='text-2xl md:text-4xl'>
          Start Cooking & Earning Today!
        </Title>

        <Text className='max-w-md text-center'>
          Share your culinary passion with your community and earn money doing
          what you love
        </Text>

        <div className='flex w-full max-w-lg flex-col items-center'>
          <Button
            size='lg'
            as={Link}
            variant='fill'
            prefetch
            href='/vendors/create'
            color='neutral'>
            Become vendor
          </Button>
        </div>
      </Section>
    </div>
  );
}
