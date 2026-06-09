#!/usr/bin/env python3
"""Convert Eshop.xlsx catalogue into structured Markdown files for the quote configurator."""

from __future__ import annotations

import json
import re
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
PROJECT_ROOT = ROOT.parent
EXCEL_PATH = ROOT / "Eshop.xlsx"
OUT_DIR = ROOT / "catalogue"
CATALOG_JSON_PATH = PROJECT_ROOT / "data" / "catalog.json"


def slugify(text: str) -> str:
    text = text.lower().strip()
    for src, dst in (
        ("àâä", "a"),
        ("éèêë", "e"),
        ("îï", "i"),
        ("ôö", "o"),
        ("ùûü", "u"),
        ("ç", "c"),
    ):
        for ch in src:
            text = text.replace(ch, dst)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:80]


def cell(row, col: int) -> str | None:
    if col >= len(row):
        return None
    value = row.iloc[col]
    if pd.isna(value):
        return None
    text = str(value).strip()
    return text or None


def parse_price(value) -> float | str | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).strip().replace(",", ".")
    if text.lower() in {"sur demande", "nan"}:
        return text
    try:
        return float(text)
    except ValueError:
        return text


def format_price(value) -> str:
    if value is None:
        return "—"
    if isinstance(value, float):
        return f"{value:.2f}".rstrip("0").rstrip(".")
    return str(value)


def is_note_text(text: str) -> bool:
    lowered = text.lower()
    starters = (
        "possibilité",
        "prix dégressif",
        "prix degressif",
        "nos ",
        "si achat",
    )
    return len(text) > 100 or any(lowered.startswith(prefix) for prefix in starters)


def find_next_header_row(df: pd.DataFrame, start_idx: int) -> int | None:
    for idx in range(start_idx, min(start_idx + 5, len(df))):
        if cell(df.iloc[idx], 0) == "Articles":
            return idx
    return None


def detect_format(header_row) -> str:
    c2 = cell(header_row, 2) or ""
    c4 = cell(header_row, 4) or ""
    c6 = cell(header_row, 6) or ""

    if c2 == "Tête" or c4 in {"Mortaises", "Mortaise"}:
        return "equestre"
    if c4 == "Modèle":
        return "poteaux_barriere"
    if c2 == "Taille" and c4 == "Prix unitaire htva":
        return "passage_canadien"
    if c4 == "Prix" and c2 == "Référence":
        return "quincaillerie_simple"
    if c6 == "Note" and c4 == "Prix unitaire htva":
        return "standard_note"
    if "taille rlx" in c6.lower():
        return "brandes"
    if "mètres" in c6.lower() or "rlx" in c6.lower():
        return "grillage"
    if "palette" in c6.lower():
        return "palette"
    if "rouleau" in c6.lower():
        return "ganivelles"
    if "quantité" in c6.lower() or "pack" in c6.lower():
        return "outillage"
    return "standard"


