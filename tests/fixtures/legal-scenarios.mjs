// Fixtures sintéticas: não representam decisões ou processos reais e nunca integram o dataset publicado.
const base = {
  fixture_sintetica: true,
  tese: { slug: "vicio_consentimento_cartao_consignado" },
  resultado: { dano_moral: "nao_informado" },
  provas: [],
};

export const teseAcolhida = structuredClone({ ...base, id: "fixture-tese-acolhida", tese: { ...base.tese, status: "acolhida" } });
export const teseRejeitada = structuredClone({ ...base, id: "fixture-tese-rejeitada", tese: { ...base.tese, status: "rejeitada" } });
export const teseParcialmenteAcolhida = structuredClone({ ...base, id: "fixture-tese-parcial", tese: { ...base.tese, status: "parcialmente_acolhida" } });
export const decisaoComBiometria = structuredClone({ ...base, id: "fixture-com-biometria", tese: { ...base.tese, status: "acolhida" }, provas: ["biometria_facial"] });
export const decisaoSemDanoMoral = structuredClone({ ...base, id: "fixture-sem-dano-moral", tese: { ...base.tese, status: "acolhida" }, resultado: { dano_moral: "nao_informado" } });

export const legalScenarios = [teseAcolhida, teseRejeitada, teseParcialmenteAcolhida, decisaoComBiometria, decisaoSemDanoMoral];
