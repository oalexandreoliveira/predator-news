# Predator News --- Modelo Técnico de Armazenamento e Backlog Priorizado do MVP

**Documento:** Especificação técnica para implementação\
**Projeto:** Predator News --- Inteligência Jurídica\
**Versão:** 1.0\
**Data:** 07/08/2026\
**Status:** Aprovado para orientar implementação no Codex

------------------------------------------------------------------------

## 1. Finalidade

Este documento consolida o modelo técnico de armazenamento e o backlog
priorizado do MVP da camada de Inteligência Jurídica do Predator News.

Seu objetivo é servir como **fonte de verdade para implementação**,
reduzindo decisões de domínio deixadas ao agente de desenvolvimento.

O MVP deverá provar o fluxo:

**Edição → Decisão → Tese → Fundamento**

preservando integralmente a experiência editorial já existente no
Predator News.

O Codex deverá, antes de implementar qualquer alteração:

1.  inspecionar a estrutura atual do repositório;
2.  ler a documentação existente em `/docs`;
3.  identificar o gerador/build atualmente utilizado;
4.  preservar convenções, componentes e padrões existentes;
5.  adaptar os caminhos exemplificados neste documento quando a
    arquitetura real do projeto exigir;
6.  não substituir tecnologias existentes sem justificativa técnica
    explícita.

------------------------------------------------------------------------

# 2. Decisões arquiteturais já estabelecidas

## 2.1. Duas camadas complementares

O Predator será composto conceitualmente por:

### Predator Editorial

Responde:

> O que aconteceu hoje e por que isso importa?

Abrange:

-   Home;
-   edição do dia;
-   arquivo de edições;
-   conteúdo editorial.

### Predator Inteligência

Responde:

> O que o acervo já revela sobre determinado problema jurídico?

Abrange:

-   jurisprudência;
-   decisões;
-   teses;
-   fundamentos;
-   futuramente, mapa nacional e tendências jurisprudenciais.

As duas camadas devem compartilhar dados e navegação, mas **não devem
ser fundidas em uma única página**.

------------------------------------------------------------------------

## 2.2. Persistência estática no MVP

O MVP não deverá introduzir banco de dados ou backend persistente sem
necessidade demonstrada.

A preferência inicial é por dados estruturados versionados no próprio
repositório, compatíveis com o modelo estático atual do Predator News.

A implementação deve privilegiar:

-   simplicidade;
-   versionamento via Git;
-   auditabilidade;
-   validação em CI;
-   geração estática;
-   baixo custo operacional.

------------------------------------------------------------------------

## 2.3. Separação entre conteúdo editorial e conhecimento estruturado

As edições continuam armazenadas no formato já utilizado pelo projeto.

O conhecimento jurídico estruturado deverá ficar separado.

Estrutura conceitual:

``` text
content/
└── edicoes/

data/
├── jurisprudencia/
├── teses/
├── fundamentos/
└── taxonomy/
```

As edições **não devem duplicar integralmente** os registros
jurisprudenciais.

Elas devem referenciar as entidades por identificadores estáveis.

------------------------------------------------------------------------

## 2.4. Relações derivadas em vez de dados duplicados

Sempre que um valor puder ser calculado a partir da base, ele não deverá
ser mantido manualmente em múltiplos arquivos.

Exemplo:

Se 12 decisões referenciam uma tese, a página da tese deverá calcular:

``` text
12 decisões catalogadas
```

em vez de depender de:

``` yaml
total_decisoes: 12
```

atualizado manualmente.

O mesmo princípio se aplica a:

-   quantidade de tribunais;
-   quantidade de fundamentos;
-   última decisão catalogada;
-   decisões relacionadas;
-   teses relacionadas;
-   edições relacionadas.

------------------------------------------------------------------------

# 3. Estrutura física proposta

A estrutura abaixo é uma referência. O Codex deverá conciliá-la com a
arquitetura real do repositório antes de criar diretórios.

