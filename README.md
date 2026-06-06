# Monte Cristo Solidário

App mobile (React Native + Expo) para gestão da distribuição semanal de alimentos da **Cozinha Mãe** — cozinha comunitária do bairro Monte Cristo, Florianópolis/SC.

## Funcionalidades

- Cadastro e busca de famílias
- Geração de senhas/horários de retirada
- Controle de alimentos e perdas
- Relatórios e dashboard
- Gestão de usuários e permissões

## Como rodar

```bash
npm install
# copie .env.example para .env e preencha o Firebase
npm start
```

Use o **Expo Go** no celular ou pressione `w` para abrir no navegador.

## Acesso para avaliação

Credenciais de **demonstração** (perfil administrador), usadas apenas para testes do projeto:

| Campo | Valor |
|-------|-------|
| E-mail | `master@montecristo.org` |
| Senha temporária | `CozinhaMae2026!` |

Na implantação real, a instituição define usuários e senhas pelo próprio app (Configurações → Gestão de Administradores).

## Gerar APK (Android)

```bash
npx eas-cli build --platform android --profile preview
```

## Autor

Kevin Maikon Caetano de Andrade Santos — kevinmaikonandrade@gmail.com
