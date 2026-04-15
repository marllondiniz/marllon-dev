import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type MetaTrafficExportAccount = {
  accountName: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  ctr: number;
  cpc: number;
  cpm: number;
};

export type MetaTrafficExportCampaign = {
  campaignName: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
};

export type MetaTrafficExportAdSet = {
  campaignName: string;
  adSetName: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
};

export type MetaTrafficExportAd = {
  campaignName: string;
  adSetName: string;
  adName: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
};

export type MetaTrafficExportInput = {
  reportTitle: string;
  adAccountId: string;
  presetLabel: string;
  timeRange?: { since: string; until: string };
  account: MetaTrafficExportAccount | null;
  campaigns: MetaTrafficExportCampaign[];
  adsets: MetaTrafficExportAdSet[];
  ads: MetaTrafficExportAd[];
  warnings?: string[];
};

function brl(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

function fmtInt(n: number) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(n);
}

function pct(n: number) {
  return `${n.toFixed(2)}%`;
}

function escMdCell(s: string): string {
  return s.replace(/\|/g, "/").replace(/\n/g, " ");
}

function safeFilePart(s: string): string {
  return s.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 80);
}

/** Assinatura exibida ao final das exportações MD/PDF */
const REPORT_SIGNATURE = {
  name: "Marllon Diniz",
  line: "zinid.tech · marllonzinid@gmail.com",
} as const;

function appendReportSignatureMd(lines: string[]) {
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`**${REPORT_SIGNATURE.name}**`);
  lines.push(REPORT_SIGNATURE.line);
}

export function buildMetaTrafficMarkdown(input: MetaTrafficExportInput): string {
  const lines: string[] = [];
  const now = new Date().toLocaleString("pt-BR");
  lines.push(`# ${input.reportTitle}`);
  lines.push("");
  lines.push(`- **Gerado em:** ${now}`);
  lines.push(`- **Conta:** \`${input.adAccountId}\``);
  lines.push(`- **Período:** ${input.presetLabel}`);
  if (input.timeRange) {
    lines.push(`- **Intervalo:** ${input.timeRange.since} → ${input.timeRange.until}`);
  }
  lines.push("");

  if (input.warnings?.length) {
    lines.push("## Avisos");
    for (const w of input.warnings) {
      lines.push(`- ${escMdCell(w)}`);
    }
    lines.push("");
  }

  if (input.account) {
    const a = input.account;
    lines.push("## Totais da conta");
    lines.push("");
    lines.push("| Métrica | Valor |");
    lines.push("| --- | --- |");
    lines.push(`| Nome | ${escMdCell(a.accountName)} |`);
    lines.push(`| Impressões | ${fmtInt(a.impressions)} |`);
    lines.push(`| Cliques | ${fmtInt(a.clicks)} |`);
    lines.push(`| Investimento | ${brl(a.spend)} |`);
    lines.push(`| Alcance | ${fmtInt(a.reach)} |`);
    lines.push(`| CTR | ${pct(a.ctr)} |`);
    lines.push(`| CPC médio | ${brl(a.cpc)} |`);
    lines.push(`| CPM | ${brl(a.cpm)} |`);
    lines.push("");
  }

  lines.push("## Campanhas");
  lines.push("");
  if (input.campaigns.length === 0) {
    lines.push("_Nenhuma linha._");
  } else {
    lines.push("| Campanha | Impressões | Cliques | Investimento | CTR | CPC |");
    lines.push("| --- | ---: | ---: | ---: | ---: | ---: |");
    for (const c of input.campaigns) {
      lines.push(
        `| ${escMdCell(c.campaignName)} | ${fmtInt(c.impressions)} | ${fmtInt(c.clicks)} | ${brl(c.spend)} | ${pct(c.ctr)} | ${brl(c.cpc)} |`
      );
    }
  }
  lines.push("");

  lines.push("## Conjuntos de anúncios");
  lines.push("");
  if (input.adsets.length === 0) {
    lines.push("_Nenhuma linha._");
  } else {
    lines.push("| Campanha | Conjunto | Impressões | Cliques | Investimento | CTR | CPC |");
    lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: |");
    for (const s of input.adsets) {
      lines.push(
        `| ${escMdCell(s.campaignName)} | ${escMdCell(s.adSetName)} | ${fmtInt(s.impressions)} | ${fmtInt(s.clicks)} | ${brl(s.spend)} | ${pct(s.ctr)} | ${brl(s.cpc)} |`
      );
    }
  }
  lines.push("");

  lines.push("## Anúncios");
  lines.push("");
  if (input.ads.length === 0) {
    lines.push("_Nenhuma linha._");
  } else {
    lines.push("| Campanha | Conjunto | Anúncio | Impressões | Cliques | Investimento | CTR | CPC |");
    lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |");
    for (const ad of input.ads) {
      lines.push(
        `| ${escMdCell(ad.campaignName)} | ${escMdCell(ad.adSetName)} | ${escMdCell(ad.adName)} | ${fmtInt(ad.impressions)} | ${fmtInt(ad.clicks)} | ${brl(ad.spend)} | ${pct(ad.ctr)} | ${brl(ad.cpc)} |`
      );
    }
  }

  appendReportSignatureMd(lines);

  return lines.join("\n");
}

