import { Injectable } from '@angular/core';
import { TaskService } from '../../tasks/services/task.service';
import { ProjectService } from '../../projects/services/project.service';
import { CategoryService } from '../../categories/services/category.service';
import { Task, TaskWithProject } from '../../../core/models/task.model';
import { Project, ProjectWithCategory } from '../../../core/models/project.model';
import { Category } from '../../../core/models/category.model';

/**
 * Search Result Interface
 * 
 * Interface para resultados de pesquisa
 */
export interface SearchResult {
  type: 'category' | 'project' | 'task';
  item: Category | Project | Task;
  relevance: number;
  matchedFields: string[];
}

/**
 * Search Service
 * 
 * Serviço responsável pela pesquisa global na aplicação.
 * Permite pesquisar em categorias, projetos e tarefas.
 * 
 * @service SearchService
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private categoryService: CategoryService
  ) {}

  /**
   * Pesquisa global em todas as entidades
   * @param query - Termo de pesquisa
   * @returns Promise com array de resultados ordenados por relevância
   */
  async searchAll(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Pesquisar em categorias
    const categories = await this.categoryService.getAllCategories();
    categories.forEach(category => {
      const relevance = this.calculateRelevance(category.name, searchTerm);
      if (relevance > 0) {
        results.push({
          type: 'category',
          item: category,
          relevance,
          matchedFields: ['name']
        });
      }
    });

    // Pesquisar em projetos
    const projects = await this.projectService.getAllProjects();
    projects.forEach(project => {
      const nameRelevance = this.calculateRelevance(project.name, searchTerm);
      
      const maxRelevance = nameRelevance;
      if (maxRelevance > 0) {
        const matchedFields: string[] = [];
        if (nameRelevance > 0) matchedFields.push('name');
        
        results.push({
          type: 'project',
          item: project,
          relevance: maxRelevance,
          matchedFields
        });
      }
    });

    // Pesquisar em tarefas
    const tasks = await this.taskService.getAllTasks();
    tasks.forEach(task => {
      const titleRelevance = this.calculateRelevance(task.title, searchTerm);
      const descriptionRelevance = task.description 
        ? this.calculateRelevance(task.description, searchTerm) 
        : 0;
      
      const maxRelevance = Math.max(titleRelevance, descriptionRelevance);
      if (maxRelevance > 0) {
        const matchedFields: string[] = [];
        if (titleRelevance > 0) matchedFields.push('title');
        if (descriptionRelevance > 0) matchedFields.push('description');
        
        results.push({
          type: 'task',
          item: task,
          relevance: maxRelevance,
          matchedFields
        });
      }
    });

    // Ordenar por relevância (maior primeiro)
    results.sort((a, b) => b.relevance - a.relevance);

    return results;
  }

  /**
   * Pesquisa apenas em categorias
   * @param query - Termo de pesquisa
   * @returns Promise com array de categorias
   */
  async searchCategories(query: string): Promise<Category[]> {
    if (!query || query.trim().length === 0) {
      return await this.categoryService.getAllCategories();
    }

    const searchTerm = query.toLowerCase().trim();
    const categories = await this.categoryService.getAllCategories();
    
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Pesquisa apenas em projetos
   * @param query - Termo de pesquisa
   * @returns Promise com array de projetos
   */
  async searchProjects(query: string): Promise<Project[]> {
    if (!query || query.trim().length === 0) {
      return await this.projectService.getAllProjects();
    }

    const searchTerm = query.toLowerCase().trim();
    const projects = await this.projectService.getAllProjects();
    
    return projects.filter(project => 
      project.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Pesquisa apenas em tarefas
   * @param query - Termo de pesquisa
   * @returns Promise com array de tarefas
   */
  async searchTasks(query: string): Promise<Task[]> {
    if (!query || query.trim().length === 0) {
      return await this.taskService.getAllTasks();
    }

    const searchTerm = query.toLowerCase().trim();
    const tasks = await this.taskService.getAllTasks();
    
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm) ||
      (task.description && task.description.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Calcula a relevância de uma correspondência
   * @param text - Texto a verificar
   * @param searchTerm - Termo de pesquisa
   * @returns Pontuação de relevância (0-100)
   */
  private calculateRelevance(text: string, searchTerm: string): number {
    const lowerText = text.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();

    // Correspondência exata
    if (lowerText === lowerSearch) {
      return 100;
    }

    // Começa com o termo de pesquisa
    if (lowerText.startsWith(lowerSearch)) {
      return 80;
    }

    // Contém o termo de pesquisa
    if (lowerText.includes(lowerSearch)) {
      // Calcular relevância baseada na posição
      const index = lowerText.indexOf(lowerSearch);
      const positionRatio = index / lowerText.length;
      return Math.max(40, 60 - (positionRatio * 20));
    }

    // Pesquisa por palavras individuais
    const searchWords = lowerSearch.split(/\s+/);
    const textWords = lowerText.split(/\s+/);
    
    let wordMatches = 0;
    searchWords.forEach(searchWord => {
      if (textWords.some(textWord => textWord.includes(searchWord))) {
        wordMatches++;
      }
    });

    if (wordMatches > 0) {
      return (wordMatches / searchWords.length) * 30;
    }

    return 0;
  }

  /**
   * Destaca o termo de pesquisa no texto
   * @param text - Texto original
   * @param searchTerm - Termo de pesquisa
   * @returns Texto com HTML destacado
   */
  highlightText(text: string, searchTerm: string): string {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return text;
    }

    const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Escapa caracteres especiais para regex
   * @param str - String a escapar
   * @returns String escapada
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
