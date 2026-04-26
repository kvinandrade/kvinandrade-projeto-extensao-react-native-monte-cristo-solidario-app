# 🚀 Guia de Build e Deploy - Monte Cristo Solidário

## Versão Mobile (React Native + Expo)

### Pré-requisitos

1. **Node.js** (v16 ou superior)
   ```bash
   node --version
   ```

2. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

3. **EAS CLI** (para gerar APK/IPA)
   ```bash
   npm install -g eas-cli
   ```

4. **Conta Expo** (para builds na nuvem)
   ```bash
   eas login
   ```

### Gerar APK para Android (Instalável via USB)

#### Opção A: Build Local
```bash
# Instalar EAS
npm install -g eas-cli

# Fazer login
eas login

# Gerar APK
eas build --platform android --local
```

#### Opção B: Build na Nuvem (Recomendado)
```bash
eas build --platform android
```

Os arquivos estarão em: `.expo/builds/`

### Instalação do APK em Dispositivo Android

1. **Via USB**
   ```bash
   adb install monte-cristo.apk
   ```

2. **Via QR Code**
   - Acesse `expo.dev` com seu email
   - Escaneie com o dispositivo fisicamente

3. **Compartilhamento**
   - Envie o arquivo `.apk` por WhatsApp/Email
   - Abra no dispositivo para instalar

### Gerar IPA para iOS

```bash
eas build --platform ios
```

> Requer conta Apple Developer ($99/ano)

---

## Versão Web (React)

### Pré-requisitos

1. **Node.js**
2. **npm** (incluído com Node.js)

### Build Local

```bash
cd web
npm install
npm run build
```

Os arquivos estarão em: `web/build/`

### Deploy Options

#### 1️⃣ **Vercel** (Mais rápido - Recomendado)

```bash
# Instalar
npm install -g vercel

# Na pasta raiz
vercel --prod

# Ou na pasta web
cd web
vercel --prod
```

✅ Deploy automático após git push

#### 2️⃣ **Firebase Hosting**

```bash
# Instalar
npm install -g firebase-tools

# Inicializar
firebase init

# Deploy
firebase deploy
```

#### 3️⃣ **Netlify**

```bash
# Instalar
npm install -g netlify-cli

# Deploy
cd web
netlify deploy --prod --dir=build
```

#### 4️⃣ **GitHub Pages**

```bash
# No package.json da web, adicione:
"homepage": "https://seu-usuario.github.io/monte-cristo-web/"

# Build
npm run build

# Deploy
npm install --save-dev gh-pages
npx gh-pages -d build
```

---

## Estrutura de Arquivos para Deploy

```
Versão Mobile:
- .apk (instalável em Android)
- .ipa (instalável em iOS via Testflight)

Versão Web:
- /web/build/
  - index.html
  - /static/
    - /js/
    - /css/
```

---

## Checklist Final Antes do Deploy

- [ ] Testar login em ambas versões
- [ ] Verificar geração de lista semanal (com shuffle aleatório)
- [ ] Testar criação de familias
- [ ] Testar registro de alimentos
- [ ] Verificar dados salvam corretamente
- [ ] Testar em dispositivo/navegador real
- [ ] Configurar variáveis de ambiente (.env)
- [ ] Revisar regras de segurança do Firebase
- [ ] Backup de dados

---

## Monitoramento Pós-Deploy

### Verificar se está rodando:

**Mobile:**
```bash
adb logcat | grep monte
```

**Web:**
```bash
Abrir DevTools > Console
```

### Logs do Firebase:

```bash
firebase functions:log --project=seu-projeto
```

---

## Suporte e Updates

### Para atualizar:

**Mobile (Expo):**
```bash
eas build --platform android  # Cria nova versão
```

**Web:**
```bash
cd web && npm run build && vercel --prod
```

---

## Troubleshooting

### APK não instala
```bash
# Limpar build Expo
rm -rf .expo

# Tentar novamente
eas build --platform android --clean
```

### Build web falha
```bash
cd web
rm -rf node_modules
npm install
npm run build
```

### Firebase não conecta
```bash
# Verificar .env
cat .env

# Validar credenciais em Firebase Console
```

---

## Documentação Adicional

- [Expo Docs](https://docs.expo.dev)
- [EAS Build Docs](https://docs.expo.dev/build)
- [Firebase Docs](https://firebase.google.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)
