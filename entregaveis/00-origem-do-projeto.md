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
<p class="natureza">Documento de contextualização apresentado no âmbito da disciplina Projeto Prático — Extensão Curricularizada Tech, do Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas da UniFECAF — Taboão da Serra.</p>
</div>

<div class="capa-rodape">
<p>Taboão da Serra</p>
<p>2026</p>
</div>

</div>

# Origem do Projeto — Como tudo começou

**Projeto:** Monte Cristo Solidário  
**Autor:** Kevin Maikon Caetano de Andrade Santos  
**Curso:** Análise e Desenvolvimento de Sistemas — UniFECAF — Taboão da Serra  
**Data:** Janeiro–Junho de 2026

---

## 1. Um impacto pessoal que virou projeto de extensão

Em **janeiro de 2026**, passei férias em **Florianópolis**, no bairro **Monte Cristo**. Durante esse período, fiquei na casa de uma amiga cuja família era **beneficiária da Cozinha Mãe** — cozinha comunitária gerida pela Associação Revolução dos Baldinhos, que distribui alimentos para famílias em situação de vulnerabilidade no Complexo do Monte Cristo.

Não foi apenas uma história que ouvi de longe: **vivi aquela realidade**. Em uma das semanas em que estive lá, fui junto com minha amiga **ajudar a buscar os alimentos** no dia de retirada. Foi nesse momento — e nas semanas seguintes em que acompanhei de perto a rotina da família — que comecei a perceber, na prática, as dificuldades enfrentadas pela equipe e pelos beneficiários.

---

## 2. O que observei no dia a dia

Durante minha estadia no bairro, identifiquei **quatro dificuldades centrais** na operação da Cozinha Mãe:

| # | Dificuldade observada | O que acontecia na prática |
|---|----------------------|---------------------------|
| 1 | **Controle de cadastro de famílias** | Informações espalhadas em cadernos e planilhas, busca lenta por nome ou CPF, risco de cadastro duplicado |
| 2 | **Controle de alimentos** | Registro informal do que chegava e do que era distribuído, sem visão clara do estoque da semana |
| 3 | **Saber quem já retirou** | No dia da retirada, a equipe tinha dificuldade em confirmar rapidamente quem já havia passado e quem ainda faltava |
| 4 | **Sistema de senhas que funcionasse** | A geração e organização das senhas/horários de retirada era feita de forma manual, gerando confusão, filas desorganizadas e até tentativas de retirada em duplicidade na mesma semana |

Essas observações não vieram de um relatório genérico — foram vividas **no balcão de atendimento**, na fila, na conversa com voluntários e na rotina semanal da minha amiga esperando a vez de buscar os alimentos.

---

## 3. Da experiência vivida ao Projeto Prático da UniFECAF

Quando retornei das férias e comecei a disciplina de **Projeto Prático — Extensão Curricularizada Tech** na UniFECAF, **lembrei imediatamente da Cozinha Mãe**. A temática de *Digitalização e Automação de Processos Sociais* descrevia exatamente o que eu tinha visto: gargalos operacionais, fluxos manuais e burocracia em uma instituição social real.

Apesar de já ter terminado as férias e não morar em Florianópolis, senti que **precisava ajudar**. Tinha sido impactado diretamente pelo projeto nas semanas em que estive na casa da minha amiga — e sabia que uma solução tecnológica simples poderia fazer diferença real na rotina da equipe.

---

## 4. Contato com a Cíntia e início da parceria

Entrei em contato com **Cíntia Aldaci da Cruz**, criadora da Cozinha Mãe e presidente da Associação Revolução dos Baldinhos, e **ofereci minha ajuda** para desenvolver uma ferramenta digital que resolvesse as dificuldades que eu havia observado.

A proposta foi apresentada como um **projeto de extensão universitária**: diagnóstico, desenvolvimento de um MVP funcional e validação com a equipe. Cíntia demonstrou interesse e disponibilidade para orientar o levantamento de requisitos com base na rotina real da cozinha.

---

## 5. O que foi desenvolvido a partir dessas dores

Com base no que vivi e no que alinhei com a equipe da Cozinha Mãe, desenvolvi o aplicativo **Monte Cristo Solidário**. Cada módulo do sistema responde diretamente a uma das dificuldades identificadas:

| Dificuldade observada | Solução implementada no app |
|----------------------|----------------------------|
| Cadastro de famílias desorganizado | Módulo **Cadastro de Famílias** com busca por CPF/nome, controle de vagas, fila de espera e inativação automática |
| Controle de alimentos informal | Módulo **Alimentos** com registro de caixas recebidas, perdas semanais e histórico por semana |
| Não saber quem já retirou | Módulo **Retiradas** com marcação em tempo real, bloqueio de duplicidade na mesma semana e dashboard com indicadores |
| Sistema de senhas que não funcionava bem | Geração **automática de lista semanal** com horários, ordem organizada, busca por CPF/senha na retirada e mensagem pronta para WhatsApp |

Além disso, o app inclui:
- **Dashboard** com visão geral da operação
- **Relatórios semanais** comparativos
- **Perfis de acesso** (master e administradores)
- **Proteção de dados** (CPF mascarado, nome abreviado — LGPD)
- **Infraestrutura gratuita** (Firebase plano Spark) para a instituição não ter custo

---

## 6. Por que essa história importa para a extensão

Este projeto não nasceu de uma instituição escolhida ao acaso para cumprir uma disciplina. Nasceu de uma **experiência vivida**, de um **vínculo real com beneficiários** e de uma **vontade concreta de devolver** à comunidade que me acolheu durante as férias.

A extensão curricularizada, neste caso, é exatamente o que a ementa propõe: **intervenção técnica estruturada** a partir de um problema social diagnosticado na realidade — com solução, validação e impacto mensurável.

---

*Documento de contextualização — Kevin Maikon Caetano de Andrade Santos. Projeto Prático, Extensão Curricularizada Tech, UniFECAF — Taboão da Serra, 2026.*
