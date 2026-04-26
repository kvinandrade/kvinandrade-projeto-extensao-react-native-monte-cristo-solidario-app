#!/bin/bash

# Script para gerar build web instalável

echo "🚀 Gerando Build Web para Deploy"
echo ""

cd web

echo "📦 Instalando dependências do web..."
npm install

echo ""
echo "🏗️  Compilando para produção..."
npm run build

echo ""
echo "✅ Build web gerado com sucesso!"
echo ""
echo "Arquivos prontos em: ./web/build/"
echo ""
echo "Para fazer deploy:"
echo "  - Vercel: vercel"
echo "  - Firebase: firebase deploy"
echo "  - Netlify: netlify deploy --prod --dir=build"
echo ""
