import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Client Supabase pour les Server Components, Route Handlers et Server Actions.
 * Lit et rafraîchit la session via les cookies de la requête.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Appelé depuis un Server Component : les cookies ne peuvent pas
            // être écrits ici. Le middleware se charge du rafraîchissement.
          }
        },
      },
    },
  );
}
