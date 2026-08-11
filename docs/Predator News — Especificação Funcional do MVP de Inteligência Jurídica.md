# Predator News — Especificação Funcional do MVP de Inteligência Jurídica

## 1. Objetivo

Esta especificação define o primeiro MVP da camada de Inteligência Jurídica do Predator News.

O objetivo é evoluir o Predator de um informativo jurídico diário para uma plataforma que, além de publicar notícias e análises, organize progressivamente o conhecimento jurídico acumulado em quatro entidades principais:

- Edição;
- Decisão jurisprudencial;
- Tese;
- Fundamento.

O MVP deverá provar o fluxo completo:

**Edição → Decisão → Tese → Fundamento**

sem comprometer a experiência editorial já consolidada do clipping diário.

---

# 2. Princípio de produto

O Predator News terá duas experiências complementares.

## 2.1. Predator Editorial

Responde:

> O que aconteceu hoje e por que isso importa?

Abrange:

- Home;
- edição do dia;
- arquivo de edições;
- notícias e análises editoriais.

## 2.2. Predator Inteligência

Responde:

> O que já sabemos sobre este problema jurídico?

Abrange:

- jurisprudência;
- decisões;
- teses;
- fundamentos;
- futuramente, mapa jurisprudencial nacional.

As duas experiências deverão compartilhar a mesma base de conhecimento, mas não serão fundidas em uma única interface.

---

# 3. Escopo do MVP

O MVP deverá implementar:

1. nova área de Jurisprudência;
2. página individual de decisão;
3. Banco de Teses;
4. página individual de tese;
5. Banco de Fundamentos;
6. página individual de fundamento;
7. relacionamento entre edição, notícia, decisão, tese e fundamento;
8. dataset inicial estruturado;
9. busca e filtros básicos de jurisprudência;
10. atualização do menu principal;
11. validação estrutural dos dados.

Não fazem parte deste primeiro MVP:

- mapa nacional;
- classificação automática nacional de tendências;
- monitoramento automatizado de novas decisões;
- integração automática do Publisher com JusRatio;
- autenticação de usuários;
- caderno pessoal;
- IA conversacional;
- pesquisa semântica avançada.

Esses itens pertencem a fases posteriores.

---

# 4. Menu principal

O menu principal deverá conter:

- Home
- Edições
- Jurisprudência
- Teses
- Fundamentos
- Sobre

O item `Mapa` não deverá aparecer no MVP.

---

# 5. Rotas

## 5.1. Rotas existentes

```text
/
/edicoes/
/edicoes/{edicao}/
```

Deverá ser preservado o padrão real de URLs atualmente utilizado pelo projeto quando houver diferença em relação ao exemplo acima.

## 5.2. Novas rotas

```text
/jurisprudencia/
/jurisprudencia/{decision-id}/

/teses/
/teses/{tese-slug}/

/fundamentos/
/fundamentos/{fundamento-slug}/
```

As URLs deverão utilizar identificadores persistentes.

Alterações de título não poderão quebrar referências históricas.

---

# 6. Home

## 6.1. Objetivo

Preservar a Home como principal superfície editorial do Predator.

## 6.2. Alteração prevista

Adicionar um bloco discreto de acesso à nova camada de Inteligência Jurídica.

Exemplo conceitual:

```text
Inteligência Predator

12 decisões catalogadas
1 tese em acompanhamento
5 fundamentos identificados

[Explorar jurisprudência]
```

## 6.3. Regras

- o bloco não deverá competir visualmente com a edição do dia;
- a Home não deverá se tornar um dashboard;
- os números deverão ser derivados da base real;
- nenhuma métrica fictícia poderá ser exibida.

---

# 7. Página individual de edição

## 7.1. Objetivo

Preservar a leitura editorial atualmente consolidada.

## 7.2. Alterações

Quando uma notícia estiver relacionada a decisão catalogada, poderão ser exibidos:

```text
TJCE
RMC
Consentimento
Contratação digital
```

Também deverão ser exibidos links contextuais:

```text
[Analisar decisão]
[Explorar tese]
```

## 7.3. Regras

A edição não deverá reproduzir:

- todos os metadados da decisão;
- histórico completo da tese;
- lista integral de fundamentos;
- dados estatísticos do tribunal.

A função da edição é introduzir o acontecimento e encaminhar o leitor para a camada de pesquisa.

---

# 8. Página `/jurisprudencia/`

## 8.1. Objetivo

Permitir pesquisa sobre as decisões já catalogadas pelo Predator.

Pergunta principal:

> Quais decisões o Predator já reuniu sobre determinado problema?

## 8.2. Componentes

### Cabeçalho

