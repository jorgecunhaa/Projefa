import { Injectable } from '@angular/core';
import { TaskService } from '../../tasks/services/task.service';
import { Task } from '../../../core/models/task.model';

/**
 * Calendar Service
 * 
 * Serviço responsável pela gestão de dados do calendário.
 * Fornece métodos para obter tarefas por data, mês e
 * organizar tarefas para exibição no calendário.
 * 
 * @service CalendarService
 */
@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor(private taskService: TaskService) {}

  /**
   * Obtém tarefas de um mês específico
   * @param year - Ano
   * @param month - Mês (1-12)
   * @returns Promise com array de tarefas
   */
  async getTasksForMonth(year: number, month: number): Promise<Task[]> {
    return await this.taskService.getTasksByMonth(year, month);
  }

  /**
   * Obtém tarefas de uma data específica
   * @param date - Data (Date object ou ISO string)
   * @returns Promise com array de tarefas
   */
  async getTasksForDate(date: Date | string): Promise<Task[]> {
    const dateStr = typeof date === 'string' ? date : date.toISOString();
    return await this.taskService.getTasksByDate(dateStr);
  }

  /**
   * Organiza tarefas por dia do mês
   * @param tasks - Array de tarefas
   * @param year - Ano
   * @param month - Mês (1-12)
   * @returns Objeto com chaves sendo os dias (1-31) e valores sendo arrays de tarefas
   */
  organizeTasksByDay(tasks: Task[], year: number, month: number): { [day: number]: Task[] } {
    const organized: { [day: number]: Task[] } = {};

    tasks.forEach(task => {
      const taskDate = new Date(task.dueDate);
      const taskYear = taskDate.getFullYear();
      const taskMonth = taskDate.getMonth() + 1;
      const taskDay = taskDate.getDate();

      if (taskYear === year && taskMonth === month) {
        if (!organized[taskDay]) {
          organized[taskDay] = [];
        }
        organized[taskDay].push(task);
      }
    });

    return organized;
  }

  /**
   * Obtém o número de tarefas para cada dia do mês
   * @param tasks - Array de tarefas
   * @param year - Ano
   * @param month - Mês (1-12)
   * @returns Objeto com chaves sendo os dias e valores sendo o número de tarefas
   */
  getTaskCountsByDay(tasks: Task[], year: number, month: number): { [day: number]: number } {
    const organized = this.organizeTasksByDay(tasks, year, month);
    const counts: { [day: number]: number } = {};

    Object.keys(organized).forEach(day => {
      counts[parseInt(day)] = organized[parseInt(day)].length;
    });

    return counts;
  }

  /**
   * Obtém o número de tarefas em atraso para cada dia do mês
   * @param tasks - Array de tarefas
   * @param year - Ano
   * @param month - Mês (1-12)
   * @returns Objeto com chaves sendo os dias e valores sendo o número de tarefas em atraso
   */
  getOverdueCountsByDay(tasks: Task[], year: number, month: number): { [day: number]: number } {
    const organized = this.organizeTasksByDay(tasks, year, month);
    const counts: { [day: number]: number } = {};
    const now = new Date();

    Object.keys(organized).forEach(day => {
      const dayTasks = organized[parseInt(day)];
      counts[parseInt(day)] = dayTasks.filter(task => {
        if (task.completed) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate < now;
      }).length;
    });

    return counts;
  }

  /**
   * Verifica se uma data tem tarefas
   * @param tasks - Array de tarefas
   * @param date - Data a verificar
   * @returns true se a data tiver tarefas
   */
  hasTasksOnDate(tasks: Task[], date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.some(task => {
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  }

  /**
   * Verifica se uma data tem tarefas em atraso
   * @param tasks - Array de tarefas
   * @param date - Data a verificar
   * @returns true se a data tiver tarefas em atraso
   */
  hasOverdueTasksOnDate(tasks: Task[], date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    const now = new Date().toISOString().split('T')[0];
    
    return tasks.some(task => {
      if (task.completed) return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateStr && taskDate < now;
    });
  }

  /**
   * Obtém o primeiro dia da semana de um mês
   * @param year - Ano
   * @param month - Mês (1-12)
   * @returns Dia da semana (0 = Domingo, 6 = Sábado)
   */
  getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month - 1, 1).getDay();
  }

  /**
   * Obtém o número de dias num mês
   * @param year - Ano
   * @param month - Mês (1-12)
   * @returns Número de dias
   */
  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  /**
   * Obtém os nomes dos meses em português
   * @returns Array com nomes dos meses
   */
  getMonthNames(): string[] {
    return [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
  }

  /**
   * Obtém os nomes dos dias da semana em português
   * @returns Array com nomes dos dias (começando em Domingo)
   */
  getDayNames(): string[] {
    return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  }
}
