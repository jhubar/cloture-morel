import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { MaterialsQuote } from "@/lib/quote";
import { site } from "@/lib/site";

/** EUR formatting kept local (Intl is available in the Node runtime). */
function eur(amount: number): string {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

const colors = {
  forest: "#1e3d29",
  forestMid: "#2e5a3c",
  terracotta: "#a8521e",
  bark: "#232b25",
  muted: "#5b6b61",
  sand: "#faf7f2",
  border: "#e3ddd2",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontSize: 10,
    color: colors.bark,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: colors.forest,
    paddingBottom: 14,
  },
  brand: { fontSize: 18, fontFamily: "Helvetica-Bold", color: colors.forest },
  brandSub: { fontSize: 9, color: colors.muted, marginTop: 2 },
  docMeta: { textAlign: "right" },
  docTitle: { fontSize: 14, fontFamily: "Helvetica-Bold", color: colors.terracotta },
  docRef: { fontSize: 9, color: colors.muted, marginTop: 3 },
  twoCol: { flexDirection: "row", justifyContent: "space-between", marginBottom: 22 },
  block: { width: "48%" },
  blockTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.forestMid,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  line: { marginBottom: 2 },
  muted: { color: colors.muted },
  tableHead: {
    flexDirection: "row",
    backgroundColor: colors.forest,
    color: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 6,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cReference: { width: "44%" },
  cQty: { width: "14%", textAlign: "right" },
  cUnit: { width: "20%", textAlign: "right" },
  cTotal: { width: "22%", textAlign: "right" },
  category: { fontSize: 8, color: colors.muted, marginTop: 1 },
  totals: { marginTop: 16, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", width: 220, justifyContent: "space-between", paddingVertical: 3 },
  totalLabel: { color: colors.muted },
  grandTotal: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.forest,
  },
  grandTotalValue: { fontSize: 13, fontFamily: "Helvetica-Bold", color: colors.forest },
  note: { marginTop: 18, fontSize: 8, color: colors.muted, lineHeight: 1.5 },
  message: {
    marginTop: 16,
    padding: 10,
    backgroundColor: colors.sand,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: colors.muted,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
});

export function MaterialsQuotePdf({ quote }: { quote: MaterialsQuote }) {
  const { customer } = quote;
  const fullName = `${customer.firstName} ${customer.lastName}`;

  return (
    <Document
      title={`Devis matériaux ${quote.reference}`}
      author={site.name}
      subject="Demande de devis matériaux"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>{site.name}</Text>
            <Text style={styles.brandSub}>{site.tagline}</Text>
            <Text style={styles.brandSub}>
              {site.address.street}, {site.address.city}
            </Text>
          </View>
          <View style={styles.docMeta}>
            <Text style={styles.docTitle}>DEMANDE DE DEVIS</Text>
            <Text style={styles.docRef}>Réf. {quote.reference}</Text>
            <Text style={styles.docRef}>{quote.date}</Text>
          </View>
        </View>

        {/* Parties */}
        <View style={styles.twoCol}>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Demandeur</Text>
            <Text style={styles.line}>{fullName}</Text>
            {customer.company ? <Text style={styles.line}>{customer.company}</Text> : null}
            <Text style={styles.line}>{customer.address}</Text>
            <Text style={[styles.line, styles.muted]}>{customer.email}</Text>
            <Text style={[styles.line, styles.muted]}>{customer.phone}</Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Fournisseur</Text>
            <Text style={styles.line}>{site.name}</Text>
            <Text style={styles.line}>{site.address.street}</Text>
            <Text style={styles.line}>{site.address.city}</Text>
            <Text style={[styles.line, styles.muted]}>{site.email}</Text>
            <Text style={[styles.line, styles.muted]}>{site.phone}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableHead}>
          <Text style={styles.cReference}>Référence</Text>
          <Text style={styles.cQty}>Qté</Text>
          <Text style={styles.cUnit}>P.U. HTVA</Text>
          <Text style={styles.cTotal}>Total HTVA</Text>
        </View>
        {quote.lines.map((line, i) => (
          <View key={i} style={styles.row} wrap={false}>
            <View style={styles.cReference}>
              <Text>{line.reference}</Text>
              <Text style={styles.category}>
                {line.category}
                {line.piecesPerPalette
                  ? ` · palette de ${line.piecesPerPalette} pièces`
                  : ""}
              </Text>
            </View>
            <Text style={styles.cQty}>
              {line.quantity}
              {line.piecesPerPalette ? " pal." : ""}
            </Text>
            <Text style={styles.cUnit}>
              {line.unitPrice !== null
                ? line.piecesPerPalette
                  ? `${eur(line.unitPrice)}/pal.`
                  : eur(line.unitPrice)
                : "Sur demande"}
            </Text>
            <Text style={styles.cTotal}>
              {line.lineTotal !== null ? eur(line.lineTotal) : "—"}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.grandTotal}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Total estimatif HTVA</Text>
            <Text style={styles.grandTotalValue}>{eur(quote.totalHTVA)}</Text>
          </View>
        </View>

        {quote.customer.message ? (
          <View style={styles.message}>
            <Text style={styles.blockTitle}>Message du client</Text>
            <Text>{quote.customer.message}</Text>
          </View>
        ) : null}

        {/* Notes */}
        <Text style={styles.note}>
          {quote.taxNote}. Ce document est une demande de devis sans engagement et ne
          constitue pas une commande ni une facture. Les prix « sur demande » ne sont
          pas inclus dans le total estimatif et vous seront communiqués séparément.
          {quote.hasOnRequest
            ? " Certaines références de cette sélection sont au prix « sur demande »."
            : ""}{" "}
          Les tarifs et disponibilités sont confirmés par Clôtures Morel dans le devis officiel.
        </Text>

        {/* Footer */}
        <Text style={styles.footer} fixed>
          {site.name} — {site.tagline} · {site.email} · {site.phone}
        </Text>
      </Page>
    </Document>
  );
}
