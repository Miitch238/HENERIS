-- ============================================================================
--  Heneris — lot 5 : voir le profil de son interlocuteur
--
--  Sans cette policy, un shopper ne peut pas lire le profil (nom, avatar) du
--  client avec qui il discute — la policy « lecture des shoppers actifs » ne
--  couvre que le sens client → shopper.
--
--  Ré-exécutable.
-- ============================================================================

drop policy if exists "profiles: lecture des interlocuteurs" on public.profiles;

create policy "profiles: lecture des interlocuteurs"
  on public.profiles for select
  using (
    exists (
      select 1
        from public.conversations c
       where (c.client_id = profiles.id or c.shopper_id = profiles.id)
         and (c.client_id = public.current_profile_id()
              or c.shopper_id = public.current_profile_id())
    )
  );
