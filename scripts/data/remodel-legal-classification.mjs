import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import YAML from "yaml";

const ROOT = process.cwd();
const DECISIONS = join(ROOT, "data", "jurisprudencia");

const thesisDefinitions = [
  ["vicio_consentimento_cartao_consignado", "Vício de consentimento no cartão consignado", "A prova do caso demonstra consentimento livre e informado quanto à contratação de cartão consignado?", "A validade do consentimento depende do exame conjunto da informação prestada, do instrumento, do modo de contratação e da conduta posterior do consumidor.", ["dever_informacao_qualificado", "autenticidade_nao_equivale_consentimento"]],
  ["violacao_dever_informacao_transparencia", "Violação do dever de informação e transparência", "A instituição explicou de forma clara a natureza, o custo e a amortização do cartão consignado?", "A transparência exige informação compreensível sobre reserva de margem, desconto mínimo, encargos e forma de extinção da dívida.", ["dever_informacao_qualificado", "informacao_sobre_amortizacao_e_custo"]],
  ["validade_contratacao_digital", "Validade da contratação digital", "Os elementos da contratação eletrônica são suficientes para demonstrar autoria, integridade e consentimento?", "A validade do negócio digital depende da confiabilidade dos registros de autoria e integridade, sem dispensar a demonstração de consentimento informado.", ["rastreabilidade_contratacao_digital", "autenticidade_nao_equivale_consentimento"]],
  ["forca_probatoria_assinatura", "Autenticidade e força probatória da assinatura", "A assinatura ou a perícia demonstram autoria e adesão válida ao negócio impugnado?", "Assinatura, perícia e demais elementos de autenticação devem ser valorados com o conjunto probatório e não substituem, por si, o dever de informação.", ["assinatura_como_prova_autoria", "pericia_grafotecnica_define_autenticidade"]],
  ["fraude_inexistencia_contratacao", "Fraude ou inexistência da contratação", "A instituição comprovou a existência e a autoria do contrato que originou os descontos?", "A ausência de instrumento idôneo ou a falsidade comprovada pode tornar o negócio inexistente ou inválido e gerar efeitos restitutórios e reparatórios.", ["onus_instituicao_provar_contratacao", "pericia_grafotecnica_define_autenticidade"]],
  ["validade_contratacao_analfabeto", "Validade da contratação por pessoa analfabeta", "A contratação observou as cautelas necessárias para demonstrar a manifestação de vontade da pessoa analfabeta?", "A assinatura a rogo, testemunhas e informação acessível devem ser examinadas concretamente para aferir a validade da contratação.", ["formalidades_contratacao_analfabeto", "hipervulnerabilidade_consumidor_idoso"]],
  ["abusividade_rmc_perpetuidade_divida", "Abusividade da RMC e perpetuidade da dívida", "A sistemática de desconto mínimo e encargos torna a dívida excessivamente onerosa ou de duração indefinida?", "A estrutura econômica da RMC pode ser controlada quando o desconto mínimo não amortiza adequadamente o saldo e perpetua a obrigação.", ["desconto_minimo_sem_amortizacao_adequada", "informacao_sobre_amortizacao_e_custo"]],
  ["conversao_cartao_em_emprestimo_consignado", "Conversão do cartão consignado em empréstimo consignado", "A operação deve ser preservada como cartão consignado ou convertida em empréstimo consignado comum?", "A conversão pode recompor o negócio conforme sua finalidade econômica quando a modalidade cartão não foi validamente informada ou consentida.", ["primazia_realidade_economica_operacao", "saque_unico_indicio_mutuo"]],
  ["repeticao_indebito_descontos", "Repetição simples ou em dobro do indébito", "Os descontos indevidos devem ser restituídos e, em caso positivo, de forma simples ou em dobro?", "A restituição e sua modalidade dependem da ilicitude da cobrança, da boa-fé objetiva e dos critérios temporais aplicáveis ao caso.", ["restituicao_conforme_boa_fe_objetiva", "desconto_indevido_em_beneficio"]],
  ["dano_moral_desconto_consignado", "Configuração e quantificação do dano moral", "Os descontos e as circunstâncias da contratação configuram dano moral indenizável?", "A reparação moral exige análise concreta da repercussão do desconto, da vulnerabilidade atingida e da gravidade da conduta.", ["dano_moral_exige_repercussao_concreta", "desconto_indevido_em_beneficio"]],
  ["prescricao_termo_inicial_rmc", "Prescrição e termo inicial", "Qual prazo prescricional incide e de quando ele deve ser contado nas pretensões relativas à RMC?", "O exame prescricional deve identificar a natureza da pretensão e o marco de ciência ou da lesão adotado no julgamento.", ["termo_inicial_ciencia_lesao", "descontos_sucessivos_e_prescricao"]],
  ["litigancia_predatoria_prova_individualizada", "Litigância predatória e prova individualizada", "Há elementos concretos e individualizados que autorizem reconhecer abuso processual ou litigância de má-fé?", "A repetição de demandas ou alegações padronizadas não dispensa a demonstração individualizada da conduta abusiva e do elemento subjetivo.", ["ma_fe_exige_conduta_individualizada", "padronizacao_demanda_nao_basta"]],
  ["uso_reiterado_confirma_contratacao", "Uso reiterado do cartão como confirmação da contratação", "Saques, compras ou faturas reiteradas demonstram ciência e aceitação da modalidade contratada?", "O uso típico e reiterado do cartão é elemento relevante de confirmação do negócio, mas deve ser confrontado com a clareza da contratação.", ["uso_reiterado_cartao_indicio_consentimento", "conduta_posterior_como_prova"]],
  ["credito_saque_como_prova_negocio", "Depósito ou saque creditado como prova do negócio", "O crédito recebido ou o saque realizado comprova a contratação e qual modalidade econômica foi efetivamente pactuada?", "A disponibilização do numerário comprova uma relação econômica, mas não necessariamente esclarece, isoladamente, a modalidade ou o consentimento informado.", ["credito_em_conta_comprova_liberacao", "saque_unico_indicio_mutuo"]],
  ["hipervulnerabilidade_consumidor_idoso", "Hipervulnerabilidade do consumidor idoso", "A idade e a condição concreta do consumidor exigem proteção informacional e probatória reforçada?", "A hipervulnerabilidade pode elevar o padrão de clareza, cautela e prova exigido da instituição financeira.", ["hipervulnerabilidade_consumidor_idoso", "dever_informacao_qualificado"]],
  ["integracao_revisao_desvantagem_exagerada", "Integração ou revisão por desvantagem exagerada", "É possível preservar o contrato e integrar ou revisar suas cláusulas para afastar desvantagem exagerada?", "A validade formal do negócio não impede controle e integração de cláusulas que produzam desequilíbrio excessivo ao consumidor.", ["conservacao_negocio_com_reequilibrio", "controle_desvantagem_exagerada"]],
];

