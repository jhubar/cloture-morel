---
name: update-qa-urls
description: >-
  Keeps tests/qa-urls.md in sync after every user-visible change: new or
  modified routes, catalogue prices, products, galleries, and matériel
  subsections. Use when editing data/catalog.json, app/**/page.tsx,
  lib/assets.ts, lib/families.ts, app/materiel/page.tsx, or when finishing a
  feature that needs browser QA. Also use when the user mentions qa-urls,
  recette, URLs de test, or vérification navigateur.
---

# Mettre à jour tests/qa-urls.md

Après **chaque** changement visible (prix, produit, image, route, section),
mettre à jour [`tests/qa-urls.md`](../../../tests/qa-urls.md) **dans le même
tour** que le code. Ne pas attendre que l'utilisateur le demande.

Le fichier est la checklist de recette : une URL cliquable par page à ouvrir,
dans l'ordre, sur `http://localhost:3000`.

## Quand mettre à jour

| Changement | Action dans qa-urls.md |
|---|---|
| Prix / conditionnement catalogue | Corriger les montants et nbre/palette dans la section concernée |
| Nouveau produit / variante | Ajouter la ligne (réf + prix) + URL famille/catégorie |
| Nouvelle galerie / photos | Mettre à jour le compte de photos et l'URL de la fiche |
| Nouvelle page `app/*/page.tsx` | Ajouter un lien `- [ ] [Label](http://localhost:3000/…)` |
| Nouvelle section matériel | Ajouter l'ancre `#materiel-<id>` |
| Nouveau groupe / sous-paragraphe atelier | Ajouter l'ancre groupe + tableau « attendu » |
| Suppression / déplacement | Retirer ou réécrire le lien obsolète |
| Changement interne (types, tests, skill) | Ne rien ajouter |

## Construction des URLs

Base : `http://localhost:3000` (jamais un autre host).

| Surface | Forme |
|---|---|
| Catalogue famille | `/catalogue?famille=<family-id>` |
| Catalogue catégorie | `/catalogue?famille=<family-id>&category=<category-id>` |
| Matériel | `/materiel` |
| Section matériel | `/materiel#materiel-<id>` |
| Groupe atelier | `/materiel#materiel-<activity-id>-<group-id>` |
| Panier | `/panier` |
| Pose / devis | `/pose#devis` |

IDs familles : clés de `FAMILY_META` dans [`lib/families.ts`](../../../lib/families.ts).
IDs catégories : `category.id` dans [`data/catalog.json`](../../../data/catalog.json).
IDs matériel : champ `id` des `categories` / `groups` dans [`app/materiel/page.tsx`](../../../app/materiel/page.tsx).

## Format d'une entrée

```markdown
- [ ] [Label lisible](http://localhost:3000/chemin)

**À vérifier :**
- point concret (prix, photo, texte, placeholder)
```

Règles :

- Cases `- [ ]` (décocher une ligne dont le critère a changé).
- Label en français, court, identique au wording du site si possible.
- Toujours dire **quoi vérifier**, pas seulement l'URL.
- Prix en EUR HTVA, format `fr-BE` (`1 210,30`).
- Compter les photos réellement servies (liste `seq(...)` dans `lib/assets.ts`).
- Ne pas lister tout le catalogue : seulement les pages **touchées** + les
  parcours liés (panier si le prix / l'unité de vente change).
- Garder les sections encore pertinentes. Ne pas réécrire tout le fichier
  pour un petit ajout : insérer au bon endroit.
- La section « Pages de contexte » (accueil, grille catalogue, contact) reste
  en fin de fichier.

## Ordre des sections

1. Catalogue — familles / produits touchés
2. Pages métier (`/materiel`, `/pose`, …)
3. Parcours panier / devis si le prix ou l'unité de vente change
4. Régression (accueil, grille, contact)
5. Rappel `npm test` si des tests ont été ajoutés ou le compte a changé

## Fin de tour

1. Relire `qa-urls.md` : chaque URL doit ouvrir la page réellement modifiée.
2. Si le serveur tourne déjà, ne pas le relancer. Sinon, le proposer.
3. Mentionner le fichier mis à jour dans le résumé à l'utilisateur.
