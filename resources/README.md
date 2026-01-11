# Recursos de Ícone e Splash Screen

Esta pasta contém os recursos base para gerar os ícones e splash screens da aplicação.

## Estrutura

- `icon.svg` - Ícone base em SVG (512x512)
- `splash.svg` - Splash screen base em SVG (2048x2048)

## Geração de Assets

Para gerar os assets para todas as plataformas, execute:

```bash
npx @capacitor/assets generate
```

Este comando irá:
1. Gerar ícones em todos os tamanhos necessários para iOS e Android
2. Gerar splash screens em todos os tamanhos necessários
3. Colocar os ficheiros nas pastas corretas do projeto

## Requisitos

- Node.js instalado
- @capacitor/assets instalado (já incluído no projeto)

## Notas

- Os ficheiros SVG são vetoriais e podem ser escalados sem perda de qualidade
- A cor principal utilizada é Bordô (#8B0000)
- O ícone representa um checklist, simbolizando gestão de tarefas
