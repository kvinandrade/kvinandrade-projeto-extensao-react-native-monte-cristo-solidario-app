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
<p class="natureza">Proposta inicial da solução tecnológica apresentada como requisito da disciplina Projeto Prático — Extensão Curricularizada Tech, do Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas da UniFECAF — Taboão da Serra.</p>
</div>

<div class="capa-rodape">
<p>Taboão da Serra</p>
<p>2026</p>
</div>

</div>

# Proposta Inicial da Solução Tecnológica

**Projeto:** Monte Cristo Solidário  
**Autor:** Kevin Maikon Caetano de Andrade Santos  
**Curso:** Análise e Desenvolvimento de Sistemas — UniFECAF — Taboão da Serra  
**Instituição parceira:** Cozinha Mãe — Associação Revolução dos Baldinhos  
**Data:** Junho de 2026

---

## 0. Origem e motivação

O projeto nasceu de uma experiência vivida. Em **janeiro de 2026**, durante férias no bairro Monte Cristo (Florianópolis), convivi com uma amiga cuja família recebia alimentos da **Cozinha Mãe**. Acompanhei uma retirada para ajudá-la e, nas semanas em que fiquei na região, identifiquei quatro dificuldades recorrentes:

1. Controle de **cadastro de famílias**
2. Controle de **alimentos** recebidos e distribuídos
3. Saber **quem já havia retirado** os alimentos na semana
4. Um **sistema de senhas/horários** que não funcionava de forma confiável

Ao iniciar o Projeto Prático de Extensão na UniFECAF, associei imediatamente essas dores à temática de automação de processos sociais. Entrei em contato com **Cíntia Aldaci da Cruz**, criadora da Cozinha Mãe, ofereci ajuda e estruturei esta proposta — mesmo já tendo retornado das férias, motivado pelo impacto direto que o projeto teve na vida da minha amiga e de outras famílias do bairro.

---

## 1. Temática escolhida

### Temática 1 — Digitalização e Automação de Processos Sociais

**Justificativa:** O projeto resolve gargalos operacionais, fluxos manuais e burocracia na gestão de cadastros, filas e distribuição de alimentos de uma instituição social real.

**Competências aplicadas (Análise e Desenvolvimento de Sistemas):**
- Desenvolvimento de aplicação mobile com React Native / Expo
- Arquitetura em camadas (screens, services, contexts, models)
- Integração com banco em nuvem (Firebase Realtime Database)
- Interface operacional para uso diário
- Modelagem de dados e regras de negócio

---

## 2. Problema delimitado

> **Como reduzir o tempo e os erros no cadastro de famílias, no controle de alimentos, no rastreio de quem já retirou e na geração de senhas/horários da Cozinha Mãe, usando uma solução digital simples e de baixo custo?**

### Escopo INCLUÍDO (MVP)
- Cadastro e gestão de famílias (ativo, inativo, espera, excluído)
- Geração automática de lista semanal de retiradas
- Marcação de retirada com bloqueio semanal
- Dashboard com indicadores
- Controle de alimentos e perdas
- Relatório semanal
- Autenticação com perfis master/admin

### Escopo EXCLUÍDO (fases futuras)
- App para beneficiários (autoatendimento)
- Integração com SMS automático
- Biometria ou reconhecimento facial
- Módulo financeiro / nota fiscal

---

## 3. Proposta da solução

### 3.1 Visão geral

**Monte Cristo Solidário** é um aplicativo mobile (React Native + Expo) para gestão da distribuição semanal de alimentos. Centraliza cadastros, listas de retirada, estoque e relatórios em uma única ferramenta pensada para uso no balcão de atendimento.

Cada módulo responde a uma dor observada pessoalmente em janeiro/2026:

| O que vi no campo | Módulo do app |
|-------------------|---------------|
| Cadastro de famílias desorganizado | **Cadastro de Famílias** — busca, vagas, fila de espera |
| Controle de alimentos informal | **Alimentos** — caixas recebidas, perdas, histórico semanal |
| Não saber quem já retirou | **Retiradas** — marcação em tempo real + dashboard |
| Senhas/horários manuais que não funcionavam | **Retiradas** — lista automática com horários + busca por senha/CPF |

### 3.2 Fluxo proposto (TO-BE)

```
Login do atendente
    ↓
Dashboard (visão da semana)
    ↓
┌─────────────────┬──────────────────┬─────────────────┐
│ Cadastro        │ Retiradas        │ Alimentos       │
│ Famílias        │ Gerar lista      │ Registrar caixas│
│ Busca CPF/nome  │ Marcar retirada  │ Registrar perdas│
│ Vagas/espera    │ Copiar WhatsApp  │ Relatório       │
└─────────────────┴──────────────────┴─────────────────┘
```

### 3.3 Telas principais

