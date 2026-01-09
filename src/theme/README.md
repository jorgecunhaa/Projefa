# Tema Projefa

Este diretório contém os ficheiros de tema e estilos globais da aplicação Projefa.

## Ficheiros

- **variables.scss**: Define as cores do tema Bordô e variáveis CSS customizadas
- **animations.scss**: Contém todas as animações e transições da aplicação
- **global.scss**: Estilos globais importados no `src/global.scss`

## Cores Principais

- **Bordô Primário**: `#8B0000`
- **Bordô Claro**: `#B22222`
- **Bordô Escuro**: `#5C0000`

## Animações Disponíveis

- `fade-in` / `fade-out`: Fade suave
- `slide-in-left` / `slide-in-right`: Deslizar horizontalmente
- `slide-in-up` / `slide-in-down`: Deslizar verticalmente
- `scale-in` / `scale-out`: Escalar elementos
- `bounce`: Efeito de bounce
- `pulse`: Efeito de pulso
- `shake`: Efeito de agitar
- `rotate`: Rotação contínua

## Uso

Para usar as cores customizadas:

```html
<ion-button color="bordo">Botão Bordô</ion-button>
<ion-button color="bordo-light">Botão Bordô Claro</ion-button>
<ion-button color="bordo-dark">Botão Bordô Escuro</ion-button>
```

Para usar animações:

```html
<div class="fade-in">Conteúdo com fade in</div>
<ion-card class="slide-in-up">Card com slide in</ion-card>
```
