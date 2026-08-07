import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { loadData } from "./load-data.mjs";

const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const controlledFields = {
  thesis: { produtos: "produto", status: "status_entidade" },
  foundation: { temas: "tema", produtos: "produto", status: "status_entidade" },
};

const unique = (items) => new Set(items).size === items.length;
const normalizedCnj = (value) => value.replace(/\D/g, "");
const expectedDecisionId = (decision) => `${decision.identificacao.tribunal.toLowerCase()}-${decision.identificacao.processo.replaceAll(".", "-")}`;

function addError(errors, file, message) { errors.push(`${file}: ${message}`); }

function checkControlled(errors, file, values, family, taxonomy) {
  const allowed = new Set(taxonomy.families[family] || []);
  for (const value of Array.isArray(values) ? values : [values]) {
    if (!allowed.has(value)) addError(errors, file, `valor '${value}' não pertence à taxonomia '${family}'`);
  }
}

export async function validateData({ root = ROOT, data: suppliedData } = {}) {
  const data = suppliedData || await loadData(root);
  const errors = [];
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const schemaFiles = {
    decision: "decision.schema.json", thesis: "thesis.schema.json", foundation: "foundation.schema.json",
  };
  const validators = {};
  for (const [kind, name] of Object.entries(schemaFiles)) {
    validators[kind] = ajv.compile(JSON.parse(await readFile(join(root, "schemas", name), "utf8")));
  }

  for (const [kind, records] of [["decision", data.decisions], ["thesis", data.theses], ["foundation", data.foundations]]) {
    for (const record of records) {
      if (!validators[kind](record.value)) {
        for (const detail of validators[kind].errors || []) addError(errors, record.file, `${detail.instancePath || "/"} ${detail.message}`);
      }
      const identity = kind === "decision" ? record.value.id : record.value.slug;
      if (record.stem !== identity) addError(errors, record.file, `nome do arquivo deve ser '${identity}.yaml'`);
      for (const [field, family] of Object.entries(controlledFields[kind] || {})) checkControlled(errors, record.file, record.value[field], family, data.taxonomy);
    }
  }

  const families = data.taxonomy?.families || {};
  for (const [family, values] of Object.entries(families)) {
    if (!Array.isArray(values) || !unique(values)) addError(errors, "taxonomy.yaml", `família '${family}' deve ser uma lista sem duplicidades`);
  }
  for (const [family, aliases] of Object.entries(data.aliases?.aliases || {})) {
    const canonical = new Set(families[family] || []);
    for (const [alias, target] of Object.entries(aliases || {})) {
      if (!canonical.has(target)) addError(errors, "aliases.yaml", `alias '${family}.${alias}' aponta para valor inexistente '${target}'`);
      if (canonical.has(alias)) addError(errors, "aliases.yaml", `alias '${family}.${alias}' colide com valor canônico`);
    }
  }

  const thesisSlugs = data.theses.map(({ value }) => value.slug);
  const foundationSlugs = data.foundations.map(({ value }) => value.slug);
  const thesisIds = new Set(thesisSlugs);
  const foundationIds = new Set(foundationSlugs);
  if (!unique(thesisSlugs)) addError(errors, "data/teses", "slug de tese duplicado");
  if (!unique(foundationSlugs)) addError(errors, "data/fundamentos", "slug de fundamento duplicado");
  for (const record of data.theses) for (const slug of record.value.fundamentos) if (!foundationIds.has(slug)) addError(errors, record.file, `fundamento inexistente '${slug}'`);

  const ids = new Set();
  const naturalKeys = new Set();
  for (const record of data.decisions) {
    const decision = record.value;
    if (ids.has(decision.id)) addError(errors, record.file, `id de decisão duplicado '${decision.id}'`);
    ids.add(decision.id);
    const naturalKey = `${decision.identificacao.tribunal}:${normalizedCnj(decision.identificacao.processo)}`;
    if (naturalKeys.has(naturalKey)) addError(errors, record.file, `tribunal + CNJ duplicado '${naturalKey}'`);
    naturalKeys.add(naturalKey);
    if (decision.id !== expectedDecisionId(decision)) addError(errors, record.file, `id não corresponde ao tribunal + CNJ; esperado '${expectedDecisionId(decision)}'`);
    for (const thesis of decision.teses) {
      if (!thesisIds.has(thesis.slug)) addError(errors, record.file, `tese inexistente '${thesis.slug}'`);
      checkControlled(errors, record.file, thesis.status, "status_tese", data.taxonomy);
    }
    for (const slug of decision.fundamentos) if (!foundationIds.has(slug)) addError(errors, record.file, `fundamento inexistente '${slug}'`);
    const context = decision.contexto;
    checkControlled(errors, record.file, context.produtos, "produto", data.taxonomy);
    checkControlled(errors, record.file, context.temas, "tema", data.taxonomy);
    if (context.perfis_consumidor) checkControlled(errors, record.file, context.perfis_consumidor, "perfil_consumidor", data.taxonomy);
    if (context.fatos_relevantes) checkControlled(errors, record.file, context.fatos_relevantes, "fato_relevante", data.taxonomy);
    if (context.meio_contratacao) checkControlled(errors, record.file, context.meio_contratacao, "meio_contratacao", data.taxonomy);
    if (decision.provas) checkControlled(errors, record.file, decision.provas, "prova", data.taxonomy);
    checkControlled(errors, record.file, decision.identificacao.tipo_decisao, "tipo_decisao", data.taxonomy);
    checkControlled(errors, record.file, decision.resultado.contrato, "resultado_contrato", data.taxonomy);
    checkControlled(errors, record.file, decision.resultado.conversao, "resultado_conversao", data.taxonomy);
    checkControlled(errors, record.file, decision.resultado.repeticao_indebito, "resultado_repeticao", data.taxonomy);
    checkControlled(errors, record.file, decision.resultado.dano_moral, "resultado_dano_moral", data.taxonomy);
    checkControlled(errors, record.file, decision.fonte.natureza, "tipo_fonte", data.taxonomy);
    checkControlled(errors, record.file, decision.fonte.recuperado_via, "origem_recuperacao", data.taxonomy);
    checkControlled(errors, record.file, decision.autoridade, "autoridade", data.taxonomy);
    checkControlled(errors, record.file, decision.status, "status_entidade", data.taxonomy);
  }
  return { valid: errors.length === 0, errors, counts: { decisions: data.decisions.length, theses: data.theses.length, foundations: data.foundations.length } };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await validateData();
  if (!result.valid) { console.error(result.errors.join("\n")); process.exitCode = 1; }
  else console.log(`Dados válidos: ${result.counts.decisions} decisões, ${result.counts.theses} tese(s), ${result.counts.foundations} fundamento(s).`);
}
