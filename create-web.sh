#!/bin/bash

# Script para criar a versão web do aplicativo

echo "📦 Criando versão web do Monte Cristo Solidário..."
echo ""

# Verificar se node/npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Por favor, instale Node.js"
    exit 1
fi

# Criar estrutura do projeto web
echo "📁 Criando estrutura de pastas..."
mkdir -p web

cd web

# Criar package.json
echo "📝 Criando package.json..."
cat > package.json << 'EOF'
{
  "name": "monte-cristo-web",
  "version": "1.0.0",
  "description": "Monte Cristo Solidário - Webapp para gestão de distribuição de alimentos",
  "private": true,
  "homepage": "./",
  "dependencies": {
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-router-dom": "^6.20.0",
    "firebase": "^10.0.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "serve": "serve -s build",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "react-scripts": "5.0.1"
  }
}
EOF

echo ""
echo "✅ Estrutura web criada com sucesso!"
echo ""
echo "Para instalar e rodar:"
echo "  cd web"
echo "  npm install"
echo "  npm start"
echo ""
echo "Para compilar para produção:"
echo "  npm run build"
echo ""
