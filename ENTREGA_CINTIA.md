# Entrega do app para a Cíntia

## Recomendação: entregar **zerado**

O app deve ir **sem famílias cadastradas** para a Cíntia cadastrar as famílias reais da Cozinha Mãe. Dados de demonstração (nomes fictícios) só confundem.

**Antes de enviar à Cíntia**, rode uma vez: `.\scripts\publicar-regras-firebase.ps1` → Ctrl+V → Publicar no Firebase. Depois: `node scripts/fix-firebase.mjs` para zerar dados de teste.

O APK novo salva no celular mesmo sem nuvem; com Firebase configurado, **todos os celulares ficam sincronizados**.

---

## Link do APK (Android)

```
https://expo.dev/artifacts/eas/tiCvMNYMivRJLxRHxrqTa6.apk
```

Arquivo local: `dist/MonteCristoSolidario.apk`

---

## Mensagem pronta para WhatsApp (copiar e enviar)

```
Olá Cíntia! 💚

Segue o aplicativo Monte Cristo Solidário para ajudar no cadastro de famílias, senhas e retiradas da Cozinha Mãe.

⚠️ IMPORTANTE: só funciona em celular ANDROID (Samsung, Motorola, Xiaomi etc.). Não instala em iPhone.

📲 COMO INSTALAR:
1. Abra este link NO CELULAR ANDROID (não no iPhone):
https://expo.dev/artifacts/eas/tiCvMNYMivRJLxRHxrqTa6.apk

2. Se o celular pedir, permita "Instalar apps desconhecidos"
3. Toque em Instalar
4. Abra o app "Monte Cristo Solidário"

🔐 PRIMEIRO ACESSO (só você, como coordenadora):
O app não vem com login preenchido. Eu te mando o e-mail e senha Master em particular, só na primeira vez.
Não compartilhe esse acesso — crie usuários separados para cada voluntário (explico abaixo).

📋 O APP VEM ZERADO — como deve ser:
Você cadastra as famílias reais da cozinha. Não tem ninguém pré-cadastrado.

👥 CRIAR USUÁRIOS E CONTROLAR ACESSOS:
Você (Master) pode cadastrar até 5 administradores e definir o que cada um pode fazer.

• Dashboard → Configurações → Gestão de Administradores
• Role até o fim e toque em "Criar administrador"
• Preencha: nome da pessoa, e-mail e senha inicial
• A pessoa entra no app com o e-mail e senha que você criou

Para BLOQUEAR o acesso de alguém:
• Na mesma tela, desligue o botão "Ativo" ao lado do nome
• Ela não consegue mais entrar no app

Para CONTROLAR permissões de cada um:
• Use os botões em cada usuário:
  - Cadastrar famílias
  - Editar famílias
  - Visualizar dados
  - Gerar listas de retirada

Recomendo: um usuário para cada voluntário, sem dividir o login Master.

COMO USAR NO DIA A DIA:

1️⃣ CADASTRAR FAMÍLIAS
• No Dashboard → "Cadastro de Famílias"
• Toque em "Nova família"
• Preencha nome, CPF, telefone e endereço (bairro Monte Cristo)
• Salvar

2️⃣ GERAR SENHAS DA SEMANA
• No Dashboard → botão "RETIRADAS"
• Escolha a data e o horário de início
• Toque em "Gerar lista semanal"
• O app cria as senhas/horários automaticamente
• Use "Copiar lista" para colar no WhatsApp das famílias

3️⃣ NO DIA DA RETIRADA
• Abra RETIRADAS
• Busque por CPF, nome ou senha
• Toque em "Marcar retirada" quando a pessoa pegar os alimentos
• O app mostra quem já retirou e impede pegar duas vezes na mesma semana

4️⃣ ALIMENTOS
• Dashboard → "Controle de Alimentos"
• Cadastre o que chegou (arroz, feijão etc.) e eventuais perdas

5️⃣ RELATÓRIOS
• Dashboard → "Relatórios" para ver resumo da semana

📶 Precisa de internet (Wi-Fi ou dados) para salvar os dados. É tudo gratuito, sem mensalidade.

Qualquer dúvida, me chama!
```

---

## Credenciais (enviar em particular, não no grupo)

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Master (só Cíntia) | master@montecristo.org | CozinhaMae2026! |

Enviar o login Master **em mensagem privada**, não na mensagem do grupo. Depois ela cria os demais usuários pelo app.

---

## iPhone

O APK **não funciona** em iPhone. Se precisar no futuro, usar versão web no navegador.
