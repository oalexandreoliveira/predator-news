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
  assert.equal(decisionsByThesis(decisions, thesisSlug).length, decisions.filter(item => item.teses.some(tese => tese.slug === thesisSlug)).length);
});

test("deriva decisões relacionadas a fundamento", () => {
  assert.equal(decisionsByFoundation(decisions, "dever_informacao_qualificado").length, decisions.filter(item => item.fundamentos.includes("dever_informacao_qualificado")).length);
});

test("deriva fundamentos usados pelas decisões da tese sem duplicidade", () => {
  const related = foundationsByThesis(decisions, thesisSlug, foundations);
  assert.equal(related.length, new Set(decisionsByThesis(decisions, thesisSlug).flatMap(item => item.fundamentos)).size);
  assert.equal(new Set(related.map((item) => item.slug)).size, related.length);
});

test("deriva teses relacionadas ao fundamento pela relação direta da tese", () => {
  const related = thesesByFoundation(theses, "dever_informacao_qualificado").map((item) => item.slug);
  assert.ok(related.includes(thesisSlug));
  assert.ok(related.includes("violacao_dever_informacao_transparencia"));
  assert.equal(new Set(related).size, related.length);
});

test("acervo usa classificação jurídica plural e questões específicas", () => {
  assert.ok(theses.length >= 15, "o banco não pode comprimir o acervo em uma tese única");
  assert.ok(foundations.length >= 20, "os fundamentos devem refletir a diversidade dos julgamentos");
  assert.ok(decisions.filter((item) => item.teses.length > 1).length >= decisions.length * 0.9);
  assert.ok(new Set(decisions.flatMap((item) => item.teses.map((thesis) => thesis.slug))).size >= 15);
  assert.ok(new Set(decisions.flatMap((item) => item.fundamentos)).size >= 20);
  assert.ok(new Set(decisions.map((item) => item.questao_juridica)).size >= 50);
  assert.equal(decisions.some((item) => item.questao_juridica.startsWith("Validade e efeitos da contratação")), false);
});

test("deriva tribunais únicos", () => {
  const tribunals = uniqueTribunals(decisions);
  assert.ok(["TJCE", "TJMA", "TJPI"].every((tribunal) => tribunals.includes(tribunal)));
  assert.ok(tribunals.length >= 3);
});

test("calcula a decisão relacionada mais recente", () => {
  const expected = decisions.filter(item => item.identificacao.data_julgamento)
    .sort((a, b) => b.identificacao.data_julgamento.localeCompare(a.identificacao.data_julgamento))[0];
  assert.equal(latestDecision(decisions).id, expected.id);
});

test("agregado da tese contém contagens corretas e sem duplicações", () => {
  const aggregate = aggregateThesis(theses.find((item) => item.slug === thesisSlug), decisions, foundations);
  assert.equal(aggregate.decisions.length, decisions.filter(item => item.teses.some(tese => tese.slug === thesisSlug)).length);
  assert.equal(aggregate.tribunals.length, new Set(decisions.filter(item => item.teses.some(tese => tese.slug === thesisSlug)).map(item => item.identificacao.tribunal)).size);
  assert.equal(aggregate.foundations.length, new Set(aggregate.decisions.flatMap(item => item.fundamentos)).size);
  assert.equal(new Set(aggregate.decisions.map((item) => item.id)).size, aggregate.decisions.length);
});

test("entidade sem decisões relacionadas é suportada", () => {
  const foundation = { slug: "fundamento-sem-decisoes", titulo: "Sem decisões", formulacao: "Controle de entidade vazia", temas: [], produtos: [], status: "ativo" };
  const aggregate = aggregateFoundation(foundation, decisions, theses);
  assert.equal(aggregate.decisions.length, 0);
  assert.equal(aggregate.latestDecision, null);
  assert.equal(aggregate.theses.length, 0);
});
