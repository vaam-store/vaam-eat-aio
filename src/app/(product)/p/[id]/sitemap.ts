import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://example.com",
      lastModified: "2021-01-01",
      changeFrequency: "weekly",
      priority: 0.6,
      images: ["https://example.com/image.jpg"],
    },
  ];
}
