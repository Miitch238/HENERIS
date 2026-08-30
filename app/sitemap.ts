import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://heneris.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: MetadataRoute.Sitemap = [
    "",
    "/shoppers",
    "/comment-ca-marche",
    "/devenir-shopper",
    "/contact",
    "/legal/mentions-legales",
    "/legal/cgu",
    "/legal/confidentialite",
    "/legal/cookies",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/shoppers" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  let shopperPaths: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("shopper_profiles")
      .select("slug, updated_at")
      .eq("statut", "actif");
    shopperPaths = (data ?? []).map((s) => ({
      url: `${SITE_URL}/shoppers/${s.slug}`,
      lastModified: new Date(s.updated_at),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // base inaccessible au build : on renvoie au moins les pages statiques
  }

  return [...staticPaths, ...shopperPaths];
}
