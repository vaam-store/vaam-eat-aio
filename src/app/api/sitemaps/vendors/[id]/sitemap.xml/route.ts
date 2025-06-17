import { env } from '@app/env';
import { db } from '@app/server/db';
import { type NextRequest, NextResponse } from 'next/server';
import { SitemapStream, streamToPromise } from 'sitemap';

export const dynamic = 'force-dynamic';

const MAX_PER_SITEMAP = 50_000;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);

    // Validate the id parameter
    if (isNaN(id) || id < 0) {
      return NextResponse.json({ error: 'Invalid chunk ID' }, { status: 400 });
    }

    // Calculate pagination
    const start = id * MAX_PER_SITEMAP;

    // Fetch vendors for this chunk
    const vendors = await db.vendor.findMany({
      take: MAX_PER_SITEMAP,
      skip: start,
      where: {
        enabled: true,
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });

    // Create sitemap stream
    const sitemap = new SitemapStream({
      hostname: env.APP_URL,
    });

    // Add each vendor to the sitemap
    vendors.forEach((vendor) => {
      sitemap.write({
        url: `/v/${vendor.id}`,
        lastmod: vendor.updatedAt,
        changefreq: 'weekly',
        priority: 0.7,
      });
    });

    sitemap.end();

    // Convert stream to string
    const xml = await streamToPromise(sitemap);

    return new NextResponse(xml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating vendor sitemap chunk:', error);
    return NextResponse.json(
      { error: 'Failed to generate vendor sitemap chunk' },
      { status: 500 },
    );
  }
}
