# Étape 7 (fin) — `/contact` + `/comment-ca-marche`

Statut : **validé, autonomie donnée par l'utilisateur** (« fais les choix toi-même
si c'est cohérent »). Les deux dernières pages `ComingSoon` de l'étape 7.

Contexte : plan de cadrage (artefact `6321d65d`), `CLAUDE.md`, décisions MVP
(`memory/heneris-mvp-decisions.md`). Rappel des décisions qui pèsent ici :
MVP 100 % gratuit, aucun paiement géré par la plateforme (nº 1) ; validation
shopper manuelle dans le dashboard Supabase, aucune UI admin (nº 4) ; FR
uniquement (nº 7) ; pas de faux profils (nº 11).

---

## 1. `/comment-ca-marche`

**Objectif** : détailler le parcours des deux côtés, lever les doutes, pousser à
l'inscription.

**Choix d'architecture** : Server Component pur, **sections empilées** plutôt
qu'une bascule à onglets interactive. Le plan mentionne une « bascule Client /
Shopper », mais l'empilement garde la page en RSC, rend les deux parcours
crawlables (page SEO importante) et n'ajoute aucun JS. Une mini-nav d'ancres
(`#client`, `#shopper`) donne le ressenti d'une bascule.

**Sections**

| # | Bloc | Détail |
|---|------|--------|
| 1 | Hero | eyebrow « Comment ça marche » · H1 · paragraphe d'intro · deux boutons d'ancre « Côté client » / « Côté personal shopper » |
| 2 | `#client` — Trouver un shopper | 5 étapes numérotées (motif `STEPS` de la landing : chiffre serif, titre, corps) + CTA `Trouver un shopper` (primary) / `Créer un compte` (ghost) |
| 3 | `#shopper` — Proposer ses services | 5 étapes numérotées + CTA `Créer mon profil shopper` (→ `/devenir-shopper`) |
| 4 | FAQ | 7 questions en `<details>/<summary>` natif via `components/marketing/faq.tsx` (Server Component, styles Tailwind inline, pas de `"use client"`) |
| 5 | CTA final | réutilise le bandeau encre de la landing (`bg-ink`), texte propre à cette page |

**Métadonnées** : `title` « Comment ça marche », `description` orientée parcours.

### Contenu FR — parcours client (`#client`)

1. **Explorez l'annuaire.** Parcourez les profils de personal shoppers et filtrez
   par budget, spécialité, style et disponibilité. Chaque fiche présente
   l'approche de la personne et ses réalisations passées.
2. **Contactez la bonne personne.** Un profil vous parle ? Ouvrez une
   conversation depuis sa fiche. C'est gratuit et sans engagement.
3. **Décrivez votre besoin.** Dans la messagerie, expliquez ce que vous
   cherchez. Vous pouvez joindre un « besoin » structuré — catégorie, budget,
   délai — ou simplement discuter librement.
4. **Échangez à votre rythme.** Le shopper vous conseille, propose des pistes,
   affine avec vous. Vous gardez la main sur chaque décision et chaque achat.
5. **Laissez un avis.** Une fois l'échange abouti, partagez votre expérience.
   Votre avis oriente les prochains clients et valorise le travail du shopper.

### Contenu FR — parcours personal shopper (`#shopper`)

1. **Créez votre profil.** Titre, présentation, spécialités, styles, fourchette
   de prix, ville, portfolio de vos réalisations. Quelques minutes suffisent.
2. **Attendez la validation.** L'équipe Heneris relit chaque profil avant
   publication — c'est ce qui garantit la qualité de l'annuaire. Vous êtes
   prévenu dès qu'il est en ligne.
3. **Recevez des demandes.** Les clients intéressés vous écrivent directement
   dans la messagerie. Vous réglez votre disponibilité — ouvert, complet, en
   pause — selon votre charge.
4. **Accompagnez vos clients.** Échangez, conseillez, proposez. Vous fixez votre
   façon de travailler et vos tarifs avec chaque client.
5. **Construisez votre réputation.** Les avis de vos clients s'affichent sur
   votre fiche et alimentent votre note moyenne. Un bon historique attire de
   nouvelles demandes.

### Contenu FR — FAQ

1. **Heneris prend-il une commission ?**
   Non. La plateforme est gratuite, côté client comme côté personal shopper.
   Heneris ne gère aucun paiement entre vous : la rémunération du shopper se
   règle directement entre vous, selon ce que vous convenez ensemble.
2. **Comment se passe le paiement d'un shopper ?**
   En dehors de Heneris. La plateforme sert à vous trouver, échanger et vous
   mettre d'accord ; le règlement de la prestation et des achats se fait entre
   vous, par le moyen que vous choisissez.
