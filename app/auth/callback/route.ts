import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Retour d'un fournisseur OAuth (Google). Échange le `code` contre une session,
 * puis redirige vers l'espace connecté (ou `suite` si fourni).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const suite = searchParams.get("suite");
  const next = suite && suite.startsWith("/") ? suite : "/tableau-de-bord";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL("/connexion?erreur=oauth", origin));
}
