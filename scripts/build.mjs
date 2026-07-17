import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/scripts\/$/, "");
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
  const flush = () => {
    if (paragraph.length) out.push(`<p>${inline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const closeList = () => { if (list) out.push("</ul>"); list = false; };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flush(); closeList(); continue; }
    if (line.startsWith("### ")) { flush(); closeList(); out.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (line.startsWith("## ")) { flush(); closeList(); out.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("# ")) { flush(); closeList(); out.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }
    if (line.startsWith("> ")) { flush(); closeList(); out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); continue; }
    if (line.startsWith("- ")) {
      flush();
      if (!list) { out.push("<ul>"); list = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    paragraph.push(line);
  }
  flush(); closeList();
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
    ${frase ? `<div class="application-quote"><p class="application-label">Frase de peça</p><blockquote>“${escapeHtml(frase)}”</blockquote></div>` : ""}
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

const themeInit = `<script>try{const t=localStorage.getItem('predator-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch{}</script>`;
const themeScript = `<script>(()=>{const root=document.documentElement,key='predator-theme',btn=document.querySelector('[data-theme-toggle]');const valid=t=>t==='light'||t==='dark';function current(){return valid(root.dataset.theme)?root.dataset.theme:'dark'}function apply(theme){root.dataset.theme=theme;try{localStorage.setItem(key,theme)}catch{}if(btn){btn.setAttribute('aria-pressed',theme==='light');const label=btn.querySelector('[data-theme-label]');if(label)label.textContent=theme==='light'?'Claro':'Escuro';}}if(!valid(root.dataset.theme))apply('dark');else apply(root.dataset.theme);btn?.addEventListener('click',()=>apply(current()==='dark'?'light':'dark'));})();</script>`;

const shell = ({ title, description, content, script = "" }) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
${themeInit}<link rel="stylesheet" href="${BASE}/assets/style.css"></head><body>
<header class="site-header"><a class="brand" href="${BASE}/"><span class="brand-mark">${brandIcon}</span><span><strong>PREDATOR</strong><small>NEWS</small></span></a>
<div class="header-actions"><nav><a href="${BASE}/#edicao-atual">Edição atual</a><a href="${BASE}/#edicoes">Edições</a><a href="${BASE}/#sobre">Sobre</a></nav><button class="theme-toggle" type="button" data-theme-toggle aria-label="Alternar tema" aria-pressed="false"><span data-theme-label>Escuro</span></button></div></header>
${content}<footer><span>Predator News</span><p>Conteúdo jurídico informativo. Leitura crítica para decisões melhores.</p></footer>${themeScript}${script}</body></html>`;

await rm(DIST, { recursive: true, force: true });
await mkdir(join(DIST, "assets"), { recursive: true });
await cp(join(ROOT, "src", "style.css"), join(DIST, "assets", "style.css"));
await writeFile(join(DIST, ".nojekyll"), "");

const names = (await readdir(CONTENT)).filter((name) => name.endsWith(".md") && !name.startsWith("_"));
const editions = [];
for (const name of names) editions.push(parseEdition(await readFile(join(CONTENT, name), "utf8"), name));
editions.sort((a, b) => b.data.localeCompare(a.data));
if (!editions.length) throw new Error("Nenhuma edição encontrada");

for (const edition of editions) {
  const directory = join(DIST, "edicoes", edition.slug);
  await mkdir(directory, { recursive: true });
  const page = shell({
    title: `${edition.titulo} — Predator News`,
    description: edition.resumo,
    content: `<main class="edition-page"><a class="back" href="${BASE}/#edicoes">← Todas as edições</a>
      <div class="edition-kicker">EDIÇÃO ${escapeHtml(edition.numero)} · ${dateLabel(edition.data)} · ${escapeHtml(edition.categoria)}</div>
      <h1>${escapeHtml(edition.titulo)}</h1><p class="edition-summary">${escapeHtml(edition.resumo)}</p>
      <section id="analise-completa" class="edition-body"><p class="signal">ANÁLISE COMPLETA</p>${markdown(edition.body)}</section></main>`,
  });
  await writeFile(join(directory, "index.html"), page);
}

const latest = editions[0];
const latestUrl = `${BASE}/edicoes/${latest.slug}/`;
const categories = [...new Set(editions.map((item) => item.categoria))];
const cards = editions.map((edition) => `<article class="edition-card" data-category="${escapeHtml(edition.categoria)}" data-search="${escapeHtml(`${edition.titulo} ${edition.resumo} ${edition.categoria}`.toLowerCase())}">
  <div class="edition-number"><span>EDIÇÃO</span><strong>${escapeHtml(edition.numero)}</strong></div>
  <div><div class="edition-meta">${dateLabel(edition.data)} · ${escapeHtml(edition.categoria)}</div><h3>${escapeHtml(edition.titulo)}</h3><p>${escapeHtml(edition.resumo)}</p></div>
  <a class="edition-link" href="${BASE}/edicoes/${edition.slug}/" aria-label="Ler ${escapeHtml(edition.titulo)}">→</a></article>`).join("\n");

const home = shell({
  title: "Predator News — Direito Bancário no Radar",
  description: "Newsletter jurídica sobre consignados, RMC/RCC, fraudes bancárias e decisões que afetam beneficiários do INSS.",
  content: `<main><section class="hero" id="edicao-atual"><div><p class="signal">EDIÇÃO ${escapeHtml(latest.numero)} · ${dateLabel(latest.data)}</p>
    <h1>O radar jurídico de quem atua contra <em>abusos bancários.</em></h1>
    <p class="hero-lead">Curadoria técnica sobre consignados, RMC/RCC, fraudes e decisões que afetam aposentados e pensionistas do INSS.</p>
    <a class="button" href="${latestUrl}">Ler a edição atual →</a></div>
    <aside><span>DESTAQUE · ${escapeHtml(latest.categoria)}</span><div class="radar"></div><h2>${escapeHtml(latest.titulo)}</h2><p>${escapeHtml(latest.resumo)}</p></aside></section>
    ${renderApplication(latest, { ctaHref: latestUrl, ctaText: "Ler edição completa →" })}
    <section class="archive" id="edicoes"><div class="archive-head"><div><p class="signal">HISTÓRICO</p><h2>Arquivo de edições</h2></div>
    <input id="search" type="search" placeholder="Buscar tema ou edição" aria-label="Buscar no arquivo"></div>
    <div class="filters"><button class="active" data-filter="Todas">Todas</button>${categories.map((category) => `<button data-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("")}</div>
    <div id="edition-list">${cards}</div><p id="empty" hidden>Nenhuma edição encontrada.</p></section>
    <section class="about" id="sobre"><p class="signal">MANIFESTO EDITORIAL</p><h2>Informação detectada.<br>Tese preparada.</h2><p>O Predator News transforma fatos dispersos em leitura técnica, risco processual, prova estratégica e linguagem aproveitável.</p></section></main>`,
  script: `<script>let filter='Todas';const q=document.querySelector('#search'),buttons=[...document.querySelectorAll('[data-filter]')],cards=[...document.querySelectorAll('.edition-card')],empty=document.querySelector('#empty');function apply(){const term=q.value.toLowerCase().trim();let count=0;cards.forEach(c=>{const show=(filter==='Todas'||c.dataset.category===filter)&&(!term||c.dataset.search.includes(term));c.hidden=!show;if(show)count++});empty.hidden=count>0}q?.addEventListener('input',apply);buttons.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;buttons.forEach(x=>x.classList.toggle('active',x===b));apply()}));</script>`,
});
await writeFile(join(DIST, "index.html"), home);
console.log(`Predator News: ${editions.length} edição(ões) gerada(s).`);