``` text
predator-news/
│
├── content/
│   └── edicoes/
│
├── data/
│   ├── jurisprudencia/
│   │   ├── tjce-3002087-43-2025-8-06-0070.yaml
│   │   ├── tjma-0801470-57-2023-8-10-0039.yaml
│   │   └── ...
│   │
│   ├── teses/
│   │   └── vicio_consentimento_cartao_consignado.yaml
│   │
│   ├── fundamentos/
│   │   ├── autenticidade_nao_equivale_consentimento.yaml
│   │   ├── dever_informacao_qualificado.yaml
│   │   └── ...
│   │
│   └── taxonomy/
│       ├── taxonomy.yaml
│       └── aliases.yaml
│
├── schemas/
│   ├── decision.schema.json
│   ├── thesis.schema.json
│   └── foundation.schema.json
│
├── docs/
│   └── ...
│
└── tests/
    └── fixtures/
```

------------------------------------------------------------------------

# 4. Entidades centrais

O MVP trabalhará com quatro entidades principais:

``` text
EDIÇÃO
   │
   └── referencia
          ↓
       DECISÃO
          │
          ├── sustenta/rejeita → TESE
          │
          └── utiliza → FUNDAMENTO
```

## 4.1. Edição

Continua sendo a unidade editorial diária.

Pode referenciar uma ou mais decisões.

## 4.2. Decisão

É a unidade jurisprudencial básica.

Deve armazenar:

-   identificação;
-   tribunal;
-   processo;
-   órgão julgador;
-   relator;
-   datas;
-   contexto fático relevante;
-   produtos;
-   temas;
-   provas;
-   teses enfrentadas;
-   fundamentos;
-   resultados;
-   fonte;
-   autoridade jurisprudencial.

## 4.3. Tese

Representa a questão jurídica que pode ser acolhida, rejeitada,
parcialmente acolhida ou não enfrentada por uma decisão.

Exemplo inicial:

``` text
vicio_consentimento_cartao_consignado
```

## 4.4. Fundamento

Representa a razão jurídica ou probatória reutilizável que sustenta ou
combate determinada tese.

Exemplo:

``` text
autenticidade_nao_equivale_consentimento
```

------------------------------------------------------------------------

# 5. Identificadores

## 5.1. Decisão

Preferência:

``` text
{tribunal}-{numero-processo-normalizado}
```

Exemplo:

``` text
tjce-3002087-43-2025-8-06-0070
```

O número CNJ + tribunal deverá ser a principal chave de deduplicação
quando disponível.

Quando não houver número CNJ confiável, deverá existir estratégia
auxiliar documentada antes da persistência.

## 5.2. Teses e fundamentos

Utilizar `snake_case`, sem acentos:

``` text
vicio_consentimento_cartao_consignado
autenticidade_nao_equivale_consentimento
```

O slug identifica o conceito e não deve incluir tribunal, banco, número
de processo ou circunstância particular.

------------------------------------------------------------------------

# 6. Exemplo de referência da edição

Uma notícia poderá referenciar decisão catalogada:

``` yaml
jurisprudencia:
  - tjce-3002087-43-2025-8-06-0070
```

O formato final deverá respeitar a estrutura real do front matter
atualmente utilizada pelo projeto.

Não alterar retroativamente todas as edições antigas como requisito do
MVP.

------------------------------------------------------------------------

# 7. Exemplo mínimo de decisão

``` yaml
id: tjce-3002087-43-2025-8-06-0070

identificacao:
  tribunal: TJCE
  processo: 3002087-43.2025.8.06.0070
  tipo_decisao: acordao
  orgao_julgador: 6a_camara_direito_privado
  relator: Maria Marleide Maciel Mendes
  data_julgamento: 2026-03-04
  data_publicacao: null

contexto:
  produtos:
    - rmc

  temas:
    - consentimento
    - dever_informacao
    - contratacao_digital

teses:
  - slug: vicio_consentimento_cartao_consignado
    status: acolhida

fundamentos:
  - autenticidade_nao_equivale_consentimento
  - dever_informacao_qualificado

resultado:
  contrato: convertido
  conversao: deferida
  repeticao_indebito: mista
  dano_moral: indeferido

fonte:
  natureza: jurisprudencia_oficial
  recuperado_via: jusratio
  url_original: null
  url_inteiro_teor: null
```

