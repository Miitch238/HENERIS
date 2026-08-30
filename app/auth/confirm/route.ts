import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Point de retour des liens envoyés par e-mail (confirmation d'inscription,
 * réinitialisation de mot de passe). Vérifie le jeton puis redirige.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const suite = searchParams.get("suite");
  const next =
    suite && suite.startsWith("/") ? suite : "/tableau-de-bord";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(
    new URL("/connexion?erreur=lien_invalide", request.url),
  );
}
