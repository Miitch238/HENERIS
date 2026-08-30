import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://heneris.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/tableau-de-bord", "/messages", "/profil", "/avis", "/connexion", "/inscription"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
