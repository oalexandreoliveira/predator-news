import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import YAML from "yaml";
import { searchTjdf } from "../../src/ingestion/adapters/tjdft-public-api.mjs";

const root = resolve(new URL("../..", import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const directory = join(root, "data", "jurisprudencia");
const fold = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const clean = (value) => String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const has = (text, pattern) => pattern.test(fold(text));

function status(text, positive, negative) {
  if (has(text, negative)) return "rejeitada";
  if (has(text, positive)) return "acolhida";
  return "resultado_nao_informado";
}

function analyze(decision, ementa) {
  const text = clean(ementa);
  const f = fold(text);
  const add = (array, value) => { if (!array.includes(value)) array.push(value); };
  const themes = [], facts = [], proofs = [], theses = [], foundations = [];
  const thesis = (slug, result) => { if (!theses.some((item) => item.slug === slug)) theses.push({ slug, status: result }); };
  const foundation = (slug) => add(foundations, slug);
  const valid = /regularidade da contratacao|validade comprovada|vicio de consentimento (?:nao|in)existente|vicio de consentimento nao (?:comprovado|caracterizado)|ciencia inequivoca/.test(f);
  const invalid = /nulidade[^.]{0,40}(?:verificada|reconhecida)|inexistencia de relacao juridica[^.]{0,50}(?:mantida|declarada)|falha no dever de informacao/.test(f) && !valid;
  const digital = /contratacao (?:digital|eletronica)|biometria|selfie|geolocalizacao|ip\b/.test(f);
  const fraud = /fraude|falsifica|inexistencia de (?:contrato|relacao juridica)|ausencia de prova formal/.test(f);
  const info = /dever de informacao|informacao clara|transparencia|clausulas? (?:ostensivas?|claras?)/.test(f);
  const conversion = /conversao em emprestimo consignado/.test(f);
  const repeat = /repeticao|restituicao/.test(f);
  const moral = /dano moral|danos morais/.test(f);
  const prescription = /prescri/.test(f);
  const elderly = /idos[oa]|hipervulnerab/.test(f);
  const use = /utilizacao do cartao|compras|faturas|uso (?:do|reiterado)/.test(f);
  const credit = /deposito|credito disponibilizado|transferencia|saque/.test(f);
  const signature = /assinatura|biometria|selfie|grafotecn/.test(f);
  const abusive = /abusiv|juros|amortiza|saldo devedor/.test(f);

  if (/\brmc\b|reserva de margem|cartao de credito consignado/.test(f)) themes.push("consentimento");
  if (info) { add(themes, "dever_informacao"); thesis("violacao_dever_informacao_transparencia", valid ? "rejeitada" : invalid ? "acolhida" : "resultado_nao_informado"); foundation("dever_informacao_qualificado"); foundation("informacao_sobre_amortizacao_e_custo"); }
  if (/vicio de consentimento|consentimento/.test(f)) { thesis("vicio_consentimento_cartao_consignado", valid ? "rejeitada" : invalid ? "acolhida" : "resultado_nao_informado"); foundation("autenticidade_nao_equivale_consentimento"); }
  if (digital) { add(themes, "contratacao_digital"); thesis("validade_contratacao_digital", valid ? "acolhida" : invalid ? "rejeitada" : "resultado_nao_informado"); foundation("rastreabilidade_contratacao_digital"); add(proofs, "assinatura"); }
  if (signature) { add(themes, "prova_contratacao"); thesis("forca_probatoria_assinatura", valid ? "acolhida" : invalid ? "rejeitada" : "resultado_nao_informado"); foundation("assinatura_como_prova_autoria"); add(proofs, "assinatura"); }
  if (fraud) { add(themes, "fraude_bancaria"); thesis("fraude_inexistencia_contratacao", invalid ? "acolhida" : valid ? "rejeitada" : "resultado_nao_informado"); foundation("onus_instituicao_provar_contratacao"); }
  if (conversion) { thesis("conversao_cartao_em_emprestimo_consignado", /conversao[^.]{0,60}(?:determinada|deferida)|convertid/.test(f) ? "acolhida" : /conversao[^.]{0,60}(?:afastada|indeferida|impossibilidade)/.test(f) ? "rejeitada" : "resultado_nao_informado"); foundation("primazia_realidade_economica_operacao"); }
  if (repeat) { thesis("repeticao_indebito_descontos", /repeticao[^.]{0,40}(?:descabimento|indevida)|restituicao[^.]{0,40}(?:indevida|afastada)/.test(f) ? "rejeitada" : "acolhida"); foundation("restituicao_conforme_boa_fe_objetiva"); }
  if (moral) { thesis("dano_moral_desconto_consignado", /dano(?:s)? morais?[^.]{0,30}(?:nao configurado|afastado|indevido)|inexistencia de danos morais/.test(f) ? "rejeitada" : /dano(?:s)? morais?[^.]{0,30}(?:configurado|devido|mantido)/.test(f) ? "acolhida" : "resultado_nao_informado"); foundation("dano_moral_exige_repercussao_concreta"); }
  if (prescription) { thesis("prescricao_termo_inicial_rmc", /prescricao[^.]{0,30}afastada/.test(f) ? "rejeitada" : "resultado_nao_informado"); foundation("termo_inicial_ciencia_lesao"); foundation("descontos_sucessivos_e_prescricao"); }
  if (elderly) { thesis("hipervulnerabilidade_consumidor_idoso", invalid ? "acolhida" : valid ? "rejeitada" : "resultado_nao_informado"); foundation("hipervulnerabilidade_consumidor_idoso"); add(decision.contexto.perfis_consumidor ||= [], "idoso"); }
  if (use) { add(themes, "uso_cartao"); thesis("uso_reiterado_confirma_contratacao", valid ? "acolhida" : invalid ? "rejeitada" : "resultado_nao_informado"); foundation("conduta_posterior_como_prova"); add(proofs, "historico_uso"); }
  if (credit) { add(themes, "saque"); thesis("credito_saque_como_prova_negocio", valid ? "acolhida" : invalid ? "rejeitada" : "resultado_nao_informado"); foundation("credito_em_conta_comprova_liberacao"); add(proofs, "comprovante_transferencia"); }
  if (abusive) { add(themes, "juros_abusivos"); thesis("abusividade_rmc_perpetuidade_divida", /ausencia de abusividade|juros[^.]{0,30}(?:regulares|mantidos)/.test(f) ? "rejeitada" : invalid ? "acolhida" : "resultado_nao_informado"); foundation("desconto_minimo_sem_amortizacao_adequada"); }
  if (!theses.length) thesis("vicio_consentimento_cartao_consignado", "resultado_nao_informado");
  if (!proofs.length) add(proofs, /prova documental|contrato|termo de adesao/.test(f) ? "contrato" : "nao_informado");
  if (/prova documental|contrato|termo de adesao/.test(f)) add(proofs, "contrato");

  const main = theses.find((item) => item.slug !== "vicio_consentimento_cartao_consignado") || theses[0];
  const outcome = valid ? "reconheceu a regularidade da contratação" : invalid ? "reconheceu vício relevante na contratação" : "definiu os efeitos jurídicos da controvérsia";
  const evidence = digital ? "os registros eletrônicos e a biometria" : use ? "a documentação e a utilização posterior do cartão" : credit ? "a documentação e a disponibilização do crédito" : "o conjunto documental descrito no acórdão";
  const result = decision.resultado;
  result.contrato = valid ? "mantido" : invalid ? (/inexistencia/.test(f) ? "inexistente" : "anulado") : "nao_informado";
  result.conversao = conversion ? (/afastada|indeferida|impossibilidade/.test(f) ? "indeferida" : /determinada|deferida|convertid/.test(f) ? "deferida" : "nao_informado") : "nao_aplicavel";
  result.repeticao_indebito = !repeat ? "nao_informado" : /repeticao dobrada|restituicao em dobro/.test(f) ? "dobro" : /restituicao simples/.test(f) ? "simples" : /descabimento|indevida|afastada/.test(f) ? "indeferida" : "nao_informado";
  result.dano_moral = !moral ? "nao_informado" : /nao configurado|afastado|indevido|inexistencia de danos morais/.test(f) ? "indeferido" : /configurado|devido|mantido/.test(f) ? "deferido" : "nao_informado";
  decision.contexto.temas = [...new Set(themes.length ? themes : ["prova_contratacao"])];
  decision.contexto.fatos_relevantes = [valid ? "contrato_claro" : invalid ? "contrato_diverso" : "nao_informado"];
  decision.contexto.meio_contratacao = digital ? "digital" : "nao_informado";
  decision.provas = proofs;
  decision.teses = theses;
  decision.fundamentos = foundations.length ? foundations : ["dever_informacao_qualificado"];
  decision.titulo = main.slug === "prescricao_termo_inicial_rmc" ? "Prescrição afastada em relação de trato sucessivo" : valid ? "Provas do caso confirmam a contratação consignada" : invalid ? "Falha informacional compromete a contratação consignada" : "TJDFT delimita efeitos da contratação bancária discutida";
  decision.questao_juridica = `O colegiado examinou se ${info ? "as informações contratuais foram claras e suficientes" : "a contratação foi validamente demonstrada"}${digital ? ", se os registros digitais comprovavam autoria e consentimento" : ""}${prescription ? " e se a pretensão estava prescrita" : ""}.`;
  decision.ratio_decidendi = `O TJDFT ${outcome} porque considerou determinantes ${evidence}, avaliados em conjunto com ${info ? "o dever de informação e a transparência da modalidade" : "a distribuição do ônus da prova e a execução do negócio"}.`;
  decision.resumo_predator = `O acórdão ${outcome}. A conclusão decorreu de ${evidence}${conversion ? " e também definiu o pedido de conversão para empréstimo consignado" : ""}${repeat ? ", com exame da restituição dos descontos" : ""}${moral ? " e da responsabilidade por dano moral" : ""}.`;
  decision.revisao = { status: "automatizada_pendente_revisao_humana", analisado_em: new Date().toISOString().slice(0, 10), revisado_em: null, revisor: null };
  return decision;
}

let enriched = 0;
for (const file of (await readdir(directory)).filter((name) => name.startsWith("tjdft-") && name.endsWith(".yaml"))) {
  const path = join(directory, file);
  const decision = YAML.parse(await readFile(path, "utf8"));
  if (decision.fonte?.recuperado_via !== "portal_tribunal" || (decision.ratio_decidendi && !decision.provas?.includes("nao_informado"))) continue;
  const response = await searchTjdf({ query: decision.identificacao.processo, tamanho: 5 });
  const record = response.records.find((item) => item.processo === decision.identificacao.processo);
  if (!record?.ementa || clean(record.ementa).length < 500) throw new Error(`Ementa estruturada não recuperada: ${decision.id}`);
  await writeFile(path, YAML.stringify(analyze(decision, record.ementa)), "utf8");
  enriched++;
}
console.log(`Enriquecidos ${enriched} acórdãos oficiais do TJDFT.`);
