import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../core/services/settings.service';
import { OrientationService } from '../../core/services/orientation.service';
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
   * Formulário reativo para configurações
   */
  settingsForm!: FormGroup;

  /**
   * Indica se o controlo de orientação está disponível
   */
  orientationControlAvailable: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private orientationService: OrientationService,
    private toastController: ToastController
  ) {
    this.initializeForm();
  }

  /**
   * Inicializa o formulário
   */
  private initializeForm(): void {
    this.settingsForm = this.formBuilder.group({
      darkModeEnabled: [false],
      notificationsEnabled: [true],
      notificationHour: [9, [Validators.required, Validators.min(0), Validators.max(23)]],
      notificationMinute: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      notificationMinutesBefore: [60, [Validators.required, Validators.min(1), Validators.max(1440)]],
      orientationLock: ['portrait']
    });
  }

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
    const notificationsEnabled = await this.settingsService.areNotificationsEnabled();
    const darkModeEnabled = await this.settingsService.isDarkModeEnabled();
    
    const notificationTime = await this.settingsService.getNotificationTime();
    const notificationMinutesBefore = await this.settingsService.getNotificationMinutesBefore();

    // Verificar se o controlo de orientação está disponível
    this.orientationControlAvailable = this.orientationService.isServiceAvailable();
    let orientationLock: 'portrait' | 'landscape' | 'unlocked' = 'portrait';
    if (this.orientationControlAvailable) {
      orientationLock = await this.settingsService.getOrientationLock();
    }

    // Atualizar formulário com valores carregados
    this.settingsForm.patchValue({
      darkModeEnabled,
      notificationsEnabled,
      notificationHour: notificationTime.hour,
      notificationMinute: notificationTime.minute,
      notificationMinutesBefore,
      orientationLock
    });
  }

  /**
   * Alterna as notificações
   * @param event - Evento do toggle
   */
  async toggleNotifications(event: any): Promise<void> {
    const enabled = event.detail.checked;
    this.settingsForm.patchValue({ notificationsEnabled: enabled });
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
    this.settingsForm.patchValue({ darkModeEnabled: enabled });
    await this.settingsService.setDarkModeEnabled(enabled);
    await this.showToast(
      enabled ? 'Modo escuro ativado' : 'Modo claro ativado',
      'success'
    );
  }

  /**
   * Atualiza a hora do lembrete diário
   */
  async updateNotificationTime(): Promise<void> {
    const hour = this.settingsForm.get('notificationHour')?.value;
    const minute = this.settingsForm.get('notificationMinute')?.value;
    
    if (this.settingsForm.get('notificationHour')?.invalid || this.settingsForm.get('notificationMinute')?.invalid) {
      await this.showToast('Valores inválidos para hora', 'danger');
      return;
    }

    await this.settingsService.setNotificationTime(hour, minute);
    await this.showToast('Hora do lembrete atualizada', 'success');
  }

  /**
   * Atualiza os minutos antes da data limite
   */
  async updateNotificationMinutesBefore(): Promise<void> {
    const minutes = this.settingsForm.get('notificationMinutesBefore')?.value;
    
    if (this.settingsForm.get('notificationMinutesBefore')?.invalid) {
      await this.showToast('Valor inválido', 'danger');
      return;
    }

    await this.settingsService.setNotificationMinutesBefore(minutes);
    await this.showToast('Tempo de notificação atualizado', 'success');
  }

  /**
   * Atualiza o bloqueio de orientação
   * @param event - Evento do segment
   */
  async updateOrientationLock(event: any): Promise<void> {
    const lock = event.detail.value as 'portrait' | 'landscape' | 'unlocked';
    this.settingsForm.patchValue({ orientationLock: lock });
    await this.settingsService.setOrientationLock(lock);
    await this.showToast(
      lock === 'unlocked' 
        ? 'Orientação desbloqueada' 
        : `Orientação bloqueada para ${lock === 'portrait' ? 'vertical' : 'horizontal'}`,
      'success'
    );
  }

  /**
   * Getters para facilitar acesso aos valores do formulário
   */
  get darkModeEnabled(): boolean {
    return this.settingsForm.get('darkModeEnabled')?.value || false;
  }

  get notificationsEnabled(): boolean {
    return this.settingsForm.get('notificationsEnabled')?.value || false;
  }

  get notificationHour(): number {
    return this.settingsForm.get('notificationHour')?.value || 9;
  }

  get notificationMinute(): number {
    return this.settingsForm.get('notificationMinute')?.value || 0;
  }

  get notificationMinutesBefore(): number {
    return this.settingsForm.get('notificationMinutesBefore')?.value || 60;
  }

  get orientationLock(): 'portrait' | 'landscape' | 'unlocked' {
    return this.settingsForm.get('orientationLock')?.value || 'portrait';
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
