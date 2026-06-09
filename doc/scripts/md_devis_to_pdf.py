#!/usr/bin/env python3
"""Convert a Markdown commercial quote (devis) into a professional PDF."""

from __future__ import annotations

import argparse
import html
import re
import sys
from pathlib import Path

import markdown
from weasyprint import CSS, HTML

SCRIPT_DIR = Path(__file__).resolve().parent
DOC_DIR = SCRIPT_DIR.parent
DEFAULT_INPUT = DOC_DIR / "devis-nicolas-morel-site-web.md"
DEFAULT_CSS = SCRIPT_DIR / "devis_pdf.css"

BODY_START = re.compile(r"^#\s+1\.\s", re.MULTILINE)
META_ROW = re.compile(r"^\|\s*(.+?)\s*\|\s*(.+?)\s*\|$")


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def split_cover_and_body(source: str) -> tuple[str, str]:
    match = BODY_START.search(source)
    if not match:
        raise ValueError(
            "Impossible de trouver la section « # 1. » — le fichier ne suit pas le format attendu."
        )
    return source[: match.start()].strip(), source[match.start() :].strip()


def parse_meta_table(block: str) -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []
    for line in block.splitlines():
        if not line.strip().startswith("|"):
            continue
        if re.match(r"^\|\s*-+", line):
            continue
        match = META_ROW.match(line.strip())
        if match:
            rows.append((match.group(1).strip(), match.group(2).strip()))
    return rows


def parse_party_block(block: str) -> dict[str, str | list[str]]:
    lines = [ln.rstrip() for ln in block.splitlines() if ln.strip() and ln.strip() != "---"]
    name = ""
    subtitle = ""
    details: list[str] = []

    idx = 0
    if lines and lines[0].startswith("#"):
        idx = 1

    while idx < len(lines):
        line = lines[idx].strip()
        if line.startswith("**") and line.endswith("**") and not name:
            name = line.strip("*")
            idx += 1
            continue
        if line.startswith("**") and line.endswith("**") and not subtitle:
            subtitle = line.strip("*")
            idx += 1
            continue
        details.append(line)
        idx += 1

    return {
        "name": name,
        "subtitle": subtitle,
        "details": details,
    }


def split_parties(cover: str) -> tuple[str, str, str]:
    udata_match = re.search(r"^#\s+UDATA SRL\s*$", cover, re.MULTILINE)
    client_match = re.search(r"^#\s+Client\s*$", cover, re.MULTILINE)
    if not udata_match or not client_match:
        raise ValueError("Sections « UDATA SRL » et/ou « Client » introuvables.")

    prestataire_raw = cover[udata_match.end() : client_match.start()].strip()
    after_client = cover[client_match.end() :].strip()
    client_block, _, meta_block = after_client.partition("\n---\n")
    return prestataire_raw, client_block.strip(), meta_block.strip()


def extract_reference(meta_rows: list[tuple[str, str]]) -> str:
    for label, value in meta_rows:
        if "référence" in label.lower() or "reference" in label.lower():
            return value
    return "Devis"


def party_lines_html(details: list[str]) -> str:
    paragraphs = []
    for line in details:
        text = line.strip()
        if not text or text.startswith("* "):
            continue
        if ":" in text:
            label, _, value = text.partition(":")
            paragraphs.append(
                f"<p><strong>{html.escape(label.strip())} :</strong> "
                f"{html.escape(value.strip())}</p>"
            )
        else:
            paragraphs.append(f"<p>{html.escape(text)}</p>")
    return "\n".join(paragraphs)


def build_party_html(party: dict[str, str | list[str]], label: str) -> str:
    details = party.get("details") or []
    lines_html = party_lines_html(details) if isinstance(details, list) else ""

    subtitle = party.get("subtitle") or ""
    subtitle_html = (
        f'<p class="party-sub">{html.escape(str(subtitle))}</p>' if subtitle else ""
    )

    return (
        f'<td class="party">'
        f'<p class="party-label">{html.escape(label)}</p>'
        f'<p class="party-name">{html.escape(str(party.get("name") or ""))}</p>'
        f"{subtitle_html}"
        f'<div class="party-lines">{lines_html}</div>'
        f"</td>"
    )


