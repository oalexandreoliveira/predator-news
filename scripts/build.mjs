import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadData } from "./data/load-data.mjs";
import { aggregateFoundation, aggregateThesis, decisionDate } from "./data/aggregate-legal.mjs";
import { buildEditorialRelations, globalMenuLinks, legalHomeMetrics } from "./data/editorial-links.mjs";
import { createDecisionSearchText } from "../src/jurisprudencia-filter.mjs";
import { renderDecisionEditionRelations, renderEditorialStatement, renderEditionIntegration } from "../src/editorial-components.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CONTENT = join(ROOT, "content", "edicoes");
const DIST = join(ROOT, "dist");
const BASE = process.env.BASE_PATH || "/predator-news";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function parseEdition(source, filename) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) throw new Error(`Front matter ausente em ${filename}`);
  const meta = {};
  for (const line of match[1].split("\n")) {
    const index = line.indexOf(":");
    if (index < 0) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    value = value.replace(/^[']|[']$/g, "").replace(/^["]|["]$/g, "");
    meta[key] = value;
  }
  for (const required of ["titulo", "data", "categoria", "resumo"]) {
    if (!meta[required]) throw new Error(`Campo ${required} ausente em ${filename}`);
  }
  return {
    ...meta,
    slug: meta.slug || basename(filename, ".md"),
    numero: meta.numero || "—",
    tempo_leitura: meta.tempo_leitura || "5 min",
    body: match[2].trim(),
  };
}

