# PDF & e-mail — fonctionnement

Ce document décrit le flux des demandes de devis matériaux, de pose et de
contact, ainsi que la configuration nécessaire.

## Vue d'ensemble

| Flux | Route API | PDF | E-mails |
|------|-----------|-----|---------|
| Devis matériaux | `POST /api/devis-materiaux` | Oui (récapitulatif) | Nicolas + client |
| Devis pose | `POST /api/devis-pose` | Non | Nicolas + client |
| Contact | `POST /api/contact` | Non | Nicolas |

Toutes les routes tournent en **runtime Node.js** (requis par `@react-pdf/renderer`).

## Chaîne de traitement (devis matériaux)

1. Le client compose son panier (Zustand, persistant dans le navigateur).
2. Sur `/panier`, le formulaire envoie `{ customer, items: [{ productId, quantity }] }`.
3. Le serveur **revalide** avec Zod (`lib/validation.ts`) et **re-dérive les prix
   depuis le catalogue** (`lib/quote.ts`) — les prix envoyés par le client ne sont
   jamais utilisés.
4. Le PDF est généré (`lib/pdf/MaterialsQuotePdf.tsx`) via `renderToBuffer`.
5. Les e-mails sont envoyés (`lib/email.ts`) avec le PDF en pièce jointe.
6. La réponse renvoie le PDF en base64 → bouton de téléchargement côté client.

## Dégradation gracieuse

Si `RESEND_API_KEY` n'est pas défini :

- la demande **réussit quand même** ;
- le PDF est **généré et téléchargeable** ;
- l'UI affiche un avertissement (`emailWarning`) ;
- le contenu est journalisé côté serveur (`console.warn`).

Cela permet de développer et déployer sans bloquer sur la configuration e-mail.

## Configuration

Copier `.env.example` vers `.env.local` et renseigner :

```
RESEND_API_KEY=...                # clé Resend
EMAIL_FROM=Clôtures Morel <devis@clotures-morel.be>   # expéditeur vérifié
QUOTE_NOTIFICATION_EMAIL=nicolas@...                  # destinataire interne
```

- Créer un compte sur https://resend.com.
- Vérifier le domaine d'envoi (DNS) pour `EMAIL_FROM`.
- En test, on peut utiliser `onboarding@resend.dev` comme expéditeur.

## Mise à jour du catalogue

Le catalogue (`data/catalog.json`) est généré depuis l'Excel client par
`doc/scripts/excel_to_md.py` :

```
npm run catalog:update
```

Aucune donnée produit n'est dupliquée dans le code — tout vient du catalogue.

## Pistes d'évolution (hors périmètre v1)

- Upload de photos pour la demande de pose (UploadThing / S3).
- Stockage des demandes (base de données) si un historique devient nécessaire.
- Protection anti-spam (honeypot / captcha) sur les formulaires publics.
