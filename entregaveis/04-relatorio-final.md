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
<p class="natureza">Relatório final apresentado como requisito da disciplina Projeto Prático — Extensão Curricularizada Tech, do Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas da UniFECAF — Taboão da Serra.</p>
</div>

<div class="capa-rodape">
<p>Taboão da Serra</p>
<p>2026</p>
</div>

</div>

# Relatório Final do Projeto Extensionista

**Autor:** Kevin Maikon Caetano de Andrade Santos  
**Curso:** Análise e Desenvolvimento de Sistemas  
**Instituição:** UniFECAF — Taboão da Serra  
**Parceira:** Cozinha Mãe — Associação Revolução dos Baldinhos  
**Temática:** 1 — Digitalização e Automação de Processos Sociais  
**Data:** Junho de 2026

---

## Sumário

1. Resumo executivo
2. Contexto e origem do projeto
3. Diagnóstico da realidade social
4. Solução desenvolvida
5. Arquitetura e tecnologias
6. Dificuldades técnicas superadas
7. Validação com a instituição parceira
8. Métricas de impacto
9. Evidências de funcionamento
10. Alinhamento com ODS
11. Sustentabilidade e implantação
12. Conclusão
13. Referências e anexos

---

## 1. Resumo executivo

O projeto **Monte Cristo Solidário** desenvolveu um aplicativo mobile para a **Cozinha Mãe** (Florianópolis/SC), substituindo o controle manual de **fichas físicas**, **cadastros em papel** e **conferência na fila** por um sistema digital integrado.

O projeto nasceu de uma experiência vivida pelo autor em janeiro/2026, quando acompanhou uma família beneficiária na retirada de alimentos e observou filas de até **2 horas ao sol**, erros de senhas, retiradas duplicadas e famílias que ficavam sem itens por falha no controle.

A solução entregue inclui: cadastro de famílias, geração automática de senhas/horários, marcação de retiradas, bloqueio semanal, controle de alimentos, dashboard, relatórios e perfis de acesso — com infraestrutura **gratuita** (Firebase Spark).

---

## 2. Contexto e origem do projeto

Em janeiro de 2026, durante férias no bairro Monte Cristo, o autor conviveu com uma amiga beneficiária da Cozinha Mãe. Ao ajudá-la na retirada de alimentos, identificou gargalos críticos. Posteriormente, na disciplina de Extensão Curricularizada da UniFECAF, contatou **Cíntia Aldaci da Cruz** e propôs o desenvolvimento do app como intervenção técnica estruturada.

A Cozinha Mãe, gerida pela Associação Revolução dos Baldinhos (Rua dos Cedros, 90), atende famílias em vulnerabilidade no Complexo do Monte Cristo e está cadastrada no Programa Cozinha Solidária (CS019465).

---

## 3. Diagnóstico da realidade social

### Processo anterior (AS-IS)

- Famílias iam **um dia antes** tirar **fichas/senhas físicas**
- No dia da distribuição: conferência manual, filas longas, anotações em caderno
- **Retiradas duplicadas** na mesma semana
- **Famílias sem algum alimento** por erro de controle
- Fila de **até 2 horas ao sol**, chegando a **dar a volta no quarteirão**
- Cadastro e estoque fragmentados

### Problema delimitado

> Como digitalizar cadastro, senhas, retiradas e estoque da Cozinha Mãe para reduzir erros, organizar filas e melhorar a experiência de famílias e voluntários?

---

## 4. Solução desenvolvida

### Módulos implementados

| Módulo | Funcionalidade |
|--------|----------------|
| **Login** | Perfis Master e Admin (até 5) |
| **Dashboard** | Indicadores, gráficos, atalho RETIRADAS |
| **Cadastro de Famílias** | CRUD, busca, vagas, fila, inativação 30 dias |
| **Retiradas** | Lista automática, senhas, busca, marcação, WhatsApp |
| **Alimentos** | Estoque semanal, perdas, histórico |
| **Relatórios** | Comparativo semanal |
| **Configurações** | Nome, logo, vagas, bairros |
| **LGPD** | CPF mascarado, nome abreviado |

### Demonstração

```bash
npm install && npm start
```

