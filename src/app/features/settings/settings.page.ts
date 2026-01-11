import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';
import { ToastController } from '@ionic/angular';

/**
 * Settings Page
 * 
 * Página de configurações da aplicação.
 * Permite configurar notificações, modo escuro e outras preferências.
 * 
 * @component SettingsPage
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {
  /**
   * Indica se as notificações estão ativadas
   */
  notificationsEnabled: boolean = true;

  /**
   * Hora do lembrete diário
   */
  notificationHour: number = 9;

  /**
   * Minuto do lembrete diário
   */
  notificationMinute: number = 0;

  /**
   * Minutos antes da data limite para notificar
   */
  notificationMinutesBefore: number = 60;

  /**
   * Indica se o modo escuro está ativado
   */
  darkModeEnabled: boolean = false;

  constructor(
    private settingsService: SettingsService,
    private toastController: ToastController
  ) {}

  /**
   * Inicializa o componente
   */
  async ngOnInit(): Promise<void> {
    await this.loadSettings();
  }

  /**
   * Carrega as configurações atuais
   */
  async loadSettings(): Promise<void> {
    this.notificationsEnabled = await this.settingsService.areNotificationsEnabled();
    this.darkModeEnabled = await this.settingsService.isDarkModeEnabled();
    
    const notificationTime = await this.settingsService.getNotificationTime();
    this.notificationHour = notificationTime.hour;
    this.notificationMinute = notificationTime.minute;
    
    this.notificationMinutesBefore = await this.settingsService.getNotificationMinutesBefore();
  }

  /**
   * Alterna as notificações
   * @param event - Evento do toggle
   */
  async toggleNotifications(event: any): Promise<void> {
    const enabled = event.detail.checked;
    await this.settingsService.setNotificationsEnabled(enabled);
    await this.showToast(
      enabled ? 'Notificações ativadas' : 'Notificações desativadas',
      enabled ? 'success' : 'medium'
    );
  }

  /**
   * Alterna o modo escuro
   * @param event - Evento do toggle
   */
  async toggleDarkMode(event: any): Promise<void> {
    const enabled = event.detail.checked;
    await this.settingsService.setDarkModeEnabled(enabled);
    await this.showToast(
      enabled ? 'Modo escuro ativado' : 'Modo claro ativado',
      'success'
    );
  }

  /**
   * Atualiza a hora do lembrete diário
   * @param event - Evento do input
   */
  async updateNotificationTime(): Promise<void> {
    await this.settingsService.setNotificationTime(this.notificationHour, this.notificationMinute);
    await this.showToast('Hora do lembrete atualizada', 'success');
  }

  /**
   * Atualiza os minutos antes da data limite
   * @param event - Evento do input
   */
  async updateNotificationMinutesBefore(): Promise<void> {
    await this.settingsService.setNotificationMinutesBefore(this.notificationMinutesBefore);
    await this.showToast('Tempo de notificação atualizado', 'success');
  }

  /**
   * Mostra um toast (notificação)
   * @param message - Mensagem a exibir
   * @param color - Cor do toast
   */
  private async showToast(message: string, color: 'success' | 'danger' | 'warning' | 'medium' = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
