-- ============================================================================
--  Heneris — connexion Google (OAuth)
--
--  Le trigger de création de profil récupère désormais aussi le prénom, le nom
--  et la photo depuis les métadonnées du fournisseur OAuth (Google), en plus du
--  cas « inscription par e-mail » (role / prenom / nom passés dans options.data).
--
--  Le rôle reste `client` par défaut : un compte Google est un compte client.
--
--  Ré-exécutable (create or replace).
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta        jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  wanted_role text  := nullif(meta ->> 'role', '');
  full_name   text  := coalesce(meta ->> 'name', meta ->> 'full_name', '');
begin
  insert into public.profiles (user_id, role, prenom, nom, avatar_url)
  values (
    new.id,
    case when wanted_role in ('client', 'shopper')
         then wanted_role::public.user_role
         else 'client' end,
    -- prénom : inscription e-mail > given_name Google > 1er mot du nom complet
    coalesce(
      nullif(meta ->> 'prenom', ''),
      nullif(meta ->> 'given_name', ''),
      nullif(split_part(full_name, ' ', 1), ''),
      ''
    ),
    -- nom : inscription e-mail > family_name Google > reste du nom complet
    coalesce(
      nullif(meta ->> 'nom', ''),
      nullif(meta ->> 'family_name', ''),
      nullif(trim(regexp_replace(full_name, '^\S+\s*', '')), ''),
      ''
    ),
    -- photo Google si présente
    nullif(coalesce(meta ->> 'avatar_url', meta ->> 'picture'), '')
  );
  return new;
end;
$$;
