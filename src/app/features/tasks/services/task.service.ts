import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataSyncService } from '../../../core/services/data-sync.service';
import { ProjectService } from '../../projects/services/project.service';
import { Task, CreateTaskDto, UpdateTaskDto, TaskWithProject } from '../../../core/models/task.model';
import { Project } from '../../../core/models/project.model';
import { generateId } from '../../../core/utils/id-generator.util';

/**
 * Task Service
 * 
 * Serviço responsável pela gestão de tarefas na aplicação.
 * Fornece métodos para criar, ler, atualizar e eliminar tarefas,
 * além de gerenciar o estado das tarefas com observables e
 * fornecer funcionalidades de ordenação e movimentação.
 * 
 * @service TaskService
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /**
   * Subject para gerenciar o estado das tarefas
   */
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  
  /**
   * Observable das tarefas (para componentes se inscreverem)
   */
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(
    private dataSync: DataSyncService,
    private projectService: ProjectService
  ) {
    this.loadTasks();
  }

  /**
   * Carrega todas as tarefas da base de dados
   */
  async loadTasks(): Promise<void> {
    try {
      const tasks = await this.dataSync.getAllTasks();
      this.tasksSubject.next(tasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      this.tasksSubject.next([]);
    }
  }

  /**
   * Obtém todas as tarefas
   * @returns Promise com array de tarefas
   */
  async getAllTasks(): Promise<Task[]> {
    return await this.dataSync.getAllTasks();
  }

  /**
   * Obtém tarefas com informações do projeto
   * @returns Promise com array de tarefas com projeto
   */
  async getAllTasksWithProject(): Promise<TaskWithProject[]> {
    try {
      const tasks = await this.dataSync.getAllTasks();
      const projects = await this.projectService.getAllProjects();
      
      return tasks.map(task => {
        const project = projects.find(p => p.id === task.projectId);
        return {
          ...task,
          projectName: project?.name || 'Projeto não encontrado',
          categoryName: 'N/A' // Será preenchido quando necessário
        };
      });
    } catch (error) {
      console.error('Erro ao obter tarefas com projeto:', error);
      return [];
    }
  }

  /**
   * Obtém tarefas por projeto
   * @param projectId - ID do projeto
   * @returns Promise com array de tarefas
   */
  async getTasksByProject(projectId: string): Promise<Task[]> {
    return await this.dataSync.getTasksByProject(projectId);
  }

  /**
   * Obtém tarefas em atraso
   * @returns Promise com array de tarefas em atraso
   */
  async getOverdueTasks(): Promise<Task[]> {
    return await this.dataSync.getOverdueTasks();
  }

  /**
   * Obtém uma tarefa por ID
   * @param id - ID da tarefa
   * @returns Promise com a tarefa ou null
   */
  async getTaskById(id: string): Promise<Task | null> {
    return await this.dataSync.getTaskById(id);
  }

  /**
   * Obtém uma tarefa por ID com informações do projeto
   * @param id - ID da tarefa
   * @returns Promise com a tarefa com projeto ou null
   */
  async getTaskByIdWithProject(id: string): Promise<TaskWithProject | null> {
    try {
      const task = await this.dataSync.getTaskById(id);
      if (!task) {
        return null;
      }

      const project = await this.projectService.getProjectById(task.projectId);
      return {
        ...task,
        projectName: project?.name || 'Projeto não encontrado',
        categoryName: 'N/A'
      };
    } catch (error) {
      console.error('Erro ao obter tarefa com projeto:', error);
      return null;
    }
  }

  /**
   * Cria uma nova tarefa
   * @param data - Dados da tarefa a criar
   * @returns Promise com a tarefa criada
   */
  async createTask(data: CreateTaskDto): Promise<Task> {
    const now = new Date().toISOString();
    
    // Obter a ordem máxima das tarefas do projeto
    const existingTasks = await this.dataSync.getTasksByProject(data.projectId);
    const maxOrder = existingTasks.length > 0 
      ? Math.max(...existingTasks.map(t => t.order)) 
      : -1;

    const task: Task = {
      id: generateId(),
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      image: data.image,
      completed: false,
      order: data.order !== undefined ? data.order : maxOrder + 1,
      createdAt: now,
      updatedAt: now
    };

    try {
      await this.dataSync.createTask(task);
      await this.loadTasks(); // Recarregar lista
      return task;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma tarefa existente
   * @param id - ID da tarefa
   * @param updates - Dados a atualizar
   * @returns Promise
   */
  async updateTask(id: string, updates: UpdateTaskDto): Promise<void> {
    try {
      await this.dataSync.updateTask(id, updates);
      await this.loadTasks(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  }

  /**
   * Elimina uma tarefa
   * @param id - ID da tarefa
   * @returns Promise
   */
  async deleteTask(id: string): Promise<void> {
    try {
      await this.dataSync.deleteTask(id);
      await this.loadTasks(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao eliminar tarefa:', error);
      throw error;
    }
  }

  /**
   * Marca uma tarefa como concluída ou não concluída
   * @param id - ID da tarefa
   * @param completed - Estado de conclusão
   * @returns Promise
   */
  async toggleTaskCompletion(id: string, completed: boolean): Promise<void> {
    await this.updateTask(id, { completed });
  }

  /**
   * Move uma tarefa para outro projeto
   * @param taskId - ID da tarefa
   * @param newProjectId - ID do novo projeto
   * @returns Promise
   */
  async moveTaskToProject(taskId: string, newProjectId: string): Promise<void> {
    await this.updateTask(taskId, { projectId: newProjectId });
  }

  /**
   * Atualiza a ordem de múltiplas tarefas
   * @param tasks - Array de tarefas com nova ordem
   * @returns Promise
   */
  async updateTasksOrder(tasks: { id: string; order: number }[]): Promise<void> {
    try {
      await this.dataSync.updateTasksOrder(tasks);
      await this.loadTasks(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao atualizar ordem das tarefas:', error);
      throw error;
    }
  }

  /**
   * Obtém tarefas por data (para calendário)
   * @param date - Data (ISO string)
   * @returns Promise com array de tarefas
   */
  async getTasksByDate(date: string): Promise<Task[]> {
    try {
      const allTasks = await this.dataSync.getAllTasks();
      const targetDate = new Date(date).toISOString().split('T')[0];
      
      return allTasks.filter(task => {
        const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
        return taskDate === targetDate;
      });
    } catch (error) {
      console.error('Erro ao obter tarefas por data:', error);
      return [];
    }
  }

  /**
   * Obtém tarefas do mês (para calendário)
   * @param year - Ano
   * @param month - Mês (1-12)
   * @returns Promise com array de tarefas
   */
  async getTasksByMonth(year: number, month: number): Promise<Task[]> {
    try {
      const allTasks = await this.dataSync.getAllTasks();
      
      return allTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.getFullYear() === year && taskDate.getMonth() + 1 === month;
      });
    } catch (error) {
      console.error('Erro ao obter tarefas do mês:', error);
      return [];
    }
  }
}
