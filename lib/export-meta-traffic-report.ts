import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type MetaTrafficExportAccount = {
  accountName: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  frequency: number;
  cpp: number;
  inlineLinkClicks: number;
  costPerInlineLinkClick: number;
  /** Conversas por mensagem iniciadas (7d). */
  messagingConversationsStarted: number;
  ctr: number;
  cpc: number;
  cpm: number;
};

export type MetaTrafficExportCampaign = {
  campaignName: string;
  impressions: number;
  clicks: number;
  spend: number;
  frequency: number;
  cpp: number;
  inlineLinkClicks: number;
  costPerInlineLinkClick: number;
  messagingConversationsStarted: number;
  cpm: number;
  ctr: number;
  cpc: number;
};

export type MetaTrafficExportAdSet = {
  campaignName: string;
  adSetName: string;
  impressions: number;
  clicks: number;
  spend: number;
  frequency: number;
  cpp: number;
  inlineLinkClicks: number;
  costPerInlineLinkClick: number;
  messagingConversationsStarted: number;
  cpm: number;
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
  frequency: number;
  cpp: number;
  inlineLinkClicks: number;
  costPerInlineLinkClick: number;
  messagingConversationsStarted: number;
  cpm: number;
  ctr: number;
  cpc: number;
};

export type MetaTrafficExportInput = {
  reportTitle: string;
  adAccountId: string;
  presetLabel: string;
  /** Preset da API (ex.: last_30d, this_month) — usado no nome do arquivo quando não há intervalo explícito. */
  presetId?: string;
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

function fmtFreq(n: number) {
  return n.toFixed(2);
}

function escMdCell(s: string): string {
  return s.replace(/\|/g, "/").replace(/\n/g, " ");
}

const EXPORT_BRAND = "zinid.tech";

/** Normaliza texto para uso seguro em nomes de arquivo (sem acentos, hífens). */
function slugifyForFilename(s: string, maxLen: number): string {
  const out = s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen);
  return out || "meta";
}

/** Mês(es) de referência do relatório para o nome do arquivo (AAAA-MM ou intervalo). */
function monthReferenceForExportFilename(input: MetaTrafficExportInput): string {
  const tr = input.timeRange;
  if (tr?.since && tr?.until) {
    const a = tr.since.slice(0, 7);
    const b = tr.until.slice(0, 7);
    if (a === b) return `mes-${a}`;
    return `mes-de-${a}-a-${b}`;
  }

  const id = input.presetId ?? "";
  const now = new Date();
  const ym = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  if (id === "this_month") return `mes-${ym(now)}`;

  if (id === "last_month") {
    const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return `mes-${ym(d)}`;
  }

  /* Últimos N dias: o “até” costuma ser hoje — referência = mês/ano atual */
  if (id === "last_7d" || id === "last_14d" || id === "last_30d" || id === "last_90d") {
    return `mes-${ym(now)}`;
  }

  return `mes-${ym(now)}`;
}

