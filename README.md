# Heneris

Marketplace mettant en relation des **personal shoppers** avec des **clients**,
quel que soit le budget. Recherche de profils, mise en relation, messagerie
temps réel, avis.

**Stack :** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase
(Postgres + Auth + Realtime + Storage) · déploiement Vercel.

---

## Lancer en local

Prérequis : **Node.js 20+**.

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs Supabase
npm run dev
```

Le site tourne sur http://localhost:3000.

### Variables d'environnement

| Variable | Où la trouver |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` |

`.env.local` n'est jamais commité. Vérifier la connexion :

```bash
npm run check:supabase
```

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | build de production |
| `npm run start` | sert le build de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | vérification TypeScript (`tsc --noEmit`) |
| `npm run check:supabase` | teste la connexion à Supabase |

## Structure

```
app/
  (marketing)/   pages publiques (landing, comment-ça-marche, légal…) + Navbar/Footer
  (auth)/        connexion, inscription
  shoppers/      annuaire + fiches (à venir)
components/
  ui/            primitives (Button, Container, Logo)
  marketing/     Navbar, Footer, Hero…
lib/
  supabase/      clients navigateur & serveur
  utils.ts       helper cn()
types/           types de la base (générés depuis Supabase)
supabase/        migrations SQL + schéma de référence
public/brand/    logo, favicon (voir public/brand/README.md)
```

## Déploiement (Vercel)

1. Importer le dépôt GitHub dans Vercel.
2. Framework détecté automatiquement : **Next.js**.
3. Renseigner les variables d'environnement (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) dans **Project Settings → Environment Variables**.
4. Déployer. Brancher le domaine `heneris.com` dans **Settings → Domains**.

## Historique

L'ancienne version (Create React App) est archivée sur la branche
[`legacy-cra`](../../tree/legacy-cra). La reconstruction repart de zéro — voir le
plan de cadrage.
