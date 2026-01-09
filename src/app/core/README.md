# Core Module

O Core Module contém os serviços fundamentais da aplicação que devem ser instanciados apenas uma vez.

## Estrutura

```
core/
├── models/              # Interfaces e modelos de dados
│   ├── category.model.ts
│   ├── project.model.ts
│   ├── task.model.ts
│   └── index.ts
├── services/            # Serviços principais
│   ├── database.service.ts      # SQLite (nativo)
│   ├── storage.service.ts       # Ionic Storage (web fallback)
│   ├── notification.service.ts  # Notificações locais
│   ├── data-sync.service.ts     # Sincronização de dados
│   └── index.ts
├── utils/               # Utilitários
│   └── id-generator.util.ts
├── core.module.ts       # Módulo core
└── README.md
```

## Serviços

### DatabaseService
Gerencia a base de dados SQLite em plataformas nativas.
- CRUD completo para Categories, Projects e Tasks
- Queries otimizadas com índices
- Suporte a relacionamentos (FOREIGN KEYS)

### StorageService
Gerencia o armazenamento local usando Ionic Storage.
- Fallback para web quando SQLite não está disponível
- CRUD completo para todas as entidades
- Sistema de configurações (settings)

### NotificationService
Gerencia notificações locais do dispositivo.
- Agendamento de notificações para tarefas
- Lembretes diários
- Cancelamento de notificações

### DataSyncService
Sincroniza dados entre SQLite e Storage automaticamente.
- Detecta a plataforma (nativo vs web)
- Usa SQLite em nativo, Storage na web
- Fallback automático em caso de erro

## Modelos

### Category
Representa uma categoria de projetos (ex: Escola, Trabalho, Pessoal).

### Project
Representa um projeto que agrupa tarefas.

### Task
Representa uma tarefa individual com título, descrição, data limite e imagem.

## Uso

```typescript
import { DataSyncService } from '@core/services';
import { Category, Project, Task } from '@core/models';

constructor(private dataSync: DataSyncService) {}

async loadData() {
  const categories = await this.dataSync.getAllCategories();
  const projects = await this.dataSync.getAllProjects();
  const tasks = await this.dataSync.getAllTasks();
}
```

## Notas

- O CoreModule deve ser importado apenas no AppModule
- Todos os serviços usam `providedIn: 'root'` para injeção de dependências
- O DataSyncService é o serviço principal a ser usado pelos componentes
- Os serviços específicos (DatabaseService, StorageService) podem ser usados diretamente se necessário