const foundationDefinitions = [
  ["informacao_sobre_amortizacao_e_custo", "Informação sobre amortização e custo", "A informação adequada deve esclarecer desconto mínimo, encargos, amortização do saldo e duração econômica provável.", ["dever_informacao", "juros_abusivos"]],
  ["rastreabilidade_contratacao_digital", "Rastreabilidade da contratação digital", "Registros eletrônicos confiáveis de autoria, integridade e sequência da contratação sustentam a prova do negócio digital.", ["contratacao_digital", "prova_contratacao"]],
  ["assinatura_como_prova_autoria", "Assinatura como prova de autoria", "A assinatura é elemento de autoria cuja força deve ser aferida conforme o suporte, a impugnação e as demais provas do caso.", ["prova_contratacao"]],
  ["pericia_grafotecnica_define_autenticidade", "Perícia grafotécnica e autenticidade", "A perícia grafotécnica pode confirmar ou afastar a autoria da assinatura quando há impugnação específica.", ["prova_contratacao", "fraude_bancaria"]],
  ["onus_instituicao_provar_contratacao", "Ônus de provar a contratação", "Impugnada a contratação, cabe valorar se a instituição apresentou instrumento e elementos idôneos de autoria e consentimento.", ["prova_contratacao", "fraude_bancaria"]],
  ["formalidades_contratacao_analfabeto", "Cautelas na contratação de pessoa analfabeta", "Assinatura a rogo, testemunhas e explicação acessível são elementos relevantes para demonstrar manifestação consciente de vontade.", ["contratacao_analfabeto", "dever_informacao"]],
  ["desconto_minimo_sem_amortizacao_adequada", "Desconto mínimo sem amortização adequada", "O pagamento apenas do mínimo pode manter ou ampliar o saldo e revelar onerosidade incompatível com a finalidade do crédito consignado.", ["juros_abusivos", "desconto_beneficio"]],
  ["primazia_realidade_economica_operacao", "Primazia da realidade econômica", "A qualificação do negócio deve considerar a finalidade econômica concretamente buscada e executada, além do nome formal do instrumento.", ["consentimento", "saque"]],
  ["restituicao_conforme_boa_fe_objetiva", "Restituição conforme a boa-fé objetiva", "A forma simples ou dobrada de restituição depende dos pressupostos jurídicos da cobrança indevida e da boa-fé objetiva.", ["desconto_beneficio"]],
  ["desconto_indevido_em_beneficio", "Desconto indevido em benefício", "A incidência de desconto sem suporte contratual válido fundamenta cessação da cobrança e exame de restituição e reparação.", ["desconto_beneficio", "prova_contratacao"]],
  ["dano_moral_exige_repercussao_concreta", "Dano moral e repercussão concreta", "A indenização deve considerar a efetiva repercussão do ilícito e não decorrer automaticamente de toda controvérsia contratual.", ["desconto_beneficio"]],
  ["termo_inicial_ciencia_lesao", "Termo inicial na ciência da lesão", "O marco prescricional deve refletir o momento juridicamente relevante de ciência inequívoca da lesão, conforme a pretensão examinada.", ["desconto_beneficio"]],
  ["descontos_sucessivos_e_prescricao", "Descontos sucessivos e prescrição", "A sucessão de descontos exige distinguir o nascimento da pretensão dos efeitos continuados da relação contratual.", ["desconto_beneficio"]],
  ["ma_fe_exige_conduta_individualizada", "Má-fé exige conduta individualizada", "A sanção processual exige identificar no caso concreto conduta desleal, temerária ou conscientemente contrária à verdade.", ["prova_contratacao"]],
  ["padronizacao_demanda_nao_basta", "Padronização da demanda não basta", "A semelhança entre petições ou a multiplicidade de ações não substitui a prova individualizada de abuso processual.", ["prova_contratacao"]],
  ["conduta_posterior_como_prova", "Conduta posterior como prova", "A execução posterior do negócio pode confirmar ou enfraquecer a narrativa de desconhecimento, conforme sua frequência e coerência.", ["uso_cartao", "prova_contratacao"]],
  ["credito_em_conta_comprova_liberacao", "Crédito em conta comprova liberação", "O comprovante de transferência demonstra disponibilização do numerário, mas deve ser relacionado ao instrumento e à modalidade discutida.", ["saque", "prova_contratacao"]],
  ["conservacao_negocio_com_reequilibrio", "Conservação do negócio com reequilíbrio", "A preservação do vínculo pode coexistir com integração ou revisão de cláusulas para restabelecer equilíbrio material.", ["juros_abusivos", "dever_informacao"]],
  ["controle_desvantagem_exagerada", "Controle da desvantagem exagerada", "Cláusulas formalmente válidas permanecem sujeitas ao controle de abusividade quando impõem desvantagem excessiva.", ["juros_abusivos"]],
];

