import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  EDITORIAL_DISCLAIMER, renderDecisionEditionRelations, renderEditorialStatement, renderEditionIntegration,
} from "../src/editorial-components.mjs";
import {
  decisaoComBiometria, decisaoSemDanoMoral, legalScenarios, teseAcolhida, teseParcialmenteAcolhida, teseRejeitada,
} from "./fixtures/legal-scenarios.mjs";

test("fixtures sintéticas cobrem os cinco cenários obrigatórios", () => {
  assert.equal(legalScenarios.length, 5);
  assert.ok(legalScenarios.every((item) => item.fixture_sintetica));
  assert.equal(teseAcolhida.tese.status, "acolhida");
  assert.equal(teseRejeitada.tese.status, "rejeitada");
  assert.equal(teseParcialmenteAcolhida.tese.status, "parcialmente_acolhida");
  assert.deepEqual(decisaoComBiometria.provas, ["biometria_facial"]);
  assert.equal(decisaoSemDanoMoral.resultado.dano_moral, "nao_informado");
});

test("Frase de peça editorial usa componente neutro e aviso obrigatório", () => {
  const html = renderEditorialStatement("Texto sintético para teste de apresentação editorial.");
  assert.match(html, /data-editorial-statement/);
  assert.match(html, new RegExp(EDITORIAL_DISCLAIMER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(html, /<blockquote|[“”]/);
});

test("Frase de peça é omitida quando não há conteúdo", () => {
  assert.equal(renderEditorialStatement(null), "");
  assert.equal(renderEditorialStatement(""), "");
});

const decision = {
  id: "fixture-decisao",
  identificacao: { tribunal: "TJXX" },
  contexto: { produtos: ["rmc"], temas: ["consentimento"] },
  teses: [{ slug: "fixture_tese", status: "acolhida" }],
};
const relatedEdition = { numero: "99", slug: "fixture-edicao", titulo: "Edição sintética" };

test("HTML da edição com referência contém decisão, tese e BASE_PATH", () => {
  const html = renderEditionIntegration({
    edition: { ...relatedEdition, jurisprudencia: [decision.id] },
    decisionsById: new Map([[decision.id, decision]]),
    thesisLabels: new Map([["fixture_tese", "Tese sintética"]]),
    base: "/preview",
    humanize: (value) => value,
  });
  assert.match(html, /edition-intelligence/);
  assert.match(html, /Analisar decisão/);
  assert.match(html, /Explorar tese/);
  assert.match(html, /\/preview\/jurisprudencia\/fixture-decisao\//);
  assert.match(html, /\/preview\/teses\/fixture_tese\//);
});

test("HTML da edição sem referência não cria seção vazia", () => {
  const html = renderEditionIntegration({ edition: { jurisprudencia: [] }, decisionsById: new Map(), thesisLabels: new Map(), base: "/preview", humanize: String });
  assert.equal(html, "");
});

test("HTML reverso da decisão exibe edição relacionada e respeita BASE_PATH", () => {
  const html = renderDecisionEditionRelations({ editions: [relatedEdition], base: "/preview" });
  assert.match(html, /Analisada na edição nº 99/);
  assert.match(html, /Edição sintética/);
  assert.match(html, /\/preview\/edicoes\/fixture-edicao\//);
});

test("decisão sem edição relacionada não cria seção vazia", () => {
  assert.equal(renderDecisionEditionRelations({ editions: [], base: "/preview" }), "");
});

test("CSS define foco visível transversal com outline perceptível", async () => {
  const css = await readFile(new URL("../src/style.css", import.meta.url), "utf8");
  for (const selector of ["a:focus-visible", "button:focus-visible", "input:focus-visible", "select:focus-visible", "summary:focus-visible"]) {
    assert.ok(css.includes(selector), selector);
  }
  assert.match(css, /outline:3px solid var\(--signal\)!important/);
});
