import type { MetadataRoute } from "next";
import { sections } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://surco.example.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalogo`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/carrito`, lastModified: new Date(), changeFrequency: "never", priority: 0.3 },
    ...sections.map((s) => ({
      url: `${base}/album/${s.album.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
