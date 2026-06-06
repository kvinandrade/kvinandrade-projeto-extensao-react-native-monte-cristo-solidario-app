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
<p class="subtitulo">Métricas de Impacto — Comparativo Antes e Depois</p>
<p class="natureza">Relatório de métricas de impacto apresentado como requisito da Parte II da disciplina Projeto Prático — Extensão Curricularizada Tech, do Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas da UniFECAF — Taboão da Serra.</p>
</div>

<div class="capa-rodape">
<p>Taboão da Serra</p>
<p>2026</p>
</div>

</div>

# Métricas de Impacto — Antes e Depois

**Projeto:** Monte Cristo Solidário  
**Autor:** Kevin Maikon Caetano de Andrade Santos  
**Instituição parceira:** Cozinha Mãe — Associação Revolução dos Baldinhos  
**Data:** Junho de 2026

---

## 1. Introdução

Este documento apresenta as **métricas de impacto** do projeto extensionista, comparando a operação **antes** (processo manual com fichas físicas) e **depois** (processo digital com o aplicativo Monte Cristo Solidário). As métricas foram construídas a partir da observação em campo (janeiro/2026), do diagnóstico com a equipe da Cozinha Mãe e da validação do protótipo com a gestora Cíntia Aldaci da Cruz.

---

## 2. Cenário ANTES — processo manual

### 2.1 Como funcionava

1. As famílias precisavam **ir até a Cozinha Mãe no dia anterior** à distribuição para retirar **fichas ou senhas físicas** em papel.
2. No dia da entrega, a equipe conferia manualmente as fichas, anotava quem passou e tentava controlar quem ainda faltava.
3. O cadastro de famílias ficava em **cadernos e planilhas**, com busca lenta.
4. O estoque de alimentos era anotado de forma **informal**, sem relatório automático.

### 2.2 Problemas mensuráveis observados

| Problema | Descrição |
|----------|-----------|
| **Fichas físicas** | Senhas de papel se perdiam, duplicavam ou eram preenchidas com erro |
| **Retirada duplicada** | Havia casos de pessoas que **retiravam alimentos mais de uma vez** na mesma semana |
| **Falta de itens** | Por falha no controle, **algumas famílias ficavam sem determinado alimento** |
| **Fila excessiva** | Em dias de pico, a espera chegava a **até 2 horas ao sol**, com fila **dando a volta no quarteirão** |
| **Cadastro lento** | Localizar uma família podia levar vários minutos |
| **Lista manual** | Montar a lista de senhas/horários levava cerca de **1h30 a 2h** por semana |
| **Sem visão em tempo real** | A gestora não tinha dashboard: não sabia na hora quantas retiradas faltavam |

---

## 3. Cenário DEPOIS — com o Monte Cristo Solidário

### 3.1 O que o app mudou

| Processo | Solução digital |
|----------|-----------------|
| Senhas/fichas | Geração **automática** de lista com horários em segundos |
| Quem já retirou | Marcação **em tempo real** + dashboard atualizado |
| Duplicidade | **Bloqueio automático** — uma retirada por família/semana |
| Cadastro | Busca por **CPF, nome ou senha** em segundos |
| Estoque | Módulo de **alimentos e perdas** com histórico semanal |
| Comunicação | Mensagem da lista **pronta para WhatsApp** |
| Fila | Horários organizados digitalmente reduzem confusão e remanejamento manual |

### 3.2 Melhorias diretas para a fila

Embora o app não elimine a fila física por si só, ele ataca as causas da demora:

- **Menos erro na conferência** → atendimento mais rápido no balcão
- **Senhas organizadas por horário** → menos aglomeração desordenada
- **Busca instantânea** → reduz tempo por família atendida
- **Menos retrabalho** → equipe focada no atendimento, não em planilhas

---

## 4. Tabela comparativa de métricas

| Métrica | ANTES (manual) | DEPOIS (app) | Melhoria estimada |
|---------|----------------|--------------|-------------------|
| Tempo para montar lista de senhas | 90–120 min/semana | ~2 min | **~95% redução** |
| Tempo de cadastro de 1 família | ~15 min | ~5 min | **~67% redução** |
| Tempo de busca na retirada | ~2 min/família | ~15 seg | **~87% redução** |
| Retirada duplicada na semana | Ocorria com frequência | Bloqueio automático | **Eliminação do problema** |
| Famílias sem item por erro de controle | Ocorria | Rastreio por ticket | **Redução significativa** |
| Perda de fichas/senhas físicas | Frequente | Senhas digitais | **Eliminação do problema** |
| Visibilidade de quem já retirou | Nenhuma em tempo real | Dashboard ao vivo | **De 0% para 100%** |
| Relatório semanal | ~45 min de retrabalho | Gerado na hora | **~100% redução** |
| Qualidade dos dados | Fragmentada (papel/planilha) | Centralizada e pesquisável | **Alta melhoria** |
| Tempo médio de fila em dias de pico | Até **2 horas** ao sol | Potencial de queda com conferência mais rápida* | **Melhoria operacional** |

\* A fila física depende também de volume de famílias e estrutura do local; o app reduz o tempo de cada atendimento e a confusão de senhas, o que impacta positivamente o tempo total.

---

## 5. Indicadores de qualidade de dados

| Indicador | Antes | Depois |
|-----------|-------|--------|
| Cadastro duplicado | Possível | Busca evita duplicidade |
| CPF desatualizado | Comum | Registro único pesquisável |
| Histórico de retiradas | Incompleto | Tickets por semana |
| Estoque da semana | Impreciso | `foodWeeklyEntries` |
| Perdas registradas | Informal | Módulo de perdas com motivo |

---

## 6. Impacto social

| Dimensão | Impacto |
|----------|---------|
| **Dignidade** | Menos tempo de espera ao sol em filas desorganizadas |
| **Equidade** | Controle de vagas e fila de espera mais justo |
| **Segurança alimentar** | Menos famílias sem item por erro operacional |
| **Eficiência da OSC** | Equipe gasta menos tempo em papel e mais no atendimento |
| **ODS 2 (Fome zero)** | Melhor logística de distribuição |
| **ODS 10 (Desigualdades)** | Organização equitativa de vagas e senhas |

---

## 7. Evidência visual do sistema

A operação digital está documentada nos prints do aplicativo (ver documento `08-evidencias-validacao`):

- Geração de lista de senhas (Figuras 3 e 4)
- Dashboard com retiradas (Figuras 2 e 8)
- Cadastro centralizado (Figura 5)

---

## 8. Conclusão

O comparativo demonstra que o **Monte Cristo Solidário** ataca diretamente os problemas que eu presenciei na Cozinha Mãe: **fichas físicas com erro**, **retiradas duplicadas**, **famílias prejudicadas por falha no controle** e **filas longas agravadas por conferência manual lenta**. As métricas indicam redução drástica de tempo operacional e melhoria na qualidade dos dados — com potencial de impacto real na experiência das famílias beneficiárias.

---

**Kevin Maikon Caetano de Andrade Santos**  
Análise e Desenvolvimento de Sistemas — UniFECAF — Taboão da Serra, 2026.