/** Texto legível (pt-BR) do mês ou intervalo, para corpo MD/PDF. */
function mesReferenciaTextoPt(input: MetaTrafficExportInput): string {
  const tr = input.timeRange;
  const fmt = (y: number, m: number) => {
    const s = new Date(y, m - 1, 15).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  if (tr?.since && tr?.until) {
    const sd = tr.since.slice(0, 10);
    const ed = tr.until.slice(0, 10);
    if (sd === ed) {
      const [y, m, day] = sd.split("-").map(Number);
      const s = new Date(y, m - 1, day).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    const [ys, ms] = tr.since.slice(0, 10).split("-").map(Number);
    const [ye, me] = tr.until.slice(0, 10).split("-").map(Number);
    if (ys === ye && ms === me) return fmt(ys, ms);
    return `De ${fmt(ys, ms)} a ${fmt(ye, me)}`;
  }
  const id = input.presetId ?? "";
  const now = new Date();
  if (id === "this_month") return fmt(now.getFullYear(), now.getMonth() + 1);
  if (id === "last_month") {
    const d = new Date(now.getFullYear(), now.getMonth() - 1, 15);
    return fmt(d.getFullYear(), d.getMonth() + 1);
  }
  if (id === "last_7d" || id === "last_14d" || id === "last_30d" || id === "last_90d") {
    return `${fmt(now.getFullYear(), now.getMonth() + 1)} (janela móvel até a data do relatório)`;
  }
  if (id === "today" || id === "yesterday") {
    const d = new Date();
    if (id === "yesterday") d.setUTCDate(d.getUTCDate() - 1);
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    const s = new Date(y, m - 1, day).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  return fmt(now.getFullYear(), now.getMonth() + 1);
}

/**
 * Nome do arquivo para exportação (.md / .pdf): título, marca, período, mês de referência, conta e data.
 * Ex.: `Metricas-zinid.tech-Ultimos-30-dias-mes-2026-04-8040...-2026-04-15.pdf`
 */
export function getMetaTrafficExportFilename(
  input: MetaTrafficExportInput,
  ext: "md" | "pdf"
): string {
  const date = new Date().toISOString().slice(0, 10);
  const title = slugifyForFilename(input.reportTitle, 44);
  const period = slugifyForFilename(input.presetLabel, 32);
  const monthPart = monthReferenceForExportFilename(input)
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 44);
  const actRaw = input.adAccountId.replace(/^act_/i, "").replace(/\D/g, "") || "conta";
  const act = actRaw.slice(0, 14);
  let base = `${title}-${EXPORT_BRAND}-${period}-${monthPart}-${act}-${date}`;
  const maxLen = 188;
  if (base.length > maxLen) {
    const shortTitle = slugifyForFilename(input.reportTitle, 24);
    base = `${shortTitle}-${EXPORT_BRAND}-${period}-${monthPart}-${act}-${date}`;
    if (base.length > maxLen) base = base.slice(0, maxLen);
  }
  return `${base}.${ext}`;
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
  lines.push(`- **Mês de referência:** ${mesReferenciaTextoPt(input)}`);
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
    lines.push(`| Frequência média | ${fmtFreq(a.frequency)} |`);
    lines.push(`| CPP (custo / mil alcance) | ${brl(a.cpp)} |`);
    lines.push(`| Cliques no link | ${fmtInt(a.inlineLinkClicks)} |`);
    lines.push(`| CPC no link | ${brl(a.costPerInlineLinkClick)} |`);
    lines.push(`| Conversas por mensagem iniciadas (7d) | ${fmtInt(a.messagingConversationsStarted)} |`);
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
    lines.push(
      "| Campanha | Impressões | Cliques | Investimento | Freq. | Conv. msg. (7d) | CTR | CPC |"
    );
    lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
    for (const c of input.campaigns) {
      lines.push(
        `| ${escMdCell(c.campaignName)} | ${fmtInt(c.impressions)} | ${fmtInt(c.clicks)} | ${brl(c.spend)} | ${fmtFreq(c.frequency)} | ${fmtInt(c.messagingConversationsStarted)} | ${pct(c.ctr)} | ${brl(c.cpc)} |`
      );
    }
  }
  lines.push("");

  lines.push("## Conjuntos de anúncios");
  lines.push("");
  if (input.adsets.length === 0) {
    lines.push("_Nenhuma linha._");
  } else {
    lines.push(
      "| Campanha | Conjunto | Impressões | Cliques | Investimento | Freq. | Conv. msg. (7d) | CTR | CPC |"
    );
    lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
    for (const s of input.adsets) {
      lines.push(
        `| ${escMdCell(s.campaignName)} | ${escMdCell(s.adSetName)} | ${fmtInt(s.impressions)} | ${fmtInt(s.clicks)} | ${brl(s.spend)} | ${fmtFreq(s.frequency)} | ${fmtInt(s.messagingConversationsStarted)} | ${pct(s.ctr)} | ${brl(s.cpc)} |`
      );
    }
  }
  lines.push("");

  lines.push("## Anúncios");
  lines.push("");
  if (input.ads.length === 0) {
    lines.push("_Nenhuma linha._");
  } else {
    lines.push(
      "| Campanha | Conjunto | Anúncio | Impressões | Cliques | Investimento | Freq. | Conv. msg. (7d) | CTR | CPC |"
    );
    lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
    for (const ad of input.ads) {
      lines.push(
        `| ${escMdCell(ad.campaignName)} | ${escMdCell(ad.adSetName)} | ${escMdCell(ad.adName)} | ${fmtInt(ad.impressions)} | ${fmtInt(ad.clicks)} | ${brl(ad.spend)} | ${fmtFreq(ad.frequency)} | ${fmtInt(ad.messagingConversationsStarted)} | ${pct(ad.ctr)} | ${brl(ad.cpc)} |`
      );
    }
  }

  appendReportSignatureMd(lines);

  return lines.join("\n");
}

export function downloadMetaTrafficMarkdown(input: MetaTrafficExportInput): void {
  const md = buildMetaTrafficMarkdown(input);
  const filename = getMetaTrafficExportFilename(input, "md");
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
  {
    const mesLines = doc.splitTextToSize(
      `Mes referencia: ${mesReferenciaTextoPt(input)}`,
      pageW - 28
    );
    doc.text(mesLines, 14, y);
    y += mesLines.length * 4 + 1;
  }
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
        ["Frequencia media", fmtFreq(a.frequency)],
        ["CPP (custo/mil alcance)", brl(a.cpp)],
        ["Cliques no link", fmtInt(a.inlineLinkClicks)],
        ["CPC no link", brl(a.costPerInlineLinkClick)],
        ["Conv. msg. iniciadas (7d)", fmtInt(a.messagingConversationsStarted)],
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
    head: [["Campanha", "Impr.", "Cliq.", "Invest.", "Freq.", "Conv.msg", "CTR", "CPC"]],
    body: input.campaigns.map((c) => [
      c.campaignName,
      fmtInt(c.impressions),
      fmtInt(c.clicks),
      brl(c.spend),
      fmtFreq(c.frequency),
      fmtInt(c.messagingConversationsStarted),
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
    head: [
      ["Campanha", "Conjunto", "Impr.", "Cliq.", "Invest.", "Freq.", "Conv.msg", "CTR", "CPC"],
    ],
    body: input.adsets.map((s) => [
      s.campaignName,
      s.adSetName,
      fmtInt(s.impressions),
      fmtInt(s.clicks),
      brl(s.spend),
      fmtFreq(s.frequency),
      fmtInt(s.messagingConversationsStarted),
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
    head: [
      [
        "Campanha",
        "Conjunto",
        "Anuncio",
        "Impr.",
        "Cliq.",
        "Invest.",
        "Freq.",
        "Conv.msg",
        "CTR",
        "CPC",
      ],
    ],
    body: input.ads.map((ad) => [
      ad.campaignName,
      ad.adSetName,
      ad.adName,
      fmtInt(ad.impressions),
      fmtInt(ad.clicks),
      brl(ad.spend),
      fmtFreq(ad.frequency),
      fmtInt(ad.messagingConversationsStarted),
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

  doc.save(getMetaTrafficExportFilename(input, "pdf"));
}