O schema completo deverá ser implementado a partir da especificação de
domínio existente, e não limitado a este exemplo mínimo.

------------------------------------------------------------------------

# 8. Taxonomia

A taxonomia deverá funcionar como fonte única de verdade para valores
controlados.

Famílias previstas:

``` text
ramo_direito
produto
tema
prova
fato_relevante
perfil_consumidor
meio_contratacao
status_tese
resultado_contrato
resultado_conversao
resultado_repeticao
resultado_dano_moral
tipo_decisao
autoridade
tendencia_jurisprudencial
tipo_fonte
status_entidade
```

Teses e fundamentos são **catálogos extensíveis**, e não simples enums
fechados.

Aliases deverão ser mantidos separadamente para normalização de termos.

Exemplo:

``` yaml
vicio_consentimento_cartao_consignado:
  aliases:
    - vicio_de_consentimento
    - vicio_de_vontade
    - erro_substancial
    - erro_na_natureza_do_negocio
```

Aliases não criam novas entidades.

------------------------------------------------------------------------

# 9. Schemas e validação

Criar schemas formais para:

``` text
decision.schema.json
thesis.schema.json
foundation.schema.json
```

Os schemas deverão validar pelo menos:

-   tipos;
-   campos obrigatórios;
-   enums;
-   formatos;
-   IDs;
-   slugs;
-   estrutura dos resultados.

Além da validação estrutural, deverá existir validação referencial.

Exemplos de erro que devem impedir publicação:

-   decisão referencia tese inexistente;
-   decisão referencia fundamento inexistente;
-   slug duplicado;
-   decisão duplicada;
-   resultado fora do enum;
-   arquivo estruturalmente inválido.

------------------------------------------------------------------------

# 10. Regras jurídicas de integridade

## 10.1. Resultado granular

É proibido reduzir a decisão a:

``` text
favoravel_consumidor
favoravel_banco
```

como classificação principal.

O resultado deve ser decomposto.

Exemplo:

``` yaml
teses:
  - slug: vicio_consentimento_cartao_consignado
    status: acolhida

resultado:
  contrato: convertido
  repeticao_indebito: mista
  dano_moral: indeferido
```

## 10.2. Autoria não equivale automaticamente a consentimento

A estrutura deve permitir que uma prova tenha efeitos distintos.

Exemplo:

``` yaml
tipo: biometria_facial
presente: true
efeitos:
  - comprova_autoria
  - insuficiente_para_consentimento
```

## 10.3. Fonte jurídica e origem de recuperação

Não confundir:

``` text
fonte jurídica = acórdão / tribunal / diário / fonte oficial
```

com:

``` text
origem de recuperação = JusRatio
```

Exemplo:

``` yaml
fonte:
  natureza: jurisprudencia_oficial
  recuperado_via: jusratio
```

## 10.4. Conteúdo editorial e citação

Sínteses produzidas pelo Predator não poderão ser apresentadas como
citação literal de decisão.

A "Frase de peça" deverá indicar:

> Síntese editorial Predator --- não corresponde a citação literal de
> decisão judicial.

------------------------------------------------------------------------

# 11. Rotas do MVP

Preservar as rotas existentes e acrescentar:

``` text
/jurisprudencia/
/jurisprudencia/{decision-id}/

/teses/
/teses/{tese-slug}/

/fundamentos/
/fundamentos/{fundamento-slug}/
```

Não fazem parte deste MVP:

``` text
/jurisprudencia/mapa/
/tribunais/{tribunal}/
/produtos/{produto}/
/temas/{tema}/
```

Essas superfícies poderão ser implementadas posteriormente.

------------------------------------------------------------------------

# 12. Dataset piloto

O MVP deverá ser validado com dados reais antes de automatizar a
alimentação.

## Escopo

