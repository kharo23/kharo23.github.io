#!/usr/bin/env python3
"""Genera l'esempio PDF pubblico della landing Preventivi Facili per idraulici."""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "preventivi-facili" / "idraulici" / "esempio-preventivo-impianto-idraulico.pdf"

INK = colors.HexColor("#111827")
BLUE = colors.HexColor("#2563EB")
MUTED = colors.HexColor("#64748B")
LINE = colors.HexColor("#DCE3EC")
SOFT = colors.HexColor("#F4F7FB")


def euro(value: float) -> str:
    return f"{value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".") + " EUR"


def build() -> None:
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="Brand", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=15, leading=18, textColor=BLUE))
    styles.add(ParagraphStyle(name="Meta", parent=styles["Normal"], fontName="Helvetica", fontSize=8.5, leading=12, textColor=MUTED))
    styles.add(ParagraphStyle(name="Heading", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=24, leading=29, textColor=INK, spaceAfter=5 * mm))
    styles.add(ParagraphStyle(name="Label", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=MUTED, spaceAfter=2 * mm))
    styles.add(ParagraphStyle(name="Body", parent=styles["Normal"], fontName="Helvetica", fontSize=9.5, leading=14, textColor=INK))
    styles.add(ParagraphStyle(name="Right", parent=styles["Body"], alignment=TA_RIGHT))
    styles.add(ParagraphStyle(name="Fine", parent=styles["Normal"], fontName="Helvetica", fontSize=7.5, leading=11, textColor=MUTED))

    doc = SimpleDocTemplate(
        str(OUT), pagesize=A4,
        rightMargin=18 * mm, leftMargin=18 * mm,
        topMargin=16 * mm, bottomMargin=15 * mm,
        title="Esempio di preventivo per impianto idraulico",
        author="Kharonte Studio",
        subject="Esempio illustrativo di preventivo PDF per idraulici",
    )

    story = []
    header = Table([
        [Paragraph("PREVENTIVI FACILI", styles["Brand"]), Paragraph("ESEMPIO ILLUSTRATIVO", styles["Right"])],
        [Paragraph("PDF di esempio per idraulici e termoidraulici", styles["Meta"]), Paragraph("Preventivo n. ES-001", styles["Right"])],
    ], colWidths=[110 * mm, 64 * mm])
    header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("LINEBELOW", (0, -1), (-1, -1), 1, BLUE),
    ]))
    story += [header, Spacer(1, 9 * mm), Paragraph("Preventivo per intervento idraulico", styles["Heading"])]

    parties = Table([
        [Paragraph("FORNITORE", styles["Label"]), Paragraph("CLIENTE", styles["Label"])],
        [Paragraph("Idraulica Esempio<br/>Dati aziendali da sostituire<br/>P. IVA 00000000000", styles["Body"]),
         Paragraph("Cliente di esempio<br/>Indirizzo dell'intervento<br/>Dati da sostituire", styles["Body"])],
    ], colWidths=[87 * mm, 87 * mm])
    parties.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SOFT),
        ("BOX", (0, 0), (-1, -1), 0.75, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story += [parties, Spacer(1, 8 * mm)]

    rows = [
        ("Diritto di chiamata e sopralluogo", "1", 80.00),
        ("Manodopera specializzata", "4 ore", 180.00),
        ("Fornitura e posa boiler", "1", 750.00),
        ("Raccordi, valvole e materiale di consumo", "1 lotto", 120.00),
    ]
    subtotal = sum(item[2] for item in rows)
    vat = subtotal * 0.22
    data = [["DESCRIZIONE", "QUANTITA", "IMPORTO"]]
    data += [[Paragraph(name, styles["Body"]), qty, euro(amount)] for name, qty, amount in rows]
    quote = Table(data, colWidths=[111 * mm, 25 * mm, 38 * mm], repeatRows=1)
    quote.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), INK),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 8),
        ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, SOFT]),
        ("LINEBELOW", (0, 1), (-1, -1), 0.5, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    story += [quote, Spacer(1, 5 * mm)]

    totals = Table([
        ["Imponibile", euro(subtotal)],
        ["IVA 22%", euro(vat)],
        [Paragraph("TOTALE", styles["Label"]), Paragraph(euro(subtotal + vat), styles["Right"])],
    ], colWidths=[42 * mm, 42 * mm], hAlign="RIGHT")
    totals.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
        ("FONTNAME", (0, 0), (-1, 1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, 1), 9.5),
        ("TEXTCOLOR", (0, 0), (-1, 1), MUTED),
        ("LINEABOVE", (0, 2), (-1, 2), 1.2, BLUE),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))
    story += [totals, Spacer(1, 10 * mm)]

    story += [
        Paragraph("NOTE", styles["Label"]),
        Paragraph("Validita del preventivo, tempi di esecuzione, modalita di pagamento e condizioni di garanzia vanno adattati al lavoro reale e concordati con il cliente.", styles["Body"]),
        Spacer(1, 7 * mm),
        Paragraph("Documento dimostrativo", styles["Label"]),
        Paragraph("Nomi, dati, voci e importi sono di fantasia e hanno solo scopo illustrativo. Questo esempio non costituisce un listino, un modello fiscale o consulenza professionale. Verifica aliquote, diciture e obblighi applicabili con il tuo commercialista.", styles["Fine"]),
        Spacer(1, 6 * mm),
        Paragraph("Creato come esempio per kharonte.dev/preventivi-facili/idraulici/", styles["Fine"]),
    ]

    doc.build(story)
    print(OUT)


if __name__ == "__main__":
    build()
