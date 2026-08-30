import { z } from "zod";

/** Sujets proposés dans le formulaire de contact (le `<select>` n'en offre pas d'autres). */
export const CONTACT_SUJETS = [
  "Question générale",
  "Problème avec mon compte",
  "Signaler un profil ou un avis",
  "Presse & partenariats",
  "Autre",
] as const;

export const contactSchema = z.object({
  nom: z.string().trim().min(2, "Votre nom est requis.").max(80),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Adresse e-mail invalide.")
    .max(160),
  sujet: z.enum(CONTACT_SUJETS, { error: "Choisissez un sujet." }),
  message: z
    .string()
    .trim()
    .min(10, "Votre message est un peu court.")
    .max(4000, "Votre message est trop long."),
});

export type ContactInput = z.infer<typeof contactSchema>;
