# Firebase — passo único (30 segundos)

O banco está **bloqueado** e o app não consegue gravar na nuvem até você publicar as regras abaixo.

## Automático (recomendado)

No PowerShell, na pasta do projeto:

```powershell
.\scripts\publicar-regras-firebase.ps1
```

Isso **copia as regras** e **abre o Firebase** no navegador. Só falta **Ctrl+V** e clicar em **Publicar**.

## Depois de publicar

Zere os dados de teste:

```bash
node scripts/fix-firebase.mjs
```

## Regras (se precisar colar manualmente)

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Link direto: https://console.firebase.google.com/project/monte-cristo-solidario/database/monte-cristo-solidario-default-rtdb/rules

## Como testar

1. Instale o **APK novo** (link em `ENTREGA_CINTIA.md`)
2. Login: `master@montecristo.org` / `CozinhaMae2026!`
3. Cadastre uma família → feche e abra o app → deve continuar lá
4. Em outro celular Android com o mesmo APK → mesma família aparece
