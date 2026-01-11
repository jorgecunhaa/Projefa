# Instruções de Build - Projefa

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Ionic CLI: `npm install -g @ionic/cli`
- Android Studio (para build Android)
- Xcode (para build iOS, apenas macOS)

## Build para Web

```bash
# Instalar dependências
npm install

# Build de produção
npm run build

# Os ficheiros estarão em: www/
```

## Build para Android

```bash
# Adicionar plataforma Android (apenas primeira vez)
ionic capacitor add android

# Sincronizar código
npx cap sync

# Abrir no Android Studio
npx cap open android

# No Android Studio:
# - Build > Build Bundle(s) / APK(s)
# - Ou Run > Run 'app'
```

## Build para iOS

```bash
# Adicionar plataforma iOS (apenas primeira vez)
ionic capacitor add ios

# Sincronizar código
npx cap sync

# Abrir no Xcode
npx cap open ios

# No Xcode:
# - Product > Archive
# - Ou Run > Run
```

## Gerar Ícones e Splash Screens

```bash
# Gerar todos os assets necessários
npm run assets

# Ou diretamente
npx @capacitor/assets generate
```

## Testes

```bash
# Executar testes unitários
npm test

# Verificar código (lint)
npm run lint
```

## Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm start

# Ou
ionic serve
```

## Notas Importantes

1. **Primeira execução**: O seed será executado automaticamente e criará dados de exemplo
2. **SQLite**: Funciona apenas em dispositivos nativos (Android/iOS)
3. **Web**: Usa Ionic Storage como fallback
4. **Notificações**: Requerem permissões no dispositivo
5. **Câmera**: Requer permissões no dispositivo

## Troubleshooting

### Erro ao sincronizar Capacitor
```bash
# Limpar e reinstalar
rm -rf node_modules
npm install
npx cap sync
```

### Erro de build Android
- Verificar se Android Studio está atualizado
- Verificar se o SDK está instalado
- Limpar projeto: `cd android && ./gradlew clean`

### Erro de build iOS
- Verificar se Xcode está atualizado
- Verificar certificados de desenvolvimento
- Limpar build: `cd ios && xcodebuild clean`
