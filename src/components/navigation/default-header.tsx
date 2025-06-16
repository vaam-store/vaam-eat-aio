import { AppName } from '@app/components/app/app-name';
import { Button } from '@app/components/button';
import { LoginButton } from '@app/components/navigation/login-button';
import { Section } from '@app/components/section/section';
import { Text } from '@app/components/text/text';
import { ThemeToggle } from '@app/components/theme-toggle';
import Link from 'next/link';
import { List, Settings, ShoppingCart } from 'react-feather';

export function DefaultHeader() {
  return (
    <div className='navbar border-base-300 bg-base-200 sticky top-0 z-10 border-b-1'>
      <Section>
        <div className='navbar-start'>
          <Text as={Link} href='/' bold className='heading-title text-xl'>
            <AppName />
          </Text>
        </div>

        <div className='navbar-center' />

        <div className='navbar-end'>
          <div className='flex flex-row items-center gap-4 align-middle'>
            <ThemeToggle />

            <Button
              as={Link}
              href='/orders'
              variant='soft'
              shape='circle'
              className='hidden md:flex'>
              <List />
            </Button>
            <Button
              as={Link}
              href='/settings'
              variant='soft'
              shape='circle'
              className='hidden md:flex'>
              <Settings />
            </Button>
            <Button as={Link} href='/cart' variant='soft' shape='circle'>
              <ShoppingCart />
            </Button>

            <LoginButton />
          </div>
        </div>
      </Section>
    </div>
  );
}
