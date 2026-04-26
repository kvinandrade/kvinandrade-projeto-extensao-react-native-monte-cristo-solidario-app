#!/bin/bash

# Script para gerar APK instalável do app Monte Cristo Solidário

echo "🚀 Gerando Build Instalável para Android/iOS"
echo ""

# Verificar se Expo está instalado
if ! command -v eas &> /dev/null; then
    echo "⚠️  EAS CLI não está instalado. Instalando..."
    npm install -g eas-cli
fi

echo "📦 Instalando dependências..."
npm install

echo ""
echo "🏗️  Compilando para produção..."

# Opção 1: Gerar APK para Android
echo ""
echo "Escolha uma opção:"
echo "1) Gerar APK para Android"
echo "2) Gerar IPA para iOS"
echo "3) Gerar ambos"
echo ""
read -p "Opção (1-3): " option

case $option in
  1)
    echo "📱 Gerando APK para Android..."
    eas build --platform android --non-interactive
    ;;
  2)
    echo "🍎 Gerando IPA para iOS..."
    eas build --platform ios --non-interactive
    ;;
  3)
    echo "📱 Gerando APK para Android..."
    eas build --platform android --non-interactive
    echo ""
    echo "🍎 Gerando IPA para iOS..."
    eas build --platform ios --non-interactive
    ;;
  *)
    echo "Opção inválida"
    exit 1
    ;;
esac

echo ""
echo "✅ Build gerado com sucesso!"
echo ""
echo "Os arquivos estão prontos para instalação."
