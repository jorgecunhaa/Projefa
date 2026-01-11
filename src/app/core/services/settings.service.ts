import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

/**
 * Settings Service
 * 
 * Serviço responsável pela gestão de configurações da aplicação.
 * Permite guardar e recuperar preferências do utilizador.
 * 
 * @service SettingsService
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly NOTIFICATIONS_ENABLED_KEY = 'notificationsEnabled';
  private readonly NOTIFICATION_TIME_KEY = 'notificationTime';
  private readonly NOTIFICATION_MINUTES_BEFORE_KEY = 'notificationMinutesBefore';
  private readonly DARK_MODE_KEY = 'darkMode';

  constructor(
    private storageService: StorageService,
    private notificationService: NotificationService
  ) {}

  /**
   * Verifica se as notificações estão ativadas
   * @returns Promise com true se estiverem ativadas
   */
  async areNotificationsEnabled(): Promise<boolean> {
    const value = await this.storageService.getSetting<boolean>(this.NOTIFICATIONS_ENABLED_KEY, true);
    return value ?? true;
  }

  /**
   * Ativa ou desativa as notificações
   * @param enabled - Estado das notificações
   */
  async setNotificationsEnabled(enabled: boolean): Promise<void> {
    await this.storageService.setSetting(this.NOTIFICATIONS_ENABLED_KEY, enabled);
    
    if (!enabled) {
      // Cancelar todas as notificações se desativadas
      await this.notificationService.cancelAllNotifications();
    } else {
      // Reagendar lembrete diário se ativadas
      const time = await this.getNotificationTime();
      await this.notificationService.scheduleDailyReminder(time.hour, time.minute);
    }
  }

  /**
   * Obtém a hora do lembrete diário
   * @returns Promise com objeto {hour, minute}
   */
  async getNotificationTime(): Promise<{ hour: number; minute: number }> {
    const time = await this.storageService.getSetting<{ hour: number; minute: number }>(
      this.NOTIFICATION_TIME_KEY,
      { hour: 9, minute: 0 }
    );
    return time || { hour: 9, minute: 0 };
  }

  /**
   * Define a hora do lembrete diário
   * @param hour - Hora (0-23)
   * @param minute - Minuto (0-59)
   */
  async setNotificationTime(hour: number, minute: number): Promise<void> {
    await this.storageService.setSetting(this.NOTIFICATION_TIME_KEY, { hour, minute });
    
    // Reagendar lembrete diário
    const enabled = await this.areNotificationsEnabled();
    if (enabled) {
      await this.notificationService.scheduleDailyReminder(hour, minute);
    }
  }

  /**
   * Obtém os minutos antes da data limite para notificar
   * @returns Promise com número de minutos
   */
  async getNotificationMinutesBefore(): Promise<number> {
    const value = await this.storageService.getSetting<number>(this.NOTIFICATION_MINUTES_BEFORE_KEY, 60);
    return value ?? 60;
  }

  /**
   * Define os minutos antes da data limite para notificar
   * @param minutes - Número de minutos
   */
  async setNotificationMinutesBefore(minutes: number): Promise<void> {
    await this.storageService.setSetting(this.NOTIFICATION_MINUTES_BEFORE_KEY, minutes);
  }

  /**
   * Verifica se o modo escuro está ativado
   * @returns Promise com true se estiver ativado
   */
  async isDarkModeEnabled(): Promise<boolean> {
    const value = await this.storageService.getSetting<boolean>(this.DARK_MODE_KEY, false);
    return value ?? false;
  }

  /**
   * Ativa ou desativa o modo escuro
   * @param enabled - Estado do modo escuro
   */
  async setDarkModeEnabled(enabled: boolean): Promise<void> {
    await this.storageService.setSetting(this.DARK_MODE_KEY, enabled);
    this.applyDarkMode(enabled);
  }

  /**
   * Aplica o modo escuro ao documento
   * @param enabled - Estado do modo escuro
   */
  private applyDarkMode(enabled: boolean): void {
    document.body.classList.toggle('dark', enabled);
  }

  /**
   * Inicializa as configurações
   */
  async initializeSettings(): Promise<void> {
    // Aplicar modo escuro se estiver ativado
    const darkMode = await this.isDarkModeEnabled();
    this.applyDarkMode(darkMode);
  }
}