3. **Les personal shoppers sont-ils vérifiés ?**
   Chaque profil est relu manuellement par l'équipe avant d'apparaître dans
   l'annuaire. Un profil qui ne respecte pas nos règles peut être refusé ou
   retiré à tout moment.
4. **Faut-il un gros budget ?**
   Non. Heneris couvre tous les budgets — d'une pièce à trouver pour quelques
   dizaines d'euros à un accompagnement plus large. Le filtre budget de
   l'annuaire vous aide à cibler.
5. **Dois-je créer un compte pour contacter un shopper ?**
   Oui, un compte client gratuit suffit. Il vous permet de suivre vos
   conversations au même endroit et de laisser un avis ensuite.
6. **Puis-je être à la fois client et personal shopper ?**
   Un compte a un seul rôle. Pour proposer vos services quand vous avez déjà un
   compte client, créez un compte shopper avec une autre adresse e-mail, ou
   écrivez-nous.
7. **Comment signaler un profil ou un avis problématique ?**
   Via la page contact, en choisissant le sujet « Signaler un profil ou un
   avis ». Nous examinons chaque signalement.

---

## 2. `/contact`

**Objectif** : un canal de contact fonctionnel. Décision utilisateur : les
messages atterrissent dans une **table Supabase**, lus depuis le dashboard —
même modèle opératoire que la validation des shoppers, aucune UI admin, aucune
dépendance e-mail. Une notification e-mail (Resend) pourra se greffer en étape 8.

### Migration `supabase/migrations/0004_contact_messages.sql`

Ré-exécutable (drop policy if exists + create table if not exists), en-tête
commentée comme 0003.

```sql
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null,
  email       text not null,
  sujet       text not null,
  message     text not null,
  auteur_id   uuid references public.profiles (id) on delete set null,
  traite      boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Insertion ouverte (anon + authenticated) ; le contenu est validé côté
-- Server Action (Zod + honeypot). Aucune policy SELECT/UPDATE/DELETE : la
-- lecture et le traitement se font uniquement via le dashboard Supabase
-- (clé service = contourne la RLS).
drop policy if exists "contact_messages: tout le monde peut écrire" on public.contact_messages;
create policy "contact_messages: tout le monde peut écrire"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create index if not exists idx_contact_messages_created on public.contact_messages (created_at desc);
```

Pas d'IP stockée (RGPD — minimisation ; la page confidentialité mentionne déjà
les journaux serveur pour la sécurité, ce qui est un traitement distinct).

### Validation `lib/validation/contact.ts`

```ts
export const CONTACT_SUJETS = [
  "Question générale",
  "Problème avec mon compte",
  "Signaler un profil ou un avis",
  "Presse & partenariats",
  "Autre",
] as const;

contactSchema = z.object({
  nom: z.string().trim().min(2, "Votre nom est requis.").max(80),
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide.").max(160),
  sujet: z.enum(CONTACT_SUJETS),
  message: z.string().trim().min(10, "Message trop court.").max(4000),
});
```

### Server Action `lib/contact/actions.ts`

`sendContactMessage(prev, formData) => { error?, notice? }` — motif identique à
`lib/reviews/actions.ts` :

