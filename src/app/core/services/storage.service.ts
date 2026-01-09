import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Category } from '../models/category.model';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';

/**
 * Storage Service
 * 
 * Serviço responsável pelo armazenamento local usando Ionic Storage.
 * Utilizado como fallback para web e para armazenar dados adicionais
 * como preferências do utilizador e cache.
 * 
 * @service StorageService
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageInitialized = false;
  private readonly CATEGORIES_KEY = 'categories';
  private readonly PROJECTS_KEY = 'projects';
  private readonly TASKS_KEY = 'tasks';
  private readonly SETTINGS_KEY = 'settings';

  constructor(private storage: Storage) {
    this.init();
  }

  /**
   * Inicializa o storage
   */
  private async init(): Promise<void> {
    try {
      await this.storage.create();
      this.storageInitialized = true;
      console.log('Ionic Storage inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar Ionic Storage:', error);
    }
  }

  /**
   * Verifica se o storage está inicializado
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.storageInitialized) {
      await this.init();
    }
  }

  // ==================== CATEGORIES ====================

  /**
   * Obtém todas as categorias do storage
   */
  async getCategories(): Promise<Category[]> {
    await this.ensureInitialized();
    return (await this.storage.get(this.CATEGORIES_KEY)) || [];
  }

  /**
   * Guarda categorias no storage
   */
  async setCategories(categories: Category[]): Promise<void> {
    await this.ensureInitialized();
    await this.storage.set(this.CATEGORIES_KEY, categories);
  }

  /**
   * Adiciona uma categoria ao storage
   */
  async addCategory(category: Category): Promise<void> {
    await this.ensureInitialized();
    const categories = await this.getCategories();
    categories.push(category);
    await this.setCategories(categories);
  }

  /**
   * Atualiza uma categoria no storage
   */
  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    await this.ensureInitialized();
    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates, updatedAt: new Date().toISOString() };
      await this.setCategories(categories);
    }
  }

  /**
   * Elimina uma categoria do storage
   */
  async deleteCategory(id: string): Promise<void> {
    await this.ensureInitialized();
    const categories = await this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    await this.setCategories(filtered);
  }

  // ==================== PROJECTS ====================

  /**
   * Obtém todos os projetos do storage
   */
  async getProjects(): Promise<Project[]> {
    await this.ensureInitialized();
    return (await this.storage.get(this.PROJECTS_KEY)) || [];
  }

  /**
   * Guarda projetos no storage
   */
  async setProjects(projects: Project[]): Promise<void> {
    await this.ensureInitialized();
    await this.storage.set(this.PROJECTS_KEY, projects);
  }

  /**
   * Adiciona um projeto ao storage
   */
  async addProject(project: Project): Promise<void> {
    await this.ensureInitialized();
    const projects = await this.getProjects();
    projects.push(project);
    await this.setProjects(projects);
  }

  /**
   * Atualiza um projeto no storage
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    await this.ensureInitialized();
    const projects = await this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
      await this.setProjects(projects);
    }
  }

  /**
   * Elimina um projeto do storage
   */
  async deleteProject(id: string): Promise<void> {
    await this.ensureInitialized();
    const projects = await this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    await this.setProjects(filtered);
  }

  // ==================== TASKS ====================

  /**
   * Obtém todas as tarefas do storage
   */
  async getTasks(): Promise<Task[]> {
    await this.ensureInitialized();
    return (await this.storage.get(this.TASKS_KEY)) || [];
  }

  /**
   * Guarda tarefas no storage
   */
  async setTasks(tasks: Task[]): Promise<void> {
    await this.ensureInitialized();
    await this.storage.set(this.TASKS_KEY, tasks);
  }

  /**
   * Adiciona uma tarefa ao storage
   */
  async addTask(task: Task): Promise<void> {
    await this.ensureInitialized();
    const tasks = await this.getTasks();
    tasks.push(task);
    await this.setTasks(tasks);
  }

  /**
   * Atualiza uma tarefa no storage
   */
  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    await this.ensureInitialized();
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
      await this.setTasks(tasks);
    }
  }

  /**
   * Elimina uma tarefa do storage
   */
  async deleteTask(id: string): Promise<void> {
    await this.ensureInitialized();
    const tasks = await this.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    await this.setTasks(filtered);
  }

  // ==================== SETTINGS ====================

  /**
   * Obtém uma configuração
   */
  async getSetting<T>(key: string, defaultValue?: T): Promise<T | null> {
    await this.ensureInitialized();
    const settings = await this.storage.get(this.SETTINGS_KEY) || {};
    return settings[key] !== undefined ? settings[key] : (defaultValue !== undefined ? defaultValue : null);
  }

  /**
   * Define uma configuração
   */
  async setSetting<T>(key: string, value: T): Promise<void> {
    await this.ensureInitialized();
    const settings = await this.storage.get(this.SETTINGS_KEY) || {};
    settings[key] = value;
    await this.storage.set(this.SETTINGS_KEY, settings);
  }

  /**
   * Remove uma configuração
   */
  async removeSetting(key: string): Promise<void> {
    await this.ensureInitialized();
    const settings = await this.storage.get(this.SETTINGS_KEY) || {};
    delete settings[key];
    await this.storage.set(this.SETTINGS_KEY, settings);
  }

  // ==================== UTILITIES ====================

  /**
   * Limpa todo o storage
   */
  async clear(): Promise<void> {
    await this.ensureInitialized();
    await this.storage.clear();
  }

  /**
   * Remove uma chave específica
   */
  async remove(key: string): Promise<void> {
    await this.ensureInitialized();
    await this.storage.remove(key);
  }

  /**
   * Obtém todas as chaves
   */
  async keys(): Promise<string[]> {
    await this.ensureInitialized();
    return await this.storage.keys();
  }

  /**
   * Obtém o número de itens no storage
   */
  async length(): Promise<number> {
    await this.ensureInitialized();
    return await this.storage.length();
  }
}
