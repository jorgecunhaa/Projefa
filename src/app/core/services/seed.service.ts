import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { StorageService } from './storage.service';
import { CategoryService } from '../../features/categories/services/category.service';
import { ProjectService } from '../../features/projects/services/project.service';
import { TaskService } from '../../features/tasks/services/task.service';
import { CreateCategoryDto } from '../models/category.model';
import { CreateProjectDto } from '../models/project.model';
import { CreateTaskDto } from '../models/task.model';

/**
 * Seed Service
 * 
 * Serviço responsável por popular a base de dados com dados iniciais.
 * Executa apenas uma vez quando a aplicação é iniciada pela primeira vez.
 * 
 * @service SeedService
 */
@Injectable({
  providedIn: 'root'
})
export class SeedService {
  private readonly SEED_EXECUTED_KEY = 'seedExecuted';

  constructor(
    private databaseService: DatabaseService,
    private storageService: StorageService,
    private categoryService: CategoryService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  /**
   * Verifica se o seed já foi executado
   * @returns Promise com true se já foi executado
   */
  async hasSeedBeenExecuted(): Promise<boolean> {
    const executed = await this.storageService.getSetting<boolean>(this.SEED_EXECUTED_KEY, false);
    return executed ?? false;
  }

  /**
   * Marca o seed como executado
   */
  private async markSeedAsExecuted(): Promise<void> {
    await this.storageService.setSetting(this.SEED_EXECUTED_KEY, true);
  }

  /**
   * Executa o seed se ainda não foi executado
   */
  async seedIfNeeded(): Promise<void> {
    const alreadyExecuted = await this.hasSeedBeenExecuted();
    if (alreadyExecuted) {
      console.log('Seed já foi executado anteriormente');
      return;
    }

    try {
      console.log('Iniciando seed da base de dados...');
      await this.seedDatabase();
      await this.markSeedAsExecuted();
      console.log('Seed da base de dados concluído com sucesso');
    } catch (error) {
      console.error('Erro ao executar seed:', error);
      // Não marcar como executado se houver erro
    }
  }

  /**
   * Popula a base de dados com dados iniciais
   */
  private async seedDatabase(): Promise<void> {
    // Criar categorias
    const categories = await this.createCategories();
    
    // Criar projetos
    const projects = await this.createProjects(categories);
    
    // Criar tarefas
    await this.createTasks(projects);
  }

  /**
   * Cria categorias iniciais
   * @returns Promise com array de IDs das categorias criadas
   */
  private async createCategories(): Promise<string[]> {
    const categoriesData: CreateCategoryDto[] = [
      {
        name: 'Pessoal',
        color: '#8B0000', // Bordô
        icon: 'person-outline'
      },
      {
        name: 'Trabalho',
        color: '#0066CC',
        icon: 'briefcase-outline'
      },
      {
        name: 'Escola',
        color: '#00AA00',
        icon: 'school-outline'
      },
      {
        name: 'Casa',
        color: '#FF6600',
        icon: 'home-outline'
      },
      {
        name: 'Saúde',
        color: '#CC0066',
        icon: 'medical-outline'
      }
    ];

    const categoryIds: string[] = [];

    for (const categoryData of categoriesData) {
      try {
        const category = await this.categoryService.createCategory(categoryData);
        categoryIds.push(category.id);
      } catch (error) {
        console.error(`Erro ao criar categoria ${categoryData.name}:`, error);
      }
    }

    return categoryIds;
  }

  /**
   * Cria projetos iniciais
   * @param categoryIds - IDs das categorias criadas
   * @returns Promise com array de IDs dos projetos criados
   */
  private async createProjects(categoryIds: string[]): Promise<string[]> {
    if (categoryIds.length === 0) {
      return [];
    }

    const projectsData: CreateProjectDto[] = [
      {
        name: 'Projeto Final de Curso',
        categoryId: categoryIds[2] || categoryIds[0] // Escola ou primeira disponível
      },
      {
        name: 'Tarefas do Trabalho',
        categoryId: categoryIds[1] || categoryIds[0] // Trabalho ou primeira disponível
      },
      {
        name: 'Organização Pessoal',
        categoryId: categoryIds[0] || categoryIds[0] // Pessoal
      },
      {
        name: 'Manutenção da Casa',
        categoryId: categoryIds[3] || categoryIds[0] // Casa ou primeira disponível
      }
    ];

    const projectIds: string[] = [];

    for (const projectData of projectsData) {
      try {
        const project = await this.projectService.createProject(projectData);
        projectIds.push(project.id);
      } catch (error) {
        console.error(`Erro ao criar projeto ${projectData.name}:`, error);
      }
    }

    return projectIds;
  }

  /**
   * Cria tarefas iniciais
   * @param projectIds - IDs dos projetos criados
   */
  private async createTasks(projectIds: string[]): Promise<void> {
    if (projectIds.length === 0) {
      return;
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const tasksData: CreateTaskDto[] = [
      {
        title: 'Revisar documentação do projeto',
        description: 'Revisar toda a documentação antes da entrega final',
        dueDate: tomorrow.toISOString(),
        projectId: projectIds[0] || projectIds[0]
      },
      {
        title: 'Preparar apresentação',
        description: 'Criar slides para a apresentação do projeto final',
        dueDate: nextWeek.toISOString(),
        projectId: projectIds[0] || projectIds[0]
      },
      {
        title: 'Reunião de equipa',
        description: 'Reunião semanal para alinhamento de objetivos',
        dueDate: tomorrow.toISOString(),
        projectId: projectIds[1] || projectIds[0]
      },
      {
        title: 'Planeamento semanal',
        description: 'Definir objetivos e tarefas para a próxima semana',
        dueDate: nextWeek.toISOString(),
        projectId: projectIds[1] || projectIds[0]
      },
      {
        title: 'Exercício físico',
        description: 'Manter rotina de exercícios',
        dueDate: tomorrow.toISOString(),
        projectId: projectIds[2] || projectIds[0]
      },
      {
        title: 'Organizar escritório',
        description: 'Limpar e organizar o espaço de trabalho',
        dueDate: nextWeek.toISOString(),
        projectId: projectIds[2] || projectIds[0]
      },
      {
        title: 'Limpeza geral',
        description: 'Limpeza profunda da casa',
        dueDate: nextWeek.toISOString(),
        projectId: projectIds[3] || projectIds[0]
      },
      {
        title: 'Manutenção do jardim',
        description: 'Cortar relva e podar plantas',
        dueDate: nextMonth.toISOString(),
        projectId: projectIds[3] || projectIds[0]
      }
    ];

    for (const taskData of tasksData) {
      try {
        await this.taskService.createTask(taskData);
      } catch (error) {
        console.error(`Erro ao criar tarefa ${taskData.title}:`, error);
      }
    }
  }

  /**
   * Reseta o seed (útil para testes ou desenvolvimento)
   */
  async resetSeed(): Promise<void> {
    await this.storageService.setSetting(this.SEED_EXECUTED_KEY, false);
    console.log('Seed resetado. Será executado novamente no próximo arranque.');
  }
}
