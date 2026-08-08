export function parseDecisionReferences(value = "") {
  if (Array.isArray(value)) return [...new Set(value.map(String).map((item) => item.trim()).filter(Boolean))];
  return [...new Set(String(value).split(",").map((item) => item.trim()).filter(Boolean))];
}

export function buildEditorialRelations(editions, decisions) {
  const decisionIds = new Set(decisions.map((decision) => decision.id));
  const editionsByDecision = new Map(decisions.map((decision) => [decision.id, []]));

  for (const edition of editions) {
    const rawReferences = Array.isArray(edition.jurisprudencia)
      ? edition.jurisprudencia.map(String).map((item) => item.trim()).filter(Boolean)
      : String(edition.jurisprudencia || "").split(",").map((item) => item.trim()).filter(Boolean);
    const references = parseDecisionReferences(rawReferences);
    if (references.length !== rawReferences.length) {
      throw new Error(`Referência jurisprudencial duplicada na edição ${edition.numero}`);
    }
    for (const decisionId of references) {
      if (!decisionIds.has(decisionId)) {
        throw new Error(`Decision-id inexistente na edição ${edition.numero}: ${decisionId}`);
      }
      editionsByDecision.get(decisionId).push(edition);
    }
    edition.jurisprudencia = references;
  }

  return editionsByDecision;
}

export function legalHomeMetrics(decisions, theses, foundations) {
  return {
    decisions: decisions.length,
    theses: theses.filter((item) => item.status === "ativo").length,
    foundations: foundations.filter((item) => item.status === "ativo").length,
  };
}

const joinBase = (base, path) => `${base}${path}`;

export function globalMenuLinks(base) {
  return [
    ["Edição atual", joinBase(base, "/#edicao-atual")],
    ["Edições", joinBase(base, "/#edicoes")],
    ["Jurisprudência", joinBase(base, "/jurisprudencia/")],
    ["Teses", joinBase(base, "/teses/")],
    ["Fundamentos", joinBase(base, "/fundamentos/")],
    ["Sobre", joinBase(base, "/#sobre")],
  ];
}

export function editorialLinkTargets(base, edition, decision) {
  return {
    decision: joinBase(base, `/jurisprudencia/${decision.id}/`),
    thesis: joinBase(base, `/teses/${decision.teses[0].slug}/`),
    edition: joinBase(base, `/edicoes/${edition.slug}/`),
  };
}
