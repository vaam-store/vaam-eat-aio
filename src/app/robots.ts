import { env } from '@app/env';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/cart',
          '/orders/*',
          '/settings/*',
          '/vendors/*',
          '/checkout/*',
          '/auth/*',
          '/api/*',
          '/search',
          '/error',
          '/not-found',
        ],
      },
      {
        userAgent: ['Googlebot', 'Applebot', 'Bingbot'],
        allow: ['/'],
        disallow: [
          '/cart',
          '/orders/*',
          '/settings/*',
          '/vendors/*',
          '/checkout/*',
          '/auth/*',
          '/api/*',
          '/search',
          '/error',
          '/not-found',
        ],
      },
    ],
    sitemap: [
      `${env.APP_URL}/sitemap.xml`,
      `${env.APP_URL}/api/sitemaps/products/sitemap.xml`,
      `${env.APP_URL}/api/sitemaps/vendors/sitemap.xml`,
    ],
  };
}
