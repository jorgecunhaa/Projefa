import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TaskService } from '../tasks/services/task.service';
import { CalendarService } from './services/calendar.service';
import { Task } from '../../core/models/task.model';
import { TaskFormComponent } from '../tasks/task-form/task-form.component';

/**
 * Calendar Page
 * 
 * Página de calendário para visualizar tarefas por data.
 * Permite navegar entre meses, ver tarefas de cada dia
 * e selecionar tarefas para visualizar/editar.
 * 
 * @component CalendarPage
 */
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: false
})
export class CalendarPage implements OnInit {
  /**
   * Ano atual do calendário
   */
  currentYear: number = new Date().getFullYear();

  /**
   * Mês atual do calendário (1-12)
   */
  currentMonth: number = new Date().getMonth() + 1;

  /**
   * Tarefas do mês atual
   */
  tasks: Task[] = [];

  /**
   * Tarefas organizadas por dia
   */
  tasksByDay: { [day: number]: Task[] } = {};

  /**
   * Contadores de tarefas por dia
   */
  taskCountsByDay: { [day: number]: number } = {};

  /**
   * Contadores de tarefas em atraso por dia
   */
  overdueCountsByDay: { [day: number]: number } = {};

  /**
   * Dia selecionado
   */
  selectedDay: number | null = null;

  /**
   * Tarefas do dia selecionado
   */
  selectedDayTasks: Task[] = [];

  /**
   * Indica se está a carregar dados
   */
  isLoading: boolean = false;

  /**
   * Nomes dos meses
   */
  monthNames: string[] = [];

  /**
   * Nomes dos dias da semana
   */
  dayNames: string[] = [];

  /**
   * Dias do mês para exibição no calendário
   */
  calendarDays: (number | null)[] = [];

  constructor(
    private taskService: TaskService,
    private calendarService: CalendarService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router
  ) {}

  /**
   * Inicializa o componente
   */
  async ngOnInit(): Promise<void> {
    this.monthNames = this.calendarService.getMonthNames();
    this.dayNames = this.calendarService.getDayNames();
    await this.loadCalendarData();
  }

  /**
   * Carrega os dados do calendário
   */
  async loadCalendarData(): Promise<void> {
    this.isLoading = true;
    try {
      this.tasks = await this.calendarService.getTasksForMonth(this.currentYear, this.currentMonth);
      this.tasksByDay = this.calendarService.organizeTasksByDay(this.tasks, this.currentYear, this.currentMonth);
      this.taskCountsByDay = this.calendarService.getTaskCountsByDay(this.tasks, this.currentYear, this.currentMonth);
      this.overdueCountsByDay = this.calendarService.getOverdueCountsByDay(this.tasks, this.currentYear, this.currentMonth);
      this.buildCalendar();
      
      // Selecionar dia atual se estiver no mês atual
      const today = new Date();
      if (today.getFullYear() === this.currentYear && today.getMonth() + 1 === this.currentMonth) {
        this.selectDay(today.getDate());
      }
    } catch (error) {
      console.error('Erro ao carregar dados do calendário:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Constrói a matriz do calendário
   */
  private buildCalendar(): void {
    const firstDay = this.calendarService.getFirstDayOfMonth(this.currentYear, this.currentMonth);
    const daysInMonth = this.calendarService.getDaysInMonth(this.currentYear, this.currentMonth);
    
    this.calendarDays = [];
    
    // Adicionar dias vazios no início
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push(null);
    }
    
    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      this.calendarDays.push(day);
    }
  }

  /**
   * Navega para o mês anterior
   */
  async previousMonth(): Promise<void> {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.selectedDay = null;
    this.selectedDayTasks = [];
    await this.loadCalendarData();
  }

  /**
   * Navega para o próximo mês
   */
  async nextMonth(): Promise<void> {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.selectedDay = null;
    this.selectedDayTasks = [];
    await this.loadCalendarData();
  }

  /**
   * Vai para o mês atual
   */
  async goToToday(): Promise<void> {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth() + 1;
    this.selectedDay = null;
    this.selectedDayTasks = [];
    await this.loadCalendarData();
  }

  /**
   * Seleciona um dia
   * @param day - Dia a selecionar
   */
  selectDay(day: number): void {
    this.selectedDay = day;
    this.selectedDayTasks = this.tasksByDay[day] || [];
  }

  /**
   * Verifica se um dia tem tarefas
   * @param day - Dia a verificar
   * @returns true se tiver tarefas
   */
  hasTasks(day: number | null): boolean {
    if (day === null) return false;
    return (this.taskCountsByDay[day] || 0) > 0;
  }

  /**
   * Verifica se um dia tem tarefas em atraso
   * @param day - Dia a verificar
   * @returns true se tiver tarefas em atraso
   */
  hasOverdueTasks(day: number | null): boolean {
    if (day === null) return false;
    return (this.overdueCountsByDay[day] || 0) > 0;
  }

  /**
   * Obtém o número de tarefas de um dia
   * @param day - Dia
   * @returns Número de tarefas
   */
  getTaskCount(day: number | null): number {
    if (day === null) return 0;
    return this.taskCountsByDay[day] || 0;
  }

  /**
   * Verifica se um dia é hoje
   * @param day - Dia a verificar
   * @returns true se for hoje
   */
  isToday(day: number | null): boolean {
    if (day === null) return false;
    const today = new Date();
    return today.getFullYear() === this.currentYear &&
           today.getMonth() + 1 === this.currentMonth &&
           today.getDate() === day;
  }

  /**
   * Verifica se um dia está selecionado
   * @param day - Dia a verificar
   * @returns true se estiver selecionado
   */
  isSelected(day: number | null): boolean {
    return day !== null && this.selectedDay === day;
  }

  /**
   * Navega para os detalhes de uma tarefa
   * @param taskId - ID da tarefa
   */
  navigateToTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  /**
   * Abre o modal para criar uma tarefa no dia selecionado
   */
  async createTaskForSelectedDay(): Promise<void> {
    if (this.selectedDay === null) {
      return;
    }

    const selectedDate = new Date(this.currentYear, this.currentMonth - 1, this.selectedDay);
    const dateStr = selectedDate.toISOString().split('T')[0];

    const modal = await this.modalController.create({
      component: TaskFormComponent,
      componentProps: {
        task: null,
        initialDate: dateStr
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.saved) {
      await this.loadCalendarData();
    }
  }

  /**
   * Obtém o nome do mês atual
   * @returns Nome do mês
   */
  getCurrentMonthName(): string {
    return this.monthNames[this.currentMonth - 1];
  }
}
