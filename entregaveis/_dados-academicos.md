# Dados acadêmicos (referência interna)

| Campo | Valor |
|-------|-------|
| **Autor** | Kevin Maikon Caetano de Andrade Santos |
| **Curso** | Análise e Desenvolvimento de Sistemas |
| **Instituição** | UniFECAF — Taboão da Serra |
| **Disciplina** | Projeto Prático — Extensão Curricularizada Tech |
| **Cidade** | Taboão da Serra |
| **Ano** | 2026 |

## Gerar PDFs com capa ABNT

```bash
cd entregaveis
npx md-to-pdf *.md --stylesheet abnt-style.css
```

Ou documento individual:

```bash
npx md-to-pdf 07-relatorio-parcial.md --stylesheet abnt-style.css
```