| Tela | Função |
|------|--------|
| **Login** | Autenticação de master e administradores |
| **Dashboard** | Indicadores: famílias ativas, retiradas, fila, gráficos |
| **Cadastro de Famílias** | CRUD, busca, abas por status, reativação |
| **Retiradas** | Gerar lista, horários, busca, marcar retirada, WhatsApp |
| **Alimentos** | Estoque semanal, perdas, histórico |
| **Relatórios** | Comparativo semanal (retiradas, perdas, famílias) |
| **Configurações** | Nome do app, logo, vagas totais, bairros |
| **Gestão de Admins** | Master cria até 5 administradores |

### 3.4 Arquitetura técnica

```
┌─────────────────────────────────────────────┐
│           App Mobile (Expo / RN)            │
│  Screens → Hooks → Contexts → Services    │
└────────────────────┬────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
   mockDatabase.js        firebaseAdapter.js
   (dev / demo)           (produção - nuvem)
         │                       │
         └───────────┬───────────┘
                     │
         Firebase Realtime Database
         (plano gratuito Spark)
```

**Camadas:**
- **Apresentação:** Screens + Components (ButtonCustom, InputCustom, Card, Header)
- **Estado global:** AuthContext, AppDataContext
- **Regras de negócio:** familiaService, retiradaService, alimentoService, foodWeeklyService
- **Dados:** mockDatabase (desenvolvimento) / Firebase (produção)

### 3.5 Modelo de dados (resumo)

| Entidade | Campos principais |
|----------|-------------------|
| **User** | id, nome, email, senha, role, permissions |
| **Family** | id, nome, cpf, telefone, endereço, bairro, status, lastWithdrawalAt |
| **Ticket** | id, familyId, weekKey, dateKey, horário, retiradaRealizada |
| **Food** | id, nome, caixasRecebidas, itensPorCaixa |
| **FoodWeeklyEntry** | id, weekKey, foods[], archivedAt |
| **Loss** | id, foodId, quantidade, reason, weekKey |
| **Config** | nomeApp, logoUrl, vagasTotais, bairrosPermitidos |

### 3.6 Regras de negócio críticas

1. Família sem retirada há **30 dias** → inativação automática
2. Vagas esgotadas → novas famílias vão para **fila de espera**
3. Vaga liberada → promoção automática da fila
4. **Uma retirada por família por semana** (bloqueio de duplicata)
5. Lista semanal gerada com **ordem aleatória** e intervalo de horários configurável
6. CPF exibido **mascarado** e nome **abreviado** (LGPD)

---

## 4. Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Frontend mobile | React Native 0.81, Expo SDK 54 |
| Navegação | React Navigation 7 |
| Gráficos | react-native-chart-kit |
| Backend / BD | Firebase Realtime Database |
| Hospedagem web (opcional) | Expo Web + Vercel ou GitHub Pages |
| Build Android | EAS Build (Expo Application Services) |

---

## 5. Estratégia de implantação sem custo

Para garantir sustentabilidade à instituição parceira **sem mensalidade**:

| Serviço | Plano | Custo | Limite gratuito |
|---------|-------|-------|-----------------|
| Firebase Realtime Database | Spark | **R$ 0 permanente** | 1 GB armazenado, 10 GB/mês transferência |
| Expo Go | Gratuito | **R$ 0** | Testes e demonstração |
| GitHub | Free | **R$ 0** | Repositório e documentação |
| Vercel / Netlify | Hobby | **R$ 0** | Deploy da versão web |

> O plano Spark do Firebase **não é trial de 30 dias** — é gratuito de forma contínua, adequado para o volume de dados de uma cozinha comunitária.

---

## 6. Cronograma do MVP

| Fase | Entrega | Status |
|------|---------|--------|
| Diagnóstico e requisitos | Relatório de diagnóstico | ✅ Concluído |
| Protótipo funcional | App com dados mockados | ✅ Concluído |
| Integração Firebase | Adapter + sincronização | ✅ Concluído |
| Validação com instituição | Teste de fluxos com equipe | ✅ Concluído |
| Documentação e entrega | Relatório final + repositório | ✅ Concluído |

---

## 7. Resultados esperados

| Indicador | Situação anterior | Meta com o app |
|-----------|-------------------|----------------|
| Tempo de cadastro de família | ~15 min | **~5 min** |
| Tempo de montagem da lista semanal | ~90 min | **~2 min** |
| Erros de retirada duplicada | Frequentes | **Eliminados** |
| Visibilidade de estoque/perdas | Baixa | **Dashboard em tempo real** |
| Qualidade dos dados | Fragmentada | **Centralizada e pesquisável** |

---

*Documento de proposta inicial — Kevin Maikon Caetano de Andrade Santos. Análise e Desenvolvimento de Sistemas. UniFECAF — Taboão da Serra, 2026.*