def build_meta_table_html(rows: list[tuple[str, str]]) -> str:
    if not rows:
        return ""
    body = "\n".join(
        f"<tr><td>{html.escape(label)}</td><td>{html.escape(value)}</td></tr>"
        for label, value in rows
    )
    return f'<table class="meta-table"><tbody>{body}</tbody></table>'


def build_cover_html(cover: str) -> str:
    prestataire_raw, client_raw, meta_raw = split_parties(cover)
    meta_rows = parse_meta_table(meta_raw)
    reference = extract_reference(meta_rows)

    prestataire = parse_party_block("# UDATA SRL\n" + prestataire_raw)
    client = parse_party_block("# Client\n" + client_raw)

    return f"""<section class="cover" data-ref="{html.escape(reference)}">
<div class="cover-title"><h1>DEVIS</h1></div>
<table class="parties" role="presentation"><tr>
{build_party_html(prestataire, "Prestataire")}
<td class="party-gap" aria-hidden="true"></td>
{build_party_html(client, "Client")}
</tr></table>
{build_meta_table_html(meta_rows)}
</section>"""


def markdown_to_html(body: str) -> str:
    return markdown.markdown(
        body,
        extensions=["tables", "fenced_code", "sane_lists", "nl2br"],
        output_format="html5",
    )


def postprocess_body_html(content: str) -> str:
    content = content.replace(
        "<h1>14. Bon pour accord</h1>",
        '<h1 class="signature-section">14. Bon pour accord</h1>',
    )
    content = re.sub(
        r"<h2>([\d\s\.]+€ HTVA)</h2>",
        r'<div class="amount-block"><h2>\1</h2>',
        content,
        count=1,
    )
    content = re.sub(
        r"(<div class=\"amount-block\"><h2>[\d\s\.]+€ HTVA</h2>\s*)"
        r"<h2>([\d\s\.]+€ TTC)</h2>",
        r"\1<h2>\2</h2></div>",
        content,
        count=1,
    )
    content = content.replace("<blockquote>", '<blockquote class="notice">')

    sig_idx = content.rfind("<table>")
    if sig_idx != -1:
        content = content[:sig_idx] + '<table class="signature-table">' + content[sig_idx + 7 :]

    return content


def build_document_html(cover_html: str, body_html: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <title>Devis</title>
</head>
<body>
  {cover_html}
  <main class="body-content">
    {body_html}
  </main>
</body>
</html>
"""


def convert_md_to_pdf(
    input_path: Path,
    output_path: Path,
    css_path: Path,
    *,
    write_html: Path | None = None,
) -> None:
    source = read_text(input_path)
    cover, body = split_cover_and_body(source)
    cover_html = build_cover_html(cover)
    body_html = postprocess_body_html(markdown_to_html(body))
    document = build_document_html(cover_html, body_html)

    if write_html:
        write_html.write_text(document, encoding="utf-8")

    css = CSS(filename=str(css_path))
    HTML(string=document, base_url=str(input_path.parent)).write_pdf(
        str(output_path),
        stylesheets=[css],
    )


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Génère un PDF professionnel à partir d'un devis Markdown."
    )
    parser.add_argument(
        "-i",
        "--input",
        type=Path,
        default=DEFAULT_INPUT,
        help="Fichier Markdown source",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Fichier PDF de sortie",
    )
    parser.add_argument(
        "--css",
        type=Path,
        default=DEFAULT_CSS,
        help="Feuille de style CSS pour le PDF",
    )
    parser.add_argument(
        "--html",
        type=Path,
        default=None,
        help="Export HTML intermédiaire (debug)",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    input_path = args.input.resolve()
    output_path = (args.output or input_path.with_suffix(".pdf")).resolve()
    css_path = args.css.resolve()

    if not input_path.is_file():
        print(f"Erreur : fichier introuvable — {input_path}", file=sys.stderr)
        return 1
    if not css_path.is_file():
        print(f"Erreur : CSS introuvable — {css_path}", file=sys.stderr)
        return 1

    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        convert_md_to_pdf(
            input_path,
            output_path,
            css_path,
            write_html=args.html.resolve() if args.html else None,
        )
    except Exception as exc:  # noqa: BLE001
        print(f"Erreur lors de la génération du PDF : {exc}", file=sys.stderr)
        return 1

    print(f"PDF généré : {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
