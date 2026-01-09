<<<<<<< HEAD
# Projefa

Aplicação móvel para Gestão de Tarefas desenvolvida com Ionic + Angular (NgModules).

## 📱 Sobre o Projeto

Projefa é uma aplicação completa de gestão de tarefas que permite:
- Gerir categorias de projetos
- Criar e organizar projetos
- Adicionar tarefas com imagens
- Visualizar tarefas num calendário
- Receber notificações de tarefas próximas
- E muito mais!

## 🛠️ Tecnologias

- **Ionic 8** - Framework para desenvolvimento móvel
- **Angular 20** - Framework web com NgModules
- **Capacitor 8** - Bridge para funcionalidades nativas
- **SQLite** - Base de dados local
- **Ionic Storage** - Armazenamento local
- **TypeScript** - Linguagem de programação

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
ionic serve

# Adicionar plataforma Android
ionic capacitor add android

# Sincronizar Capacitor
npx cap sync
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── core/              # Módulo core (singleton services)
│   ├── shared/            # Componentes e módulos compartilhados
│   ├── features/          # Módulos de funcionalidades
│   │   ├── categories/    # Gestão de categorias
│   │   ├── projects/      # Gestão de projetos
│   │   ├── tasks/         # Gestão de tarefas
│   │   ├── calendar/      # Calendário de tarefas
│   │   ├── statistics/    # Estatísticas
│   │   └── search/        # Pesquisa global
│   └── app.module.ts      # Módulo raiz
├── assets/                # Recursos estáticos
│   ├── i18n/             # Ficheiros de tradução
│   ├── data/             # Dados iniciais JSON
│   └── fonts/            # Fontes personalizadas
└── theme/                 # Estilos e temas
```

## 🚀 Funcionalidades

### Funcionalidades Base
- ✅ Gestão de categorias (CRUD)
- ✅ Gestão de projetos (CRUD)
- ✅ Gestão de tarefas (CRUD)
- ✅ Visualização por categoria
- ✅ Identificação de tarefas em atraso
- ✅ Calendário de tarefas
- ✅ Notificações locais

### Funcionalidades Extras
- ✅ Pesquisa global
- ✅ Estatísticas
- ✅ Modo escuro/claro
- ✅ Exportação de dados
- ✅ Integração com APIs externas
- ✅ i18n (internacionalização)
- ✅ Reactive Forms

## 📝 Licença

Este projeto foi desenvolvido para fins académicos.

## 👨‍💻 Autor

Desenvolvido para a cadeira de Programação Móvel e Ubíqua.
=======
# Projefa
>>>>>>> 683d280bfd39951859a668c8eee75de53d8fcadc
