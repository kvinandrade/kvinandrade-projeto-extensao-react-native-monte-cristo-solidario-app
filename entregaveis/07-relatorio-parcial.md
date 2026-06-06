<div class="capa-abnt">

<div class="capa-topo">
<p class="instituicao">UniFECAF</p>
<p class="campus">Taboão da Serra</p>
<p class="curso">Curso Superior de Tecnologia em<br>Análise e Desenvolvimento de Sistemas</p>
</div>

<div class="capa-autor">
<p>Kevin Maikon Caetano de Andrade Santos</p>
</div>

<div class="capa-titulo">
<p class="titulo">Monte Cristo Solidário</p>
<p class="subtitulo">Sistema de Gestão para Distribuição de Alimentos da Cozinha Mãe</p>
<p class="natureza">Relatório parcial apresentado como requisito da disciplina Projeto Prático — Extensão Curricularizada Tech, do Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas da UniFECAF — Taboão da Serra.</p>
</div>

<div class="capa-rodape">
<p>Taboão da Serra</p>
<p>2026</p>
</div>

</div>

# Relatório Parcial do Projeto Prático

**Disciplina:** Projeto Prático — Extensão Curricularizada Tech  
**Unidade:** 3 — Parte I  
**Autor:** Kevin Maikon Caetano de Andrade Santos  
**Curso:** Análise e Desenvolvimento de Sistemas  
**Instituição:** UniFECAF — Taboão da Serra  
**Parceira:** Cozinha Mãe — Associação Revolução dos Baldinhos  
**Data:** Junho de 2026

---

## Sumário

1. Introdução
2. Origem do projeto e vínculo com a Cozinha Mãe
3. Registro da instituição parceira
4. Diagnóstico das dores operacionais
5. Temática e problema delimitado
6. Proposta da solução (MVP)
7. Desenvolvimento: dificuldades técnicas enfrentadas
8. Apresentação do esboço à Cíntia e retorno da parceira
9. Situação atual do projeto
10. Referências

---

## 1. Introdução

Este relatório parcial documenta a **primeira fase** do projeto extensionista **Monte Cristo Solidário**, conforme exigido pela **Unidade 3 (Parte I)** da disciplina Projeto Prático da UniFECAF. O documento consolida o diagnóstico da realidade social, a escolha da instituição parceira, a temática de extensão, o problema delimitado, a proposta tecnológica inicial e o andamento do desenvolvimento até o estágio atual do aplicativo.

O relatório parcial não é o produto final: ele registra **como o projeto começou**, **o que foi identificado no campo**, **o que foi planejado** e **como o desenvolvimento avançou**, incluindo as dificuldades técnicas e a validação preliminar com a gestora da Cozinha Mãe.

---

## 2. Origem do projeto e vínculo com a Cozinha Mãe

Em **janeiro de 2026**, durante férias no bairro **Monte Cristo** (Florianópolis/SC), convivi com uma amiga cuja família era beneficiária da **Cozinha Mãe**. Em um dia de distribuição, acompanhei a retirada de alimentos para ajudá-la. Nas semanas em que permaneci na região, observei de perto a operação e identifiquei quatro dificuldades centrais:

1. **Cadastro de famílias** disperso em cadernos e planilhas
2. **Controle de alimentos** sem visão clara do estoque
3. **Impossibilidade de saber rapidamente quem já havia retirado**
4. **Sistema de senhas/fichas físicas** que gerava erros e confusão na fila

Ao iniciar a disciplina de extensão na UniFECAF, lembrei imediatamente dessa experiência. Entrei em contato com **Cíntia Aldaci da Cruz**, criadora da Cozinha Mãe e presidente da Associação Revolução dos Baldinhos, e ofereci desenvolver uma ferramenta digital como projeto de extensão universitária.

---

## 3. Registro da instituição parceira

| Campo | Informação |
|-------|------------|
| Projeto social | Cozinha Mãe |
| Gestora | Associação Revolução dos Baldinhos |
| Endereço | Rua dos Cedros, 90 — Monte Cristo, Florianópolis/SC |
| Programa federal | Cozinha Solidária (código CS019465) |
| Liderança | Cíntia Aldaci da Cruz |
| Público | Famílias em vulnerabilidade no Complexo do Monte Cristo |

A Cozinha Mãe surgiu em 2018 como desdobramento do trabalho comunitário da associação, reconhecida por práticas de agroecologia, compostagem e soberania alimentar. A instituição atende centenas de famílias e depende de processos organizados para não desperdiçar alimentos nem excluir beneficiários por falha operacional.

---

## 4. Diagnóstico das dores operacionais

### 4.1 Como era o processo (AS-IS)

**Retirada de alimentos:** as famílias precisavam **ir até o local no dia anterior** para tirar **fichas ou senhas físicas** em papel. No dia da distribuição, a equipe conferia manualmente quem tinha direito, quem já havia passado e quem ainda faltava.

**Fila de espera:** em dias de maior demanda, as filas **demoravam até 2 horas**, com pessoas esperando **ao sol**, muitas vezes com a fila **dando a volta no quarteirão**.

**Problemas recorrentes observados:**

- Pessoas que **retiravam alimentos mais de uma vez** na mesma semana
- Famílias que **ficavam sem algum item** por falha no controle
- **Senhas duplicadas** ou perdidas
- Cadastro desatualizado e busca lenta por nome/CPF
- Estoque de alimentos anotado de forma informal

### 4.2 Dores priorizadas

| Dor | Prioridade |
|-----|------------|
| Fichas/senhas físicas com erro | Alta |
| Fila longa e desorganizada | Alta |
| Retirada duplicada na semana | Alta |
| Cadastro manual | Alta |
| Controle de estoque informal | Alta |