const statusByContract = (d, positiveWhenValid = false) => {
  const value = d.resultado.contrato;
  if (value === "nao_informado") return "resultado_nao_informado";
  const valid = value === "mantido";
  return (positiveWhenValid ? valid : !valid) ? "acolhida" : "rejeitada";
};

function add(items, slug, status) {
  if (!items.some((item) => item.slug === slug)) items.push({ slug, status });
}

function classify(d) {
  const theses = [];
  const foundations = new Set();
  const themes = new Set(d.contexto.temas || []);
  const facts = new Set(d.contexto.fatos_relevantes || []);
  const proofs = new Set(d.provas || []);
  const effects = new Set(d.resultado.efeitos_materiais || []);
  const profiles = new Set(d.contexto.perfis_consumidor || []);
  const text = `${d.titulo || ""} ${d.resumo_predator || ""} ${d.ratio_decidendi || ""} ${d.resultado.processual || ""}`.toLowerCase();
  const adverse = ["anulado", "inexistente", "convertido"].includes(d.resultado.contrato);

  if (themes.has("consentimento") || themes.has("vicio_consentimento")) {
    add(theses, "vicio_consentimento_cartao_consignado", statusByContract(d));
    foundations.add("autenticidade_nao_equivale_consentimento");
  }
  if (themes.has("dever_informacao")) {
    add(theses, "violacao_dever_informacao_transparencia", statusByContract(d));
    foundations.add("dever_informacao_qualificado");
    foundations.add("informacao_sobre_amortizacao_e_custo");
  }
  if (d.contexto.meio_contratacao === "digital" || themes.has("contratacao_digital")) {
    add(theses, "validade_contratacao_digital", statusByContract(d, true));
    foundations.add("rastreabilidade_contratacao_digital");
  }
  if (proofs.has("assinatura") || proofs.has("pericia_grafotecnica")) {
    add(theses, "forca_probatoria_assinatura", statusByContract(d, true));
    foundations.add("assinatura_como_prova_autoria");
    if (proofs.has("pericia_grafotecnica")) foundations.add("pericia_grafotecnica_define_autenticidade");
  }
  if (facts.has("ausencia_contrato") || proofs.has("pericia_grafotecnica") || themes.has("fraude_bancaria") || d.resultado.contrato === "inexistente") {
    add(theses, "fraude_inexistencia_contratacao", adverse ? "acolhida" : "rejeitada");
    foundations.add("onus_instituicao_provar_contratacao");
  }
  if (proofs.has("assinatura_rogo") || proofs.has("testemunhas") || themes.has("contratacao_analfabeto") || profiles.has("analfabeto")) {
    add(theses, "validade_contratacao_analfabeto", statusByContract(d, true));
    foundations.add("formalidades_contratacao_analfabeto");
  }
  if (themes.has("juros_abusivos")) {
    add(theses, "abusividade_rmc_perpetuidade_divida", statusByContract(d));
    foundations.add("desconto_minimo_sem_amortizacao_adequada");
    foundations.add("informacao_sobre_amortizacao_e_custo");
  }
  if (d.resultado.conversao && !["nao_informado", "nao_aplicavel"].includes(d.resultado.conversao)) {
    add(theses, "conversao_cartao_em_emprestimo_consignado", d.resultado.conversao === "deferida" ? "acolhida" : "rejeitada");
    foundations.add("primazia_realidade_economica_operacao");
  }
  if (d.resultado.repeticao_indebito && d.resultado.repeticao_indebito !== "nao_informado") {
    add(theses, "repeticao_indebito_descontos", d.resultado.repeticao_indebito === "indeferida" ? "rejeitada" : "acolhida");
    foundations.add("restituicao_conforme_boa_fe_objetiva");
    foundations.add("desconto_indevido_em_beneficio");
  }
  if (d.resultado.dano_moral && d.resultado.dano_moral !== "nao_informado") {
    add(theses, "dano_moral_desconto_consignado", d.resultado.dano_moral === "deferido" ? "acolhida" : "rejeitada");
    foundations.add("dano_moral_exige_repercussao_concreta");
    foundations.add("desconto_indevido_em_beneficio");
  }
  if (/prescri|decad/.test(text)) {
    add(theses, "prescricao_termo_inicial_rmc", /afast|inocorr|não.*prescri/.test(text) ? "rejeitada" : "acolhida");
    foundations.add("termo_inicial_ciencia_lesao");
    foundations.add("descontos_sucessivos_e_prescricao");
  }
  if (effects.has("litigância de má-fé examinada") || /litigância|predatóri|má-fé/.test(text)) {
    add(theses, "litigancia_predatoria_prova_individualizada", "resultado_nao_informado");
    foundations.add("ma_fe_exige_conduta_individualizada");
    foundations.add("padronizacao_demanda_nao_basta");
  }
  if (facts.has("uso_reiterado_cartao") || proofs.has("historico_uso")) {
    add(theses, "uso_reiterado_confirma_contratacao", statusByContract(d, true));
    foundations.add("uso_reiterado_cartao_indicio_consentimento");
    foundations.add("conduta_posterior_como_prova");
  }
  if (facts.has("saque_unico") || proofs.has("comprovante_transferencia")) {
    add(theses, "credito_saque_como_prova_negocio", statusByContract(d, true));
    foundations.add("credito_em_conta_comprova_liberacao");
    if (facts.has("saque_unico")) foundations.add("saque_unico_indicio_mutuo");
  }
  if (profiles.has("idoso")) {
    add(theses, "hipervulnerabilidade_consumidor_idoso", adverse ? "acolhida" : "rejeitada");
    foundations.add("hipervulnerabilidade_consumidor_idoso");
  }
  if (effects.has("integração contratual por desvantagem exagerada")) {
    add(theses, "integracao_revisao_desvantagem_exagerada", "acolhida");
    foundations.add("conservacao_negocio_com_reequilibrio");
    foundations.add("controle_desvantagem_exagerada");
  }

  if (!theses.length) add(theses, "vicio_consentimento_cartao_consignado", statusByContract(d));
  if (!foundations.size) foundations.add("dever_informacao_qualificado");
  return { theses, foundations: [...foundations] };
}

