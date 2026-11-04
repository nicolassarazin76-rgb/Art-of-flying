# Art of Flying — version bleue pour GitHub Pages

Ce dossier est prêt à être publié sur GitHub Pages. Aucun logiciel de compilation, compte ChatGPT ni serveur applicatif n’est nécessaire pour les visiteurs.

## Ce qui est inclus

- La proposition graphique inspirée du fichier de référence, avec le bleu historique `#336699`.
- Les 61 œuvres réparties dans les cinq collections, avec leurs fiches et leurs images.
- Les textes et images des pages d’origine, les pages secondaires, la presse, les témoignages, les vidéos et les documents.
- Une navigation regroupée : Œuvres, Expositions, Les artistes, Journal, Contact.
- Un plan du site permettant de retrouver toutes les rubriques.
- Les images et documents conservés dans `assets/`.

## Publication recommandée : GitHub Desktop

Cette méthode permet de transférer toutes les images en une fois.

1. Décompressez le ZIP sur votre ordinateur. Il faut copier les fichiers décompressés, pas le ZIP lui-même.
2. Sur GitHub, créez un nouveau dépôt nommé par exemple `art-of-flying`. Pour utiliser GitHub Pages avec une offre gratuite, choisissez un dépôt **Public**.
3. Dans GitHub Desktop, clonez ce dépôt sur votre ordinateur.
4. Ouvrez le dossier local du dépôt et copiez-y **tout le contenu** de ce dossier décompressé : `index.html`, les autres pages, les fichiers `.css` et `.js`, le dossier `assets/`, le README et `.nojekyll`.
5. Dans GitHub Desktop, indiquez un résumé, par exemple « Ajouter le site Art of Flying », puis faites **Commit** et **Push origin**. Lors du premier envoi, le bouton peut s’appeler **Publish branch**.
6. Sur la page du dépôt sur GitHub : **Settings → Pages**.
7. Dans **Build and deployment**, choisissez **Deploy from a branch**, puis la branche **main** et le dossier **/(root)**. Cliquez sur **Save**.
8. Attendez la fin du déploiement. GitHub affichera le lien de votre site dans cette même page.

Le fichier `index.html` doit être à la racine du dépôt, au même niveau que `assets/`, et non dans un sous-dossier supplémentaire.

Le fichier `.nojekyll` est un petit fichier vide qui peut être masqué par votre ordinateur. Il est inclus pour que le contenu soit servi comme un site statique. Il n’y a aucune commande de build à exécuter.

## Alternative : directement dans le navigateur

Après avoir créé le dépôt, utilisez **Add file → Upload files**. GitHub limite le nombre de fichiers déposés à la fois : transférez les fichiers par lots de 100 maximum, en conservant le dossier `assets/`. GitHub Desktop reste plus pratique pour cette version, qui comporte plusieurs centaines de fichiers.

## Après publication

- Ouvrez l’accueil, une collection, une fiche d’œuvre et le plan du site.
- Testez une image agrandie, un document PDF et une vidéo.
- Vérifiez aussi le menu sur un téléphone.
- Le contact et la newsletter renvoient au site actuel. Le nouveau livre d’or est indépendant : ses contributions seront activées après le raccordement décrit dans `supabase/ACTIVER-LE-LIVRE-DOR.md`.
- Les vidéos et les polices utilisent des services externes et nécessitent une connexion internet.

## Modifier le site

| Élément | Fichier |
| --- | --- |
| Accueil | `index.html` |
| Couleurs, polices et mise en page | `style.css` |
| Catalogue et données des expositions | `data.js` |
| Fonctionnement des galeries et expositions | `app.js` |
| Menus et agrandissement des images | `media.js` |
| Images et documents | `assets/` |
| Liste de toutes les pages | `plan-site.html` |

Les fiches complètes d’œuvres sont les pages `collection-….html`. La page `oeuvre.html` redirige vers la fiche de l’œuvre sélectionnée. Les menus et pieds de page étant présents dans chaque page HTML, une modification globale de ces éléments doit être appliquée à toutes les pages concernées.

`admin.html` est uniquement la démonstration reprise du fichier de référence : ce n’est pas un espace d’administration sécurisé et il n’enregistre pas les modifications. Pour modifier le site réellement, éditez les fichiers du dépôt, puis faites Commit et Push.

## Domaine art-of-flying.com

Commencez par tester le nouveau site à l’adresse fournie par GitHub. Aucun fichier `CNAME` ni réglage DNS n’est inclus : le site actuel et son domaine ne sont donc pas modifiés par ce dossier. Le raccordement du domaine pourra être fait après validation de la nouvelle version, dans les paramètres Pages et chez le fournisseur du domaine.

## Vérifications effectuées

Les liens locaux, la syntaxe JavaScript, l’intégrité des images et la conservation des textes, images et vidéos des pages éditoriales importées ont été contrôlés. Le rendu visuel sur différents écrans reste à vérifier.

Documentation officielle :
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Les œuvres et photographies restent la propriété de leurs auteurs. Aucune licence ouverte n’est attribuée aux contenus artistiques par ce dossier.

## Nouveau livre d’or

`guestbook.js` et `guestbook-config.js` préparent un livre d’or avec validation par les artistes. L’aperçu du message fonctionne localement. Pour activer son enregistrement et sa publication, suivre `supabase/ACTIVER-LE-LIVRE-DOR.md` et exécuter le SQL fourni. Sans cette configuration, aucun message n’est envoyé.
