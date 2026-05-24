// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.lachopin.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/editar/", "/mis-publicaciones"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}