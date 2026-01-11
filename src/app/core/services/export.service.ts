import { Injectable } from '@angular/core';
import { CategoryService } from '../../features/categories/services/category.service';
import { ProjectService } from '../../features/projects/services/project.service';
import { TaskService } from '../../features/tasks/services/task.service';
import { Category } from '../models/category.model';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';

/**
 * Export Service
 * 
 * Serviço responsável pela exportação de dados da aplicação.
 * Permite exportar dados em formato JSON ou CSV.
 * 
 * @service ExportService
 */
@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(
    private categoryService: CategoryService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  /**
   * Exporta todos os dados em formato JSON
   * @returns Promise com string JSON
   */
  async exportAllAsJSON(): Promise<string> {
    const [categories, projects, tasks] = await Promise.all([
      this.categoryService.getAllCategories(),
      this.projectService.getAllProjects(),
      this.taskService.getAllTasks()
    ]);

    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      categories,
      projects,
      tasks
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Exporta categorias em formato JSON
   * @returns Promise com string JSON
   */
  async exportCategoriesAsJSON(): Promise<string> {
    const categories = await this.categoryService.getAllCategories();
    return JSON.stringify(categories, null, 2);
  }

  /**
   * Exporta projetos em formato JSON
   * @returns Promise com string JSON
   */
  async exportProjectsAsJSON(): Promise<string> {
    const projects = await this.projectService.getAllProjects();
    return JSON.stringify(projects, null, 2);
  }

  /**
   * Exporta tarefas em formato JSON
   * @returns Promise com string JSON
   */
  async exportTasksAsJSON(): Promise<string> {
    const tasks = await this.taskService.getAllTasks();
    return JSON.stringify(tasks, null, 2);
  }

  /**
   * Exporta todos os dados em formato CSV
   * @returns Promise com string CSV
   */
  async exportAllAsCSV(): Promise<string> {
    const [categories, projects, tasks] = await Promise.all([
      this.categoryService.getAllCategories(),
      this.projectService.getAllProjects(),
      this.taskService.getAllTasks()
    ]);

    let csv = 'PROJEFA EXPORT - ' + new Date().toISOString() + '\n\n';

    // Categorias
    csv += 'CATEGORIAS\n';
    csv += 'ID,Nome,Cor,Ícone,Data de Criação\n';
    categories.forEach(cat => {
      csv += `${this.escapeCSV(cat.id)},${this.escapeCSV(cat.name)},${this.escapeCSV(cat.color)},${this.escapeCSV(cat.icon)},${this.escapeCSV(cat.createdAt)}\n`;
    });
    csv += '\n';

    // Projetos
    csv += 'PROJETOS\n';
    csv += 'ID,Nome,Categoria ID,Data de Criação,Data de Atualização\n';
    projects.forEach(proj => {
      csv += `${this.escapeCSV(proj.id)},${this.escapeCSV(proj.name)},${this.escapeCSV(proj.categoryId)},${this.escapeCSV(proj.createdAt)},${this.escapeCSV(proj.updatedAt)}\n`;
    });
    csv += '\n';

    // Tarefas
    csv += 'TAREFAS\n';
    csv += 'ID,Projeto ID,Título,Descrição,Data Limite,Concluída,Ordem,Data de Criação,Data de Atualização\n';
    tasks.forEach(task => {
      csv += `${this.escapeCSV(task.id)},${this.escapeCSV(task.projectId)},${this.escapeCSV(task.title)},${this.escapeCSV(task.description || '')},${this.escapeCSV(task.dueDate)},${task.completed ? 'Sim' : 'Não'},${task.order},${this.escapeCSV(task.createdAt)},${this.escapeCSV(task.updatedAt)}\n`;
    });

    return csv;
  }

  /**
   * Exporta categorias em formato CSV
   * @returns Promise com string CSV
   */
  async exportCategoriesAsCSV(): Promise<string> {
    const categories = await this.categoryService.getAllCategories();
    let csv = 'ID,Nome,Cor,Ícone,Data de Criação\n';
    categories.forEach(cat => {
      csv += `${this.escapeCSV(cat.id)},${this.escapeCSV(cat.name)},${this.escapeCSV(cat.color)},${this.escapeCSV(cat.icon)},${this.escapeCSV(cat.createdAt)}\n`;
    });
    return csv;
  }

  /**
   * Exporta projetos em formato CSV
   * @returns Promise com string CSV
   */
  async exportProjectsAsCSV(): Promise<string> {
    const projects = await this.projectService.getAllProjects();
    let csv = 'ID,Nome,Categoria ID,Data de Criação,Data de Atualização\n';
    projects.forEach(proj => {
      csv += `${this.escapeCSV(proj.id)},${this.escapeCSV(proj.name)},${this.escapeCSV(proj.categoryId)},${this.escapeCSV(proj.createdAt)},${this.escapeCSV(proj.updatedAt)}\n`;
    });
    return csv;
  }

  /**
   * Exporta tarefas em formato CSV
   * @returns Promise com string CSV
   */
  async exportTasksAsCSV(): Promise<string> {
    const tasks = await this.taskService.getAllTasks();
    let csv = 'ID,Projeto ID,Título,Descrição,Data Limite,Concluída,Ordem,Data de Criação,Data de Atualização\n';
    tasks.forEach(task => {
      csv += `${this.escapeCSV(task.id)},${this.escapeCSV(task.projectId)},${this.escapeCSV(task.title)},${this.escapeCSV(task.description || '')},${this.escapeCSV(task.dueDate)},${task.completed ? 'Sim' : 'Não'},${task.order},${this.escapeCSV(task.createdAt)},${this.escapeCSV(task.updatedAt)}\n`;
    });
    return csv;
  }

  /**
   * Faz download de um ficheiro
   * @param content - Conteúdo do ficheiro
   * @param filename - Nome do ficheiro
   * @param mimeType - Tipo MIME
   */
  downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Escapa caracteres especiais para CSV
   * @param value - Valor a escapar
   * @returns String escapada
   */
  private escapeCSV(value: string): string {
    if (value === null || value === undefined) {
      return '';
    }
    const stringValue = String(value);
    // Se contém vírgula, nova linha ou aspas, envolver em aspas e duplicar aspas
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  /**
   * Gera nome de ficheiro com timestamp
   * @param prefix - Prefixo do nome
   * @param extension - Extensão do ficheiro
   * @returns Nome do ficheiro
   */
  generateFilename(prefix: string, extension: string): string {
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return `${prefix}_${timestamp}.${extension}`;
  }
}
