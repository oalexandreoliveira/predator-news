import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { loadData } from "../scripts/data/load-data.mjs";
import { validateData } from "../scripts/data/validate-data.mjs";

const root = resolve(".");

test("dataset completo é estrutural e referencialmente válido", async () => {
  const result = await validateData({ root });
  assert.equal(result.valid, true, result.errors.join("\n"));
  assert.ok(result.counts.decisions >= 10);
  assert.ok(result.counts.theses >= 1);
  assert.ok(result.counts.foundations >= 4);
});

test("referência de tese inexistente falha", async () => {
  const data = await loadData(root);
  data.decisions[0].value.teses[0].slug = "tese_inexistente";
  const result = await validateData({ root, data });
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /tese inexistente/);
});

test("referência de fundamento inexistente falha", async () => {
  const data = await loadData(root);
  data.decisions[0].value.fundamentos.push("fundamento_inexistente");
  const result = await validateData({ root, data });
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /fundamento inexistente/);
});

test("tribunal + CNJ duplicado falha mesmo com outro id", async () => {
  const data = await loadData(root);
  const duplicate = structuredClone(data.decisions[0]);
  duplicate.file = "fixture-duplicada.yaml";
  duplicate.stem = duplicate.value.id;
  data.decisions.push(duplicate);
  const result = await validateData({ root, data });
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /tribunal \+ CNJ duplicado/);
});

test("tribunal fora do lote inicial é aceito quando o identificador CNJ é consistente", async () => {
  const data = await loadData(root);
  const expanded = structuredClone(data.decisions[0]);
  expanded.file = "stj-7654321-71-2025-8-06-9999.yaml";
  expanded.stem = "stj-7654321-71-2025-8-06-9999";
  expanded.value.id = expanded.stem;
  expanded.value.identificacao.tribunal = "STJ";
  expanded.value.identificacao.processo = "7654321-71.2025.8.06.9999";
  data.decisions.push(expanded);
  const result = await validateData({ root, data });
  assert.equal(result.valid, true, result.errors.join("\n"));
});

test("novas teses e fundamentos podem ser cadastrados sem alterar decisões existentes", async () => {
  const data = await loadData(root);
  const foundation = structuredClone(data.foundations[0]);
  foundation.file = "fundamento_expansao_controlada.yaml";
  foundation.stem = "fundamento_expansao_controlada";
  foundation.value.slug = foundation.stem;
  foundation.value.titulo = "Fundamento adicional para expansão controlada";
  data.foundations.push(foundation);
  const thesis = structuredClone(data.theses[0]);
  thesis.file = "tese_expansao_controlada.yaml";
  thesis.stem = "tese_expansao_controlada";
  thesis.value.slug = thesis.stem;
  thesis.value.titulo = "Tese adicional para expansão controlada";
  thesis.value.questao_juridica = "A nova tese pode ser cadastrada sem duplicar relações existentes?";
  thesis.value.sintese = "A nova tese permanece separada e validada até receber decisões relacionadas.";
  thesis.value.fundamentos = [foundation.value.slug];
  data.theses.push(thesis);
  const result = await validateData({ root, data });
  assert.equal(result.valid, true, result.errors.join("\n"));
});

test("enum fora da taxonomia falha", async () => {
  const data = await loadData(root);
  data.decisions[0].value.resultado.dano_moral = "talvez";
  const result = await validateData({ root, data });
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /resultado_dano_moral/);
});

test("campo estrutural obrigatório ausente falha no schema", async () => {
  const data = await loadData(root);
  delete data.decisions[0].value.fonte.url_original;
  const result = await validateData({ root, data });
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /url_original/);
});

test("slug de fundamento duplicado falha", async () => {
  const data = await loadData(root);
  const duplicate = structuredClone(data.foundations[0]);
  duplicate.file = "fixture-fundamento-duplicado.yaml";
  duplicate.stem = duplicate.value.slug;
  data.foundations.push(duplicate);
  const result = await validateData({ root, data });
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /slug de fundamento duplicado/);
});

test("fundamento aceita Frase de peça opcional curada", async () => {
  const data = await loadData(root);
  data.foundations[0].value.frase_peca = "Texto editorial curado exclusivamente para validar o suporte estrutural opcional.";
  const result = await validateData({ root, data });
  assert.equal(result.valid, true, result.errors.join("\n"));
});
