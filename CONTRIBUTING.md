# Guia de Contribuição

Este é um projeto académico desenvolvido como trabalho prático. No entanto, se quiseres contribuir ou usar como base para outros projetos, segue estas diretrizes.

## Estrutura de Commits

Este projeto segue uma estrutura de commits organizada por funcionalidades:

```
feat: Descrição da funcionalidade
fix: Correção de bug
docs: Documentação
style: Formatação
refactor: Refatoração
test: Testes
chore: Manutenção
```

## Padrões de Código

### TypeScript
- Usar TypeScript strict mode
- Tipar todas as variáveis e funções
- Usar interfaces para modelos de dados
- Comentar código complexo com JSDoc

### Angular
- Usar NgModules (não standalone components)
- Reactive Forms em todos os formulários
- Lazy loading para módulos de features
- Services como singletons quando apropriado

### Ionic
- Seguir padrões do Ionic
- Usar componentes do Ionic quando possível
- Responsividade mobile-first

### Estilos
- SCSS para estilos
- Variáveis CSS para cores e espaçamentos
- Animações em ficheiro separado
- Mobile-first approach

## Testes

- Escrever testes unitários para serviços
- Testar componentes críticos
- Validar formulários

## Documentação

- Comentar todos os métodos públicos
- Atualizar README quando necessário
- Documentar decisões arquiteturais importantes
