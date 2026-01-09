# Shared Module

O Shared Module contém componentes, pipes e diretivas reutilizáveis em toda a aplicação.

## Estrutura

```
shared/
├── components/          # Componentes reutilizáveis
│   ├── task-card/       # Card de tarefa
│   ├── project-card/    # Card de projeto
│   ├── category-badge/  # Badge de categoria
│   └── index.ts
├── pipes/               # Pipes personalizados
│   ├── date-format.pipe.ts
│   └── index.ts
├── shared.module.ts     # Módulo compartilhado
└── README.md
```

## Componentes

### TaskCardComponent
Card para exibir uma tarefa com todas as informações relevantes.

**Inputs:**
- `task: Task` - Tarefa a exibir (obrigatório)
- `showProject: boolean` - Mostrar nome do projeto (padrão: false)
- `projectName: string` - Nome do projeto (opcional)
- `clickable: boolean` - Card clicável (padrão: true)

**Outputs:**
- `click: EventEmitter<Task>` - Emitido ao clicar no card
- `complete: EventEmitter<Task>` - Emitido ao marcar como concluída
- `delete: EventEmitter<Task>` - Emitido ao eliminar

**Exemplo:**
```html
<app-task-card
  [task]="task"
  [showProject]="true"
  [projectName]="project.name"
  (click)="onTaskClick($event)"
  (complete)="onTaskComplete($event)"
  (delete)="onTaskDelete($event)">
</app-task-card>
```

### ProjectCardComponent
Card para exibir um projeto com estatísticas e informações da categoria.

**Inputs:**
- `project: Project` - Projeto a exibir (obrigatório)
- `categoryName: string` - Nome da categoria
- `categoryColor: string` - Cor da categoria (padrão: '#8B0000')
- `categoryIcon: string` - Ícone da categoria (padrão: 'folder-outline')
- `taskCount: number` - Número total de tarefas (padrão: 0)
- `completedTaskCount: number` - Tarefas concluídas (padrão: 0)
- `overdueTaskCount: number` - Tarefas em atraso (padrão: 0)
- `clickable: boolean` - Card clicável (padrão: true)

**Outputs:**
- `click: EventEmitter<Project>` - Emitido ao clicar no card
- `delete: EventEmitter<Project>` - Emitido ao eliminar

**Exemplo:**
```html
<app-project-card
  [project]="project"
  [categoryName]="category.name"
  [categoryColor]="category.color"
  [categoryIcon]="category.icon"
  [taskCount]="10"
  [completedTaskCount]="7"
  [overdueTaskCount]="2"
  (click)="onProjectClick($event)"
  (delete)="onProjectDelete($event)">
</app-project-card>
```

### CategoryBadgeComponent
Badge para exibir uma categoria com cor e ícone personalizados.

**Inputs:**
- `name: string` - Nome da categoria (obrigatório)
- `color: string` - Cor da categoria (padrão: '#8B0000')
- `icon: string` - Ícone da categoria (padrão: 'folder-outline')
- `size: 'small' | 'medium' | 'large'` - Tamanho do badge (padrão: 'medium')
- `showIcon: boolean` - Mostrar ícone (padrão: true)

**Exemplo:**
```html
<app-category-badge
  [name]="'Escola'"
  [color]="'#8B0000'"
  [icon]="'school-outline'"
  [size]="'medium'">
</app-category-badge>
```

## Pipes

### DateFormatPipe
Pipe para formatar datas de forma consistente.

**Formatos disponíveis:**
- `'full'` - Data completa (ex: "15 de Janeiro de 2024")
- `'short'` - Data curta (ex: "15/01/2024")
- `'time'` - Apenas hora (ex: "14:30")
- `'datetime'` - Data e hora (ex: "15/01/2024 14:30")
- `'relative'` - Relativa (ex: "há 2 dias", "em 3 horas")
- `'day'` - Dia da semana (ex: "Segunda-feira")
- `'default'` - Formato padrão (ex: "15 Jan 2024")

**Exemplo:**
```html
{{ task.dueDate | dateFormat }}
{{ task.dueDate | dateFormat:'short' }}
{{ task.dueDate | dateFormat:'relative' }}
```

## Uso

Para usar os componentes e pipes, importe o SharedModule no módulo onde precisar:

```typescript
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    // outros módulos...
  ]
})
export class YourModule { }
```

## Notas

- Todos os componentes são responsivos
- Os componentes incluem animações de entrada (fade-in)
- Os estilos seguem o tema Bordô da aplicação
- Todos os componentes suportam modo escuro/claro
