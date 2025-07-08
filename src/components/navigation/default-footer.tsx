import { AppName } from '@app/components/app/app-name';
import { Button } from '@app/components/button';
import { Section } from '@app/components/section/section';
import Link from 'next/link';
import { Facebook, Youtube } from 'react-feather';

export function DefaultFooter() {
  return (
    <div className='bg-primary-content text-white'>
      <Section className='pt-4'>
        <footer className='footer sm:footer-horizontal items-center'>
          <aside className='grid-flow-col items-center'>
            <span className='font-bold uppercase'>
              <AppName />
            </span>
            <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
          </aside>
          <nav className='grid-flow-col gap-4 md:place-self-center md:justify-self-end'>
            <Button as={Link} href='#' shape='circle' variant='soft'>
              <Facebook />
            </Button>

            <Button as={Link} href='#' shape='circle' variant='soft'>
              <Youtube />
            </Button>
          </nav>
        </footer>
      </Section>

      <Section>
        <div className='divider' />
      </Section>

      <Section className='md:pb-8'>
        <footer className='footer flex flex-col md:flex-row items-center'>
          <Link href='/res/privacy'>Privacy policy</Link>
          <Link href='/res/tos'>Terms of Service</Link>
          <Link href='/res/contact'>Contact</Link>
        </footer>
      </Section>
    </div>
  );
}
