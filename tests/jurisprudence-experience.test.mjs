import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadData } from "../scripts/data/load-data.mjs";
import { choosePrimaryThesis } from "../scripts/build.mjs";
import { createDecisionSearchText, matchesDecision } from "../src/jurisprudencia-filter.mjs";

const loaded = await loadData(resolve("."));
const thesisLabels = new Map(loaded.theses.map(({ value }) => [value.slug, value.titulo]));
const foundationLabels = new Map(loaded.foundations.map(({ value }) => [value.slug, value.titulo]));

test("tese principal privilegia a controvérsia específica", () => {
  const decision = loaded.decisions.map(({ value }) => value).find((item) => item.id === "tjce-0201664-84-2022-8-06-0029");
  assert.ok(["fraude_inexistencia_contratacao", "forca_probatoria_assinatura"].includes(choosePrimaryThesis(decision).slug));
  assert.notEqual(choosePrimaryThesis(decision).slug, "vicio_consentimento_cartao_consignado");
});

test("texto pesquisável inclui títulos públicos de teses e fundamentos", () => {
  const decision = loaded.decisions.map(({ value }) => value).find((item) => item.teses.some((entry) => entry.slug === "validade_contratacao_digital"));
  const search = createDecisionSearchText(decision, { thesisLabels, foundationLabels });
  assert.equal(matchesDecision({ search, tribunal: decision.identificacao.tribunal, produtos: [], temas: [], teses: [], statusTese: [] }, { query: "validade da contratação digital" }), true);
});

test("cards ocultos não são reexibidos pelo layout", async () => {
  const css = await readFile(new URL("../src/style.css", import.meta.url), "utf8");
  assert.match(css, /\.legal-card\[hidden\]\{display:none!important\}/);
});

test("lote oficial do TJDFT contém análise e não cópia de ementa", () => {
  const automatic = loaded.decisions.map(({ value }) => value).filter((item) => item.identificacao.tribunal === "TJDFT" && item.fonte.recuperado_via === "portal_tribunal");
  assert.ok(automatic.length >= 20);
  for (const decision of automatic) {
    assert.ok(decision.questao_juridica?.length >= 40, decision.id);
    assert.ok(decision.ratio_decidendi?.length >= 80, decision.id);
    assert.doesNotMatch(decision.resumo_predator, /^(EMENTA:|APELAÇÃO|DIREITO (?:CIVIL|DO CONSUMIDOR)|PROCESSUAL CIVIL|CONSUMIDOR,)/i, decision.id);
  }
});
