export const normalizeSearch = (value = "") => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

export function createDecisionSearchText(decision) {
  const identification = decision.identificacao || {};
  const context = decision.contexto || {};
  return normalizeSearch([
    identification.processo,
    identification.tribunal,
    identification.orgao_julgador,
    identification.relator,
    decision.titulo,
    decision.resumo_predator,
    ...(context.produtos || []),
    ...(context.temas || []),
    ...(decision.teses || []).map((item) => item.slug),
    ...(decision.fundamentos || []),
  ].filter(Boolean).join(" "));
}

export function decisionToFilterRecord(decision) {
  return {
    search: createDecisionSearchText(decision),
    tribunal: decision.identificacao.tribunal,
    produtos: decision.contexto.produtos || [],
    temas: decision.contexto.temas || [],
    teses: (decision.teses || []).map((item) => item.slug),
    statusTese: (decision.teses || []).map((item) => item.status),
  };
}

export function matchesDecision(record, { query = "", tribunal = "", produto = "", tema = "", tese = "", statusTese = "" } = {}) {
  const term = normalizeSearch(query);
  return (!term || record.search.includes(term))
    && (!tribunal || record.tribunal === tribunal)
    && (!produto || record.produtos.includes(produto))
    && (!tema || record.temas.includes(tema))
    && (!tese || record.teses.includes(tese))
    && (!statusTese || record.statusTese.includes(statusTese));
}

export function filterDecisions(decisions, filters = {}) {
  return decisions.filter((decision) => matchesDecision(decisionToFilterRecord(decision), filters));
}
