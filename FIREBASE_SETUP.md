# Configuração do Firebase

## Passo 1: Criar Projeto no Firebase

1. Acesse [https://console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Criar novo projeto"
3. Entre com um nome (ex: `monte-cristo-solidario`)
4. Desabilite Google Analytics (opcional)
5. Aguarde a criação

## Passo 2: Adicionar Banco de Dados Realtime

1. No console do Firebase, clique em "Realtime Database"
2. Clique em "Criar banco de dados"
3. Escolha a região: `southamerica-east1` (São Paulo)
4. Escolha "Começar no modo de teste" (depois você configura regras)
5. Aguarde a criação

## Passo 3: Configurar Regras de Segurança

1. Vá para "Realtime Database" > "Regras"
2. Substitua todo o conteúdo por:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'MASTER'"
      }
    },
    "families": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "tickets": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "foods": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "losses": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "config": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'MASTER'"
    }
  }
}
```

3. Clique em "Publicar"

## Passo 4: Habilitar Autenticação Email/Senha

1. Vá para "Authentication"
2. Clique em "Sign-in method"
3. Habilite "Email/Senha"
4. Crie os usuários de teste:
   - Email: `master@montecristo.org`, Senha: `123456`
   - Email: `admin@montecristo.org`, Senha: `123456`

## Passo 5: Copiar Credenciais

1. Vá para "Configurações do Projeto" (engrenagem)
2. Copie as credenciais da seção "SDK do Firebase"
3. Crie um arquivo `.env` na raiz do projeto
4. Cole as credenciais (use `.env.example` como referência)

## Passo 6: Instalar Dependências

```bash
npm install
```

## Passo 7: Inicializar Firebase no App

O Firebase será inicializado automaticamente quando você iniciar o app. Você pode também chamar manualmente:

```javascript
import { firebaseAdapter } from "./src/services/firebaseAdapter";
firebaseAdapter.init();
```

## Estrutura do Banco de Dados

```
monte-cristo-solidario/
├── users/
│   └── {userID}/
│       ├── nome
│       ├── email
│       ├── role
│       ├── permissions
│       └── ativo
├── families/
│   └── {familyID}/
│       ├── nome
│       ├── cpf
│       ├── telefone
│       ├── status
│       ├── lastWithdrawalAt
│       └── ...
├── tickets/
│   └── {ticketID}/
│       ├── familyId
│       ├── senha
│       ├── horario
│       ├── retiradaRealizada
│       └── ...
├── foods/
│   └── {foodID}/
│       ├── nome
│       ├── caixasRecebidas
│       └── itensPorCaixa
├── losses/
│   └── {lossID}/
│       ├── foodId
│       ├── quantidade
│       └── reason
└── config/
    ├── nomeApp
    ├── logoUrl
    ├── vagasTotais
    └── bairrosPermitidos
```

## Dados de Teste

Você também pode carregar dados de teste manualmente no console do Firebase ou usar a API fornecida.

## Verificação

Para verificar se está funcionando:

1. Inicie o app: `npm start`
2. Faça login com `master@montecristo.org` / `123456`
3. Veja se os dados carregam/salvam no Firebase
