/** Transforme un texte en slug URL (minuscules, sans accent, tirets). */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Rend un slug unique en testant sa disponibilité via `isTaken`.
 * Ajoute -2, -3, … tant qu'il est pris.
 */
export async function uniqueSlug(
  base: string,
  isTaken: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const root = slugify(base) || "shopper";
  let candidate = root;
  let n = 1;
  while (await isTaken(candidate)) {
    n += 1;
    candidate = `${root}-${n}`;
  }
  return candidate;
}
