const uniqueBy = (items, key) => [...new Map(items.map((item) => [key(item), item])).values()];
export const uniqueValues = (values = []) => [...new Set(values.filter(Boolean))];

export const decisionDate = (decision) => decision.identificacao.data_julgamento
  || decision.identificacao.data_publicacao
  || "";

export function decisionsByThesis(decisions, thesisSlug) {
  return uniqueBy(decisions.filter((decision) => decision.teses.some((item) => item.slug === thesisSlug)), (decision) => decision.id);
}

export function decisionsByFoundation(decisions, foundationSlug) {
  return uniqueBy(decisions.filter((decision) => decision.fundamentos.includes(foundationSlug)), (decision) => decision.id);
}

export function foundationsByThesis(decisions, thesisSlug, foundations) {
  const ids = new Set(decisionsByThesis(decisions, thesisSlug).flatMap((decision) => decision.fundamentos));
  return foundations.filter((foundation) => ids.has(foundation.slug));
}

export function thesesByFoundation(theses, foundationSlug) {
  return uniqueBy(theses.filter((thesis) => thesis.fundamentos.includes(foundationSlug)), (thesis) => thesis.slug);
}

export function uniqueTribunals(decisions) {
  return uniqueValues(decisions.map((decision) => decision.identificacao.tribunal)).sort();
}

export function latestDecision(decisions) {
  return [...decisions].sort((a, b) => decisionDate(b).localeCompare(decisionDate(a)) || a.id.localeCompare(b.id))[0] || null;
}

export function recurringEvidence(decisions) {
  const counts = new Map();
  for (const proof of decisions.flatMap((decision) => decision.provas || [])) counts.set(proof, (counts.get(proof) || 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([slug, count]) => ({ slug, count }));
}

export function aggregateThesis(thesis, decisions, foundations) {
  const relatedDecisions = decisionsByThesis(decisions, thesis.slug);
  return {
    thesis,
    decisions: relatedDecisions,
    foundations: foundationsByThesis(decisions, thesis.slug, foundations),
    tribunals: uniqueTribunals(relatedDecisions),
    latestDecision: latestDecision(relatedDecisions),
    products: uniqueValues([...thesis.produtos, ...relatedDecisions.flatMap((decision) => decision.contexto.produtos)]),
    themes: uniqueValues(relatedDecisions.flatMap((decision) => decision.contexto.temas)),
    evidence: recurringEvidence(relatedDecisions),
  };
}

export function aggregateFoundation(foundation, decisions, theses) {
  const relatedDecisions = decisionsByFoundation(decisions, foundation.slug);
  return {
    foundation,
    decisions: relatedDecisions,
    theses: thesesByFoundation(theses, foundation.slug),
    tribunals: uniqueTribunals(relatedDecisions),
    latestDecision: latestDecision(relatedDecisions),
    evidence: recurringEvidence(relatedDecisions),
  };
}
