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
<p class="natureza">Relatório de diagnóstico apresentado como requisito da disciplina Projeto Prático — Extensão Curricularizada Tech, do Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas da UniFECAF — Taboão da Serra.</p>
</div>

<div class="capa-rodape">
<p>Taboão da Serra</p>
<p>2026</p>
</div>

</div>

# Relatório de Diagnóstico

**Projeto:** Sistema de Gestão Solidária — Monte Cristo Solidário  
**Instituição parceira:** Cozinha Mãe / Associação Revolução dos Baldinhos  
**Autor:** Kevin Maikon Caetano de Andrade Santos  
**Curso:** Análise e Desenvolvimento de Sistemas — UniFECAF — Taboão da Serra  
**Data:** Junho de 2026

---

## 1. Objetivo do diagnóstico

Mapear o fluxo operacional atual da Cozinha Mãe para identificar gargalos no **cadastro de famílias**, **controle de alimentos**, **rastreio de retiradas** e **sistema de senhas/horários**, fundamentando o desenvolvimento de uma solução tecnológica viável (MVP social).

---

## 2. Contexto: como o diagnóstico começou

O diagnóstico não partiu de pesquisa de mesa. Em **janeiro de 2026**, durante férias no bairro **Monte Cristo** (Florianópolis/SC), o autor conviveu com uma amiga cuja família é beneficiária da Cozinha Mãe. Em um dia de distribuição, **acompanhou a retirada de alimentos** para ajudar. Nas semanas seguintes, observou repetidamente as mesmas dificuldades:

- A equipe demorava para encontrar o cadastro de uma família
- Não havia clareza sobre quantos alimentos tinham chegado e quantos restavam
- No dia da retirada, era difícil saber **quem já havia passado** e quem ainda faltava
- O **sistema de senhas e horários** era montado manualmente e frequentemente gerava confusão na fila

Ao retornar das férias e iniciar o Projeto Prático da UniFECAF, o autor contatou **Cíntia Aldaci da Cruz** (criadora da Cozinha Mãe) e formalizou a proposta de extensão, complementando as observações vividas com levantamento estruturado junto à equipe.

---

## 3. Metodologia

| Etapa | Ação realizada |
|-------|----------------|
| Imersão pessoal | Acompanhamento da retirada com família beneficiária (jan/2026, Monte Cristo) |
| Observação contínua | Registro das dores ao longo das semanas de convivência no bairro |
| Contato institucional | Conversa com Cíntia Aldaci da Cruz sobre viabilidade e escopo |
| Entrevista | Alinhamento com gestora/responsável operacional sobre rotina semanal |
| Mapeamento | Desenho do fluxo "como é hoje" (AS-IS) |
| Priorização | Delimitação do escopo mínimo da solução (MVP) |

---

## 4. Fluxo operacional atual (AS-IS)

### 4.1 Cadastro de famílias

```
Beneficiário chega → Atendente anota em caderno/planilha
→ Verifica bairro manualmente → Define se entra como ativo ou em espera
→ Arquivo fica disperso (sem busca rápida por CPF)
```

**Problemas identificados:**
- Busca por nome ou CPF lenta e sujeita a erro
- Dados duplicados ou desatualizados
- Sem alerta automático para famílias inativas (sem retirada há muito tempo)
- Controle de vagas e fila de espera feito manualmente

### 4.2 Distribuição semanal (retiradas) e sistema de senhas

```
Início da semana → Montagem manual da lista de famílias
→ Definição de senhas/horários no papel → Divulgação por WhatsApp
→ No dia: conferência por nome/CPF/senha → Marcação manual de quem retirou
```

**Problemas identificados** *(observados pessoalmente em janeiro/2026)*:
- Lista semanal e **geração de senhas** levam **cerca de 1h30 a 2h** para ser montadas
- Senhas e horários organizados manualmente geram **confusão na fila** no dia da retirada
- Risco de **retirada duplicada** na mesma semana
- Dificuldade em saber, em tempo real, **quem já pegou os alimentos** e quantas retiradas faltam
- Mensagem para WhatsApp precisa ser montada manualmente

### 4.3 Controle de alimentos

```
Doação chega → Registro em caderno → Distribuição ao longo da semana
→ Perdas anotadas informalmente → Sem comparativo semanal estruturado
```

**Problemas identificados:**
- Estoque sem visão consolidada por semana
- Perdas sem cálculo automático
- Relatórios para prestação de contas exigem retrabalho

---

## 5. Dores priorizadas (matriz de impacto)

| Dor (observada em campo) | Impacto | Frequência | Prioridade |
|--------------------------|---------|------------|------------|
| Cadastro lento e desorganizado | Alto | Diária | **Alta** |
| Sistema de senhas/horários manual | Alto | Semanal | **Alta** |
| Não saber quem já retirou | Alto | Semanal | **Alta** |
| Lista semanal montada à mão | Alto | Semanal | **Alta** |
| Controle de alimentos informal | Alto | Semanal | **Alta** |
| Controle de vagas/fila manual | Médio | Semanal | **Média** |
| Relatório de perdas e estoque | Médio | Semanal | **Média** |
| Comunicação WhatsApp manual | Médio | Semanal | **Média** |

---

## 6. Requisitos levantados com a instituição

### Funcionais
- Cadastrar, editar, inativar e reativar famílias
- Buscar por CPF, nome ou telefone
- Limitar cadastro ao bairro Monte Cristo (configurável)
- Gerar lista semanal automática com senhas e horários
- Buscar beneficiário por CPF, nome ou senha na retirada
- Marcar retirada em tempo real (saber quem já pegou)
- Impedir segunda retirada na mesma semana
- Controlar vagas e fila de espera
- Registrar alimentos recebidos e perdas
- Gerar relatório semanal comparativo
- Copiar lista formatada para WhatsApp
- Perfis de acesso (master e administradores)

### Não funcionais
- Interface simples para uso em celular
- Proteção de dados sensíveis (LGPD: CPF mascarado)
- Baixo custo de infraestrutura (instituição sem orçamento de TI)
- Possibilidade de uso por mais de um atendente

---

## 7. Personas identificadas

| Persona | Papel | Necessidade principal |
|---------|-------|----------------------|
| **Gestora** | Coordena operação e vagas | Visão geral: quantas famílias ativas, retiradas da semana, perdas |
| **Atendente** | Opera retirada no balcão | Busca rápida e marcação de retirada |
| **Voluntário admin** | Cadastra novas famílias | Formulário simples com validação de bairro |

---

## 8. Restrições e considerações

- Equipe com **baixa familiaridade** com sistemas complexos
- Conectividade móvel **intermitente** em parte do território
- Instituição **sem verba** para software pago ou servidores dedicados
- Dados pessoais de famílias vulneráveis exigem **cuidado com LGPD**

---

## 9. Conclusão do diagnóstico

O diagnóstico — iniciado na vivência pessoal de janeiro/2026 e aprofundado com a equipe da Cozinha Mãe e com Cíntia Aldaci da Cruz — confirmou que a principal necessidade é **automatizar e centralizar** quatro frentes: cadastro de famílias, controle de alimentos, rastreio de retiradas e geração de senhas/horários.

A solução proposta — aplicativo **Monte Cristo Solidário** — ataca diretamente cada dor observada no campo, com um MVP enxuto, testável e adaptado à realidade de uma OSC.

O problema está **delimitado** e é **tecnicamente viável** dentro do escopo de um projeto de extensão curricularizada.

---

*Kevin Maikon Caetano de Andrade Santos. Análise e Desenvolvimento de Sistemas. UniFECAF — Taboão da Serra, 2026.*
