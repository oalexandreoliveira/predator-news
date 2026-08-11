import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildEditorialRelations, editorialLinkTargets, globalMenuLinks, legalHomeMetrics, parseDecisionReferences } from "../scripts/data/editorial-links.mjs";

const decisions = [{ id: "tjce-0000000-00-2026-8-06-0000" }, { id: "tjpi-1111111-11-2026-8-18-0000" }];
const editions = [
  { numero: "01", slug: "com-relacao", jurisprudencia: "tjce-0000000-00-2026-8-06-0000" },
  { numero: "02", slug: "sem-relacao" },
];

test("normaliza referências explícitas sem duplicar relações", () => {
  assert.deepEqual(parseDecisionReferences(" a, b "), ["a", "b"]);
  const copy = structuredClone(editions);
  const reverse = buildEditorialRelations(copy, decisions);
  assert.deepEqual(copy[0].jurisprudencia, [decisions[0].id]);
  assert.deepEqual(copy[1].jurisprudencia, []);
  assert.deepEqual(reverse.get(decisions[0].id).map((item) => item.slug), ["com-relacao"]);
  assert.deepEqual(reverse.get(decisions[1].id), []);
});

test("falha para decision-id inexistente", () => {
  assert.throws(
    () => buildEditorialRelations([{ numero: "03", jurisprudencia: "decisao-inexistente" }], decisions),
    /Decision-id inexistente/,
  );
});

test("falha para referência duplicada na mesma edição", () => {
  assert.throws(
    () => buildEditorialRelations([{ numero: "04", jurisprudencia: `${decisions[0].id}, ${decisions[0].id}` }], decisions),
    /duplicada/,
  );
});

test("deriva métricas da Home apenas da base válida e ativa", () => {
  assert.deepEqual(
    legalHomeMetrics(decisions, [{ status: "ativo" }, { status: "inativo" }], [{ status: "ativo" }, { status: "ativo" }]),
    { decisions: 2, theses: 1, foundations: 2 },
  );
});

test("gera links globais compatíveis com BASE_PATH", () => {
  const links = new Map(globalMenuLinks("/preview"));
  assert.equal(links.get("Jurisprudência"), "/preview/jurisprudencia/");
  assert.equal(links.get("Teses"), "/preview/teses/");
  assert.equal(links.get("Fundamentos"), "/preview/fundamentos/");
  assert.equal(links.get("Edições"), "/preview/#edicoes");
});

test("gera navegação Edição → Decisão → Tese e Decisão → Edição", () => {
  const targets = editorialLinkTargets(
    "/preview",
    { slug: "edicao-relacionada" },
    { id: "decisao-relacionada", teses: [{ slug: "tese-relacionada" }] },
  );
  assert.deepEqual(targets, {
    decision: "/preview/jurisprudencia/decisao-relacionada/",
    thesis: "/preview/teses/tese-relacionada/",
    edition: "/preview/edicoes/edicao-relacionada/",
  });
});

test("acervo editorial real referencia uma decisão canônica existente", async () => {
  const source = await readFile(new URL("../content/edicoes/2026-07-16-cartao-consignado-fugazi.md", import.meta.url), "utf8");
  const relation = source.match(/^jurisprudencia:\s*([^\r\n]+)$/m)?.[1]?.trim();
  assert.equal(relation, "tjce-0050625-78-2021-8-06-0157");
  const canonical = await readFile(new URL(`../data/jurisprudencia/${relation}.yaml`, import.meta.url), "utf8");
  assert.match(canonical, new RegExp(`^id:\\s*${relation}$`, "m"));
});
