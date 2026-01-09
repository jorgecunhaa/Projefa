import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataSyncService } from '../../../core/services/data-sync.service';
import { CategoryService } from '../../categories/services/category.service';
import { Project, CreateProjectDto, UpdateProjectDto, ProjectWithCategory } from '../../../core/models/project.model';
import { Category } from '../../../core/models/category.model';
import { Task } from '../../../core/models/task.model';
import { generateId } from '../../../core/utils/id-generator.util';

/**
 * Project Service
 * 
 * Serviço responsável pela gestão de projetos na aplicação.
 * Fornece métodos para criar, ler, atualizar e eliminar projetos,
 * além de gerenciar o estado dos projetos com observables e
 * fornecer estatísticas relacionadas.
 * 
 * @service ProjectService
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  /**
   * Subject para gerenciar o estado dos projetos
   */
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  
  /**
   * Observable dos projetos (para componentes se inscreverem)
   */
  public projects$: Observable<Project[]> = this.projectsSubject.asObservable();

  constructor(
    private dataSync: DataSyncService,
    private categoryService: CategoryService
  ) {
    this.loadProjects();
  }

  /**
   * Carrega todos os projetos da base de dados
   */
  async loadProjects(): Promise<void> {
    try {
      const projects = await this.dataSync.getAllProjects();
      this.projectsSubject.next(projects);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      this.projectsSubject.next([]);
    }
  }

  /**
   * Obtém todos os projetos
   * @returns Promise com array de projetos
   */
  async getAllProjects(): Promise<Project[]> {
    return await this.dataSync.getAllProjects();
  }

  /**
   * Obtém projetos com informações da categoria
   * @returns Promise com array de projetos com categoria
   */
  async getAllProjectsWithCategory(): Promise<ProjectWithCategory[]> {
    try {
      const projects = await this.dataSync.getAllProjects();
      const categories = await this.categoryService.getAllCategories();
      
      return projects.map(project => {
        const category = categories.find(c => c.id === project.categoryId);
        return {
          ...project,
          categoryName: category?.name || 'Sem categoria',
          categoryColor: category?.color || '#8B0000',
          categoryIcon: category?.icon || 'folder-outline'
        };
      });
    } catch (error) {
      console.error('Erro ao obter projetos com categoria:', error);
      return [];
    }
  }

  /**
   * Obtém projetos por categoria
   * @param categoryId - ID da categoria
   * @returns Promise com array de projetos
   */
  async getProjectsByCategory(categoryId: string): Promise<Project[]> {
    return await this.dataSync.getProjectsByCategory(categoryId);
  }

  /**
   * Obtém projetos por categoria com informações da categoria
   * @param categoryId - ID da categoria
   * @returns Promise com array de projetos com categoria
   */
  async getProjectsByCategoryWithInfo(categoryId: string): Promise<ProjectWithCategory[]> {
    try {
      const projects = await this.dataSync.getProjectsByCategory(categoryId);
      const category = await this.categoryService.getCategoryById(categoryId);
      
      return projects.map(project => ({
        ...project,
        categoryName: category?.name || 'Sem categoria',
        categoryColor: category?.color || '#8B0000',
        categoryIcon: category?.icon || 'folder-outline'
      }));
    } catch (error) {
      console.error('Erro ao obter projetos por categoria:', error);
      return [];
    }
  }

  /**
   * Obtém um projeto por ID
   * @param id - ID do projeto
   * @returns Promise com o projeto ou null
   */
  async getProjectById(id: string): Promise<Project | null> {
    return await this.dataSync.getProjectById(id);
  }

  /**
   * Obtém um projeto por ID com informações da categoria
   * @param id - ID do projeto
   * @returns Promise com o projeto com categoria ou null
   */
  async getProjectByIdWithCategory(id: string): Promise<ProjectWithCategory | null> {
    try {
      const project = await this.dataSync.getProjectById(id);
      if (!project) {
        return null;
      }

      const category = await this.categoryService.getCategoryById(project.categoryId);
      return {
        ...project,
        categoryName: category?.name || 'Sem categoria',
        categoryColor: category?.color || '#8B0000',
        categoryIcon: category?.icon || 'folder-outline'
      };
    } catch (error) {
      console.error('Erro ao obter projeto com categoria:', error);
      return null;
    }
  }

  /**
   * Cria um novo projeto
   * @param data - Dados do projeto a criar
   * @returns Promise com o projeto criado
   */
  async createProject(data: CreateProjectDto): Promise<Project> {
    const now = new Date().toISOString();
    const project: Project = {
      id: generateId(),
      name: data.name,
      categoryId: data.categoryId,
      createdAt: now,
      updatedAt: now
    };

    try {
      await this.dataSync.createProject(project);
      await this.loadProjects(); // Recarregar lista
      return project;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  }

  /**
   * Atualiza um projeto existente
   * @param id - ID do projeto
   * @param updates - Dados a atualizar
   * @returns Promise
   */
  async updateProject(id: string, updates: UpdateProjectDto): Promise<void> {
    try {
      await this.dataSync.updateProject(id, updates);
      await this.loadProjects(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  }

  /**
   * Elimina um projeto
   * @param id - ID do projeto
   * @returns Promise
   */
  async deleteProject(id: string): Promise<void> {
    try {
      await this.dataSync.deleteProject(id);
      await this.loadProjects(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao eliminar projeto:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas de um projeto
   * @param projectId - ID do projeto
   * @returns Promise com estatísticas (total, concluídas, em atraso)
   */
  async getProjectStatistics(projectId: string): Promise<{
    total: number;
    completed: number;
    overdue: number;
    percentage: number;
  }> {
    try {
      const tasks = await this.dataSync.getTasksByProject(projectId);
      const now = new Date().toISOString();
      
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      const overdue = tasks.filter(t => !t.completed && t.dueDate < now).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        total,
        completed,
        overdue,
        percentage
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas do projeto:', error);
      return { total: 0, completed: 0, overdue: 0, percentage: 0 };
    }
  }

  /**
   * Verifica se um projeto tem tarefas associadas
   * @param projectId - ID do projeto
   * @returns Promise com true se tiver tarefas
   */
  async hasTasks(projectId: string): Promise<boolean> {
    try {
      const tasks = await this.dataSync.getTasksByProject(projectId);
      return tasks.length > 0;
    } catch (error) {
      console.error('Erro ao verificar tarefas do projeto:', error);
      return false;
    }
  }
}