Título:

`Jurisprudência`

Descrição curta:

> Decisões selecionadas e estruturadas pelo Predator News para pesquisa em Direito Bancário aplicado a aposentados e pensionistas do INSS.

### Campo de busca

Exemplo:

```text
Pesquisar jurisprudência...
```

A busca deverá procurar inicialmente em:

- tribunal;
- número do processo;
- resumo;
- títulos;
- temas;
- produtos;
- teses;
- fundamentos.

### Filtros do MVP

- Tribunal
- Produto
- Tema
- Tese
- Resultado da tese

Filtros adicionais ficam para versões posteriores.

## 8.3. Resultado

Cada decisão deverá ser apresentada em um card contendo:

- tribunal;
- órgão julgador;
- data de julgamento;
- título/resumo técnico;
- produto;
- temas relevantes;
- tese principal;
- resultado da tese;
- resultado contratual, quando aplicável;
- dano moral, quando aplicável;
- link para página individual.

Exemplo:

```text
TJCE · 6ª Câmara de Direito Privado
04/03/2026

Vício de consentimento em cartão consignado

O tribunal reconheceu deficiência informacional mesmo diante
da existência de biometria e registros eletrônicos.

RMC · Contratação digital · Consentimento

Tese: acolhida
Contrato: convertido
Dano moral: indeferido

[Ver decisão]
```

---

# 9. Página individual de decisão

## 9.1. Objetivo

Transformar uma decisão jurisprudencial em unidade de estudo.

## 9.2. URL

```text
/jurisprudencia/{decision-id}/
```

## 9.3. Conteúdo

### Identificação

- tribunal;
- número do processo;
- órgão julgador;
- relator;
- data de julgamento;
- data de publicação, quando disponível;
- tipo de decisão.

### Resumo Predator

Resumo técnico da ratio ou do problema jurídico relevante.

O resumo deverá ser identificado como conteúdo editorial do Predator.

### Contexto fático

Quando disponível:

- consumidor idoso;
- aposentado/pensionista;
- analfabeto;
- baixa escolaridade;
- meio de contratação;
- saque inicial;
- uso do cartão;
- descontos prolongados.

### Elementos probatórios

Exemplos:

- contrato;
- assinatura;
- biometria;
- gravação;
- IP;
- logs;
- device ID;
- comprovante de transferência;
- faturas;
- histórico de uso.

### Resultados

Os resultados deverão ser decompostos.

Exemplo:

```text
Tese principal
Acolhida

Contrato
Convertido em empréstimo consignado

Repetição do indébito
Mista

Dano moral
Indeferido
```

É proibida a simplificação global:

```text
Favorável ao consumidor
```

como substituição da classificação granular.

### Teses relacionadas

Deverá listar e permitir navegação para as teses relacionadas.

### Fundamentos relacionados

Deverá listar os fundamentos identificados e permitir navegação.

### Fonte

Deverá existir acesso ao inteiro teor ou à fonte primária sempre que disponível.

---

# 10. Página `/teses/`

## 10.1. Objetivo

Apresentar questões jurídicas acompanhadas pelo Predator.

Pergunta principal:

> Quais teses estão sendo monitoradas e sustentadas pela jurisprudência catalogada?

## 10.2. Conteúdo

Cada card deverá conter:

- título da tese;
- formulação curta;
- produtos relacionados;
- número de decisões catalogadas;
- número de tribunais representados;
- quantidade de fundamentos;
- link para exploração.

## 10.3. Escopo inicial

O MVP deverá começar com uma tese principal, sem limitar a evolução posterior do Banco de Teses:

`Vício de consentimento no cartão consignado`

Produtos relacionados:

- RMC;
- RCC.

---

# 11. Página individual de tese

## 11.1. Objetivo

Concentrar a inteligência acumulada sobre uma determinada questão jurídica.

## 11.2. URL

```text
/teses/{tese-slug}/
```

## 11.3. Conteúdo

### Título

Exemplo:

`Vício de consentimento no cartão consignado`

### Questão jurídica

Exemplo:

> A comprovação formal da contratação é suficiente para demonstrar consentimento informado sobre RMC ou RCC?

### Síntese Predator

A síntese deverá:

- refletir apenas as decisões catalogadas;
- indicar limitações da amostra;
- não declarar entendimento consolidado sem base metodológica;
- distinguir tese principal e efeitos secundários.

### Indicadores

- quantidade de decisões;
- quantidade de tribunais;
- quantidade de fundamentos;
- data da última atualização.

### Fundamentos relacionados

Exemplo:

- Autenticidade não equivale a consentimento informado;
- Dever de informação qualificado;
- Ausência de utilização do cartão como indício de vício;
- Hipervulnerabilidade do consumidor idoso.