-   10 a 15 decisões;
-   TJCE;
-   TJMA;
-   TJPI;
-   1 tese principal;
-   4 a 6 fundamentos.

## Tese inicial

``` text
vicio_consentimento_cartao_consignado
```

## Fundamentos iniciais recomendados

``` text
autenticidade_nao_equivale_consentimento
dever_informacao_qualificado
ausencia_uso_cartao_indicio_vicio
hipervulnerabilidade_consumidor_idoso
saque_unico_indicio_mutuo
onerosidade_cartao_consignado
```

O dataset deverá ser revisado antes de ser tratado como base válida para
a interface.

------------------------------------------------------------------------

# 13. JusRatio no MVP

A integração automática com JusRatio **não faz parte da primeira
implementação**.

No MVP, JusRatio poderá ser utilizado como ferramenta de pesquisa para:

-   localizar decisões;
-   recuperar metadados;
-   consultar inteiro teor;
-   auxiliar na estruturação do dataset.

A automação:

``` text
Publisher
   ↓
JusRatio
   ↓
normalização
   ↓
persistência
```

é uma fase posterior.

O MVP deve primeiro provar que o modelo de dados e as superfícies de
pesquisa são úteis e sustentáveis.

------------------------------------------------------------------------

# 14. Backlog priorizado

## EP01 --- Infraestrutura de dados

**Prioridade:** P0\
**Dependências:** nenhuma\
**Objetivo:** criar a fundação estrutural do MVP.

### US01 --- Estrutura de dados

Criar os diretórios necessários para jurisprudência, teses, fundamentos
e taxonomia, respeitando a arquitetura real do projeto.

**Aceite**

-   estrutura criada sem quebrar o build atual;
-   nenhuma edição existente deixa de funcionar;
-   convenções existentes são preservadas.

### US02 --- Taxonomia v1

Implementar taxonomia controlada e aliases.

**Aceite**

-   slugs são únicos;
-   aliases não criam entidades duplicadas;
-   valores inválidos podem ser detectados.

### US03 --- Schemas

Criar schemas para decisão, tese e fundamento.

**Aceite**

-   dados válidos passam;
-   dados inválidos falham;
-   enums são respeitados.

### US04 --- Validação referencial

Implementar validação entre entidades.

**Aceite**

Uma decisão que referencie:

``` text
tese_inexistente
```

ou:

``` text
fundamento_inexistente
```

deve falhar na validação.

### US05 --- Deduplicação

Implementar verificação de duplicidade.

**Aceite**

O mesmo tribunal + número CNJ não poderá gerar dois registros
independentes sem tratamento explícito.

------------------------------------------------------------------------

# 15. DATASET-001 --- Base piloto

**Prioridade:** P0\
**Dependência:** EP01

Criar o dataset piloto inicial com:

-   10 a 15 decisões reais;
-   1 tese;
-   4 a 6 fundamentos;
-   TJCE, TJMA e TJPI (composição inicial, não limite estrutural).

**Aceite**

-   todos os registros passam nos schemas;
-   todas as referências são válidas;
-   não existem decisões duplicadas;
-   classificação jurídica é revisada;
-   cada decisão possui fonte rastreável.

------------------------------------------------------------------------

# 16. EP02 --- Jurisprudência

**Prioridade:** P0\
**Dependências:** EP01 + DATASET-001

### US06 --- Página `/jurisprudencia/`

Criar listagem de decisões válidas.

**Aceite**

-   decisões do dataset aparecem;
-   dados exibidos são derivados dos registros;
-   layout é responsivo.

### US07 --- Busca

Pesquisar inicialmente em:

-   processo;
-   tribunal;
-   título;
-   resumo;
-   produto;
-   tema;
-   tese;
-   fundamento.

**Aceite**

Busca deve ignorar diferenças de caixa e, preferencialmente, acentuação,
mantendo o comportamento já adotado no projeto quando aplicável.

### US08 --- Filtros

Implementar:

-   Tribunal;
-   Produto;
-   Tema;
-   Tese;
-   Resultado da tese.

**Aceite**

Filtros podem ser combinados.

### US09 --- Página individual