function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function markdown(source = "") {
  const lines = source.split("\n");
  const out = [];
  let paragraph = [];
  let list = false;
  let section = "";
  let newsArticle = false;
  let contentSection = false;
  const flush = () => {
    if (paragraph.length) out.push(`<p>${inline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const closeList = () => { if (list) out.push("</ul>"); list = false; };
  const closeContentSection = () => { if (contentSection) out.push("</section>"); contentSection = false; };
  const closeNewsArticle = () => { closeContentSection(); if (newsArticle) out.push("</article>"); newsArticle = false; };
  const newsBlockClass = (key) => ({
    "o que aconteceu": "fact", "tese do dia": "interpretation", "onde usar": "application-use",
    "prova que nao pode faltar": "evidence", "risco processual": "risk", "frase de peca": "statement",
    "pergunta da edicao": "question", "pergunta para comentario": "question", fonte: "source",
  })[key] || "detail";
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flush(); closeList(); continue; }
    if (line.startsWith("### ")) {
      flush(); closeList(); closeNewsArticle();
      const title = line.slice(4);
      const number = title.match(/^Notícia\s+(\d+)/i)?.[1] || "";
      newsArticle = true;
      out.push(`<article class="edition-news"><header class="edition-news-head">${number ? `<span aria-hidden="true">${escapeHtml(number.padStart(2, "0"))}</span>` : ""}<p class="signal">NOTÍCIA ${escapeHtml(number || "SELECIONADA")}</p><h2>${inline(title.replace(/^Notícia\s+\d+\s*:\s*/i, ""))}</h2></header>`);
      continue;
    }
    if (line.startsWith("## ")) {
      flush(); closeList(); closeContentSection();
      section = normalize(line.slice(3));
      if (newsArticle && section !== "fechamento" && section !== "conclusao") {
        contentSection = true;
        out.push(`<section class="news-block news-block-${newsBlockClass(section)}"><h3>${inline(line.slice(3))}</h3>`);
      } else {
        closeNewsArticle();
        const sectionClass = section === "fio condutor da edicao"
          ? "edition-context"
          : ["fechamento", "conclusao"].includes(section) ? "edition-closing" : "edition-legacy-section";
        contentSection = true;
        out.push(`<section class="${sectionClass}"><h2>${inline(line.slice(3))}</h2>`);
      }
      continue;
    }
    if (line.startsWith("# ")) { flush(); closeList(); section = normalize(line.slice(2)); out.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }
    if (line.startsWith("> ")) { flush(); closeList(); out.push(section === "frase de peca" ? renderEditorialStatement(stripMarkdown(line.slice(2)), { copyButton: true, showLabel: false }) : `<blockquote>${inline(line.slice(2))}</blockquote>`); continue; }
    if (line.startsWith("- ")) {
      flush();
      if (!list) { out.push("<ul>"); list = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    paragraph.push(line);
  }
  flush(); closeList(); closeContentSection(); closeNewsArticle();
  return out.join("\n");
}

const normalize = (value = "") => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

function extractSections(source = "") {
  const matches = [];
  const regex = /^##\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(source))) {
    matches.push({ title: match[1].trim(), index: match.index, bodyStart: regex.lastIndex });
  }
  const sections = new Map();
  for (let index = 0; index < matches.length; index++) {
    const item = matches[index];
    const next = matches[index + 1];
    const body = source.slice(item.bodyStart, next ? next.index : source.length).trim();
    const key = normalize(item.title);
    if (!sections.has(key)) sections.set(key, body);
  }
  return sections;
}

const stripMarkdown = (source = "") => String(source)
  .replace(/^>\s?/gm, "")
  .replace(/^[-*]\s+/gm, "")
  .replace(/^#{1,6}\s+/gm, "")
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, "$1")
  .replace(/\*\*(.*?)\*\*/g, "$1")
  .replace(/\*(.*?)\*/g, "$1")
  .replace(/\s+/g, " ")
  .trim();

const compact = (source = "", limit = 210) => {
  const text = stripMarkdown(source);
  if (text.length <= limit) return text;
  const sliced = text.slice(0, limit).replace(/\s+\S*$/, "");
  return `${sliced}...`;
};

function pickSection(sections, labels) {
  for (const label of labels) {
    const value = sections.get(normalize(label));
    if (value) return value;
  }
  return "";
}

function firstBlockquote(source = "") {
  const match = source.match(/^>\s*(.+)$/m);
  return match ? match[1].trim() : stripMarkdown(source);
}

function extractNews(source = "") {
  const matches = [...source.matchAll(/^###\s+Notícia\s+(\d+)\s*:\s*(.+)$/gmi)];
  return matches.map((match, index) => {
    const body = source.slice(match.index + match[0].length, matches[index + 1]?.index ?? source.length);
    const sections = extractSections(body);
    const sourceSection = pickSection(sections, ["Fonte"]);
    const sourceMatch = sourceSection.match(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/);
    return {
      number: match[1].padStart(2, "0"), title: match[2].trim(),
      summary: compact(pickSection(sections, ["O que aconteceu"]), 230),
      source: sourceMatch?.[1] || "Fonte indicada na edição",
    };
  }).slice(0, 3);
}

function renderNewsDigest(edition, href) {
  const news = extractNews(edition.body);
  if (!news.length) return "";
  return `<section class="news-digest" aria-labelledby="news-digest-title"><div class="section-heading"><div><p class="signal">NOTÍCIAS SELECIONADAS</p><h2 id="news-digest-title">O que aconteceu</h2></div><p>Três acontecimentos conectados pelo fio condutor desta edição.</p></div><div class="news-digest-grid">${news.map((item) => `<article><span class="news-digest-number">${escapeHtml(item.number)}</span><p class="news-digest-category">${escapeHtml(edition.categoria)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p><div><span>${escapeHtml(item.source)}</span><a href="${escapeHtml(href)}#analise-completa" aria-label="Continuar leitura: ${escapeHtml(item.title)}">Continuar →</a></div></article>`).join("")}</div></section>`;
}

function insightCard(number, label, title, body) {
  return `<article class="application-card">
    <span class="application-number">${number}</span>
    <p class="application-label">${escapeHtml(label)}</p>
    <h3>${escapeHtml(title)}</h3>
    <p>${escapeHtml(body)}</p>
  </article>`;
}

function renderApplication(edition, { ctaHref = "", ctaText = "Ler edição completa →" } = {}) {
  const sections = extractSections(edition.body);
  const tese = pickSection(sections, ["Tese do dia"]);
  const prova = pickSection(sections, ["Prova que não pode faltar"]);
  const risco = pickSection(sections, ["Risco processual"]);
  const frase = firstBlockquote(pickSection(sections, ["Frase de peça"]));
  const pergunta = pickSection(sections, ["Pergunta da edição", "Pergunta para comentário"]);
  if (!tese && !prova && !risco && !frase && !pergunta) return "";

  const cta = ctaHref
    ? `<a href="${escapeHtml(ctaHref)}">${escapeHtml(ctaText)}</a>`
    : "";

  return `<section class="application" aria-labelledby="application-title">
    <div class="application-head">
      <div><p class="signal">APLICAÇÃO IMEDIATA</p><h2 id="application-title">Da notícia para a atuação</h2></div>
      <p>Cada edição reduz o ruído e entrega o que muda na estratégia, na prova e na peça.</p>
    </div>
    <div class="application-grid">
      ${insightCard("01", "Tese do dia", compact(tese, 78), compact(tese, 180))}
      ${insightCard("02", "Prova que não pode faltar", compact(prova, 64), compact(prova, 180))}
      ${insightCard("03", "Risco processual", compact(risco, 72), compact(risco, 180))}
    </div>
    ${renderEditorialStatement(frase, { copyButton: true })}
    ${pergunta ? `<div class="application-question"><div><p class="application-label">Pergunta da edição</p><h3>${escapeHtml(compact(pergunta, 190))}</h3></div>${cta}</div>` : ""}
  </section>`;
}

const dateLabel = (date) => new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit", month: "short", year: "numeric", timeZone: "UTC"
}).format(new Date(`${date}T00:00:00Z`)).toUpperCase().replace(" DE ", " ");

const brandIcon = `<svg class="brand-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <path class="logo-shell" d="M32 5 55 18.5v27L32 59 9 45.5v-27L32 5Z"/>
  <path class="logo-cut" d="M12 34 27 43v13L19 40l-7-6Zm40 0L37 43v13l8-16 7-6Z"/>
  <path class="logo-radar" d="M19 31a13 13 0 0 1 22-9M14 31a18 18 0 0 1 31-13" />
  <path class="logo-sweep" d="M32 33 46 15" />
  <circle class="logo-core" cx="32" cy="33" r="4"/>
  <circle class="logo-ping" cx="48" cy="28" r="3.2"/>
</svg>`;

const radarVisual = `<figure class="hero-radar"><iframe class="radar radar-frame" src="${BASE}/assets/radar.html?velocidade=6&cor=9fe870&fundo=transparente&aleatorio=1&destaque=1" title="Radar jurídico animado" loading="lazy" aria-hidden="true" tabindex="-1">Radar jurídico do Predator News</iframe><figcaption><strong>Radar jurídico</strong><span>Monitoramento editorial de Direito Bancário</span></figcaption></figure>`;

const themeInit = `<script>try{const t=localStorage.getItem('predator-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch{}</script>`;
const themeScript = `<script>(()=>{const root=document.documentElement,key='predator-theme',btn=document.querySelector('[data-theme-toggle]');const valid=t=>t==='light'||t==='dark';function current(){return valid(root.dataset.theme)?root.dataset.theme:'dark'}function apply(theme){root.dataset.theme=theme;try{localStorage.setItem(key,theme)}catch{}if(btn){btn.setAttribute('aria-pressed',theme==='light');const label=btn.querySelector('[data-theme-label]');if(label)label.textContent=theme==='light'?'Claro':'Escuro';}}if(!valid(root.dataset.theme))apply('dark');else apply(root.dataset.theme);btn?.addEventListener('click',()=>apply(current()==='dark'?'light':'dark'));})();</script>`;
const interactionScript = `<script>(()=>{document.querySelectorAll('[data-copy-quote]').forEach(button=>button.addEventListener('click',async()=>{const quote=button.closest('[data-editorial-statement]')?.querySelector('.editorial-statement-text')?.textContent?.trim();if(!quote)return;try{await navigator.clipboard.writeText(quote);const original=button.textContent;button.textContent='Copiado';button.classList.add('copied');setTimeout(()=>{button.textContent=original;button.classList.remove('copied')},1800)}catch{button.textContent='Não foi possível copiar'}}));})();</script>`;
const menu = globalMenuLinks(BASE).map(([label, href]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`).join("");

const shell = ({ title, description, content, script = "" }) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
${themeInit}<link rel="stylesheet" href="${BASE}/assets/style.css"></head><body>
<header class="site-header"><a class="brand" href="${BASE}/"><span class="brand-mark">${brandIcon}</span><span><strong>PREDATOR</strong><small>NEWS</small></span></a>
<div class="header-actions"><nav class="desktop-nav">${menu}</nav><details class="site-nav"><summary>Navegar</summary><nav>${menu}</nav></details><button class="theme-toggle" type="button" data-theme-toggle aria-label="Alternar tema" aria-pressed="false"><span data-theme-label>Escuro</span></button></div></header>
${content}<footer><span>Predator News</span><p>Conteúdo jurídico informativo. Leitura crítica para decisões melhores.</p></footer>${themeScript}${interactionScript}${script}</body></html>`;

const legalLabels = new Map(Object.entries({
  rmc: "RMC", rcc: "RCC", cartao_credito_consignado: "Cartão de crédito consignado",
  consentimento: "Consentimento", dever_informacao: "Dever de informação", contratacao_digital: "Contratação digital",
  contratacao_analfabeto: "Contratação de pessoa analfabeta", prova_contratacao: "Prova da contratação",
  uso_cartao: "Uso do cartão", saque: "Saque", desconto_beneficio: "Desconto em benefício",
  acolhida: "Acolhida", parcialmente_acolhida: "Parcialmente acolhida", rejeitada: "Rejeitada",
  nao_enfrentada: "Não enfrentada", prejudicada: "Prejudicada", mantido: "Mantido", anulado: "Anulado",
  inexistente: "Inexistente", convertido: "Convertido", deferida: "Deferida", indeferida: "Indeferida",
  nao_aplicavel: "Não aplicável", simples: "Simples", dobro: "Em dobro", mista: "Mista",
  deferido: "Deferido", indeferido: "Indeferido", acordao: "Acórdão", decisao_monocratica: "Decisão monocrática",
  decisao_terminativa: "Decisão terminativa", jurisprudencia_oficial: "Jurisprudência oficial",
  informativo_oficial: "Informativo oficial", persuasiva: "Persuasiva", idoso: "Pessoa idosa",
  aposentado_pensionista: "Aposentado ou pensionista", analfabeto: "Pessoa analfabeta", hipossuficiente: "Hipossuficiente",
  fisico: "Físico", digital: "Digital", ausencia_contrato: "Ausência de contrato", contrato_claro: "Contrato claro",
  contrato_diverso: "Contrato diverso", saque_unico: "Saque único", uso_reiterado_cartao: "Uso reiterado do cartão",
  contrato: "Contrato", assinatura: "Assinatura",
  assinatura_rogo: "Assinatura a rogo", testemunhas: "Testemunhas", termo_consentimento: "Termo de consentimento",
  comprovante_transferencia: "Comprovante de transferência", faturas: "Faturas", historico_uso: "Histórico de uso",
  pericia_grafotecnica: "Perícia grafotécnica",
}));
const sentenceCase = (value = "") => {
  const text = String(value).replaceAll("_", " ");
  return text ? text[0].toLocaleUpperCase("pt-BR") + text.slice(1) : text;
};
const humanize = (value = "") => legalLabels.get(String(value)) || sentenceCase(value);
const known = (value) => value !== null && value !== undefined && value !== "" && value !== "nao_informado";
const displayDate = (value) => known(value) ? new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
}).format(new Date(`${value}T00:00:00Z`)).replaceAll(" de ", " ") : "";
const pills = (values = []) => values.map((value) => `<span class="legal-pill">${escapeHtml(humanize(value))}</span>`).join("");
const detailItem = (label, value, formatter = String) => known(value) ? `<div class="legal-detail"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(formatter(value))}</dd></div>` : "";
const listSection = (title, values = []) => values.length ? `<section class="decision-section"><h2>${escapeHtml(title)}</h2><div class="legal-pills">${pills(values)}</div></section>` : "";

function selectFilter(name, label, values, labels = new Map()) {
  const options = values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(labels.get(value) || humanize(value))}</option>`).join("");
  return `<label class="legal-filter"><span>${escapeHtml(label)}</span><select data-decision-filter="${escapeHtml(name)}"><option value="">Todos</option>${options}</select></label>`;
}

function decisionCard(decision, thesisLabels) {
  const primaryThesis = decision.teses[0];
  const date = decision.identificacao.data_julgamento || decision.identificacao.data_publicacao;
  const filterRecord = {
    tribunal: decision.identificacao.tribunal,
    produtos: decision.contexto.produtos,
    temas: decision.contexto.temas,
    teses: decision.teses.map((item) => item.slug),
    statusTese: decision.teses.map((item) => item.status),
  };
  const attributes = Object.entries(filterRecord).map(([key, value]) => `data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${escapeHtml(Array.isArray(value) ? value.join("|") : value)}"`).join(" ");
  const resultItems = [
    known(decision.resultado.contrato) ? `<span><small>Contrato</small>${escapeHtml(humanize(decision.resultado.contrato))}</span>` : "",
    known(decision.resultado.dano_moral) ? `<span><small>Dano moral</small>${escapeHtml(humanize(decision.resultado.dano_moral))}</span>` : "",
  ].filter(Boolean).join("");
  return `<article class="legal-card" data-decision-card data-search="${escapeHtml(createDecisionSearchText(decision))}" ${attributes}>
    <div class="legal-card-meta"><strong>${escapeHtml(decision.identificacao.tribunal)}</strong><span>${escapeHtml(decision.identificacao.orgao_julgador)}</span><time>${escapeHtml(displayDate(date))}</time></div>
    <h2>${escapeHtml(decision.titulo)}</h2><p>${escapeHtml(decision.resumo_predator)}</p>
    <div class="legal-pills">${pills([...decision.contexto.produtos, ...decision.contexto.temas])}</div>
    <div class="legal-thesis"><small>Tese principal</small><strong>${escapeHtml(thesisLabels.get(primaryThesis.slug) || humanize(primaryThesis.slug))}</strong><span data-thesis-status="${escapeHtml(primaryThesis.status)}">${escapeHtml(humanize(primaryThesis.status))}</span></div>
    ${resultItems ? `<div class="legal-results">${resultItems}</div>` : ""}
    <a class="legal-card-link" href="${BASE}/jurisprudencia/${escapeHtml(decision.id)}/">Ver decisão →</a>
  </article>`;
}

function renderDecisionPage(decision, thesisLabels, foundationLabels, relatedEditions = []) {
  const identification = decision.identificacao;
  const sourceUrl = decision.fonte.url_inteiro_teor || decision.fonte.url_original;
  const thesisItems = decision.teses.map((item) => `<li><a href="${BASE}/teses/${escapeHtml(item.slug)}/"><strong>${escapeHtml(thesisLabels.get(item.slug) || humanize(item.slug))}</strong></a><span>${escapeHtml(humanize(item.status))}</span></li>`).join("");
  return shell({
    title: `${decision.titulo} — Predator News`, description: decision.resumo_predator,
    content: `<main class="decision-page"><a class="back" href="${BASE}/jurisprudencia/">← Jurisprudência</a>
      <div class="edition-kicker">${escapeHtml(identification.tribunal)} · ${escapeHtml(identification.processo)}</div>
      <h1>${escapeHtml(decision.titulo)}</h1><p class="decision-editorial-label">RESUMO EDITORIAL PREDATOR</p><p class="edition-summary">${escapeHtml(decision.resumo_predator)}</p>
      <dl class="decision-identification">${detailItem("Tribunal", identification.tribunal)}${detailItem("Processo", identification.processo)}${detailItem("Tipo de decisão", identification.tipo_decisao, humanize)}${detailItem("Órgão julgador", identification.orgao_julgador)}${detailItem("Relator", identification.relator)}${detailItem("Data de julgamento", displayDate(identification.data_julgamento))}${detailItem("Data de publicação", displayDate(identification.data_publicacao))}</dl>
      ${listSection("Contexto fático", decision.contexto.fatos_relevantes)}
      ${listSection("Perfil do consumidor", decision.contexto.perfis_consumidor)}
      ${known(decision.contexto.meio_contratacao) ? `<section class="decision-section"><h2>Meio de contratação</h2><p>${escapeHtml(humanize(decision.contexto.meio_contratacao))}</p></section>` : ""}
      ${listSection("Provas e elementos probatórios", decision.provas)}
      <section class="decision-section"><h2>Teses enfrentadas</h2><ul class="decision-relations">${thesisItems}</ul></section>
      <section class="decision-section"><h2>Fundamentos identificados</h2><div class="legal-pills">${decision.fundamentos.map((slug) => `<a class="legal-pill" href="${BASE}/fundamentos/${escapeHtml(slug)}/">${escapeHtml(foundationLabels.get(slug) || humanize(slug))}</a>`).join("")}</div></section>
      <section class="decision-section"><h2>Resultados</h2><dl class="decision-results">${detailItem("Contrato", decision.resultado.contrato, humanize)}${detailItem("Conversão", decision.resultado.conversao, humanize)}${detailItem("Repetição do indébito", decision.resultado.repeticao_indebito, humanize)}${detailItem("Dano moral", decision.resultado.dano_moral, humanize)}</dl></section>
      <section class="decision-section"><h2>Natureza e autoridade</h2><dl class="decision-results">${detailItem("Natureza da fonte", decision.fonte.natureza, humanize)}${detailItem("Autoridade", decision.autoridade, humanize)}</dl></section>
      ${renderDecisionEditionRelations({ editions: relatedEditions, base: BASE })}
      <section class="decision-source"><div><p class="signal">FONTE JURÍDICA</p><h2>Consulte a decisão na origem</h2><p>A síntese acima é conteúdo editorial do Predator e não substitui a leitura do documento oficial.</p></div><a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener">${decision.fonte.url_inteiro_teor ? "Acessar inteiro teor" : "Acessar fonte oficial"} ↗</a></section>
    </main>`,
  });
}

function indicators(items) {
  return `<dl class="entity-indicators">${items.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>`;
}

function relatedDecisions(decisions, thesisSlug = "") {
  if (!decisions.length) return `<p class="entity-empty">Nenhuma decisão catalogada utiliza esta relação na amostra atual.</p>`;
  return `<div class="related-decisions">${decisions.map((decision) => {
    const thesis = thesisSlug ? decision.teses.find((item) => item.slug === thesisSlug) : null;
    return `<article><div><span>${escapeHtml(decision.identificacao.tribunal)} · ${escapeHtml(decision.identificacao.processo)}</span><h3>${escapeHtml(decision.titulo)}</h3>${thesis ? `<p>Tese: <strong>${escapeHtml(humanize(thesis.status))}</strong></p>` : ""}</div><a href="${BASE}/jurisprudencia/${escapeHtml(decision.id)}/">Ver decisão →</a></article>`;
  }).join("")}</div>`;
}

function renderThesisPage(aggregate) {
  const { thesis, decisions: related, foundations, tribunals, latestDecision: latestRelated, products, themes, evidence } = aggregate;
  const latest = latestRelated ? displayDate(decisionDate(latestRelated)) : "Não disponível";
  return shell({
    title: `${thesis.titulo} — Teses — Predator News`, description: thesis.sintese,
    content: `<main class="entity-page"><a class="back" href="${BASE}/teses/">← Banco de Teses</a>
      <div class="edition-kicker">TESE EM ACOMPANHAMENTO</div><h1>${escapeHtml(thesis.titulo)}</h1>
      <section class="entity-intro"><div><p class="signal">QUESTÃO JURÍDICA</p><p>${escapeHtml(thesis.questao_juridica)}</p></div><div><p class="signal">SÍNTESE PREDATOR</p><p>${escapeHtml(thesis.sintese)}</p></div></section>
      ${indicators([["Decisões", String(related.length)],["Tribunais", String(tribunals.length)],["Fundamentos usados", String(foundations.length)],["Última decisão", latest]])}
      <section class="decision-section"><h2>Escopo da amostra</h2><div class="entity-columns"><div><h3>Produtos</h3><div class="legal-pills">${pills(products)}</div></div><div><h3>Temas identificados</h3><div class="legal-pills">${pills(themes)}</div></div><div><h3>Tribunais representados</h3><div class="legal-pills">${pills(tribunals)}</div></div></div></section>
      <section class="decision-section"><h2>Fundamentos relacionados</h2><div class="entity-link-grid">${foundations.map((foundation) => `<a href="${BASE}/fundamentos/${escapeHtml(foundation.slug)}/"><strong>${escapeHtml(foundation.titulo)}</strong><span>${escapeHtml(foundation.formulacao)}</span></a>`).join("")}</div></section>
      ${evidence.length ? `<section class="decision-section"><h2>Provas recorrentes</h2><div class="legal-pills">${evidence.map((item) => `<span class="legal-pill">${escapeHtml(humanize(item.slug))} · ${item.count}</span>`).join("")}</div></section>` : ""}
      <section class="decision-section"><h2>Decisões relacionadas</h2>${relatedDecisions(related, thesis.slug)}</section>
      <aside class="sample-note"><strong>Limite da amostra</strong><p>Os indicadores refletem somente as decisões catalogadas no dataset atual e não representam conclusão sobre entendimento consolidado ou posição majoritária.</p></aside>
    </main>`,
  });
}

function renderFoundationPage(aggregate) {
  const { foundation, decisions: related, theses: relatedTheses, evidence } = aggregate;
  return shell({
    title: `${foundation.titulo} — Fundamentos — Predator News`, description: foundation.formulacao,
    content: `<main class="entity-page"><a class="back" href="${BASE}/fundamentos/">← Banco de Fundamentos</a>
      <div class="edition-kicker">FUNDAMENTO JURÍDICO</div><h1>${escapeHtml(foundation.titulo)}</h1>
      <section class="entity-intro"><div><p class="signal">FORMULAÇÃO TÉCNICA</p><p>${escapeHtml(foundation.formulacao)}</p></div></section>
      ${indicators([["Decisões relacionadas", String(related.length)],["Teses relacionadas", String(relatedTheses.length)]])}
      <section class="decision-section"><h2>Aplicabilidade</h2><div class="entity-columns"><div><h3>Produtos</h3><div class="legal-pills">${pills(foundation.produtos)}</div></div><div><h3>Temas</h3><div class="legal-pills">${pills(foundation.temas)}</div></div></div></section>
      ${foundation.base_normativa?.length ? `<section class="decision-section"><h2>Base normativa</h2><ul class="normative-list">${foundation.base_normativa.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>` : ""}
      ${foundation.frase_peca ? `<section class="decision-section foundation-statement"><h2>Frase de peça</h2>${renderEditorialStatement(foundation.frase_peca, { showLabel: false })}</section>` : ""}
      ${evidence.length ? `<section class="decision-section"><h2>Provas relacionadas</h2><div class="legal-pills">${evidence.map((item) => `<span class="legal-pill">${escapeHtml(humanize(item.slug))} · ${item.count}</span>`).join("")}</div></section>` : ""}
      <section class="decision-section"><h2>Teses relacionadas</h2><div class="entity-link-grid">${relatedTheses.map((thesis) => `<a href="${BASE}/teses/${escapeHtml(thesis.slug)}/"><strong>${escapeHtml(thesis.titulo)}</strong><span>${escapeHtml(thesis.questao_juridica)}</span></a>`).join("")}</div></section>
      <section class="decision-section"><h2>Decisões relacionadas</h2>${relatedDecisions(related)}</section>
    </main>`,
  });
}

const legalData = await loadData(ROOT);
await rm(DIST, { recursive: true, force: true });
await mkdir(join(DIST, "assets"), { recursive: true });
await cp(join(ROOT, "src", "style.css"), join(DIST, "assets", "style.css"));
await cp(join(ROOT, "src", "radar.html"), join(DIST, "assets", "radar.html"));
await cp(join(ROOT, "src", "jurisprudencia-filter.mjs"), join(DIST, "assets", "jurisprudencia-filter.mjs"));
await writeFile(join(DIST, ".nojekyll"), "");

const names = (await readdir(CONTENT)).filter((name) => name.endsWith(".md") && !name.startsWith("_"));
const editions = [];
for (const name of names) editions.push(parseEdition(await readFile(join(CONTENT, name), "utf8"), name));
editions.sort((a, b) => b.data.localeCompare(a.data));
if (!editions.length) throw new Error("Nenhuma edição encontrada");

const decisions = legalData.decisions.map(({ value }) => value).sort((a, b) => {
  const dateA = a.identificacao.data_julgamento || a.identificacao.data_publicacao || "";
  const dateB = b.identificacao.data_julgamento || b.identificacao.data_publicacao || "";
  return dateB.localeCompare(dateA) || a.id.localeCompare(b.id);
});
const activeTheses = legalData.theses.map(({ value }) => value).filter((thesis) => thesis.status === "ativo");
const activeFoundations = legalData.foundations.map(({ value }) => value).filter((foundation) => foundation.status === "ativo");
const thesisLabels = new Map(legalData.theses.map(({ value }) => [value.slug, value.titulo]));
const foundationLabels = new Map(legalData.foundations.map(({ value }) => [value.slug, value.titulo]));
const decisionsById = new Map(decisions.map((decision) => [decision.id, decision]));
const editionsByDecision = buildEditorialRelations(editions, decisions);

for (const edition of editions) {
  const directory = join(DIST, "edicoes", edition.slug);
  await mkdir(directory, { recursive: true });
  const page = shell({
    title: `${edition.titulo} — Predator News`,
    description: edition.resumo,
    content: `<main class="edition-page"><a class="back" href="${BASE}/#edicoes">← Todas as edições</a>
      <div class="edition-kicker">EDIÇÃO ${escapeHtml(edition.numero)} · ${dateLabel(edition.data)} · ${escapeHtml(edition.categoria)}</div>
      <h1>${escapeHtml(edition.titulo)}</h1><p class="edition-summary">${escapeHtml(edition.resumo)}</p>
      ${renderEditionIntegration({ edition, decisionsById, thesisLabels, base: BASE, humanize })}
      <section id="analise-completa" class="edition-body" aria-labelledby="analysis-title"><div class="edition-body-heading"><p class="signal">ANÁLISE COMPLETA</p><h2 id="analysis-title">Da notícia à aplicação profissional</h2><p>Fato, interpretação, consequência jurídica e uso prático em uma sequência contínua.</p></div>${markdown(edition.body)}</section></main>`,
  });
  await writeFile(join(directory, "index.html"), page);
}

const filterValues = (getter) => [...new Set(decisions.flatMap(getter))].sort((a, b) => a.localeCompare(b, "pt-BR"));
const tribunals = filterValues((decision) => [decision.identificacao.tribunal]);
const products = filterValues((decision) => decision.contexto.produtos);
const themes = filterValues((decision) => decision.contexto.temas);
const theses = filterValues((decision) => decision.teses.map((item) => item.slug));
const thesisStatuses = filterValues((decision) => decision.teses.map((item) => item.status));
const jurisprudenceDirectory = join(DIST, "jurisprudencia");
await mkdir(jurisprudenceDirectory, { recursive: true });

for (const decision of decisions) {
  const directory = join(jurisprudenceDirectory, decision.id);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), renderDecisionPage(decision, thesisLabels, foundationLabels, editionsByDecision.get(decision.id)));
}

const jurisprudencePage = shell({
  title: "Jurisprudência — Predator News",
  description: "Decisões selecionadas e estruturadas pelo Predator News para pesquisa em Direito Bancário.",
  content: `<main class="jurisprudence-page"><section class="legal-hero"><p class="signal">INTELIGÊNCIA JURÍDICA</p><h1>Jurisprudência</h1><p>Decisões selecionadas e estruturadas pelo Predator News para pesquisa em Direito Bancário aplicado a aposentados e pensionistas do INSS.</p></section>
    <section class="legal-explorer" aria-labelledby="legal-results-title">
      <div class="legal-search-row"><label><span>Pesquisar jurisprudência</span><input type="search" data-decision-search placeholder="Processo, tribunal, tema ou fundamento"></label><button type="button" data-clear-filters>Limpar filtros</button></div>
      <div class="legal-filter-grid">${selectFilter("tribunal", "Tribunal", tribunals)}${selectFilter("produto", "Produto", products)}${selectFilter("tema", "Tema", themes)}${selectFilter("tese", "Tese", theses, thesisLabels)}${selectFilter("statusTese", "Resultado da tese", thesisStatuses)}</div>
      <div class="legal-results-head"><h2 id="legal-results-title">Decisões catalogadas</h2><p aria-live="polite"><strong data-result-count>${decisions.length}</strong> resultado(s)</p></div>
      <div class="legal-card-list">${decisions.map((decision) => decisionCard(decision, thesisLabels)).join("\n")}</div>
      <p class="legal-empty" data-decision-empty hidden>Nenhuma decisão corresponde aos critérios informados.</p>
    </section></main>`,
  script: `<script type="module">import{matchesDecision}from'${BASE}/assets/jurisprudencia-filter.mjs';const search=document.querySelector('[data-decision-search]'),selects=[...document.querySelectorAll('[data-decision-filter]')],cards=[...document.querySelectorAll('[data-decision-card]')],count=document.querySelector('[data-result-count]'),empty=document.querySelector('[data-decision-empty]');const split=value=>value?value.split('|'):[];function apply(){const filters={query:search.value};selects.forEach(select=>filters[select.dataset.decisionFilter]=select.value);let visible=0;cards.forEach(card=>{const record={search:card.dataset.search,tribunal:card.dataset.tribunal,produtos:split(card.dataset.produtos),temas:split(card.dataset.temas),teses:split(card.dataset.teses),statusTese:split(card.dataset.statusTese)};const show=matchesDecision(record,filters);card.hidden=!show;if(show)visible++});count.textContent=visible;empty.hidden=visible!==0}search.addEventListener('input',apply);selects.forEach(select=>select.addEventListener('change',apply));document.querySelector('[data-clear-filters]').addEventListener('click',()=>{search.value='';selects.forEach(select=>select.value='');apply();search.focus()});</script>`,
});
await writeFile(join(jurisprudenceDirectory, "index.html"), jurisprudencePage);

const thesisAggregates = activeTheses.map((thesis) => aggregateThesis(thesis, decisions, activeFoundations));
const foundationAggregates = activeFoundations.map((foundation) => aggregateFoundation(foundation, decisions, activeTheses));

const thesesDirectory = join(DIST, "teses");
await mkdir(thesesDirectory, { recursive: true });
for (const aggregate of thesisAggregates) {
  const directory = join(thesesDirectory, aggregate.thesis.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), renderThesisPage(aggregate));
}
const thesesPage = shell({
  title: "Banco de Teses — Predator News",
  description: "Questões jurídicas acompanhadas a partir das decisões catalogadas pelo Predator News.",
  content: `<main class="jurisprudence-page"><section class="legal-hero"><p class="signal">INTELIGÊNCIA JURÍDICA</p><h1>Banco de Teses</h1><p>Questões jurídicas acompanhadas a partir da amostra de decisões catalogadas pelo Predator News.</p></section><section class="entity-index"><div class="entity-index-grid">${thesisAggregates.map(({ thesis, decisions: related, tribunals: represented, foundations, latestDecision: latest, products, themes: relatedThemes }) => `<article class="entity-card"><p class="signal">TESE EM ACOMPANHAMENTO</p><h2>${escapeHtml(thesis.titulo)}</h2><p>${escapeHtml(thesis.sintese)}</p><div class="legal-pills">${pills([...products, ...relatedThemes])}</div>${indicators([["Decisões", String(related.length)],["Tribunais", String(represented.length)],["Fundamentos", String(foundations.length)],["Última decisão", latest ? displayDate(decisionDate(latest)) : "Não disponível"]])}<a href="${BASE}/teses/${escapeHtml(thesis.slug)}/">Explorar tese →</a></article>`).join("")}</div></section></main>`,
});
await writeFile(join(thesesDirectory, "index.html"), thesesPage);

const foundationsDirectory = join(DIST, "fundamentos");
await mkdir(foundationsDirectory, { recursive: true });
for (const aggregate of foundationAggregates) {
  const directory = join(foundationsDirectory, aggregate.foundation.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), renderFoundationPage(aggregate));
}
const foundationsPage = shell({
  title: "Banco de Fundamentos — Predator News",
  description: "Razões jurídicas e probatórias identificadas no acervo do Predator News.",
  content: `<main class="jurisprudence-page"><section class="legal-hero"><p class="signal">INTELIGÊNCIA JURÍDICA</p><h1>Banco de Fundamentos</h1><p>Razões jurídicas e probatórias reutilizáveis identificadas no acervo catalogado.</p></section><section class="entity-index"><div class="entity-index-grid">${foundationAggregates.map(({ foundation, decisions: related, theses: relatedTheses }) => `<article class="entity-card"><p class="signal">FUNDAMENTO</p><h2>${escapeHtml(foundation.titulo)}</h2><p>${escapeHtml(foundation.formulacao)}</p><div class="legal-pills">${pills([...foundation.produtos, ...foundation.temas])}</div>${indicators([["Decisões", String(related.length)],["Teses", String(relatedTheses.length)]])}<a href="${BASE}/fundamentos/${escapeHtml(foundation.slug)}/">Explorar fundamento →</a></article>`).join("")}</div></section></main>`,
});
await writeFile(join(foundationsDirectory, "index.html"), foundationsPage);

const latest = editions[0];
const latestUrl = `${BASE}/edicoes/${latest.slug}/`;
const homeMetrics = legalHomeMetrics(decisions, activeTheses, activeFoundations);
const categories = [...new Set(editions.map((item) => item.categoria))];
const cards = editions.map((edition) => `<article class="edition-card" data-category="${escapeHtml(edition.categoria)}" data-search="${escapeHtml(normalize(`${edition.numero} ${edition.titulo} ${edition.resumo} ${edition.categoria}`))}">
  <div class="edition-number"><span>EDIÇÃO</span><strong>${escapeHtml(edition.numero)}</strong></div>
  <div><div class="edition-meta">${dateLabel(edition.data)} · ${escapeHtml(edition.categoria)}</div><h3>${escapeHtml(edition.titulo)}</h3><p>${escapeHtml(edition.resumo)}</p></div>
  <a class="edition-link" href="${BASE}/edicoes/${edition.slug}/" aria-label="Ler ${escapeHtml(edition.titulo)}">→</a></article>`).join("\n");

const home = shell({
  title: "Predator News — Direito Bancário no Radar",
  description: "Newsletter jurídica sobre consignados, RMC/RCC, fraudes bancárias e decisões que afetam beneficiários do INSS.",
  content: `<main><section class="hero" id="edicao-atual"><div class="hero-copy"><p class="signal">EDIÇÃO ${escapeHtml(latest.numero)} · ${dateLabel(latest.data)}</p><p class="hero-category">${escapeHtml(latest.categoria)}</p>
    <h1>${escapeHtml(latest.titulo)}</h1>
    <p class="hero-lead">${escapeHtml(latest.resumo)}</p>
    <a class="button" href="${latestUrl}">Ler a edição atual →</a></div>
    <aside aria-label="Radar da edição"><p class="hero-manifesto">Informação detectada.<br><em>Tese preparada.</em></p>${radarVisual}</aside></section>
    ${renderNewsDigest(latest, latestUrl)}
    ${renderApplication(latest, { ctaHref: latestUrl, ctaText: "Ler edição completa →" })}
    <section class="home-intelligence" aria-labelledby="home-intelligence-title"><div><p class="signal">INTELIGÊNCIA PREDATOR</p><h2 id="home-intelligence-title">O acervo jurídico em perspectiva</h2><p>Explore decisões estruturadas e os argumentos jurídicos relacionados, sem sair do fluxo editorial.</p></div><dl><div><dt>Decisões catalogadas</dt><dd>${homeMetrics.decisions}</dd></div><div><dt>Tese em acompanhamento</dt><dd>${homeMetrics.theses}</dd></div><div><dt>Fundamentos</dt><dd>${homeMetrics.foundations}</dd></div></dl><a href="${BASE}/jurisprudencia/">Explorar jurisprudência →</a></section>
    <section class="archive" id="edicoes"><div class="archive-head"><div><p class="signal">HISTÓRICO</p><h2>Arquivo de edições</h2></div>
    <input id="search" type="search" placeholder="Buscar tema ou edição" aria-label="Buscar no arquivo"></div>
    <div class="filters"><button class="active" data-filter="Todas">Todas</button>${categories.map((category) => `<button data-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("")}</div>
    <div class="archive-results"><p aria-live="polite"><strong data-edition-count>${editions.length}</strong> edição(ões)</p><span>Ordenadas da mais recente para a mais antiga</span></div><div id="edition-list">${cards}</div><p id="empty" role="status" hidden>Nenhuma edição corresponde à busca e ao filtro selecionados.</p></section>
    <section class="about" id="sobre"><p class="signal">MANIFESTO EDITORIAL</p><h2>Informação detectada.<br>Tese preparada.</h2><p>O Predator News transforma fatos dispersos em leitura técnica, risco processual, prova estratégica e linguagem aproveitável.</p></section></main>`,
  script: `<script>let filter='Todas';const normalizeSearch=value=>String(value||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();const q=document.querySelector('#search'),buttons=[...document.querySelectorAll('[data-filter]')],cards=[...document.querySelectorAll('.edition-card')],empty=document.querySelector('#empty'),countLabel=document.querySelector('[data-edition-count]');buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.classList.contains('active'))));function apply(){const term=normalizeSearch(q.value);let count=0;cards.forEach(c=>{const show=(filter==='Todas'||c.dataset.category===filter)&&(!term||c.dataset.search.includes(term));c.hidden=!show;if(show)count++});empty.hidden=count>0;countLabel.textContent=count}q?.addEventListener('input',apply);buttons.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;buttons.forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active))});apply()}));</script>`,
});
await writeFile(join(DIST, "index.html"), home);
console.log(`Predator News: ${editions.length} edição(ões) gerada(s).`);
