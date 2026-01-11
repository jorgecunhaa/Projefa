# Projefa

Aplicação móvel para Gestão de Projetos e Tarefas desenvolvida com Ionic + Angular (NgModules).

## 📱 Sobre o Projeto

**Projefa** é uma aplicação completa de gestão de tarefas que permite organizar projetos, categorias e tarefas de forma eficiente. A aplicação foi desenvolvida como trabalho prático para a cadeira de Programação Móvel e Ubíqua.

### Características Principais

- ✅ Gestão completa de categorias, projetos e tarefas
- ✅ Interface moderna com tema Bordô personalizado
- ✅ Base de dados local (SQLite) para armazenamento offline
- ✅ Notificações locais para lembretes de tarefas
- ✅ Calendário visual de tarefas
- ✅ Pesquisa global em toda a aplicação
- ✅ Estatísticas e relatórios
- ✅ Modo escuro/claro
- ✅ Exportação de dados (JSON/CSV)
- ✅ Suporte a imagens nas tarefas
- ✅ Controlo de orientação do ecrã
- ✅ Internacionalização (i18n)

## 🛠️ Tecnologias

- **Ionic 8** - Framework para desenvolvimento móvel multiplataforma
- **Angular 20** - Framework web com NgModules
- **Capacitor 8** - Bridge para funcionalidades nativas
- **SQLite** - Base de dados local (via @capacitor-community/sqlite)
- **Ionic Storage** - Armazenamento local para configurações e imagens
- **TypeScript** - Linguagem de programação
- **SCSS** - Pré-processador CSS para estilos

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Ionic CLI: `npm install -g @ionic/cli`

### Instalação do Projeto

```bash
# Clonar o repositório
git clone <repository-url>
cd Projefa

# Instalar dependências
npm install

# Executar em desenvolvimento
ionic serve

# Ou usar o Angular CLI diretamente
npm start
```

### Build para Produção

```bash
# Build para web
npm run build

# Build para Android
ionic capacitor add android
ionic capacitor build android

# Build para iOS
ionic capacitor add ios
ionic capacitor build ios
```

## 🏗️ Estrutura do Projeto

```
Projefa/
├── src/
│   ├── app/
│   │   ├── core/                    # Módulo core (singleton services)
│   │   │   ├── models/              # Interfaces e modelos de dados
│   │   │   ├── services/            # Serviços singleton
│   │   │   │   ├── database.service.ts
│   │   │   │   ├── storage.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── settings.service.ts
│   │   │   │   ├── seed.service.ts
│   │   │   │   └── ...
│   │   │   └── utils/               # Utilitários
│   │   ├── shared/                  # Módulo compartilhado
│   │   │   ├── components/          # Componentes reutilizáveis
│   │   │   │   ├── task-card/
│   │   │   │   ├── project-card/
│   │   │   │   ├── category-badge/
│   │   │   │   └── quote-card/
│   │   │   └── pipes/               # Pipes personalizados
│   │   ├── features/                # Módulos de funcionalidades
│   │   │   ├── categories/          # Gestão de categorias
│   │   │   ├── projects/            # Gestão de projetos
│   │   │   ├── tasks/                # Gestão de tarefas
│   │   │   ├── calendar/             # Calendário de tarefas
│   │   │   ├── search/               # Pesquisa global
│   │   │   ├── statistics/           # Estatísticas
│   │   │   ├── settings/             # Configurações
│   │   │   └── export/               # Exportação de dados
│   │   └── tabs/                     # Navegação por tabs
│   ├── assets/                       # Recursos estáticos
│   │   ├── i18n/                    # Ficheiros de tradução
│   │   └── icon/                     # Ícones da aplicação
│   ├── theme/                        # Estilos e temas
│   │   ├── variables.scss           # Variáveis CSS
│   │   └── animations.scss          # Animações
│   └── global.scss                   # Estilos globais
├── resources/                        # Recursos para build nativo
│   ├── icon.svg                     # Ícone da aplicação
│   └── splash.svg                   # Splash screen
└── capacitor.config.ts              # Configuração do Capacitor
```

## 🚀 Funcionalidades

### Funcionalidades Base

