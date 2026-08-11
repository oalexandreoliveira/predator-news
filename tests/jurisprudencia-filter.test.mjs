import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { loadData } from "../scripts/data/load-data.mjs";
import { filterDecisions, normalizeSearch } from "../src/jurisprudencia-filter.mjs";

const { decisions: records } = await loadData(resolve("."));
const decisions = records.map(({ value }) => value);

test("normalização ignora caixa, acentos e pontuação", () => {
  assert.equal(normalizeSearch("Órgão — JULGADOR"), "orgao julgador");
});

test("sem filtros retorna as dez decisões", () => {
  assert.equal(filterDecisions(decisions).length, decisions.length);
});

test("busca cobre processo, tribunal, relator, título, produto, tema, tese e fundamento", () => {
  for (const query of ["0818263-04.2023", "TJMA", "Carliete", "perícia grafotécnica", "RMC", "contratação digital", "vicio consentimento", "hipervulnerabilidade"]) {
    assert.ok(filterDecisions(decisions, { query }).length > 0, query);
  }
});

test("cada dimensão de filtro funciona isoladamente", () => {
  assert.equal(filterDecisions(decisions, { tribunal: "TJMA" }).length, 1);
  assert.ok(filterDecisions(decisions, { produto: "rmc" }).length > 0);
  assert.ok(filterDecisions(decisions, { tema: "consentimento" }).length > 0);
  assert.equal(filterDecisions(decisions, { tese: "vicio_consentimento_cartao_consignado" }).length, decisions.filter(item => item.teses.some(tese => tese.slug === "vicio_consentimento_cartao_consignado")).length);
  assert.ok(filterDecisions(decisions, { statusTese: "acolhida" }).length > 0);
});

test("filtros de dimensões diferentes são combinados com AND", () => {
  const results = filterDecisions(decisions, { tribunal: "TJCE", produto: "cartao_credito_consignado", statusTese: "rejeitada" });
  assert.equal(results.length, 1);
  assert.equal(results[0].id, "tjce-0050625-78-2021-8-06-0157");
});

test("busca e filtros podem ser combinados", () => {
  const results = filterDecisions(decisions, { query: "contrato digital", tribunal: "TJMA", statusTese: "acolhida" });
  assert.equal(results.length, 1);
  assert.equal(results[0].id, "tjma-0818263-04-2023-8-10-0029");
});
