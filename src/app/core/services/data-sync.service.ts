import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { DatabaseService } from './database.service';
import { StorageService } from './storage.service';
import { Category } from '../models/category.model';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';

/**
 * Data Sync Service
 * 
 * Serviço responsável por sincronizar dados entre SQLite (nativo)
 * e Ionic Storage (web fallback). Garante que a aplicação funcione
 * tanto em plataformas nativas quanto na web.
 * 
 * @service DataSyncService
 */
@Injectable({
  providedIn: 'root'
})
export class DataSyncService {
  private useSQLite: boolean;

  constructor(
    private databaseService: DatabaseService,
    private storageService: StorageService
  ) {
    // Determinar qual storage usar baseado na plataforma
    this.useSQLite = Capacitor.isNativePlatform();
  }

  /**
   * Verifica se está a usar SQLite ou Storage
   */
  isUsingSQLite(): boolean {
    return this.useSQLite;
  }

  // ==================== CATEGORIES ====================

  /**
   * Obtém todas as categorias
   */
  async getAllCategories(): Promise<Category[]> {
    if (this.useSQLite) {
      try {
        return await this.databaseService.getAllCategories();
      } catch (error) {
        console.warn('Erro ao obter categorias do SQLite, usando Storage:', error);
        return await this.storageService.getCategories();
      }
    }
    return await this.storageService.getCategories();
  }

  /**
   * Obtém uma categoria por ID
   */
  async getCategoryById(id: string): Promise<Category | null> {
    if (this.useSQLite) {
      try {
        return await this.databaseService.getCategoryById(id);
      } catch (error) {
        return await this.storageService.getCategories().then(
          categories => categories.find(c => c.id === id) || null
        );
      }
    }
    const categories = await this.storageService.getCategories();
    return categories.find(c => c.id === id) || null;
  }

  /**
   * Cria uma nova categoria
   */
  async createCategory(category: Category): Promise<void> {
    if (this.useSQLite) {
      try {
        await this.databaseService.createCategory(category);
        return;
      } catch (error) {
        console.warn('Erro ao criar categoria no SQLite, usando Storage:', error);
      }
    }
    await this.storageService.addCategory(category);
  }