Cada fundamento deverá ser clicável.

### Provas recorrentes

Apresentar os elementos encontrados nos precedentes.

### Jurisprudência

Lista das decisões relacionadas.

### Divergências

A página deverá ter espaço próprio para divergências.

Exemplo:

```text
Dano moral

Existem decisões reconhecendo dano moral e decisões que exigem
circunstâncias adicionais.
```

O mesmo poderá ocorrer com:

- repetição do indébito;
- conversão;
- nulidade;
- consequência restitutória.

---

# 12. Página `/fundamentos/`

## 12.1. Objetivo

Organizar razões jurídicas reutilizáveis identificadas no acervo.

Pergunta principal:

> Quais fundamentos aparecem reiteradamente nas decisões catalogadas?

## 12.2. Card

Cada card deverá conter:

- título;
- síntese curta;
- temas;
- produtos relacionados;
- número de decisões;
- número de teses relacionadas;
- link para página individual.

---

# 13. Página individual de fundamento

## 13.1. Objetivo

Transformar um argumento jurídico recorrente em unidade própria de estudo e aplicação.

## 13.2. URL

```text
/fundamentos/{fundamento-slug}/
```

## 13.3. Conteúdo

### Título

Exemplo:

`Autenticidade formal não equivale a consentimento informado`

### Formulação técnica

Explicação do fundamento.

### Aplicabilidade

Produtos e contextos relacionados.

### Base normativa

Exibir normas e dispositivos associados.

### Raciocínio jurídico

Apresentar:

- premissas;
- conclusão;
- limites;
- distinções.

### Situações que fortalecem

Exemplos:

- ausência de utilização do cartão;
- saque único;
- ausência de gravação explicativa;
- consumidor idoso.

### Situações que enfraquecem

Exemplos:

- utilização reiterada;
- compras sucessivas;
- gravação clara;
- termo específico e destacado.

### Jurisprudência relacionada

Lista das decisões em que o fundamento foi identificado.

### Frase de peça

Deverá existir bloco copiável.

Exemplo:

> A comprovação da autoria do ato eletrônico não se confunde com a demonstração do consentimento informado quanto à modalidade contratual.

Obrigatoriamente acompanhado da indicação:

`Síntese editorial Predator — não corresponde a citação literal de decisão judicial.`

---

# 14. Relacionamentos

O sistema deverá permitir navegação bidirecional.

## Edição → Decisão

Uma notícia pode referenciar uma ou mais decisões.

## Decisão → Edição

A página de decisão poderá informar em quais edições do Predator foi analisada.

## Decisão → Tese

Uma decisão pode:

- acolher;
- acolher parcialmente;
- rejeitar;
- não enfrentar;
- prejudicar

uma ou mais teses.

## Tese → Decisão

A página da tese deve listar decisões relacionadas.

## Decisão → Fundamento

Uma decisão pode utilizar vários fundamentos.

## Fundamento → Decisão

A página do fundamento deve listar as decisões relacionadas.

## Tese ↔ Fundamento

Uma tese pode ser sustentada por vários fundamentos.

Um fundamento pode servir a várias teses.

---

# 15. Dataset inicial

O MVP não deverá depender de automação externa.

A base inicial deverá ser carregada de forma controlada.

Escopo recomendado:

- 1 tese principal;
- 4 a 6 fundamentos;
- aproximadamente 10 a 15 decisões;
- tribunais inicialmente representados no dataset piloto:
  - TJCE;
  - TJMA;
  - TJPI.

Essa lista descreve a composição inicial da amostra, não uma restrição estrutural. Novos tribunais, teses e fundamentos devem ser aceitos mediante cadastro, validação e revisão compatíveis com o modelo de dados.

A primeira tese será:

`vicio_consentimento_cartao_consignado`

Fundamentos iniciais recomendados:

```text
autenticidade_nao_equivale_consentimento
dever_informacao_qualificado
ausencia_uso_cartao_indicio_vicio
hipervulnerabilidade_consumidor_idoso
saque_unico_indicio_mutuo
onerosidade_cartao_consignado
```

---

# 16. Integração JusRatio

A integração automática com JusRatio não fará parte do MVP inicial.

O JusRatio será utilizado inicialmente como ferramenta de pesquisa para:

- localizar decisões;
- recuperar metadados;
- acessar inteiro teor;
- estruturar o dataset inicial.

Após validação das páginas e do modelo de dados, uma nova fase deverá automatizar:

```text
Publisher
   ↓
notícia judicial
   ↓
JusRatio
   ↓
decisão
   ↓
normalização
   ↓
persistência
   ↓
edição + jurisprudência + tese + fundamento
```

