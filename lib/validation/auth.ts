import { z } from "zod";

export const roleSchema = z.enum(["client", "shopper"]);

export const signUpSchema = z.object({
  role: roleSchema,
  prenom: z.string().trim().min(1, "Votre prénom est requis.").max(80),
  nom: z.string().trim().min(1, "Votre nom est requis.").max(80),
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères.")
    .max(72, "Le mot de passe est trop long."),
});

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