Criar:

``` text
/jurisprudencia/{decision-id}/
```

Exibir:

-   identificação;
-   resumo;
-   fatos;
-   provas;
-   resultados;
-   teses;
-   fundamentos;
-   fonte.

### US10 --- Fonte primária

Toda decisão deverá permitir acesso à fonte jurídica ou inteiro teor
quando disponível.

------------------------------------------------------------------------

# 17. EP03 --- Banco de Teses

**Prioridade:** P1\
**Dependências:** EP01 + EP02

### US11 --- Página `/teses/`

Listar teses ativas.

### US12 --- Página individual

Criar:

``` text
/teses/{slug}/
```

### US13 --- Agregação automática

Derivar automaticamente decisões relacionadas.

### US14 --- Indicadores

Calcular:

-   quantidade de decisões;
-   quantidade de tribunais;
-   quantidade de fundamentos;
-   última decisão catalogada.

### US15 --- Divergências

Permitir registrar e exibir divergências sem declarar automaticamente
entendimento consolidado.

------------------------------------------------------------------------

# 18. EP04 --- Banco de Fundamentos

**Prioridade:** P1\
**Dependências:** EP01 + EP02

### US16 --- Página `/fundamentos/`

Listar fundamentos ativos.

### US17 --- Página individual

Criar:

``` text
/fundamentos/{slug}/
```

### US18 --- Decisões relacionadas

Derivar decisões que utilizam o fundamento.

### US19 --- Teses relacionadas

Exibir teses relacionadas ao fundamento.

### US20 --- Frase de peça

Exibir bloco copiável.

**Aceite obrigatório**

Toda frase editorial deverá ser acompanhada de:

> Síntese editorial Predator --- não corresponde a citação literal de
> decisão judicial.

------------------------------------------------------------------------

# 19. EP05 --- Integração editorial

**Prioridade:** P1\
**Dependências:** EP02 + EP03 + EP04

### US21 --- Referência jurisprudencial na edição

Permitir referência por `decision-id` na notícia.

### US22 --- Links contextuais

Quando houver decisão relacionada, exibir acesso para:

``` text
Analisar decisão
Explorar tese
```

### US23 --- Navegação reversa

A página da decisão deverá indicar as edições nas quais foi analisada.

### US24 --- Home

Adicionar bloco discreto de Inteligência Predator com métricas reais
derivadas da base:

-   decisões;
-   teses;
-   fundamentos.

A Home não deverá se tornar um dashboard.

------------------------------------------------------------------------

# 20. EP06 --- Qualidade e publicação

**Prioridade:** P0 para release\
**Dependências:** EP01--EP05

### US25 --- Fixtures

Criar fixtures para pelo menos:

``` text
decisao-tese-acolhida
decisao-tese-rejeitada
decisao-parcial
decisao-com-biometria
decisao-sem-dano-moral
```

### US26 --- Testes de schema

Dados inválidos devem falhar.

### US27 --- Testes referenciais

IDs inexistentes devem falhar.

### US28 --- Testes de agregação

Se 10 decisões referenciarem uma tese, a interface deverá mostrar
exatamente 10.

### US29 --- Testes de consistência jurídica

Exemplo obrigatório:

``` yaml
tese: acolhida
dano_moral: indeferido
```

não poderá produzir texto ou badge equivalente a:

``` text
integralmente favorável ao consumidor
```

### US30 --- Regressão

Validar:

-   Home;
-   edição atual;
-   edições antigas;
-   arquivo;
-   busca existente;
-   filtros existentes;
-   radar;
-   build;
-   deploy.

------------------------------------------------------------------------

# 21. Ordem obrigatória de implementação

Não executar todos os épicos simultaneamente.

## Incremento 1

``` text
EP01
+
DATASET-001
```

Objetivo: validar modelo e integridade.

## Incremento 2

``` text
EP02
```

Objetivo: colocar o acervo jurisprudencial em uso real.

## Incremento 3

``` text
EP03
+
EP04
```

Objetivo: provar agregação por tese e fundamento.