const questionLabels = new Map(thesisDefinitions.map(([slug, , question]) => [slug, question.replace(/\?$/, "")]));
function specificQuestion(d, theses) {
  const clauses = theses.map(({ slug }) => questionLabels.get(slug)).filter(Boolean)
    .map((clause) => clause.charAt(0).toLocaleLowerCase("pt-BR") + clause.slice(1));
  const selected = [...new Set(clauses)];
  const process = d.resultado.processual ? `, no contexto de ${d.resultado.processual}` : "";
  return `O julgamento examinou se ${selected.join("; se ")}${process}.`;
}

async function writeDefinitions() {
  for (const [slug, titulo, questao_juridica, sintese, fundamentos] of thesisDefinitions) {
    const data = { slug, titulo, questao_juridica, sintese, produtos: ["rmc", "rcc", "cartao_credito_consignado"], fundamentos, status: "ativo" };
    await writeFile(join(ROOT, "data", "teses", `${slug}.yaml`), YAML.stringify(data), "utf8");
  }
  for (const [slug, titulo, formulacao, temas] of foundationDefinitions) {
    const data = { slug, titulo, formulacao, temas, produtos: ["rmc", "rcc", "cartao_credito_consignado"], base_normativa: [], status: "ativo" };
    await writeFile(join(ROOT, "data", "fundamentos", `${slug}.yaml`), YAML.stringify(data), "utf8");
  }
}

await writeDefinitions();
const files = (await readdir(DECISIONS)).filter((file) => file.endsWith(".yaml")).sort();
for (const file of files) {
  const path = join(DECISIONS, file);
  const decision = YAML.parse(await readFile(path, "utf8"));
  const { theses, foundations } = classify(decision);
  decision.questao_juridica = specificQuestion(decision, theses);
  decision.teses = theses;
  decision.fundamentos = foundations;
  await writeFile(path, YAML.stringify(decision), "utf8");
}

console.log(`Remodeladas ${files.length} decisões com ${thesisDefinitions.length} teses e ${foundationDefinitions.length + 6} fundamentos disponíveis.`);
