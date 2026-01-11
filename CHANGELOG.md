# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste ficheiro.

## [1.0.0] - 2024

### Adicionado

#### Funcionalidades Base
- Gestão completa de categorias (CRUD)
- Gestão completa de projetos (CRUD)
- Gestão completa de tarefas (CRUD)
- Visualização de tarefas por categoria
- Identificação automática de tarefas em atraso
- Calendário mensal de tarefas
- Sistema de notificações locais

#### Funcionalidades Extras
- Pesquisa global em categorias, projetos e tarefas
- Página de estatísticas com múltiplas visualizações
- Modo escuro/claro com persistência
- Exportação de dados em JSON e CSV
- Integração com API de citações (quotable.io)
- Sistema de internacionalização (i18n)
- Controlo de orientação do ecrã (portrait/landscape)
- Dados iniciais (seed) para primeira execução
- Suporte a imagens nas tarefas (Base64)

#### Técnico
- Base de dados SQLite para plataformas nativas
- Ionic Storage para browser
- Reactive Forms em todos os formulários
- Validação completa de dados
- Animações e transições CSS
- Tema personalizado Bordô
- Componentes reutilizáveis
- Pipes personalizados
- Serviços singleton
- Lazy loading de módulos

### Estrutura
- Arquitetura modular (Core, Shared, Features)
- Separação de responsabilidades
- Documentação JSDoc em todos os serviços
- README completo
- Estrutura de pastas organizada

### Melhorias
- Interface moderna e responsiva
- Feedback visual em todas as ações
- Tratamento de erros robusto
- Performance otimizada
- Acessibilidade melhorada
