-- ============================================================
-- BABN CVthèque — Script de configuration Supabase
-- À exécuter dans : Supabase > SQL Editor > New query
-- ============================================================

-- 1. Création de la table des candidatures
create table candidatures (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prenom text not null,
  email text not null,
  telephone text,
  ville text,
  domaine text,
  niveau text,
  diplome text,
  message text,
  cv_chemin text not null,
  cv_nom_original text,
  date_candidature timestamptz default now()
);

-- 2. Active la sécurité au niveau des lignes (RLS)
alter table candidatures enable row level security;

-- 3. Autorise TOUT LE MONDE à insérer une candidature (le formulaire public)
create policy "Tout le monde peut deposer une candidature"
on candidatures for insert
to anon
with check (true);

-- 4. Autorise SEULEMENT les utilisateurs connectés (RH) à lire les candidatures
create policy "Seuls les utilisateurs connectes peuvent lire"
on candidatures for select
to authenticated
using (true);

-- ============================================================
-- 5. Configuration du stockage des fichiers CV
-- ============================================================
-- Va dans Storage > New bucket
-- Nom du bucket : cvs
-- Décoche "Public bucket" (garde-le privé)
-- Puis reviens ici et exécute la suite :

-- Autorise tout le monde à uploader un CV
create policy "Tout le monde peut deposer un CV"
on storage.objects for insert
to anon
with check (bucket_id = 'cvs');

-- Autorise seulement les utilisateurs connectés (RH) à télécharger les CV
create policy "Seuls les utilisateurs connectes peuvent telecharger"
on storage.objects for select
to authenticated
using (bucket_id = 'cvs');

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