---

## 5. Temática e problema delimitado

### 5.1 Temática escolhida

**Temática 1 — Digitalização e Automação de Processos Sociais**

O projeto automatiza cadastros, geração de senhas, controle de retiradas e estoque de uma instituição social real, aplicando competências de Análise e Desenvolvimento de Sistemas.

### 5.2 Problema delimitado

> Como substituir o controle manual de fichas, filas e cadastros da Cozinha Mãe por um sistema digital simples, que reduza erros, organizar senhas/horários e permita saber em tempo real quem já retirou os alimentos?

### 5.3 Escopo do MVP

**Incluído:** cadastro de famílias, lista semanal digital com senhas, marcação de retirada, bloqueio semanal, controle de alimentos, dashboard, relatórios, perfis de acesso.

**Excluído nesta fase:** app para beneficiários, SMS automático, biometria.

---

## 6. Proposta da solução (MVP)

O **Monte Cristo Solidário** é um aplicativo mobile (React Native + Expo) com os módulos:

| Módulo | Função |
|--------|--------|
| Login | Acesso master e administradores |
| Dashboard | Indicadores da semana |
| Cadastro de Famílias | Busca, vagas, fila de espera |
| Retiradas | Geração de senhas, busca, marcação, WhatsApp |
| Alimentos | Estoque e perdas semanais |
| Relatórios | Comparativo semanal |

**Arquitetura:** screens → contexts → services → mockDatabase / Firebase  
**Banco em produção:** Firebase Realtime Database (plano gratuito permanente)

---

## 7. Desenvolvimento: dificuldades técnicas enfrentadas

Durante a implementação do MVP, encontrei desafios que vão além da interface — especialmente na **lógica de negócio** e na **consistência dos dados**:

### 7.1 Lógica de senhas e listas semanais

A geração da lista exigiu definir regras para: ordem aleatória das famílias, intervalo de horários (a cada 5 minutos), períodos de manhã/tarde, vínculo com a semana correta (`weekKey`) e impedir colisão de IDs nos tickets. A maior dificuldade foi garantir que a lista de um dia não conflitasse com listas anteriores e que a substituição de uma lista do dia funcionasse sem corromper o histórico.

### 7.2 Controle de retiradas e duplicidade

Foi necessário implementar bloqueio para que a mesma família **não pudesse retirar duas vezes na mesma semana**, atualizando `lastWithdrawalAt` e o status do ticket em sincronia. Erros nessa regra reproduziam exatamente o problema que eu tinha visto na Cozinha Mãe.

### 7.3 Vagas, fila de espera e inativação automática

Outro ponto complexo foi a combinação de: limite de vagas (`vagasTotais`), promoção automática da fila de espera quando uma vaga liberava, e inativação de famílias sem retirada há 30 dias. Cada regra parecia simples isoladamente, mas integrá-las no `familiaService` exigiu várias iterações de teste.

### 7.4 Sincronização de alimentos por semana

O controle de alimentos precisou ser separado por semana (`foodWeeklyEntries`), com arquivamento automático ao virar a semana e cálculo de perdas vinculado à entrada correta. A inconsistência entre `getWeeklySummary` e `weekKey` foi um bug que precisei corrigir para os relatórios baterem com a realidade.

### 7.5 Integração Firebase e modo demonstração

Para a entrega acadêmica e para não gerar custo à instituição, mantive o `mockDatabase.js` funcional para demonstração, com `firebaseAdapter.js` preparado para produção. A decisão de arquitetura permitiu testar toda a lógica localmente antes de depender de nuvem.

### 7.6 Interface simples para uso real

Por ser um app para voluntários e gestoras com pouca familiaridade técnica, simplificar fluxos (botão grande de RETIRADAS, busca por CPF/nome/senha, copiar lista para WhatsApp) foi tão importante quanto a lógica de backend.

---

## 8. Apresentação do esboço à Cíntia e retorno da parceira

Após estruturar o diagnóstico e montar os primeiros wireframes das telas, **apresentei um esboço do aplicativo para a Cíntia Aldaci da Cruz** — primeiro em conversa sobre as telas principais (cadastro, retirada e dashboard), depois com uma **versão navegável do protótipo** rodando no celular via Expo.

**Pontos apresentados à gestora:**

- Tela de login e perfis de acesso
- Dashboard com visão da semana
- Geração automática de senhas/horários (substituindo fichas físicas)
- Busca rápida na retirada
- Controle de quem já pegou os alimentos
- Módulo de alimentos e relatórios

**Retorno da Cíntia:** a gestora **gostou da proposta** e considerou a solução **adequada à rotina da cozinha**, destacando especialmente a geração digital de senhas e a possibilidade de saber em tempo real quem já retirou. Solicitou que a interface permanecesse **simples**, pois seria usada por voluntários no dia a dia. Validou o foco no bairro Monte Cristo e no controle de vagas.

Essa validação preliminar confirmou que o MVP estava no caminho certo antes da finalização do desenvolvimento.

---

## 9. Situação atual do projeto

- Aplicativo funcional com todas as telas principais
- Dados de demonstração para testes
- Adapter Firebase para implantação sem custo
- Documentação e repositório organizados

---

## 10. Referências

- UniFECAF. *Ementa e Roteiro — Extensão Curricularizada Tech.*
- Programa Cozinha Solidária — CS019465.
- Slow Food Brasil (2018). Cozinha Mãe e Revolução dos Baldinhos.
- ONU — ODS 2, 10, 11 e 17.
- Documentação React Native, Expo SDK 54, Firebase.

---

**Kevin Maikon Caetano de Andrade Santos**  
Análise e Desenvolvimento de Sistemas — UniFECAF — Taboão da Serra, 2026.
