/**
 * Modelo de Tarefa
 * 
 * Representa uma tarefa individual dentro de um projeto.
 */
export interface Task {
  /** Identificador único da tarefa */
  id: string;
  
  /** ID do projeto ao qual a tarefa pertence */
  projectId: string;
  
  /** Título da tarefa */
  title: string;
  
  /** Descrição detalhada da tarefa */
  description: string;
  
  /** Data limite da tarefa (ISO string) */
  dueDate: string;
  
  /** Imagem da tarefa em Base64 (opcional) */
  image?: string;
  
  /** Indica se a tarefa está concluída */
  completed: boolean;
  
  /** Ordem de exibição da tarefa (para ordenação) */
  order: number;
  
  /** Data de criação */
  createdAt: string;
  
  /** Data de última atualização */
  updatedAt: string;
}

/**
 * Tarefa com informações do projeto (para exibição)
 */
export interface TaskWithProject extends Task {
  /** Nome do projeto */
  projectName: string;
  
  /** Nome da categoria do projeto */
  categoryName: string;
}

/**
 * Dados para criar uma nova tarefa
 */
export interface CreateTaskDto {
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  image?: string;
  order?: number;
}

/**
 * Dados para atualizar uma tarefa existente
 */
export interface UpdateTaskDto {
  projectId?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  image?: string;
  completed?: boolean;
  order?: number;
}
