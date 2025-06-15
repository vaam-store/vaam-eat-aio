import type { MetadataRoute } from "next";
import { env } from "@app/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${env.NEXT_PUBLIC_EMGR_APP_URL}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_EMGR_APP_URL}/res/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${env.NEXT_PUBLIC_EMGR_APP_URL}/res/tos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${env.NEXT_PUBLIC_EMGR_APP_URL}/res/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${env.NEXT_PUBLIC_EMGR_APP_URL}/res/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${env.NEXT_PUBLIC_EMGR_APP_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