---

# 17. Estrutura de armazenamento esperada

A implementação deverá prever, conceitualmente:

```text
data/
├── jurisprudencia/
├── teses/
├── fundamentos/
└── taxonomy/
```

Os detalhes de formato físico deverão ser definidos na especificação técnica.

As edições não deverão duplicar a estrutura completa das decisões.

Elas deverão apenas referenciar identificadores.

Exemplo:

```yaml
jurisprudencia:
  - tjce-3002087-43-2025-8-06-0070
```

---

# 18. Regras de integridade

O sistema deverá garantir:

1. slug único para cada tese;
2. slug único para cada fundamento;
3. identificador único para cada decisão;
4. referências somente para entidades existentes;
5. resultados controlados por enums;
6. inexistência de decisão duplicada;
7. separação entre fonte jurídica e origem de recuperação;
8. separação entre conteúdo editorial e citação literal;
9. ausência de classificação global simplificada de decisão;
10. rastreabilidade de toda conclusão jurisprudencial.

---

# 19. Princípios jurídicos da interface

A interface não poderá apresentar:

`TJMA entende que...`

com base em uma decisão isolada.

Também não poderá afirmar:

`Entendimento consolidado`

sem metodologia e amostra suficientes.

No MVP, deverão ser preferidas formulações como:

- decisão catalogada;
- decisões catalogadas;
- ocorrências identificadas;
- jurisprudência relacionada;
- amostra atual.

A classificação por tendência será implementada em fase posterior.

---

# 20. Critérios de aceite do MVP

O MVP será considerado funcional quando:

1. existir nova navegação para Jurisprudência, Teses e Fundamentos;
2. pelo menos 10 decisões reais estiverem estruturadas;
3. o usuário conseguir abrir uma decisão individual;
4. cada decisão indicar suas teses e fundamentos;
5. a tese principal agregar todas as decisões relacionadas;
6. cada fundamento exibir suas decisões relacionadas;
7. uma edição do Predator estiver efetivamente ligada a uma decisão;
8. o usuário conseguir navegar:

   `Edição → Decisão → Tese → Fundamento`;

9. o usuário conseguir realizar o caminho inverso;
10. a busca de jurisprudência funcionar;
11. os filtros essenciais funcionarem;
12. os dados respeitarem a taxonomia oficial;
13. nenhum link interno referenciar entidade inexistente;
14. a construção e publicação atual do site continuarem funcionando;
15. nenhuma funcionalidade editorial existente sofrer regressão.

---

# 21. Ordem de implementação

## Incremento 1 — Infraestrutura

- estrutura de dados;
- taxonomia;
- schemas;
- validação;
- dataset inicial.

## Incremento 2 — Jurisprudência

- `/jurisprudencia/`;
- busca;
- filtros;
- página individual de decisão.

## Incremento 3 — Teses

- `/teses/`;
- página individual de tese;
- relações decisão ↔ tese.

## Incremento 4 — Fundamentos

- `/fundamentos/`;
- página individual;
- relações fundamento ↔ decisão ↔ tese.

## Incremento 5 — Integração editorial

- adicionar referências nas edições;
- links de `Analisar decisão`;
- links de `Explorar tese`;
- exibir edições relacionadas na jurisprudência.

## Incremento 6 — Validação do MVP

- testes;
- revisão jurídica;
- revisão visual;
- acessibilidade;
- responsividade;
- publicação.

---

# 22. Fases posteriores

Após validação do MVP:

## Fase 2

Integração do Predator News Publisher com JusRatio.

## Fase 3

Carga jurisprudencial ampliada por tese e tribunal.

## Fase 4

Mapa Nacional da Jurisprudência.

## Fase 5

Metodologia de tendências e divergências.

## Fase 6

Monitoramento periódico das teses.

## Fase 7

Pesquisa semântica e inteligência assistida sobre o acervo.

---

# 23. Resultado esperado

Ao final do MVP, o Predator deverá manter sua proposta editorial original, mas passar a oferecer uma segunda camada de navegação:

```text
Predator News
   │
   ├── Editorial
   │     └── o que aconteceu?
   │
   └── Inteligência Jurídica
         └── o que o acervo já revela sobre isso?
```

Cada nova decisão publicada futuramente deverá poder contribuir simultaneamente para:

- a edição do dia;
- o acervo jurisprudencial;
- as teses relacionadas;
- os fundamentos relacionados;
- posteriormente, o mapa jurisprudencial.

O princípio estrutural permanente será:

> Cada nova edição deve aumentar o valor de pesquisa de todo o acervo anterior.