## Incremento 4

``` text
EP05
```

Objetivo: conectar a camada editorial à inteligência jurídica.

## Incremento 5

``` text
EP06
```

Objetivo: fechar qualidade, regressão e release.

A integração automática com JusRatio somente deverá ser planejada após a
validação deste MVP.

------------------------------------------------------------------------

# 22. Definição de pronto do MVP

O MVP será considerado concluído quando o seguinte fluxo funcionar em
produção:

``` text
Edição
   ↓
Notícia
   ↓
Decisão
   ↓
Tese
   ↓
Fundamento
   ↓
Outras decisões relacionadas
```

E também o caminho inverso:

``` text
Fundamento
   ↓
Tese
   ↓
Decisões
   ↓
Edições relacionadas
```

Além disso:

1.  pelo menos 10 decisões reais devem estar estruturadas;
2.  deve existir pelo menos uma tese funcional;
3.  devem existir pelo menos quatro fundamentos funcionais;
4.  busca e filtros devem funcionar;
5.  relações devem ser derivadas corretamente;
6.  nenhuma referência quebrada deve existir;
7.  schemas devem estar ativos;
8.  CI deve validar os dados;
9.  páginas existentes não podem sofrer regressão;
10. fonte jurídica deve permanecer rastreável;
11. nenhuma conclusão jurídica deve ser apresentada sem suporte nos
    dados catalogados.

------------------------------------------------------------------------

# 23. Fora de escopo

O Codex não deverá implementar neste MVP, salvo nova especificação
expressa:

-   mapa nacional;
-   score jurisprudencial;
-   classificação automática de tendências;
-   pesquisa semântica;
-   chatbot;
-   RAG;
-   autenticação;
-   banco de dados;
-   painel administrativo;
-   notas pessoais;
-   favoritos;
-   monitoramento automático;
-   integração automática com JusRatio;
-   alteração da rotina integral do Predator News Publisher;
-   migração tecnológica do site;
-   reestruturação das edições históricas.

------------------------------------------------------------------------

# 24. Limites de autonomia do Codex

O Codex pode decidir autonomamente:

-   detalhes internos de implementação;
-   nomes de funções;
-   composição de componentes;
-   organização de testes;
-   refatorações pequenas necessárias para integração;
-   solução técnica compatível com a stack atual.

O Codex **não deve decidir autonomamente**:

-   criar novas teses jurídicas;
-   criar novos fundamentos sem necessidade demonstrada;
-   alterar significado de enums;
-   fundir conceitos jurídicos;
-   classificar tendência jurisprudencial;
-   alterar regras de resultado;
-   substituir a stack;
-   introduzir banco de dados;
-   alterar a estratégia editorial;
-   modificar o modelo de publicação sem especificação;
-   afirmar entendimento consolidado de tribunal.

Quando uma decisão dessa natureza for necessária, interromper a
implementação daquele ponto e registrar a pendência.

------------------------------------------------------------------------

# 25. Princípio permanente

Toda implementação deverá respeitar o seguinte princípio:

> **Cada nova edição deve aumentar o valor de pesquisa de todo o acervo
> anterior.**

A camada de Inteligência Jurídica não substitui o Predator News
editorial.

Ela transforma o conhecimento produzido diariamente em uma base
progressivamente mais estruturada, navegável, rastreável e reutilizável
para pesquisa e estudo jurídico.

------------------------------------------------------------------------

# 26. Próxima etapa após aprovação deste documento

Após este documento ser incorporado ao repositório, a primeira execução
técnica deverá:

1.  inspecionar a arquitetura atual;
2.  confrontar esta especificação com a implementação existente;
3.  registrar incompatibilidades, se houver;
4.  propor o plano de alteração do **Incremento 1 --- EP01 +
    DATASET-001**;
5.  implementar apenas após confirmar que a solução preserva o
    funcionamento atual;
6.  executar testes;
7.  apresentar relatório das alterações realizadas.

A automação via JusRatio e o Mapa Nacional pertencem a fases posteriores
e não devem ser antecipados.
