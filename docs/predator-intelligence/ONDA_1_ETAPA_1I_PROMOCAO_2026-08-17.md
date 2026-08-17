# Onda 1 / Etapa 1I — materialização e promoção

Data operacional: 17 de agosto de 2026.

## Baseline e autorização

- baseline de materialização: `78f9a028e39d4cf7bce4bc28532866bb991f09d1`;
- revisão humana: `3d76c1a0254b6a033374aae4933032b416c24367`;
- digest da revisão: `sha256:1946bfda9d6e1c082448821a342b60e6279d3a76e3b4fdcfe701a0bc2f624c52`;
- revisor e autorizador: Alexandre Oliveira;
- candidatos humanos aprovados: 77;
- pacote final: `sha256:eaad106352c4c4e25983f758fbea485b5407454ce9cd19405706970da3fe4964`;
- estado do gate: `FINAL_AUTHORIZED` e `PROMOTED`.

## Materialização

| Tribunal | Registros |
| --- | ---: |
| TJMG | 13 |
| TJRJ | 13 |
| TJGO | 15 |
| TJPE | 22 |
| TJSP | 14 |
| Total | 77 |

Foram criados 77 arquivos canônicos novos. Não havia processo idêntico ou conflitante no acervo usado como baseline. Nenhuma reserva ou decisão redundante foi promovida. Não foram criadas teses ou fundamentos: a materialização reutiliza as 16 teses e os 25 fundamentos canônicos existentes.

Os resultados materiais compostos foram preservados em `resultado.efeitos_materiais` e também traduzidos para os campos controlados do schema. Questões jurídicas, provas, teses com orientação e fundamentos derivam dos objetos individualmente aprovados. A indicação “divergência colegiada” foi preservada no resultado processual (“por maioria”), pois descreve a forma de deliberação, e não fundamento jurídico autônomo.

## Governança e reprodutibilidade

- declaração humana: `ingestion/config/wave1-human-review-declaration.json`;
- autorização final: `ingestion/config/wave1-final-authorization.json`;
- materializador: `scripts/ingestion/materialize-wave1-approved.mjs`;
- proposta, manifesto e digest operacionais são gerados em caminhos não publicáveis já excluídos do build;
- qualquer alteração do payload muda o digest do pacote e invalida a autorização materializada.

## Validações locais

- `npm run validate:wave1-review`: 77 aprovados, 0 rejeitados, 0 correções, 0 pendentes;
- `npm run validate:ingestion`: 17 schemas e fixtures válidos;
- `npm run validate:data`: 271 decisões, 16 teses e 25 fundamentos válidos após a integração segura da `main` atualizada;
- `npm run build`: 32 edições e 349 páginas HTML com links internos válidos;
- `npm test`: 154 testes aprovados, 0 falhas.

Estado local após os gates: `WAVE1_PROMOTED_READY_FOR_GIT_PUBLICATION`.
