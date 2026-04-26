# 🔥 Setup Firebase - Guia Passo a Passo

A janela do Firebase Console está aberto. Siga os passos abaixo com cuidado:

## 📋 Passo 1: Fazer Login no Firebase

**Na página que abriu**:
1. Clique em "Sign in" ou "Login com Google"
2. Use sua conta Google (ou crie uma se não tiver)
3. Conceda as permissões solicitadas

**Resultado esperado**: Você vê "Welcome to Firebase" ou um dashboard

---

## 🆕 Passo 2: Criar Novo Projeto

**Na página do Firebase**:

1. Clique no botão **"Create a Project"** (ou ➕ New Project)
2. Na janela que abrir, preencha:

   **Nome do Projeto**: `monte-cristo-solidario`

   **ID do Projeto**: `monte-cristo-solidario` (vai aparecer automaticamente)

3. Clique **"Continue"**

4. **Pergunta: Analytics?**
   - Se questionar sobre Google Analytics, clique **"Create Project"** (sem analytics por enquanto)

5. Aguarde... (leva ~1 minuto)

6. Clique **"Continue"** quando aparecer

**Resultado esperado**: Você entra no dashboard do seu projeto

---

## 🗄️ Passo 3: Criar Banco de Dados Realtime Database

**No dashboard do projeto**:

1. No menu esquerdo, procure **"Realtime Database"** ou vá em "Build" → "Realtime Database"

2. Clique **"Create Database"**

3. Na janela:
   
   📍 **Localização**: Escolha `southamerica-east1` (São Paulo)
   
   🔒 **Modo**: Selecione **"Start in Test Mode"**
   
   (Depois mudamos para regras de segurança)

4. Clique **"Create"**

**Resultado esperado**: Você vê uma URL como `https://monte-cristo-solidario-xxxxx.firebaseio.com/`

---

## 👤 Passo 4: Ativar Autenticação

**No menu esquerdo**:

1. Vá em "Build" → **"Authentication"**

2. Clique na aba **"Sign-in Method"**

3. Clique em **"Email and Password"**

4. Ative (toggle para ON/azul)

5. Clique **"Save"**

**Resultado esperado**: Email/Password marca como "Enabled"

---

## 🔐 Passo 5: Pegar as Credenciais

**Na página do projeto**:

1. Clique no ícone de ⚙️ (engrenagem) no topo esquerdo

2. Clique **"Project Settings"**

3. Vá para aba **"Your Apps"**

4. Clique **"Add App"** → Escolha **"</>  Web"**

5. Na janela:
   - **App nickname**: `Monte Cristo Web` (ou qualquer nome)
   - Clique **"Register App"**

6. **IMPORTANTE**: Na tela que abrir, você vai ver um código JavaScript assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "monte-cristo-solidario-xxxxx.firebaseapp.com",
  databaseURL: "https://monte-cristo-solidario-xxxxx.firebaseio.com",
  projectId: "monte-cristo-solidario",
  storageBucket: "monte-cristo-solidario-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijk",
};
```

7. **COPIE TODOS ESSES VALORES** (pode usar botão copy ou selecionar manual)

---

## 📝 Passo 6: Salvar as Credenciais no .env

**Voltando ao VS Code**:

1. Na raiz do projeto (onde está `package.json` da mobile), crie o arquivo `.env`:

```
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=monte-cristo-solidario-xxxxx.firebaseapp.com
FIREBASE_DATABASE_URL=https://monte-cristo-solidario-xxxxx.firebaseio.com
FIREBASE_PROJECT_ID=monte-cristo-solidario
FIREBASE_STORAGE_BUCKET=monte-cristo-solidario-xxxxx.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdefghijk
```

**IMPORTANTE**: Substitua os valores com os que copiou do Firebase!

---

## 🔐 Passo 7: Definir Regras de Segurança

**De volta no console Firebase**:

1. Vá em "Realtime Database"

2. Clique na aba **"Rules"**

3. **Delete o conteúdo atual** (ctrl+a, delete)

4. **Cole as regras abaixo**:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "families": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "foods": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "tickets": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "losses": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "config": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

5. Clique **"Publish"** (azul no canto superior direito)

**Resultado esperado**: "Security rules published"

---

## ✅ Passo 8: Testar a Conexão

**No VS Code**:

```bash
cd web
npm install
npm start
```

Na tela de login, teste:
- Email: `master@montecristo.org`
- Senha: `123456`

Vá para "Retirada" e gere uma lista. Se os dados aparecerem nos Realtime Database do Firebase, deu certo! ✅

---

## ⚠️ Se der erro...

**"Firebase is not defined"**
→ Reinicie com `npm start`

**"Too many requests"**
→ Firebase está bloqueando por segurança, aguarde alguns minutos

**"PERMISSION_DENIED"**
→ Verifique as regras JSON (Passo 7)

**"invalid_grant"**
→ Credenciais incorretas no `.env`

---

## 🎯 Checklist de Conclusão

- [ ] Projeto criado no Firebase (monte-cristo-solidario)
- [ ] Realtime Database criado (southamerica-east1)
- [ ] Email/Password ativado em Authentication
- [ ] Credenciais copiadas do firebaseConfig
- [ ] Arquivo `.env` criado na raiz do projeto
- [ ] Credenciais copiadas para `.env`
- [ ] Regras de segurança publicadas
- [ ] `npm install` executado
- [ ] `npm start` funcionando
- [ ] Login funciona
- [ ] Dados aparecem no Firebase (testar gerar lista em Retirada)
