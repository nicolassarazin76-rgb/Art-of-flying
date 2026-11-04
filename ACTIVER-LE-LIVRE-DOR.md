# Activer le nouveau livre d’or

Le nouveau livre d’or ne renvoie plus au site Artmajeur. Les quatre témoignages existants sont conservés dans la page. Les nouveaux messages doivent être enregistrés dans un service séparé : GitHub Pages sert uniquement les fichiers du site.

## Fonctionnement prévu

1. Le visiteur indique son nom ou pseudonyme et son message, sans créer de compte.
2. Il accepte leur publication, puis soumet son message.
3. Le message est enregistré avec `approved = false`. Il n’est pas visible par les visiteurs.
4. Les artistes le relisent dans le tableau de bord Supabase, puis passent `approved` à `true` pour le publier, ou le suppriment.
5. La page publique récupère uniquement les messages approuvés. Les visiteurs ne peuvent ni modifier, ni supprimer, ni approuver les messages.

## Installation

1. Créer ou choisir un projet Supabase.
2. Dans le SQL Editor de ce projet, exécuter `guestbook-setup.sql`.
3. Dans les paramètres Data API / Integrations, vérifier que la table `public.guestbook_entries` est exposée. Les droits et les règles de lecture/écriture sont définis dans le SQL fourni.
4. Dans le dialogue Connect du projet, relever le **Project URL** et la **publishable key** commençant par `sb_publishable_`.
5. Dans `guestbook-config.js` à la racine des fichiers du site, renseigner `supabaseUrl` et `publishableKey`, puis publier ces fichiers sur GitHub.

La clé publishable est prévue pour figurer dans le code public. Ne jamais mettre de clé secrète `sb_secret_` ni de clé `service_role` dans ce fichier, le dépôt GitHub ou la page du site.

## Modération

Dans Supabase, ouvrir Table Editor → guestbook_entries. Les nouvelles lignes ont `approved = false`. Relire le texte et le nom. Pour publier, mettre `approved` à `true`, puis enregistrer. Pour retirer un témoignage publié, remettre `approved` à `false` ou supprimer sa ligne. Les droits de modération restent ceux du propriétaire du projet Supabase ; aucune connexion administrateur n’est stockée dans le site public.

Les quatre anciens messages sont conservés séparément dans `livre-or.html` : inutile de les ajouter une seconde fois à la base.

## Vérification après connexion

- Soumettre un message de test. Le formulaire doit annoncer sa réception uniquement si le serveur confirme l’enregistrement.
- Recharger la page : le message en attente ne doit pas être public.
- Approuver ce message dans Supabase, puis recharger : il doit apparaître.
- Masquer de nouveau le message, puis recharger : il ne doit plus apparaître.
- Avec la clé publishable, vérifier que les tentatives de lecture des messages en attente, de modification d’une ligne, de suppression et de dépôt avec `approved = true` échouent.

Sans cette configuration, le bouton d’envoi reste désactivé et aucun message n’est transmis. L’aperçu local permet seulement de visualiser son texte. Un échec réseau ne produit jamais de confirmation d’envoi et conserve le texte dans le formulaire.

Documentation :
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://supabase.com/docs/guides/api/creating-routes
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/getting-started/api-keys
