import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { loadData } from "../scripts/data/load-data.mjs";
import { validateData } from "../scripts/data/validate-data.mjs";

const root = resolve(".");

test("dataset completo é estrutural e referencialmente válido", async () => {
  const result = await validateData({ root });
  assert.equal(result.valid, true, result.errors.join("\n"));
  assert.ok(result.counts.decisions >= 10 && result.counts.decisions <= 15);
  assert.equal(result.counts.theses, 1);
  assert.ok(result.counts.foundations >= 4 && result.counts.foundations <= 6);
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
