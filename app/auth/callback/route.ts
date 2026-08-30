import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Retour d'un fournisseur OAuth (Google). Échange le `code` contre une session.
 * Version diagnostic : chaque issue est encodée dans l'URL (?diag=...).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthErr = searchParams.get("error");
  const suite = searchParams.get("suite");
  const next = suite && suite.startsWith("/") ? suite : "/tableau-de-bord";

  const back = (diag: string) =>
    NextResponse.redirect(
      new URL(`/connexion?diag=${encodeURIComponent(diag)}`, origin),
    );

  if (oauthErr) return back(`provider:${oauthErr}`);
  if (!code) return back("nocode");

  const cookieStore = await cookies();
  const nVerifier = cookieStore
    .getAll()
    .filter((c) => c.name.includes("code-verifier")).length;

  const collected: { name: string; value: string; options?: object }[] = [];

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          for (const c of list) collected.push(c);
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return back(`exchange:${error.message}|verif:${nVerifier}`);
  if (!data.session) return back(`nosession|verif:${nVerifier}`);

  const response = NextResponse.redirect(
    new URL(`${next}?diag=ok-c${collected.length}-v${nVerifier}`, origin),
  );
  for (const { name, value, options } of collected) {
    response.cookies.set(name, value, options as never);
  }
  return response;
}