Credenciais: `master@montecristo.org` / `123456`

---

## 5. Arquitetura e tecnologias

- **Frontend:** React Native 0.81 + Expo SDK 54
- **Navegação:** React Navigation 7
- **Estado:** AuthContext, AppDataContext
- **Regras de negócio:** familiaService, retiradaService, alimentoService
- **Dados:** mockDatabase (demo) + firebaseAdapter (produção)
- **BD:** Firebase Realtime Database (plano Spark — gratuito)

---

## 6. Dificuldades técnicas superadas

1. **Geração de senhas/listas** — weekKey, horários, IDs únicos
2. **Bloqueio de duplicidade** — uma retirada por família/semana
3. **Vagas e fila de espera** — promoção automática
4. **Alimentos por semana** — arquivamento e perdas vinculadas
5. **Interface simples** — uso por voluntários sem formação técnica

---

## 7. Validação com a instituição parceira

O autor apresentou **esboço e protótipo navegável** à **Cíntia Aldaci da Cruz**. A gestora **gostou da proposta**, validou a geração digital de senhas e o controle de retiradas, e reforçou a necessidade de interface simples.

**Fluxos validados:** login, dashboard, geração de lista, cadastro, alimentos, relatórios. Evidências em `08-evidencias-validacao` (prints do app em execução).

---

## 8. Métricas de impacto

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Montagem de senhas | 90–120 min | ~2 min | ~95% |
| Cadastro de família | ~15 min | ~5 min | ~67% |
| Busca na retirada | ~2 min | ~15 seg | ~87% |
| Retirada duplicada | Frequente | Bloqueada | Eliminada |
| Relatório semanal | ~45 min | Instantâneo | ~100% |
| Fila em dias de pico | Até 2h ao sol | Conferência mais rápida* | Operacional |

\* Detalhamento completo em `09-metricas-impacto`.

---

## 9. Evidências de funcionamento

Foram capturadas **9 telas** do aplicativo em execução real:

1. Login  
2. Dashboard  
3. Retirada (configuração)  
4. Retirada (lista gerada)  
5. Cadastro de famílias  
6. Alimentos  
7. Relatórios  
8. Dashboard (gráficos)  

Arquivos em `entregaveis/prints/`. Documento dedicado: `08-evidencias-validacao`.

---

## 10. Alinhamento com ODS

| ODS | Contribuição |
|-----|-------------|
| **ODS 2** | Logística de distribuição de alimentos |
| **ODS 10** | Fila de espera e vagas equitativas |
| **ODS 11** | Fortalecimento digital de OSC periférica |
| **ODS 17** | Parceria universidade-comunidade |

---

## 11. Sustentabilidade e implantação

| Serviço | Custo |
|---------|-------|
| Firebase Spark | R$ 0 permanente |
| GitHub | R$ 0 |
| Expo / Vercel | R$ 0 |

O app pode ser implantado sem mensalidade para a instituição. Instruções em `FIREBASE_SETUP.md` e `BUILD_DEPLOY_GUIDE.md`.

---

## 12. Conclusão

O **Monte Cristo Solidário** cumpre o objetivo da extensão curricularizada: aplicar competências de ADS para resolver um problema social real, com diagnóstico, solução funcional, validação, métricas e evidências. O projeto transforma uma vivência pessoal em intervenção técnica com potencial de impacto na **Cozinha Mãe** e nas famílias do Monte Cristo.

---

## 13. Referências e anexos

**Referências:** Ementa UniFECAF; Programa Cozinha Solidária; Slow Food Brasil; ODS ONU; React Native; Expo; Firebase.

**Anexos:**

| Anexo | Documento |
|-------|-----------|
| A | Relatório parcial (`07-relatorio-parcial`) |
| B | Evidências e prints (`08-evidencias-validacao`) |
| C | Métricas de impacto (`09-metricas-impacto`) |
| D | Roteiro vídeo pitch (`05-roteiro-video-pitch`) |
| E | Repositório GitHub do projeto |

---

**Kevin Maikon Caetano de Andrade Santos**  
Análise e Desenvolvimento de Sistemas — UniFECAF — Taboão da Serra, 2026.
