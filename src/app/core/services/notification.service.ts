import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Task } from '../models/task.model';

/**
 * Notification Service
 * 
 * Serviço responsável pelo agendamento e gestão de notificações locais.
 * Permite notificar o utilizador sobre tarefas próximas da data limite.
 * 
 * @service NotificationService
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private isInitialized = false;

  constructor() {
    this.initializeNotifications();
  }

  /**
   * Inicializa o sistema de notificações
   */
  private async initializeNotifications(): Promise<void> {
    try {
      if (!Capacitor.isNativePlatform()) {
        console.warn('Notificações locais só estão disponíveis em plataformas nativas.');
        return;
      }

      // Solicitar permissão para notificações
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display === 'granted') {
        this.isInitialized = true;
        console.log('Sistema de notificações inicializado com sucesso');
      } else {
        console.warn('Permissão para notificações negada');
      }
    } catch (error) {
      console.error('Erro ao inicializar notificações:', error);
    }
  }

  /**
   * Verifica se as notificações estão disponíveis
   */
  isAvailable(): boolean {
    return Capacitor.isNativePlatform() && this.isInitialized;
  }

  /**
   * Agenda uma notificação para uma tarefa
   * @param task - Tarefa para a qual agendar a notificação
   * @param minutesBefore - Minutos antes da data limite para notificar (padrão: 60)
   */
  async scheduleTaskNotification(task: Task, minutesBefore: number = 60): Promise<void> {
    if (!this.isAvailable()) {
      console.warn('Notificações não estão disponíveis');
      return;
    }

    try {
      const dueDate = new Date(task.dueDate);
      const notificationTime = new Date(dueDate.getTime() - minutesBefore * 60 * 1000);
      const now = new Date();

      // Só agendar se a data de notificação for no futuro
      if (notificationTime <= now) {
        console.log('Data de notificação já passou, não será agendada');
        return;
      }

      // Cancelar notificação anterior se existir
      await this.cancelTaskNotification(task.id);

      // Agendar nova notificação
      await LocalNotifications.schedule({
        notifications: [
          {
            id: this.getNotificationId(task.id),
            title: 'Tarefa Próxima',
            body: `A tarefa "${task.title}" está próxima da data limite!`,
            schedule: { at: notificationTime },
            sound: 'beep.wav',
            attachments: [],
            actionTypeId: 'TASK_NOTIFICATION',
            extra: {
              taskId: task.id,
              projectId: task.projectId
            }
          }
        ]
      });

      console.log(`Notificação agendada para a tarefa ${task.id}`);
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
    }
  }

  /**
   * Agenda notificações para múltiplas tarefas
   * @param tasks - Array de tarefas
   * @param minutesBefore - Minutos antes da data limite
   */
  async scheduleMultipleTaskNotifications(tasks: Task[], minutesBefore: number = 60): Promise<void> {
    if (!this.isAvailable()) {
      return;
    }

    for (const task of tasks) {
      await this.scheduleTaskNotification(task, minutesBefore);
    }
  }

  /**
   * Cancela a notificação de uma tarefa
   * @param taskId - ID da tarefa
   */
  async cancelTaskNotification(taskId: string): Promise<void> {
    if (!this.isAvailable()) {
      return;
    }

    try {
      await LocalNotifications.cancel({
        notifications: [{ id: this.getNotificationId(taskId) }]
      });
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }

  /**
   * Cancela todas as notificações agendadas
   */
  async cancelAllNotifications(): Promise<void> {
    if (!this.isAvailable()) {
      return;
    }

    try {
      // Obter todas as notificações pendentes e cancelá-las
      const pending = await this.getPendingNotifications();
      if (pending.length > 0) {
        const ids = pending.map(n => n.id);
        await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
      }
      console.log('Todas as notificações foram canceladas');
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  }

  /**
   * Obtém todas as notificações pendentes
   */
  async getPendingNotifications(): Promise<any[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const result = await LocalNotifications.getPending();
      return result.notifications || [];
    } catch (error) {
      console.error('Erro ao obter notificações pendentes:', error);
      return [];
    }
  }

  /**
   * Mostra uma notificação imediata (para testes)
   * @param title - Título da notificação
   * @param body - Corpo da notificação
   */
  async showImmediateNotification(title: string, body: string): Promise<void> {
    if (!this.isAvailable()) {
      console.log(`[Notification] ${title}: ${body}`);
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            sound: 'beep.wav'
          }
        ]
      });
    } catch (error) {
      console.error('Erro ao mostrar notificação imediata:', error);
    }
  }

  /**
   * Converte o ID da tarefa para um ID de notificação único
   * @param taskId - ID da tarefa
   * @returns ID numérico para a notificação
   */
  private getNotificationId(taskId: string): number {
    // Converte o ID da tarefa para um número usando hash simples
    let hash = 0;
    for (let i = 0; i < taskId.length; i++) {
      const char = taskId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 2147483647; // Máximo ID do Capacitor
  }

  /**
   * Agenda notificações diárias para verificar tarefas próximas
   * @param hour - Hora do dia para verificar (0-23)
   * @param minute - Minuto da hora (0-59)
   */
  async scheduleDailyReminder(hour: number = 9, minute: number = 0): Promise<void> {
    if (!this.isAvailable()) {
      return;
    }

    try {
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(hour, minute, 0, 0);

      // Se a hora já passou hoje, agendar para amanhã
      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 999999, // ID fixo para o lembrete diário
            title: 'Verificar Tarefas',
            body: 'Tens tarefas para revisar hoje!',
            schedule: {
              at: reminderTime,
              repeats: true,
              every: 'day'
            },
            sound: 'beep.wav',
            actionTypeId: 'DAILY_REMINDER'
          }
        ]
      });

      console.log('Lembrete diário agendado');
    } catch (error) {
      console.error('Erro ao agendar lembrete diário:', error);
    }
  }
}
