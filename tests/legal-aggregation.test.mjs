import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { loadData } from "../scripts/data/load-data.mjs";
import {
  aggregateFoundation, aggregateThesis, decisionsByFoundation, decisionsByThesis,
  foundationsByThesis, latestDecision, thesesByFoundation, uniqueTribunals,
} from "../scripts/data/aggregate-legal.mjs";

const loaded = await loadData(resolve("."));
const decisions = loaded.decisions.map(({ value }) => value);
const theses = loaded.theses.map(({ value }) => value);
const foundations = loaded.foundations.map(({ value }) => value);
const thesisSlug = "vicio_consentimento_cartao_consignado";

test("deriva as dez decisões relacionadas à tese", () => {
  assert.equal(decisionsByThesis(decisions, thesisSlug).length, 10);
});

test("deriva decisões relacionadas a fundamento", () => {
  assert.equal(decisionsByFoundation(decisions, "dever_informacao_qualificado").length, 7);
});

test("deriva fundamentos usados pelas decisões da tese sem duplicidade", () => {
  const related = foundationsByThesis(decisions, thesisSlug, foundations);
  assert.equal(related.length, 5);
  assert.equal(new Set(related.map((item) => item.slug)).size, related.length);
});

test("deriva teses relacionadas ao fundamento pela relação direta da tese", () => {
  assert.deepEqual(thesesByFoundation(theses, "dever_informacao_qualificado").map((item) => item.slug), [thesisSlug]);
});

test("deriva tribunais únicos", () => {
  const tribunals = uniqueTribunals(decisions);
  assert.ok(["TJCE", "TJMA", "TJPI"].every((tribunal) => tribunals.includes(tribunal)));
  assert.ok(tribunals.length >= 3);
});

test("calcula a decisão relacionada mais recente", () => {
  assert.equal(latestDecision(decisions).id, "tjce-0201664-84-2022-8-06-0029");
});

test("agregado da tese contém contagens corretas e sem duplicações", () => {
  const aggregate = aggregateThesis(theses[0], decisions, foundations);
  assert.equal(aggregate.decisions.length, 10);
  assert.equal(aggregate.tribunals.length, 3);
  assert.equal(aggregate.foundations.length, 5);
  assert.equal(new Set(aggregate.decisions.map((item) => item.id)).size, 10);
});

test("entidade sem decisões relacionadas é suportada", () => {
  const foundation = foundations.find((item) => item.slug === "ausencia_uso_cartao_indicio_vicio");
  const aggregate = aggregateFoundation(foundation, decisions, theses);
  assert.equal(aggregate.decisions.length, 0);
  assert.equal(aggregate.latestDecision, null);
  assert.equal(aggregate.theses.length, 1);
});
