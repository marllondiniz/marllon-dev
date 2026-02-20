#!/bin/bash

# Script para gerar todos os ícones necessários para SEO e PWA
# Requer ImageMagick instalado: brew install imagemagick

echo "🎨 Gerando ícones para SEO e PWA..."
echo ""

# Verificar se ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick não está instalado!"
    echo "📦 Instale com: brew install imagemagick"
    echo ""
    echo "Ou use as ferramentas online recomendadas no GUIA-ICONES-SEO.md"
    exit 1
fi

# Verificar se o logo existe
if [ ! -f "public/logo.png" ]; then
    echo "❌ Logo não encontrado em public/logo.png"
    echo "Por favor, adicione um logo primeiro."
    exit 1
fi

echo "✅ ImageMagick encontrado!"
echo "✅ Logo encontrado!"
echo ""

# Criar pasta temporária
mkdir -p public/temp

# Gerar favicon.ico (32x32)
echo "📦 Gerando favicon.ico (32x32)..."
convert public/logo.png -resize 32x32 -background transparent -flatten public/favicon.ico

# Gerar icon.png (512x512)
echo "📦 Gerando icon.png (512x512)..."
convert public/logo.png -resize 512x512 -background transparent -flatten public/icon.png

# Gerar apple-icon.png (180x180)
echo "📦 Gerando apple-icon.png (180x180)..."
convert public/logo.png -resize 180x180 -background transparent -flatten public/apple-icon.png

# Gerar icon-192.png (192x192) para PWA
echo "📦 Gerando icon-192.png (192x192)..."
convert public/logo.png -resize 192x192 -background transparent -flatten public/icon-192.png

# Gerar icon-512.png (512x512) para PWA
echo "📦 Gerando icon-512.png (512x512)..."
convert public/logo.png -resize 512x512 -background transparent -flatten public/icon-512.png

echo ""
echo "✨ Ícones gerados com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Criar og-image.png (1200x630) manualmente"
echo "   Use: https://www.opengraph.xyz/ ou Canva"
echo ""
echo "2. Criar screenshot.png (1280x720) do seu site"
echo "   Tire um print da página principal"
echo ""
echo "3. Configurar Google Search Console"
echo "   Adicione o código de verificação em app/layout.tsx"
echo ""
echo "4. Testar com: npm run dev"
echo "   Acesse: http://localhost:3000"
echo ""
echo "🚀 Pronto para deploy!"
