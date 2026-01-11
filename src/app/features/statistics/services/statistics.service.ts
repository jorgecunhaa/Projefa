import { Injectable } from '@angular/core';
import { TaskService } from '../../tasks/services/task.service';
import { ProjectService } from '../../projects/services/project.service';
import { CategoryService } from '../../categories/services/category.service';
import { Task } from '../../../core/models/task.model';
import { Project } from '../../../core/models/project.model';
import { Category } from '../../../core/models/category.model';

/**
 * Estatísticas Gerais
 */
export interface GeneralStatistics {
  totalCategories: number;
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number; // Percentagem de tarefas concluídas
}

/**
 * Estatísticas por Projeto
 */
export interface ProjectStatistics {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
}

/**
 * Estatísticas por Categoria
 */
export interface CategoryStatistics {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

/**
 * Statistics Service
 * 
 * Serviço responsável pelo cálculo e fornecimento de estatísticas.
 * Fornece estatísticas gerais, por projeto e por categoria.
 * 
 * @service StatisticsService
 */
@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private categoryService: CategoryService
  ) {}

  /**
   * Obtém estatísticas gerais
   * @returns Promise com estatísticas gerais
   */
  async getGeneralStatistics(): Promise<GeneralStatistics> {
    const [categories, projects, tasks] = await Promise.all([
      this.categoryService.getAllCategories(),
      this.projectService.getAllProjects(),
      this.taskService.getAllTasks()
    ]);

    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const now = new Date().toISOString();
    const overdueTasks = tasks.filter(t => !t.completed && t.dueDate < now).length;
    
    const completionRate = tasks.length > 0 
      ? (completedTasks / tasks.length) * 100 
      : 0;

    return {
      totalCategories: categories.length,
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate: Math.round(completionRate * 100) / 100
    };
  }

  /**
   * Obtém estatísticas por projeto
   * @returns Promise com array de estatísticas por projeto
   */
  async getProjectStatistics(): Promise<ProjectStatistics[]> {
    const projects = await this.projectService.getAllProjects();
    const tasks = await this.taskService.getAllTasks();
    const now = new Date().toISOString();

    const statistics: ProjectStatistics[] = [];

    for (const project of projects) {
      const projectTasks = tasks.filter(t => t.projectId === project.id);
      const completedTasks = projectTasks.filter(t => t.completed).length;
      const pendingTasks = projectTasks.filter(t => !t.completed).length;
      const overdueTasks = projectTasks.filter(t => !t.completed && t.dueDate < now).length;
      
      const completionRate = projectTasks.length > 0 
        ? (completedTasks / projectTasks.length) * 100 
        : 0;

      statistics.push({
        projectId: project.id,
        projectName: project.name,
        totalTasks: projectTasks.length,
        completedTasks,
        pendingTasks,
        overdueTasks,
        completionRate: Math.round(completionRate * 100) / 100
      });
    }

    // Ordenar por número de tarefas (maior primeiro)
    statistics.sort((a, b) => b.totalTasks - a.totalTasks);

    return statistics;
  }

  /**
   * Obtém estatísticas por categoria
   * @returns Promise com array de estatísticas por categoria
   */
  async getCategoryStatistics(): Promise<CategoryStatistics[]> {
    const categories = await this.categoryService.getAllCategories();
    const projects = await this.projectService.getAllProjects();
    const tasks = await this.taskService.getAllTasks();

    const statistics: CategoryStatistics[] = [];

    for (const category of categories) {
      const categoryProjects = projects.filter(p => p.categoryId === category.id);
      const categoryProjectIds = categoryProjects.map(p => p.id);
      const categoryTasks = tasks.filter(t => categoryProjectIds.includes(t.projectId));
      
      const completedTasks = categoryTasks.filter(t => t.completed).length;
      
      const completionRate = categoryTasks.length > 0 
        ? (completedTasks / categoryTasks.length) * 100 
        : 0;

      statistics.push({
        categoryId: category.id,
        categoryName: category.name,
        categoryColor: category.color,
        totalProjects: categoryProjects.length,
        totalTasks: categoryTasks.length,
        completedTasks,
        completionRate: Math.round(completionRate * 100) / 100
      });
    }

    // Ordenar por número de tarefas (maior primeiro)
    statistics.sort((a, b) => b.totalTasks - a.totalTasks);

    return statistics;
  }

  /**
   * Obtém tarefas por estado
   * @returns Promise com objeto com contadores por estado
   */
  async getTasksByStatus(): Promise<{ completed: number; pending: number; overdue: number }> {
    const tasks = await this.taskService.getAllTasks();
    const now = new Date().toISOString();

    return {
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      overdue: tasks.filter(t => !t.completed && t.dueDate < now).length
    };
  }

  /**
   * Obtém distribuição de tarefas por mês (últimos 6 meses)
   * @returns Promise com array de objetos { month, created, completed }
   */
  async getTasksByMonth(): Promise<Array<{ month: string; created: number; completed: number }>> {
    const tasks = await this.taskService.getAllTasks();
    const months: { [key: string]: { created: number; completed: number } } = {};
    const now = new Date();
    
    // Últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
      months[monthKey] = { created: 0, completed: 0, month: monthName } as any;
    }

    tasks.forEach(task => {
      const createdDate = new Date(task.createdAt);
      const createdMonth = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (months[createdMonth]) {
        months[createdMonth].created++;
      }

      if (task.completed) {
        const completedDate = new Date(task.updatedAt); // Assumir que updatedAt é quando foi completada
        const completedMonth = `${completedDate.getFullYear()}-${String(completedDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (months[completedMonth]) {
          months[completedMonth].completed++;
        }
      }
    });

    return Object.keys(months).map(key => ({
      month: (months[key] as any).month || key,
      created: months[key].created,
      completed: months[key].completed
    }));
  }
}