def parse_product_row(row, fmt: str, dual: bool = False) -> list[dict]:
    article = cell(row, 0)
    if not article:
        return []

    product: dict = {"article": article}

    if fmt == "equestre":
        product.update(
            {
                "tete": cell(row, 2),
                "mortaises": cell(row, 4),
                "info": cell(row, 6),
                "prix_unitaire_htva": parse_price(cell(row, 8)),
                "dimension": cell(row, 10),
                "section": cell(row, 11),
                "note": cell(row, 12),
            }
        )
    elif fmt == "poteaux_barriere":
        product.update(
            {
                "reference": cell(row, 2),
                "modele": cell(row, 4),
                "prix_unitaire_htva": parse_price(cell(row, 6)),
                "note": cell(row, 8),
            }
        )
    elif fmt == "passage_canadien":
        product.update(
            {
                "taille": cell(row, 2),
                "prix_unitaire_htva": parse_price(cell(row, 4)),
                "note": cell(row, 6),
            }
        )
    elif fmt == "quincaillerie_simple":
        product.update(
            {
                "reference": cell(row, 2),
                "prix_unitaire_htva": parse_price(cell(row, 4)),
            }
        )
    elif fmt == "standard_note":
        product.update(
            {
                "reference": cell(row, 2),
                "prix_unitaire_htva": parse_price(cell(row, 4)),
                "note": cell(row, 6),
            }
        )
    elif fmt == "grillage":
        product.update(
            {
                "reference": cell(row, 2),
                "prix_unitaire_htva": parse_price(cell(row, 4)),
                "metres_par_rlx": cell(row, 6),
                "note": cell(row, 8),
            }
        )
    elif fmt == "palette":
        product.update(
            {
                "reference": cell(row, 2),
                "prix_unitaire_htva": parse_price(cell(row, 4)),
                "nombre_par_palette": cell(row, 6),
                "note": cell(row, 8),
            }
        )
    elif fmt == "ganivelles":
        product.update(
            {
                "reference": cell(row, 2),
                "prix_unitaire_htva": parse_price(cell(row, 4)),
                "taille_rouleau": cell(row, 6),
                "note": cell(row, 8),
            }
        )
    elif fmt == "brandes":
        product.update(
            {
                "reference": cell(row, 2),
                "prix_unitaire_htva": parse_price(cell(row, 4)),
                "taille_rlx": cell(row, 6),
            }
        )
    elif fmt == "outillage":
        product.update(
            {
                "reference": cell(row, 2),
                "prix_unitaire_htva": parse_price(cell(row, 4)),
                "quantite_pack": cell(row, 6),
                "note": cell(row, 8),
            }
        )
    else:
        product.update(
            {
                "reference": cell(row, 2),
                "prix_unitaire_htva": parse_price(cell(row, 4)),
                "note": cell(row, 8),
            }
        )

    if dual and cell(row, 13):
        product["prix_camion_complet_htva"] = parse_price(cell(row, 15))
        if cell(row, 17):
            product["nombre_par_palette_camion"] = cell(row, 17)
        if cell(row, 19):
            product["note_camion"] = cell(row, 19)

    return [product]


TOP_LEVEL_CATEGORIES = {
    "Piquets en robiniers faux acacia ronds",
    "Outillage et accessoires clôtures",
    "Ganivelles en robiniers faux acacia",
}


def is_group_header(df: pd.DataFrame, idx: int) -> bool:
    header_idx = find_next_header_row(df, idx + 1)
    if header_idx is None:
        return not is_note_text(cell(df.iloc[idx], 0) or "")
    for j in range(idx + 1, header_idx):
        text = cell(df.iloc[j], 0)
        if text and text != "Articles":
            return True
    return False


def parse_categories(df: pd.DataFrame) -> list[dict]:
    categories: list[dict] = []
    current_group: str | None = None
    idx = 0

    while idx < len(df):
        row = df.iloc[idx]
        title = cell(row, 0)

        if title and title != "Articles" and not parse_price(cell(row, 4)):
            if is_group_header(df, idx):
                if not is_note_text(title):
                    current_group = title
                elif categories:
                    categories[-1]["notes"].append(title)
                idx += 1
                continue

            header_idx = find_next_header_row(df, idx + 1)
            if header_idx:
                category_title = title
                for j in range(header_idx - 1, idx, -1):
                    previous = cell(df.iloc[j], 0)
                    if previous:
                        category_title = previous
                        break

                parent = current_group if category_title != current_group else None
                if category_title in TOP_LEVEL_CATEGORIES:
                    parent = None
                    current_group = None
                fmt = detect_format(df.iloc[header_idx])
                dual = cell(df.iloc[header_idx], 11) == "Articles"

                notes: list[str] = []
                products: list[dict] = []
                j = header_idx + 1

                while j < len(df):
                    current = df.iloc[j]
                    if cell(current, 0) == "Articles":
                        break

                    text = cell(current, 0)
                    if (
                        text
                        and find_next_header_row(df, j + 1)
                        and not parse_price(cell(current, 4))
                        and cell(current, 2) is None
                    ):
                        break

                    if text and is_note_text(text):
                        notes.append(text)
                        j += 1
                        continue

                    parsed = parse_product_row(current, fmt, dual)
                    if parsed:
                        products.extend(parsed)
                    elif (
                        text
                        and not parse_price(cell(current, 4))
                        and cell(current, 2) is None
                        and fmt != "equestre"
                    ):
                        next_header = find_next_header_row(df, j + 1)
                        if next_header and j + 1 <= next_header <= j + 3:
                            break

                    j += 1

                categories.append(
                    {
                        "title": category_title,
                        "parent": parent,
                        "format": fmt,
                        "dual_pricing": dual,
                        "notes": notes,
                        "products": products,
                    }
                )
                idx = j
                continue

        idx += 1

    return categories


