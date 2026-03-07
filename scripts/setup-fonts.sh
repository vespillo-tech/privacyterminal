#!/bin/bash
# Download and extract JetBrains Mono fonts for self-hosting
# This runs during CI build if fonts aren't present

FONT_DIR="public/fonts"

if [ -f "$FONT_DIR/JetBrainsMono-Regular.woff2" ]; then
  echo "Fonts already present, skipping download."
  exit 0
fi

echo "Downloading JetBrains Mono fonts..."
mkdir -p "$FONT_DIR"
curl -sL 'https://github.com/JetBrains/JetBrainsMono/releases/download/v2.304/JetBrainsMono-2.304.zip' -o /tmp/jbmono.zip
unzip -q /tmp/jbmono.zip -d /tmp/jbmono
cp /tmp/jbmono/fonts/webfonts/JetBrainsMono-Regular.woff2 "$FONT_DIR/"
cp /tmp/jbmono/fonts/webfonts/JetBrainsMono-Bold.woff2 "$FONT_DIR/"
cp /tmp/jbmono/fonts/webfonts/JetBrainsMono-Italic.woff2 "$FONT_DIR/"
cp /tmp/jbmono/fonts/webfonts/JetBrainsMono-Medium.woff2 "$FONT_DIR/"
rm -rf /tmp/jbmono /tmp/jbmono.zip
echo "Fonts installed successfully."
