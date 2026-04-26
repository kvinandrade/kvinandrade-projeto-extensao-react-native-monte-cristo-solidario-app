# Monte Cristo Solidario

Aplicativo mobile com React Native + Expo para gestao de distribuicao de alimentos para familias em vulnerabilidade social.

## Objetivo

- Simples para operacao diaria
- Organizado em camadas e com Clean Code
- Funciona totalmente com dados mockados
- Preparado para futura integracao Firebase

## Arquitetura aplicada

```text
/src
  /screens
    /Login
    /Dashboard
    /Retirada
    /CadastroFamilia
    /Alimentos
    /Relatorios
  /components
    /ButtonCustom
    /InputCustom
    /Card
    /Header
  /services
    authService
    familiaService
    retiradaService
    alimentoService
  /contexts
    AuthContext
    AppDataContext
  /hooks
  /utils
  /models
  /navigation
  /theme
```

## Funcionalidades implementadas

- Login mock com logo e nome dinamico
- Usuario MASTER e administradores
- MASTER cria ate 5 administradores
- Permissoes de administradores por objeto `permissions`
- Cadastro de familias com busca por CPF/nome
- Inativacao automatica apos 30 dias sem retirada
- Reativacao manual de familia
- Sistema de vagas com fila de espera automatica
- Dashboard com indicadores principais
- Botao principal "INICIAR RETIRADAS"
- Lista semanal automatica com ordem aleatoria
- Horario inicial configuravel e intervalo de 5 minutos
- Busca por CPF, nome e senha na retirada
- Marcacao de retirada em tempo real
- Bloqueio de retirada duplicada na mesma semana
- Botao "Copiar lista" e mensagem pronta para WhatsApp
- Controle de alimentos recebidos e perdas
- Calculo de perda semanal
- Relatorio semanal com comparacao da semana anterior
- Configuracoes editaveis (`nomeApp`, `logoUrl`, `vagasTotais`)
- LGPD: CPF mascarado e nome reduzido

## Modo teste

- Sem Firebase
- Dados em memoria (`src/services/mockDatabase.js`)
- Adaptador de integracao futura em `src/services/firebaseAdapter.js`

## Acesso mock

- MASTER: `master@montecristo.org` / `123456`
- ADMIN: `admin@montecristo.org` / `123456`

## Execucao

1. Instalar dependencias:
   - `npm install`
2. Iniciar projeto:
   - `npm run start`
3. Abrir no Expo Go pelo QR code

## Observacao importante

As dependencias foram alinhadas no `package.json` para o SDK do Expo. Se o ambiente local ainda mostrar aviso de versao, execute:

- `npx expo install`