TABLE_HEADERS = {
    "equestre": [
        "Article",
        "Tête",
        "Mortaises",
        "Info",
        "Prix HTVA (€)",
        "Dimension",
        "Section",
    ],
    "poteaux_barriere": ["Article", "Référence", "Modèle", "Prix HTVA (€)", "Disponibilité"],
    "passage_canadien": ["Article", "Taille", "Prix HTVA (€)", "Disponibilité"],
    "quincaillerie_simple": ["Article", "Référence", "Prix HTVA (€)"],
    "standard_note": ["Article", "Référence", "Prix HTVA (€)", "Disponibilité"],
    "grillage": ["Article", "Référence", "Prix HTVA (€)", "Mètres/rlx", "Disponibilité"],
    "palette": [
        "Article",
        "Référence",
        "Prix HTVA (€)",
        "Prix camion complet (€)",
        "Nb/palette",
        "Disponibilité",
    ],
    "ganivelles": ["Article", "Référence", "Prix HTVA (€)", "Taille/rouleau", "Disponibilité"],
    "brandes": ["Article", "Référence", "Prix HTVA (€)", "Taille rlx"],
    "outillage": ["Article", "Référence", "Prix HTVA (€)", "Quantité/pack", "Disponibilité"],
    "standard": ["Article", "Référence", "Prix HTVA (€)", "Disponibilité"],
}


def product_to_row(product: dict, fmt: str) -> list[str]:
    if fmt == "equestre":
        return [
            product["article"],
            product.get("tete") or "—",
            product.get("mortaises") or "—",
            product.get("info") or "—",
            format_price(product.get("prix_unitaire_htva")),
            product.get("dimension") or "—",
            product.get("section") or "—",
        ]
    if fmt == "poteaux_barriere":
        return [
            product["article"],
            product.get("reference") or "—",
            product.get("modele") or "—",
            format_price(product.get("prix_unitaire_htva")),
            product.get("note") or "—",
        ]
    if fmt == "passage_canadien":
        return [
            product["article"],
            product.get("taille") or "—",
            format_price(product.get("prix_unitaire_htva")),
            product.get("note") or "—",
        ]
    if fmt == "quincaillerie_simple":
        return [
            product["article"],
            product.get("reference") or "—",
            format_price(product.get("prix_unitaire_htva")),
        ]
    if fmt == "grillage":
        return [
            product["article"],
            product.get("reference") or "—",
            format_price(product.get("prix_unitaire_htva")),
            product.get("metres_par_rlx") or "—",
            product.get("note") or "—",
        ]
    if fmt == "palette":
        return [
            product["article"],
            product.get("reference") or "—",
            format_price(product.get("prix_unitaire_htva")),
            format_price(product.get("prix_camion_complet_htva")),
            str(product.get("nombre_par_palette") or "—"),
            product.get("note") or "—",
        ]
    if fmt == "ganivelles":
        return [
            product["article"],
            product.get("reference") or "—",
            format_price(product.get("prix_unitaire_htva")),
            product.get("taille_rouleau") or "—",
            product.get("note") or "—",
        ]
    if fmt == "brandes":
        return [
            product["article"],
            product.get("reference") or "—",
            format_price(product.get("prix_unitaire_htva")),
            product.get("taille_rlx") or "—",
        ]
    if fmt == "outillage":
        return [
            product["article"],
            product.get("reference") or "—",
            format_price(product.get("prix_unitaire_htva")),
            product.get("quantite_pack") or "—",
            product.get("note") or "—",
        ]
    return [
        product["article"],
        product.get("reference") or "—",
        format_price(product.get("prix_unitaire_htva")),
        product.get("note") or "—",
    ]


