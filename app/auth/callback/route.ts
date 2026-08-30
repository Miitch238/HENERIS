import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Retour d'un fournisseur OAuth (Google). Échange le `code` contre une session.
 *
 * Les cookies de session sont écrits **directement sur la réponse de
 * redirection** : dans un Route Handler, `cookies().set()` ne survit pas
 * toujours à un `NextResponse.redirect`, ce qui laissait l'utilisateur
 * déconnecté après le retour de Google.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const suite = searchParams.get("suite");
  const next = suite && suite.startsWith("/") ? suite : "/tableau-de-bord";

  const failure = NextResponse.redirect(
    new URL("/connexion?erreur=oauth", origin),
  );
  if (!code) return failure;

  const cookieStore = await cookies();
  const response = NextResponse.redirect(new URL(next, origin));

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) =>
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          ),
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return error ? failure : response;
}
