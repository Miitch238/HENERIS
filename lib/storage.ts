const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export type Bucket = "avatars" | "portfolios";

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
export const MAX_PORTFOLIO_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** URL publique d'un objet Storage (les buckets sont publics). */
export function publicUrl(bucket: Bucket, path: string | null | undefined): string | null {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

/** Extension à partir du type MIME. */
export function extFor(mime: string): string {
  return mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
}

/** Vérifie type + taille d'un fichier image. Renvoie un message d'erreur, ou null. */
export function validateImage(file: File, maxBytes: number): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
    return "Formats acceptés : JPEG, PNG ou WebP.";
  if (file.size > maxBytes)
    return `Image trop lourde (max ${Math.round(maxBytes / 1024 / 1024)} Mo).`;
  return null;
}
