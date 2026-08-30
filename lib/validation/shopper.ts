import { z } from "zod";

const tagList = z
  .string()
  .transform((s) =>
    s
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 8),
  )
  .pipe(z.array(z.string().min(1).max(40)));

const optionalMoney = z
  .string()
  .trim()
  .transform((s) => (s === "" ? null : Number(s.replace(",", "."))))
  .pipe(z.number().min(0).max(1_000_000).nullable());

export const shopperProfileSchema = z
  .object({
    titre: z
      .string()
      .trim()
      .min(3, "Un titre d'au moins 3 caractères est requis.")
      .max(80),
    bio: z.string().trim().max(1500, "La bio est trop longue (1500 caractères max).").default(""),
    specialites: tagList,
    styles: tagList,
    ville: z.string().trim().max(80).optional().default(""),
    budget_min: optionalMoney,
    budget_max: optionalMoney,
    disponibilite: z.enum(["ouvert", "complet", "pause"]).default("ouvert"),
  })
  .refine(
    (v) =>
      v.budget_min === null ||
      v.budget_max === null ||
      v.budget_min <= v.budget_max,
    { message: "Le budget minimum doit être inférieur au maximum.", path: ["budget_max"] },
  );

export type ShopperProfileInput = z.infer<typeof shopperProfileSchema>;

export const clientProfileSchema = z.object({
  prenom: z.string().trim().min(1, "Votre prénom est requis.").max(80),
  nom: z.string().trim().min(1, "Votre nom est requis.").max(80),
  ville: z.string().trim().max(80).optional().default(""),
});
