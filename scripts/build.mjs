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
    value = value.replace(/^['"]|['"]$/g, "");
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

function markdown(source) {
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

const dateLabel = (date) => new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit", month: "short", year: "numeric", timeZone: "UTC"
}).format(new Date(`${date}T00:00:00Z`)).toUpperCase().replace(" DE ", " ");

const shell = ({ title, description, content, script = "" }) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
<link rel="stylesheet" href="${BASE}/assets/style.css"></head><body>
<header class="site-header"><a class="brand" href="${BASE}/"><span class="brand-mark">PN</span><span><strong>PREDATOR</strong><small>NEWS</small></span></a>
<nav><a href="${BASE}/#edicao-atual">Edição atual</a><a href="${BASE}/#edicoes">Edições</a><a href="${BASE}/#sobre">Sobre</a></nav></header>
${content}<footer><span>Predator News</span><p>Conteúdo jurídico informativo. Leitura crítica para decisões melhores.</p></footer>${script}</body></html>`;

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
      <div class="edition-body">${markdown(edition.body)}</div></main>`,
  });
  await writeFile(join(directory, "index.html"), page);
}

const latest = editions[0];
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
    <a class="button" href="${BASE}/edicoes/${latest.slug}/">Ler a edição atual →</a></div>
    <aside><span>DESTAQUE · ${escapeHtml(latest.categoria)}</span><div class="radar"></div><h2>${escapeHtml(latest.titulo)}</h2><p>${escapeHtml(latest.resumo)}</p></aside></section>
    <section class="archive" id="edicoes"><div class="archive-head"><div><p class="signal">HISTÓRICO</p><h2>Arquivo de edições</h2></div>
    <input id="search" type="search" placeholder="Buscar tema ou edição" aria-label="Buscar no arquivo"></div>
    <div class="filters"><button class="active" data-filter="Todas">Todas</button>${categories.map((category) => `<button data-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("")}</div>
    <div id="edition-list">${cards}</div><p id="empty" hidden>Nenhuma edição encontrada.</p></section>
    <section class="about" id="sobre"><p class="signal">MANIFESTO EDITORIAL</p><h2>Informação detectada.<br>Tese preparada.</h2><p>O Predator News transforma fatos dispersos em leitura técnica, risco processual, prova estratégica e linguagem aproveitável.</p></section></main>`,
  script: `<script>let filter='Todas';const q=document.querySelector('#search'),buttons=[...document.querySelectorAll('[data-filter]')],cards=[...document.querySelectorAll('.edition-card')],empty=document.querySelector('#empty');function apply(){const term=q.value.toLowerCase().trim();let count=0;cards.forEach(c=>{const show=(filter==='Todas'||c.dataset.category===filter)&&(!term||c.dataset.search.includes(term));c.hidden=!show;if(show)count++});empty.hidden=count>0}q.addEventListener('input',apply);buttons.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;buttons.forEach(x=>x.classList.toggle('active',x===b));apply()}));</script>`,
});
await writeFile(join(DIST, "index.html"), home);
console.log(`Predator News: ${editions.length} edição(ões) gerada(s).`);
