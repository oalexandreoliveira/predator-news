const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export const EDITORIAL_DISCLAIMER = "Síntese editorial Predator — não corresponde a citação literal de decisão judicial.";

export function renderEditorialStatement(text, { copyButton = false, showLabel = true } = {}) {
  if (!text) return "";
  return `<div class="editorial-statement" data-editorial-statement>
    ${showLabel || copyButton ? `<div class="editorial-statement-head">${showLabel ? '<p class="application-label">Frase de peça</p>' : ""}${copyButton ? '<button type="button" class="copy-quote" data-copy-quote aria-label="Copiar frase de peça">Copiar frase</button>' : ""}</div>` : ""}
    <p class="editorial-statement-text">${escapeHtml(text)}</p>
    <p class="editorial-disclaimer">${EDITORIAL_DISCLAIMER}</p>
  </div>`;
}

export function renderEditionIntegration({ edition, decisionsById, thesisLabels, base, humanize }) {
  if (!edition.jurisprudencia.length) return "";
  return `<aside class="edition-intelligence" aria-labelledby="edition-intelligence-title"><div><p class="signal">INTELIGÊNCIA JURÍDICA</p><h2 id="edition-intelligence-title">Decisões relacionadas à análise</h2></div><div class="edition-intelligence-list">${edition.jurisprudencia.map((decisionId) => {
    const decision = decisionsById.get(decisionId);
    const thesis = decision.teses[0];
    return `<article><div><strong>${escapeHtml(decision.identificacao.tribunal)}</strong><span>${escapeHtml(humanize(decision.contexto.produtos[0]))} · ${escapeHtml(humanize(decision.contexto.temas[0]))}</span><p>${escapeHtml(thesisLabels.get(thesis.slug) || humanize(thesis.slug))}</p></div><div class="edition-intelligence-actions"><a href="${escapeHtml(`${base}/jurisprudencia/${decision.id}/`)}">Analisar decisão →</a><a href="${escapeHtml(`${base}/teses/${thesis.slug}/`)}">Explorar tese →</a></div></article>`;
  }).join("")}</div></aside>`;
}

export function renderDecisionEditionRelations({ editions, base }) {
  if (!editions.length) return "";
  return `<section class="decision-section"><h2>Análises editoriais relacionadas</h2><div class="editorial-edition-links">${editions.map((edition) => `<a href="${escapeHtml(`${base}/edicoes/${edition.slug}/`)}"><span>Analisada na edição nº ${escapeHtml(edition.numero)}</span><strong>${escapeHtml(edition.titulo)}</strong></a>`).join("")}</div></section>`;
}
