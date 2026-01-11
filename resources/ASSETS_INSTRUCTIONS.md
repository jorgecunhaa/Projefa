# Instruções para Gerar Ícones e Splash Screens

## Pré-requisitos

1. Instalar o `@capacitor/assets` (já instalado globalmente):
   ```bash
   npm install -g @capacitor/assets
   ```

## Gerar Assets

Para gerar todos os ícones e splash screens para iOS e Android:

```bash
npm run assets
```

Ou diretamente:

```bash
npx @capacitor/assets generate
```

## Estrutura de Ficheiros

Os ficheiros SVG base estão em:
- `resources/icon.svg` - Ícone da aplicação (512x512)
- `resources/splash.svg` - Splash screen (2048x2048)

## Configuração

A configuração está em `.capacitor/assets.json` e define:
- Cores de fundo (Bordô #8B0000)
- Ficheiros fonte (SVG)
- Plataformas (iOS e Android)

## Resultado

Após executar o comando, os assets serão gerados em:
- `android/app/src/main/res/` - Recursos Android
- `ios/App/App/Assets.xcassets/` - Recursos iOS

## Notas

- Os SVGs são vetoriais e podem ser editados facilmente
- A cor principal é Bordô (#8B0000)
- O ícone representa um checklist, simbolizando gestão de tarefas
- O splash screen inclui o logo e o nome "Projefa"
