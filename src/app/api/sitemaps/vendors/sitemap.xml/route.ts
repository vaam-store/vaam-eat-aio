import { env } from '@app/env';
import { db } from '@app/server/db';
import { type NextRequest, NextResponse } from 'next/server';
import { SitemapIndexStream, streamToPromise } from 'sitemap';

export const dynamic = 'force-dynamic';

const MAX_PER_SITEMAP = 50_000;

export async function GET(req: NextRequest) {
  try {
    // Get total count of enabled vendors
    const totalVendors = await db.vendor.count({
      where: {
        enabled: true,
      },
    });

    // Calculate number of sitemap chunks needed
    const numberOfSitemaps = Math.ceil(totalVendors / MAX_PER_SITEMAP);

    // Get base URL from request or environment
    const baseUrl = req.nextUrl.origin || env.APP_URL;

    // Create sitemap index stream
    const sitemapIndex = new SitemapIndexStream();

    // Add each sitemap to the index
    for (let i = 0; i < numberOfSitemaps; i++) {
      sitemapIndex.write({
        url: `${baseUrl}/api/sitemaps/vendors/${i}/sitemap.xml`,
        lastmod: new Date().toISOString(),
      });
    }

    sitemapIndex.end();

    // Convert stream to string
    const xml = await streamToPromise(sitemapIndex);

    return new NextResponse(xml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating vendor sitemap index:', error);
    return NextResponse.json(
      { error: 'Failed to generate vendor sitemap index' },
      { status: 500 },
    );
  }
}
