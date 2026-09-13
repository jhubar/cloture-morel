# URLs de recette — mises à jour 2026

Ouvrir les liens **dans l'ordre**, un par un, sur le serveur local (`npm run dev`).
Base par défaut : [http://localhost:3000](http://localhost:3000). Si le port change, remplacer dans le navigateur.

Chaque ligne = une page à inspecter. Cocher au fur et à mesure.

---

## 1. Piquets acacia — tarifs palette + camion

- [ ] [Catalogue — Piquets bois](http://localhost:3000/catalogue?famille=piquets-en-robiniers-faux-acacia-ronds)

**À vérifier :**

| Variante | Palette 2026 | €/pc | Camion €/pc | Nbre/palette |
|---|---:|---:|---:|---:|
| 160 cm Ø 8/10 | 529,00 | 5,29 | 4,90 | 100 |
| 160 cm Ø 10/12 | 790,00 | 7,90 | 7,32 | **100** (était 70) |
| 180 cm Ø 8/10 | 595,00 | 5,95 | 5,51 | 100 |
| 180 cm Ø 10/12 | 622,30 | 8,89 | 8,23 | 70 |
| 200 cm Ø 8/10 | 661,00 | 6,61 | 6,12 | 100 |
| 200 cm Ø 10/12 | 691,60 | 9,88 | 9,15 | 70 |
| 250 cm Ø 8/10 | 827,00 | 8,27 | 7,65 | 100 |
| 250 cm Ø 10/12 | 864,50 | 12,35 | 11,43 | 70 |
| 300 cm Ø 10/12 | 1 037,40 | 14,82 | 13,72 | 70 |
| 350 cm Ø 10/12 | 1 210,30 | 17,29 | 16,00 | **70** (était 60) |
| 350 cm Ø 12/14 (hors PDF) | 1 317,00 | 26,34 | 24,39 | 50 |
| 450 cm Ø 12/14 (hors PDF) | 1 693,50 | 33,87 | 31,36 | 50 |

Ajouter 1 palette au panier, puis ouvrir le [panier](http://localhost:3000/panier) : le total doit être le **prix palette**, pas le prix pièce.

---

## 2. Barrières galvanisées Bateman — montants inchangés

- [ ] [Catalogue — Barrières métal](http://localhost:3000/catalogue?famille=barrieres-galvanisees)
- [ ] [7 tubes fixes H.120](http://localhost:3000/catalogue?famille=barrieres-galvanisees&category=barrieres-fixes-en-7-tubes-h-120-cm) — 133,53 / 163,50 / 220,00 €
- [ ] [Extensibles 5 tubes](http://localhost:3000/catalogue?famille=barrieres-galvanisees&category=barrieres-extensibles-en-5-tubes-h-120-cm) — 265,00 / 300,00 €
- [ ] [Demi grillagées H.120](http://localhost:3000/catalogue?famille=barrieres-galvanisees&category=barrieres-demi-grillagees-h-120-cm) — 113,62 / 161,24 / 181,20 / 221,09 €
- [ ] [Entièrement grillagées H.150 / H.180](http://localhost:3000/catalogue?famille=barrieres-galvanisees&category=barrieres-entierement-grillagees-h-150-cm-et-h-180-cm) — 266,02 / 453,83 / 563,80 €
- [ ] [Poteaux galvanisés](http://localhost:3000/catalogue?famille=barrieres-galvanisees&category=poteaux-galvanises-pour-barrieres) — Support 80,00 / 148,38 € · Récepteur 64,70 / 138,70 €
- [ ] [Quincaillerie](http://localhost:3000/catalogue?famille=barrieres-galvanisees&category=quincailleries-pour-barrieres-galvanisees) — 24,32 / 11,13 / 23,84 / 23,00 €
- [ ] [Passage canadien](http://localhost:3000/catalogue?famille=barrieres-galvanisees&category=passage-canadien) — 2 150,00 €

---

## 3. Outillage — clameuse + dérouleuse

- [ ] [Catalogue — Outillage & accessoires](http://localhost:3000/catalogue?famille=outillage-et-accessoires-clotures)

**Clameuse Stockade — à sélectionner dans le picker de variantes :**

| Référence | Prix HTVA |
|---|---:|
| Stockade ST315I | 1 090,00 |
| Consommable ST 315I (pack) | 150,00 |
| Clames 33 mm | 147,00 |
| Clames 40 mm | 128,00 |
| Cartouche de gaz | 12,00 |
| Carton de cartouches de gaz | 120,00 |

**Dérouleuse de grillage (« Pour mini pelles et autres ») :**

- [ ] Ouvrir la galerie : 11 photos (1–8 existantes + **9, 10, 11** nouvelles)
- Prix inchangé : 7 200,00 €

---

## 4. Page matériel — dérouleuses + atelier / ferronnerie

- [ ] [Matériel](http://localhost:3000/materiel)
- [ ] [Matériel — Dérouleuses](http://localhost:3000/materiel#materiel-derouleuses) — galerie 11 photos
- [ ] [Matériel — Atelier](http://localhost:3000/materiel#materiel-atelier)
- [ ] [Matériel — Ferronnerie](http://localhost:3000/materiel#materiel-atelier-ferronnerie)

**Sous-paragraphes Ferronnerie :**

| Sous-paragraphe | Attendu |
|---|---|
| Réalisation de bacs en corten | Titre + texte sur mesure / patine corten + **galerie 2 photos** (plus de placeholder) |
| Couvre-mur en corten | Titre + texte sur mesure / patine corten + « Photos à venir » |
| Équilibrage de rotors à axe horizontal | Titre + « Description à compléter » + « Photos à venir » |

---

## 5. Parcours panier / devis (après avoir ajouté des articles)

- [ ] [Panier](http://localhost:3000/panier)
- [ ] [Pose / devis](http://localhost:3000/pose#devis)

Vérifier qu'un piquet est bien facturé **à la palette** et qu'un consommable Stockade est facturé **à l'unité**.

---

## 6. Pages de contexte (régression rapide)

- [ ] [Accueil](http://localhost:3000/)
- [ ] [Catalogue (grille familles)](http://localhost:3000/catalogue)
- [ ] [Contact](http://localhost:3000/contact)

---

## Rappel tests automatisés

```bash
npm test
```

92 tests tarif 2026 (piquets, Bateman, Stockade + 4 nouveaux SKU).