  /**
   * Atualiza uma categoria
   */
  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    if (this.useSQLite) {
      try {
        await this.databaseService.updateCategory(id, updates);
        return;
      } catch (error) {
        console.warn('Erro ao atualizar categoria no SQLite, usando Storage:', error);
      }
    }
    await this.storageService.updateCategory(id, updates);
  }

  /**
   * Elimina uma categoria
   */
  async deleteCategory(id: string): Promise<void> {
    if (this.useSQLite) {
      try {
        await this.databaseService.deleteCategory(id);
        return;
      } catch (error) {
        console.warn('Erro ao eliminar categoria no SQLite, usando Storage:', error);
      }
    }
    await this.storageService.deleteCategory(id);
  }

  // ==================== PROJECTS ====================

  /**
   * Obtém todos os projetos
   */
  async getAllProjects(): Promise<Project[]> {
    if (this.useSQLite) {
      try {
        return await this.databaseService.getAllProjects();
      } catch (error) {
        return await this.storageService.getProjects();
      }
    }
    return await this.storageService.getProjects();
  }

  /**
   * Obtém projetos por categoria
   */
  async getProjectsByCategory(categoryId: string): Promise<Project[]> {
    if (this.useSQLite) {
      try {
        return await this.databaseService.getProjectsByCategory(categoryId);
      } catch (error) {
        const projects = await this.storageService.getProjects();
        return projects.filter(p => p.categoryId === categoryId);
      }
    }
    const projects = await this.storageService.getProjects();
    return projects.filter(p => p.categoryId === categoryId);
  }

  /**
   * Obtém um projeto por ID
   */
  async getProjectById(id: string): Promise<Project | null> {
    if (this.useSQLite) {
      try {
        return await this.databaseService.getProjectById(id);
      } catch (error) {
        const projects = await this.storageService.getProjects();
        return projects.find(p => p.id === id) || null;
      }
    }
    const projects = await this.storageService.getProjects();
    return projects.find(p => p.id === id) || null;
  }

  /**
   * Cria um novo projeto
   */
  async createProject(project: Project): Promise<void> {
    if (this.useSQLite) {
      try {
        await this.databaseService.createProject(project);
        return;
      } catch (error) {
        console.warn('Erro ao criar projeto no SQLite, usando Storage:', error);
      }
    }
    await this.storageService.addProject(project);
  }

  /**
   * Atualiza um projeto
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    if (this.useSQLite) {
      try {
        await this.databaseService.updateProject(id, updates);
        return;
      } catch (error) {
        console.warn('Erro ao atualizar projeto no SQLite, usando Storage:', error);
      }
    }
    await this.storageService.updateProject(id, updates);
  }

  /**
   * Elimina um projeto
   */
  async deleteProject(id: string): Promise<void> {
    if (this.useSQLite) {
      try {
        await this.databaseService.deleteProject(id);
        return;
      } catch (error) {
        console.warn('Erro ao eliminar projeto no SQLite, usando Storage:', error);
      }
    }
    await this.storageService.deleteProject(id);
  }

  // ==================== TASKS ====================

  /**
   * Obtém todas as tarefas
   */
  async getAllTasks(): Promise<Task[]> {
    if (this.useSQLite) {
      try {
        return await this.databaseService.getAllTasks();
      } catch (error) {
        return await this.storageService.getTasks();
      }
    }
    return await this.storageService.getTasks();
  }

  /**
   * Obtém tarefas por projeto
   */
  async getTasksByProject(projectId: string): Promise<Task[]> {
    if (this.useSQLite) {
      try {
        return await this.databaseService.getTasksByProject(projectId);
      } catch (error) {
        const tasks = await this.storageService.getTasks();
        return tasks.filter(t => t.projectId === projectId);
      }
    }
    const tasks = await this.storageService.getTasks();
    return tasks.filter(t => t.projectId === projectId);
  }

  /**
   * Obtém tarefas em atraso
   */
  async getOverdueTasks(): Promise<Task[]> {
    if (this.useSQLite) {
      try {
        return await this.databaseService.getOverdueTasks();
      } catch (error) {
        const tasks = await this.storageService.getTasks();
        const now = new Date().toISOString();
        return tasks.filter(t => !t.completed && t.dueDate < now);
      }
    }
    const tasks = await this.storageService.getTasks();
    const now = new Date().toISOString();
    return tasks.filter(t => !t.completed && t.dueDate < now);
  }

  /**
   * Obtém uma tarefa por ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    if (this.useSQLite) {
      try {
        return await this.databaseService.getTaskById(id);
      } catch (error) {
        const tasks = await this.storageService.getTasks();
        return tasks.find(t => t.id === id) || null;
      }
    }
    const tasks = await this.storageService.getTasks();
    return tasks.find(t => t.id === id) || null;
  }

  /**
   * Cria uma nova tarefa
   */
  async createTask(task: Task): Promise<void> {
    if (this.useSQLite) {
      try {
        await this.databaseService.createTask(task);
        return;
      } catch (error) {
        console.warn('Erro ao criar tarefa no SQLite, usando Storage:', error);
      }
    }
    await this.storageService.addTask(task);
  }

  /**
   * Atualiza uma tarefa
   */
  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    if (this.useSQLite) {
      try {
        await this.databaseService.updateTask(id, updates);
        return;
      } catch (error) {
        console.warn('Erro ao atualizar tarefa no SQLite, usando Storage:', error);
      }
    }
    await this.storageService.updateTask(id, updates);
  }

  /**
   * Elimina uma tarefa
   */
  async deleteTask(id: string): Promise<void> {
    if (this.useSQLite) {
      try {
        await this.databaseService.deleteTask(id);
        return;
      } catch (error) {
        console.warn('Erro ao eliminar tarefa no SQLite, usando Storage:', error);
      }
    }
    await this.storageService.deleteTask(id);
  }

  /**
   * Atualiza a ordem de múltiplas tarefas
   */
  async updateTasksOrder(tasks: { id: string; order: number }[]): Promise<void> {
    if (this.useSQLite) {
      try {
        await this.databaseService.updateTasksOrder(tasks);
        return;
      } catch (error) {
        // Para Storage, atualizar individualmente
        for (const task of tasks) {
          await this.storageService.updateTask(task.id, { order: task.order });
        }
      }
    } else {
      for (const task of tasks) {
        await this.storageService.updateTask(task.id, { order: task.order });
      }
    }
  }
}