def yaml_value(value) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    escaped = str(value).replace('"', '\\"')
    return f'"{escaped}"'


def render_category_md(category: dict) -> str:
    category_id = slugify(category["title"])
    parent_id = slugify(category["parent"]) if category.get("parent") else None
    fmt = category["format"]
    headers = TABLE_HEADERS.get(fmt, TABLE_HEADERS["standard"])

    lines = [
        "---",
        f"id: {category_id}",
        f'title: "{category["title"]}"',
        f"parent: {yaml_value(parent_id)}",
        f"format: {fmt}",
        f"dual_pricing: {yaml_value(category.get('dual_pricing', False))}",
        f"product_count: {len(category['products'])}",
        "source: doc/Eshop.xlsx",
        "---",
        "",
        f"# {category['title']}",
        "",
    ]

    if category.get("parent"):
        lines.extend(
            [
                f"Catégorie parente : [{category['parent']}](../{slugify(category['parent'])}.md)",
                "",
            ]
        )

    if category.get("notes"):
        lines.extend(["## Informations", ""])
        for note in category["notes"]:
            lines.append(f"- {note}")
        lines.append("")

    lines.extend(["## Produits", ""])
    lines.append("| " + " | ".join(headers) + " |")
    lines.append("| " + " | ".join(["---"] * len(headers)) + " |")

    for product in category["products"]:
        row = product_to_row(product, fmt)
        lines.append("| " + " | ".join(row) + " |")

    lines.extend(["", "## Données structurées (JSON)", "", "```json"])
    lines.append(json.dumps(category["products"], ensure_ascii=False, indent=2))
    lines.extend(["```", ""])

    return "\n".join(lines)


def render_index_md(categories: list[dict]) -> str:
    parents: dict[str | None, list[dict]] = {}
    for category in categories:
        parents.setdefault(category.get("parent"), []).append(category)

    lines = [
        "---",
        "title: Catalogue Clôture Morel",
        "source: doc/Eshop.xlsx",
        f"category_count: {len(categories)}",
        f"product_count: {sum(len(c['products']) for c in categories)}",
        "---",
        "",
        "# Catalogue produits — Clôture Morel",
        "",
        "Catalogue extrait du fichier Excel client `Eshop.xlsx`, structuré pour alimenter le configurateur de devis.",
        "",
        "Tous les prix sont **HTVA** (hors TVA).",
        "",
        "## Catégories",
        "",
    ]

    standalone = parents.get(None, [])
    parent_names = sorted({c.get("parent") for c in categories if c.get("parent")})

    for category in standalone:
        if category["title"] in parent_names:
            continue
        lines.append(
            f"- [{category['title']}](./{slugify(category['title'])}.md) — {len(category['products'])} produit(s)"
        )

    for parent in parent_names:
        lines.append("")
        lines.append(f"### {parent}")
        lines.append("")
        for category in parents.get(parent, []):
            lines.append(
                f"- [{category['title']}](./{slugify(category['title'])}.md) — {len(category['products'])} produit(s)"
            )

    lines.extend(
        [
            "",
            "## Formats de fiche",
            "",
            "| Format | Usage |",
            "| --- | --- |",
            "| `palette` | Piquets avec tarif standard et camion complet |",
            "| `grillage` | Grillages, barbelés, fils (prix au rouleau) |",
            "| `standard_note` | Barrières avec référence et disponibilité |",
            "| `poteaux_barriere` | Poteaux galvanisés (modèle support/récepteur) |",
            "| `equestre` | Clôtures équestres et pin Nobifix |",
            "| `ganivelles` | Ganivelles et portillons |",
            "| `outillage` | Outillage et accessoires |",
            "",
        ]
    )

    return "\n".join(lines)


