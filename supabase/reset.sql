-- ============================================================================
--  Heneris — RESET COMPLET du projet Supabase
--
--  À exécuter UNE SEULE FOIS, dans Supabase → SQL Editor, AVANT 0001.
--  Nécessaire si le projet contient déjà d'anciennes tables (tests de la v1).
--
--  ⚠️  Détruit TOUT le contenu du schéma `public` (tables, données, fonctions,
--      types, policies) et les données Storage des buckets 'avatars' /
--      'portfolios'. N'affecte PAS auth.users (tes comptes de test restent —
--      supprime-les manuellement dans Authentication si besoin).
--
--  Ne PAS ajouter ce fichier à la chaîne de migrations.
-- ============================================================================

-- 1 · Trigger posé sur auth.users (hors schéma public) --------------------------
drop trigger if exists on_auth_user_created on auth.users;

-- 2 · Policies Storage éventuelles (v1 ou re-run) ------------------------------
drop policy if exists "storage: lecture publique avatars & portfolios" on storage.objects;
drop policy if exists "storage: écriture dans son dossier"             on storage.objects;
drop policy if exists "storage: mise à jour de ses fichiers"           on storage.objects;
drop policy if exists "storage: suppression de ses fichiers"           on storage.objects;

-- 3 · Contenu et buckets Storage 'avatars' / 'portfolios' ---------------------
delete from storage.objects where bucket_id in ('avatars', 'portfolios');
delete from storage.buckets where id       in ('avatars', 'portfolios');

-- 4 · Remise à zéro du schéma public (méthode officielle Supabase) ------------
drop schema if exists public cascade;
create schema public;

grant usage on schema public to postgres, anon, authenticated, service_role;

grant all on all tables    in schema public to postgres, anon, authenticated, service_role;
grant all on all routines  in schema public to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role;

alter default privileges in schema public grant all on tables    to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on routines  to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;

comment on schema public is 'standard public schema';

-- ➜ Enchaîner ensuite avec :
--     supabase/migrations/0001_initial_schema.sql
--     supabase/migrations/0002_storage.sql
