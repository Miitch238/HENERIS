/**
 * Vérifie que les variables d'environnement Supabase sont valides et que
 * le projet répond. Lancé par `npm run check:supabase`.
 */
import { readFileSync } from "node:fs";

// Charge .env.local sans dépendance externe
try {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  console.error("✗ .env.local introuvable — copiez .env.example et renseignez vos valeurs.");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY manquant.");
  process.exit(1);
}

const res = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key } });
if (!res.ok) {
  console.error(`✗ Supabase a répondu ${res.status} — vérifiez l'URL et la clé.`);
  process.exit(1);
}

const body = await res.json().catch(() => ({}));
console.log(`✓ Supabase joignable — ${url}`);
console.log(`  auth: ${body.name ?? "ok"}${body.version ? " " + body.version : ""}`);