1. Honeypot : champ `entreprise` non vide → renvoyer le `notice` de succès
   **sans rien insérer** (on ne signale pas au bot qu'il est repéré).
2. Piège temporel : champ caché `rendu_a` (timestamp posé **côté serveur** par la
   page, passé en prop — pas d'horloge client, donc pas de dérive). Si
   `Date.now() - rendu_a < 2500` → même faux succès.
3. `contactSchema.safeParse` → `{ error: première issue }` sinon.
4. `getCurrentProfile()` : si connecté, `auteur_id = me.id`.
5. `supabase.from("contact_messages").insert(...)` via le client SSR (clé anon).
   Erreur → `{ error: "Envoi impossible pour le moment. Réessayez." }`.
6. Cooldown : `cookies().set("heneris_contact", "1", { maxAge: 90, httpOnly: true })`.
   Si le cookie est déjà là en entrée → `{ error: "Vous venez d'envoyer un
   message. Laissez-nous un moment pour y répondre." }`.
7. Succès → `{ notice: "Message bien reçu. Nous vous répondrons par e-mail sous
   quelques jours ouvrés." }`.

Pas de `redirect` (contrairement à l'avis) : le formulaire bascule sur le
`FormNotice` en place, comme `forgot-password-form.tsx`.

### Composant `components/marketing/contact-form.tsx` (`"use client"`)

`useActionState(sendContactMessage, {})`, `if (state.notice) return <FormNotice>`.
Props : `defaultNom`, `defaultEmail` (pré-remplis si connecté), `renduA: number`.

Champs : `Field` + `Input` (Nom, E-mail), `Field` + `Select` (Sujet, options
`CONTACT_SUJETS`), `Field` + `Textarea` (Message, `rows={6}`), `SubmitButton`
(`pendingLabel="Envoi…"`, label « Envoyer »). Champs cachés : `entreprise`
(honeypot, `<input tabIndex={-1} autoComplete="off" aria-hidden>` dans un wrapper
`absolute -left-[9999px]`), `rendu_a`.

### Page `app/(marketing)/contact/page.tsx` (Server Component)

- `export const dynamic = "force-dynamic";` (le timestamp anti-spam doit être
  frais ; page à formulaire, aucun intérêt à la mettre en cache).
- `metadata` : title « Contact », description existante.
- `const me = await getCurrentProfile();`
- Layout `Container max-w-2xl py-16 md:py-24` : eyebrow « Nous écrire », H1
  « Contact », intro *« Une question, un souci, une proposition ? Écrivez-nous —
  nous répondons sous quelques jours ouvrés. »*
- `<ContactForm renduA={Date.now()} defaultNom={me ? `${me.prenom} ${me.nom}`.trim() : ""} defaultEmail="" />`
  (l'e-mail du compte n'est pas dans `profiles` ; on ne le pré-remplit pas).
- Repli sous le formulaire : *« Vous pouvez aussi nous écrire directement à
  contact@heneris.com. »* + lien vers `/comment-ca-marche` (« Voir d'abord les
  questions fréquentes »).

---

## 3. Composants partagés à ajouter

### `components/ui/field.tsx` — `Textarea` + `Select`

Même fabrique que `Input` (bordure `hairline`, fond `surface`, focus or) :

```tsx
export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn("w-full border border-hairline bg-surface px-3 py-2 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink-faint focus-visible:border-gold-deep focus-visible:ring-2 focus-visible:ring-gold/25", className)} {...props} />;
}
export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn("h-11 w-full border border-hairline bg-surface px-3 text-[0.95rem] text-ink outline-none transition-colors focus-visible:border-gold-deep focus-visible:ring-2 focus-visible:ring-gold/25", className)} {...props} />;
}
```

### `components/marketing/faq.tsx` — Server Component

```tsx
export function Faq({ items }: { items: { q: string; a: React.ReactNode }[] }) { … }
```

Liste de `<details>` : `<summary>` cliquable (question, chevron rotatif via
`[&_svg]:group-open:rotate-180` ou `details[open]`), réponse `text-ink-soft`.
Bordure `border-hairline` entre items. Styles Tailwind inline (cohérent avec le
reste des composants ; `globals.css` ne porte que les tokens + `.eyebrow` +
`.legal`).

---

## 4. Fichiers touchés

| Fichier | Action |
|---------|--------|
| `supabase/migrations/0004_contact_messages.sql` | **nouveau** |
| `types/database.ts` | + table `contact_messages` (Row/Insert/Update/Relationships) + alias `ContactMessageRow` |
| `lib/validation/contact.ts` | **nouveau** |
| `lib/contact/actions.ts` | **nouveau** |
| `components/marketing/contact-form.tsx` | **nouveau** (`"use client"`) |
| `components/marketing/faq.tsx` | **nouveau** (Server Component) |
| `components/ui/field.tsx` | + `Textarea`, `Select` |
| `app/(marketing)/contact/page.tsx` | `ComingSoon` → vraie page |
| `app/(marketing)/comment-ca-marche/page.tsx` | `ComingSoon` → vraie page |

Nav et footer pointent déjà vers les deux routes — rien à changer.

## 5. Vérification

- `npm run typecheck` + `npm run lint` verts.
- `npm run build` passe (les deux pages, `/contact` en dynamique).
- Preview : `/comment-ca-marche` — ancres, FAQ qui s'ouvre/ferme sans JS ;
  `/contact` — envoi nominal (vérifier la ligne insérée), honeypot rempli =
  faux succès sans ligne, message trop court = erreur inline, double envoi =
  message de cooldown.
- `ComingSoon` n'est plus importé que par… plus personne → le composant devient
  mort. **Le garder** : `CLAUDE.md` le désigne comme le placeholder standard, et
  l'étape 8 / de futures pages peuvent le réutiliser.

## 6. Étape manuelle utilisateur (après merge)

Appliquer `0004_contact_messages.sql` dans Supabase → SQL Editor (comme 0001–0003).
Le formulaire renverra une erreur douce (« Envoi impossible ») tant que la table
n'existe pas — aucune page ne casse.

## 7. Hors périmètre (rappel pour la clôture de l'étape 7)

- Bandeau cookies : la page cookies annonce « aucun cookie non essentiel » →
  un simple encart d'information suffit, pas de vrai gestionnaire de consentement.
  À trancher séparément.
- Mentions `[À COMPLÉTER]` des pages légales : infos société de l'utilisateur.
- Relecture juridique des 4 documents.
- Notification e-mail des messages de contact (Resend) : étape 8.
