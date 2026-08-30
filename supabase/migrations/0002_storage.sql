-- ============================================================================
--  Heneris — Storage (lot 2)
--  Buckets : avatars (avatars des utilisateurs) · portfolios (réalisations
--  des shoppers). Lecture publique, écriture par le propriétaire.
--
--  Convention de chemin : "<user_id>/<nom-fichier>" — le premier segment du
--  path doit être l'UID de l'utilisateur connecté.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars',    'avatars',    true, 2 * 1024 * 1024, array['image/jpeg', 'image/png', 'image/webp']),
  ('portfolios', 'portfolios', true, 5 * 1024 * 1024, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Lecture publique des deux buckets.
create policy "storage: lecture publique avatars & portfolios"
  on storage.objects for select
  using (bucket_id in ('avatars', 'portfolios'));

-- Écriture / mise à jour / suppression : uniquement dans son propre dossier.
create policy "storage: écriture dans son dossier"
  on storage.objects for insert
  with check (
    bucket_id in ('avatars', 'portfolios')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage: mise à jour de ses fichiers"
  on storage.objects for update
  using (
    bucket_id in ('avatars', 'portfolios')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage: suppression de ses fichiers"
  on storage.objects for delete
  using (
    bucket_id in ('avatars', 'portfolios')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
