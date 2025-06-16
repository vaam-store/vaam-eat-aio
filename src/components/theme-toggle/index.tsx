'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'react-feather';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <label htmlFor='vaam-theme-play' className='toggle text-base-content'>
      <input
        onChange={(e) => {
          const newTheme = e.target.checked
            ? 'vymalo-dark-v2'
            : 'vymalo-light-v2';
          setTheme(newTheme);
        }}
        checked={resolvedTheme === 'vymalo-dark-v2'}
        id='vaam-theme-play'
        type='checkbox'
        className='theme-controller'
        aria-label='Toggle theme'
      />

      <Sun className='swap-off size-5' />
      <Moon className='swap-on size-5' />
    </label>
  );
}
