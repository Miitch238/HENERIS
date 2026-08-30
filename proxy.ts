import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Proxy Next.js (ex-middleware) — rafraîchit la session Supabase à chaque
 * requête et protège les routes de l'espace connecté.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Toutes les routes sauf assets statiques, images optimisées, favicon,
    // /brand et fichiers image.
    "/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)",
  ],
};
