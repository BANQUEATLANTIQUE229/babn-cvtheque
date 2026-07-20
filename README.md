# CVthèque — Banque Atlantique Bénin (BABN)

Site de dépôt de CV en ligne avec espace RH sécurisé pour consulter, filtrer et télécharger les candidatures.

## Ce que contient ce site

- **Page publique** (`index.html`) : présentation de la banque + formulaire de dépôt de CV (PDF)
- **Espace RH protégé** (`admin/`) : connexion par mot de passe, tableau de bord avec recherche, filtres et téléchargement des CV
- **Aucun serveur à gérer** : les données et les fichiers sont stockés gratuitement sur Supabase

---

## Étape 1 — Créer le projet Supabase (gratuit, 5 minutes)

1. Va sur **https://supabase.com** et crée un compte (tu peux te connecter avec GitHub)
2. Clique sur **"New project"**
3. Donne un nom au projet (ex : `babn-cvtheque`), choisis un mot de passe pour la base de données (garde-le de côté), choisis une région proche (ex : Europe)
4. Clique sur **"Create new project"** et attends 1 à 2 minutes que le projet soit prêt

## Étape 2 — Créer la table et les règles de sécurité

1. Dans le tableau de bord Supabase, clique sur **SQL Editor** (icône dans le menu de gauche)
2. Clique sur **"New query"**
3. Ouvre le fichier `supabase-setup.sql` fourni dans ce projet, copie tout son contenu
4. Colle-le dans l'éditeur SQL de Supabase
5. **Avant de cliquer sur "Run" pour la partie stockage** : va d'abord dans **Storage** (menu de gauche) → **"New bucket"** → nomme-le exactement `cvs` → laisse-le **privé** (ne coche pas "Public bucket") → crée-le
6. Reviens dans SQL Editor et clique sur **"Run"** pour exécuter tout le script

## Étape 3 — Récupérer tes clés API

1. Dans Supabase, va dans **Project Settings** (icône engrenage) → **API**
2. Copie la valeur **Project URL**
3. Copie la valeur **anon public** (clé API)
4. Ouvre le fichier `js/config.js` dans ton projet et remplace :
   ```js
   const SUPABASE_URL = "https://VOTRE-PROJET.supabase.co";
   const SUPABASE_ANON_KEY = "VOTRE_CLE_ANON_PUBLIC";
   ```
   par tes vraies valeurs.

## Étape 4 — Créer ton compte RH (pour te connecter à l'espace admin)

1. Dans Supabase, va dans **Authentication** → **Users**
2. Clique sur **"Add user"** → **"Create new user"**
3. Renseigne un e-mail et un mot de passe (ce sera tes identifiants pour te connecter à `admin/connexion.html`)
4. Coche **"Auto Confirm User"** pour éviter d'avoir à confirmer l'e-mail
5. Clique sur **"Create user"**

Tu peux créer plusieurs comptes ici, un par personne RH qui doit avoir accès.

## Étape 5 — Mettre le site en ligne sur GitHub Pages

### Si tu n'as encore rien sur GitHub :

1. Va sur **https://github.com** et connecte-toi
2. Clique sur **"New repository"** (bouton vert)
3. Nom du dépôt : `babn-cvtheque`
4. Laisse-le en **Public**, ne coche aucune case supplémentaire
5. Clique sur **"Create repository"**

### Envoyer les fichiers sur GitHub

Depuis le dossier de ce projet sur ton ordinateur, ouvre un terminal et tape :

```bash
git init
git add .
git commit -m "Premier déploiement CVthèque BABN"
git branch -M main
git remote add origin https://github.com/TON-NOM-UTILISATEUR/babn-cvtheque.git
git push -u origin main
```

(Remplace `TON-NOM-UTILISATEUR` par ton pseudo GitHub)

### Activer GitHub Pages

1. Sur la page de ton dépôt GitHub, va dans **Settings**
2. Dans le menu de gauche, clique sur **Pages**
3. Dans **"Branch"**, sélectionne **main** et le dossier **/ (root)**
4. Clique sur **Save**
5. Attends 1 à 2 minutes, ton site sera en ligne à l'adresse :
   `https://TON-NOM-UTILISATEUR.github.io/babn-cvtheque/`

---

## Utilisation au quotidien

- **Candidats** : vont sur le site, remplissent le formulaire, déposent leur CV
- **RH** : va sur `.../admin/connexion.html`, se connecte avec l'e-mail/mot de passe créé à l'étape 4, consulte et télécharge les CV depuis le tableau de bord

## Ajouter d'autres comptes RH plus tard

Répète l'étape 4 dans Supabase (Authentication → Users → Add user) autant de fois que nécessaire.

## Limites du plan gratuit Supabase

- 500 Mo de base de données (largement suffisant, des dizaines de milliers de candidatures)
- 1 Go de stockage de fichiers (environ 500 à 1000 CV selon leur taille)
- Le projet gratuit se met en pause après 7 jours d'inactivité totale — une simple visite du site le réactive automatiquement

## Sécurité

- Les candidats ne peuvent que déposer des candidatures, jamais consulter les autres dossiers
- Seuls les comptes RH créés manuellement dans Supabase peuvent se connecter au tableau de bord
- Les fichiers CV sont stockés dans un espace privé, inaccessible sans être connecté

## Besoin d'aide ?

Si une étape bloque, les messages d'erreur les plus courants :
- **"Failed to fetch"** dans le formulaire → vérifie que `js/config.js` contient bien tes vraies clés Supabase
- **Page blanche sur GitHub Pages** → vérifie que Pages est bien activé sur la branche `main`
- **Impossible de se connecter à l'espace RH** → vérifie que l'utilisateur a bien été créé dans Authentication → Users, avec "Auto Confirm User" coché
