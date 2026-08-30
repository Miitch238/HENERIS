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
| `NEXT_PUBLIC_SITE_URL` | Optionnel en local. En prod : `https://heneris.com` (sitemap, robots, Open Graph). |

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
  (marketing)/   pages publiques (landing, comment-ça-marche, contact, légal) + Navbar/Footer
  (auth)/        connexion, inscription, mot de passe oublié
  (app)/         espace connecté (tableau de bord, profil, messagerie, avis) — protégé par proxy.ts
  shoppers/      annuaire + fiches publiques /shoppers/[slug]
  sitemap.ts · robots.ts · manifest.ts · opengraph-image.tsx · not-found.tsx · error.tsx
components/
  ui/            primitives (Button, Container, Logo, Field…)
  marketing/     Navbar, Footer, LegalDoc, Faq, ContactForm
  shopper/ messaging/ app/   composants métier
lib/
  supabase/      clients navigateur & serveur (SSR)
  queries/       lectures typées
  <domaine>/actions.ts   Server Actions (mutations)
  validation/    schémas Zod
types/           types de la base (forme @supabase/supabase-js, tenus à la main)
supabase/        migrations SQL (0001→0004) + reset.sql + schéma de référence
public/brand/    logo, favicon (voir public/brand/README.md)
```

## Mise en ligne (Vercel)

**1 · Base de données.** Dans Supabase → SQL Editor, exécuter dans l'ordre, une
seule fois : `supabase/reset.sql` (⚠ uniquement si le projet contient d'anciennes
tables), puis `migrations/0001` → `0002` → `0003` → `0004`.

**2 · Auth.** Supabase → Authentication : activer **Confirm email** avant
l'ouverture au public (le code gère déjà les deux cas). Ajouter
`https://heneris.com/auth/confirm` aux **Redirect URLs**. Supprimer les comptes
de test résiduels dans Authentication → Users.

**3 · Vercel.** Importer le dépôt GitHub (framework **Next.js** détecté seul).
Renseigner dans **Project Settings → Environment Variables** :
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_SITE_URL=https://heneris.com`.

**4 · Domaine.** Brancher `heneris.com` dans **Settings → Domains**, puis
déployer.

**5 · Après déploiement.** Vérifier `/(sitemap|robots).xml`, l'image Open Graph
(`/opengraph-image`), l'absence d'erreur console, et un envoi via `/contact`
(la ligne doit apparaître dans la table `contact_messages`).

## Contenu en attente avant ouverture

- Pages légales : remplacer les mentions `[À COMPLÉTER]` (raison sociale, SIREN,
  TVA, directeur de publication) et faire relire par un professionnel du droit.
- Onboarding manuel de 5 à 10 personal shoppers réels ; passer leur
  `shopper_profiles.statut` à `actif` dans le dashboard Supabase (aucune UI
  admin, c'est volontaire).

## Bandeau cookies

Aucun bandeau de consentement : le site ne dépose qu'un **cookie de session**
strictement nécessaire à l'authentification (aucune mesure d'audience, aucun
traçage). L'information figure sur `/legal/cookies`, lien en pied de page. Un
gestionnaire de consentement ne deviendra obligatoire que si un outil de mesure
d'audience est ajouté.

## Historique

L'ancienne version (Create React App) est archivée sur la branche
[`legacy-cra`](../../tree/legacy-cra). La reconstruction repart de zéro — voir le
plan de cadrage.