export function downloadMetaTrafficMarkdown(input: MetaTrafficExportInput): void {
  const md = buildMetaTrafficMarkdown(input);
  const stamp = safeFilePart(new Date().toISOString().slice(0, 10));
  const filename = `metricas-meta-${stamp}.md`;
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

type JsPdfWithLast = jsPDF & { lastAutoTable?: { finalY: number } };

export function downloadMetaTrafficPdf(input: MetaTrafficExportInput): void {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  doc.setFontSize(14);
  doc.text(input.reportTitle, 14, y);
  y += 7;
  doc.setFontSize(9);
  doc.text(`Conta: ${input.adAccountId}`, 14, y);
  y += 5;
  doc.text(`Periodo: ${input.presetLabel}`, 14, y);
  y += 5;
  if (input.timeRange) {
    doc.text(`Intervalo: ${input.timeRange.since} -> ${input.timeRange.until}`, 14, y);
    y += 5;
  }
  doc.text(`Gerado: ${new Date().toLocaleString("pt-BR")}`, 14, y);
  y += 8;

  if (input.warnings?.length) {
    doc.setFontSize(8);
    doc.text("Avisos:", 14, y);
    y += 4;
    for (const w of input.warnings) {
      const lines = doc.splitTextToSize(w, pageW - 28);
      doc.text(lines, 14, y);
      y += lines.length * 3.5 + 2;
    }
    y += 4;
  }

  const d = doc as JsPdfWithLast;

  if (input.account) {
    const a = input.account;
    doc.setFontSize(9);
    doc.text("Totais da conta", 14, y);
    y += 5;
    autoTable(doc, {
      startY: y,
      head: [["Metrica", "Valor"]],
      body: [
        ["Nome", a.accountName],
        ["Impressoes", fmtInt(a.impressions)],
        ["Cliques", fmtInt(a.clicks)],
        ["Investimento", brl(a.spend)],
        ["Alcance", fmtInt(a.reach)],
        ["CTR", pct(a.ctr)],
        ["CPC medio", brl(a.cpc)],
        ["CPM", brl(a.cpm)],
      ],
      styles: { fontSize: 7 },
      headStyles: { fillColor: [39, 39, 42] },
      margin: { left: 14, right: 14 },
    });
    y = (d.lastAutoTable?.finalY ?? y) + 10;
  }

  doc.setFontSize(9);
  doc.text("Campanhas", 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [["Campanha", "Impr.", "Cliques", "Invest.", "CTR", "CPC"]],
    body: input.campaigns.map((c) => [
      c.campaignName,
      fmtInt(c.impressions),
      fmtInt(c.clicks),
      brl(c.spend),
      pct(c.ctr),
      brl(c.cpc),
    ]),
    styles: { fontSize: 6, cellPadding: 1 },
    headStyles: { fillColor: [39, 39, 42] },
    margin: { left: 14, right: 14 },
    theme: "striped",
  });
  y = (d.lastAutoTable?.finalY ?? y) + 8;

  if (y > doc.internal.pageSize.getHeight() - 35) {
    doc.addPage();
    y = 14;
  }

  doc.setFontSize(9);
  doc.text("Conjuntos de anuncios", 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [["Campanha", "Conjunto", "Impr.", "Cliques", "Invest.", "CTR", "CPC"]],
    body: input.adsets.map((s) => [
      s.campaignName,
      s.adSetName,
      fmtInt(s.impressions),
      fmtInt(s.clicks),
      brl(s.spend),
      pct(s.ctr),
      brl(s.cpc),
    ]),
    styles: { fontSize: 5, cellPadding: 0.8 },
    headStyles: { fillColor: [39, 39, 42] },
    margin: { left: 14, right: 14 },
  });
  y = (d.lastAutoTable?.finalY ?? y) + 8;

  if (y > doc.internal.pageSize.getHeight() - 35) {
    doc.addPage();
    y = 14;
  }

  doc.setFontSize(9);
  doc.text("Anuncios", 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [["Campanha", "Conjunto", "Anuncio", "Impr.", "Cliques", "Invest.", "CTR", "CPC"]],
    body: input.ads.map((ad) => [
      ad.campaignName,
      ad.adSetName,
      ad.adName,
      fmtInt(ad.impressions),
      fmtInt(ad.clicks),
      brl(ad.spend),
      pct(ad.ctr),
      brl(ad.cpc),
    ]),
    styles: { fontSize: 5, cellPadding: 0.8 },
    headStyles: { fillColor: [39, 39, 42] },
    margin: { left: 14, right: 14 },
  });

  y = (d.lastAutoTable?.finalY ?? y) + 10;

  const pageH = doc.internal.pageSize.getHeight();
  const sigBlockMm = 22;
  if (y + sigBlockMm > pageH - 12) {
    doc.addPage();
    y = 14;
  }

  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, pageW - 14, y);
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(REPORT_SIGNATURE.name, 14, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(REPORT_SIGNATURE.line, 14, y);
  doc.setTextColor(0, 0, 0);

  const stamp = safeFilePart(new Date().toISOString().slice(0, 10));
  doc.save(`metricas-meta-${stamp}.pdf`);
}