- **Gestão de Categorias (CRUD)**
  - Criar, editar e eliminar categorias
  - Personalização de cor e ícone
  - Validação de dados com Reactive Forms

- **Gestão de Projetos (CRUD)**
  - Criar, editar e eliminar projetos
  - Associação a categorias
  - Estatísticas de tarefas por projeto

- **Gestão de Tarefas (CRUD)**
  - Criar, editar e eliminar tarefas
  - Associação a projetos
  - Data limite configurável
  - Suporte a imagens (Base64)
  - Marcação como concluída/pendente

- **Calendário de Tarefas**
  - Visualização mensal
  - Indicadores de tarefas por dia
  - Lista de tarefas do dia selecionado

- **Notificações Locais**
  - Lembretes de tarefas próximas
  - Lembrete diário configurável
  - Notificações automáticas

### Funcionalidades Extras

- **Pesquisa Global**
  - Pesquisa em categorias, projetos e tarefas
  - Filtros por tipo
  - Destaque de resultados

- **Estatísticas**
  - Estatísticas gerais
  - Estatísticas por projeto e categoria
  - Timeline de atividades
  - Taxa de conclusão

- **Modo Escuro/Claro**
  - Alternância entre temas
  - Persistência da preferência

- **Exportação de Dados**
  - Exportação em JSON
  - Exportação em CSV
  - Filtros por tipo de dados

- **Integração com APIs Externas**
  - Citações inspiradoras (quotable.io)
  - Fallback local

- **Internacionalização (i18n)**
  - Suporte a múltiplos idiomas
  - Strings isoladas em JSON
  - Pipe de tradução

- **Controlo de Orientação**
  - Bloqueio para portrait/landscape
  - Desbloqueio para rotação livre

- **Dados Iniciais (Seed)**
  - População automática na primeira execução
  - Categorias, projetos e tarefas de exemplo

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia servidor de desenvolvimento
npm run build          # Build para produção
npm run watch          # Build em modo watch

# Testes
npm test               # Executa testes unitários
npm run lint           # Verifica código com ESLint

# Assets
npm run assets         # Gera ícones e splash screens

# Capacitor
npx cap sync           # Sincroniza código nativo
npx cap open android   # Abre projeto Android
npx cap open ios       # Abre projeto iOS
```

## 🎨 Tema e Personalização

A aplicação utiliza um tema personalizado com a cor **Bordô (#8B0000)** como cor primária. As animações e transições foram implementadas para melhorar a experiência do utilizador.

### Cores Principais

- **Primária (Bordô)**: `#8B0000`
- **Secundária**: Variações do Bordô
- **Sucesso**: Verde
- **Aviso**: Laranja
- **Perigo**: Vermelho

## 📱 Plataformas Suportadas

- **Web** (PWA) - Funcionalidades limitadas (sem SQLite, notificações, câmera)
- **Android** (via Capacitor) - **Recomendado para teste completo**
- **iOS** (via Capacitor) - **Recomendado para teste completo**

### ⚠️ Importante: Teste no Dispositivo Móvel

**A aplicação DEVE ser testada no telemóvel** para funcionalidades completas:
- SQLite (base de dados) só funciona em dispositivos nativos
- Notificações locais requerem permissões do dispositivo
- Câmera requer permissões do dispositivo
- Controlo de orientação só funciona em dispositivos nativos

Ver `MOBILE_TESTING.md` para instruções detalhadas de teste no dispositivo.

## 🔧 Configuração

### Variáveis de Ambiente

A aplicação não requer variáveis de ambiente configuradas. Todas as configurações são feitas através do `capacitor.config.ts` e `ionic.config.json`.

### Base de Dados

A aplicação utiliza SQLite em plataformas nativas e Ionic Storage no browser. A migração é automática e transparente.

## 📄 Licença

Este projeto foi desenvolvido para fins académicos como trabalho prático para a cadeira de **Programação Móvel e Ubíqua**.

## 👨‍💻 Autor

Desenvolvido como trabalho prático académico.

## 🙏 Agradecimentos

- Ionic Framework
- Angular Team
- Capacitor Community
- Quotable.io (API de citações)

---

**Versão**: 1.0.0  
**Última atualização**: 2024
