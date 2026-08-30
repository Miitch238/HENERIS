# Heneris — notes pour Claude

Marketplace personal shoppers ↔ clients (tous budgets). Reconstruction complète
en cours : l'ancienne app Create React App est archivée sur la branche
`legacy-cra`, on repart de zéro sur `main`.

## Stack

Next.js 16 (App Router, RSC) · TypeScript strict · Tailwind CSS **v4** (config
CSS-first dans `app/globals.css`, pas de `tailwind.config`) · Supabase
(`@supabase/ssr`) · déploiement Vercel.

## Conventions

- **Server Components par défaut.** `"use client"` seulement pour l'interactivité.
- **Mutations = Server Actions.** La clé Supabase ne fuit jamais côté client.
- **Design system :** tokens dans `app/globals.css` (`--ink`, `--ground`, `--gold`
  `#C9A84B`, …). Classes : `bg-ground`, `text-ink`, `text-gold-deep`,
  `border-hairline`. Polices : `font-serif` (Playfair, titres), `font-sans`
  (Inter, texte), `font-mono` (IBM Plex Mono, méta). Classe `.eyebrow` pour les
  sur-titres.
- **Site committé en clair** (pas de dark mode pour l'instant).
- **FR uniquement.** Tout le texte visible est du vrai contenu français — jamais
  de lorem.
- **Chaque écran dynamique** a ses états vide / chargement / erreur.
- Placeholders des pages non encore construites : `components/marketing/coming-soon.tsx`.

## Modèle de données

7 tables prévues (`profiles`, `shopper_profiles`, `portfolio_items`,
`conversations`, `briefs`, `messages`, `reviews`), toutes en RLS. Points clés :
`shopper_profiles.statut` (`en_revue` → validé à la main dans Supabase avant
publication) ; `reviews` unique par couple `(client_id, shopper_id)`. Schéma
détaillé dans le plan de cadrage ; migrations à venir dans `supabase/migrations/`.
`supabase/_legacy-schema.sql` = ancien schéma, pour référence seulement.

## Commandes

`npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck` ·
`npm run check:supabase`

## Avancement (plan en 8 étapes)

- [x] **Étape 1** — Fondations & design system (layout, nav, footer, landing, 404/erreur, clients Supabase)
- [x] **Étape 2** — Base de données & auth (migrations SQL appliquées, `proxy.ts`, inscription/connexion/reset, groupe `(app)` protégé).
- [x] **Étape 3** — Profils shoppers & portfolio (`/devenir-shopper`, `/profil` édition + portfolio, upload Storage, fiche publique `/shoppers/[slug]` + JSON-LD, génération de slug, dispo rapide au dashboard).
- [x] **Étape 4** — Annuaire & recherche (/shoppers grille + filtres URL, chips spécialités, tri, pagination, états vide/chargement ; section « à la une » sur l'accueil).
- [x] **Étape 5** — Messagerie temps réel (conversations, fil de messages, brief structuré, realtime Supabase, badge non-lu, read_at). ⚠ migration 0003 à appliquer.
- [x] **Étape 6** — Tableaux de bord & avis (dashboard client avec conversations, avis client : dépôt/édition/suppression, note_moyenne auto, affichage + aggregateRating sur la fiche).
- [x] **Étape 7** — Pages publiques & légales (4 pages légales rédigées via `LegalDoc`,
  `/comment-ca-marche` parcours client/shopper + FAQ, `/contact` → table `contact_messages`
  lue au dashboard + anti-spam, `sitemap.ts` / `robots.ts` / `opengraph-image.tsx` / `manifest.ts`).
  ⚠ migration 0004 à appliquer. Pas de bandeau cookies : seul un cookie de session
  strictement nécessaire (info sur `/legal/cookies`). Reste **hors code** : mentions
  `[À COMPLÉTER]` des pages légales (infos société) + relecture juridique.
- [~] **Étape 8** — Finitions & mise en ligne (manifest, métadonnées Twitter/keywords,
  `.env.example` + README de déploiement). Reste : passe a11y/perf, états de chargement,
  déploiement Vercel + domaine (utilisateur).