def product_label(product: dict, fmt: str) -> str:
    parts = [product.get("article") or ""]
    if fmt == "equestre":
        for key in ("section", "dimension", "tete", "mortaises", "info"):
            if product.get(key):
                parts.append(str(product[key]))
    elif product.get("reference"):
        parts.append(str(product["reference"]))
    elif product.get("modele"):
        parts.append(str(product["modele"]))
    elif product.get("taille"):
        parts.append(str(product["taille"]))
    return " — ".join(p for p in parts if p)


def export_catalog_json(categories: list[dict]) -> None:
    parent_slugs = {
        c["title"]: slugify(c["title"])
        for c in categories
        if any(other.get("parent") == c["title"] for other in categories)
    }
    for title in {c.get("parent") for c in categories if c.get("parent")}:
        if title:
            parent_slugs.setdefault(title, slugify(title))

    catalog_categories = []
    for category in categories:
        category_id = slugify(category["title"])
        fmt = category["format"]
        products = []
        for index, product in enumerate(category["products"]):
            reference = (
                product.get("reference")
                or product.get("section")
                or product.get("taille")
                or product.get("modele")
                or str(index)
            )
            product_id = slugify(f"{category_id}-{reference}-{index}")
            # Colonne Excel « Référence » uniquement (pas la « Taille » du passage canadien).
            catalog_reference = product.get("reference")
            if not catalog_reference and fmt == "equestre":
                catalog_reference = product.get("section")
            entry = {
                "id": product_id,
                "label": product_label(product, fmt),
                "article": product.get("article"),
                "reference": catalog_reference,
                "prixUnitaireHTVA": product.get("prix_unitaire_htva"),
                "disponibilite": product.get("note"),
                "details": {
                    k: v
                    for k, v in product.items()
                    if k
                    not in {
                        "article",
                        "reference",
                        "prix_unitaire_htva",
                        "note",
                        "prix_camion_complet_htva",
                    }
                    and v is not None
                },
            }
            if product.get("prix_camion_complet_htva") is not None:
                entry["prixCamionCompletHTVA"] = product["prix_camion_complet_htva"]
            products.append(entry)

        parent_title = category.get("parent")
        catalog_categories.append(
            {
                "id": category_id,
                "title": category["title"],
                "parent": parent_slugs.get(parent_title) if parent_title else None,
                "parentTitle": parent_title,
                "format": fmt,
                "dualPricing": category.get("dual_pricing", False),
                "notes": category.get("notes", []),
                "products": products,
            }
        )

    payload = {
        "generatedAt": pd.Timestamp.now().isoformat(),
        "source": "doc/Eshop.xlsx",
        "currency": "EUR",
        "taxNote": "Tous les prix sont HTVA",
        "categories": catalog_categories,
    }
    CATALOG_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    CATALOG_JSON_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def main() -> None:
    df = pd.read_excel(EXCEL_PATH, sheet_name=0, header=None)
    categories = parse_categories(df)

    if OUT_DIR.exists():
        for path in OUT_DIR.glob("*.md"):
            path.unlink()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for category in categories:
        filename = OUT_DIR / f"{slugify(category['title'])}.md"
        filename.write_text(render_category_md(category), encoding="utf-8")

    index_path = OUT_DIR / "README.md"
    index_path.write_text(render_index_md(categories), encoding="utf-8")
    export_catalog_json(categories)

    print(f"Generated {len(categories)} category files in {OUT_DIR}")
    print(f"Generated catalog JSON at {CATALOG_JSON_PATH}")
    print(f"Total products: {sum(len(c['products']) for c in categories)}")


if __name__ == "__main__":
    main()
