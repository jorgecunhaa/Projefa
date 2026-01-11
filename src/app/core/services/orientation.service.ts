import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatform } from '@ionic/angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';

/**
 * Orientation Service
 * 
 * Serviço responsável pelo controlo da orientação do ecrã.
 * Permite bloquear ou permitir rotação para landscape.
 * 
 * @service OrientationService
 */
@Injectable({
  providedIn: 'root'
})
export class OrientationService {
  /**
   * Indica se o controlo de orientação está disponível
   */
  private isAvailable: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.checkAvailability();
  }

  /**
   * Verifica se o controlo de orientação está disponível
   */
  private checkAvailability(): void {
    // Apenas disponível em plataformas nativas (iOS/Android)
    this.isAvailable = Capacitor.isNativePlatform() && 
                       (isPlatform('ios') || isPlatform('android'));
  }

  /**
   * Verifica se o serviço está disponível
   * @returns true se disponível
   */
  isServiceAvailable(): boolean {
    return this.isAvailable;
  }

  /**
   * Bloqueia a orientação para portrait (vertical)
   */
  async lockToPortrait(): Promise<void> {
    if (!this.isAvailable) {
      console.warn('Controlo de orientação não disponível nesta plataforma');
      return;
    }

    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
      console.log('Orientação bloqueada para portrait');
    } catch (error) {
      console.error('Erro ao bloquear orientação:', error);
    }
  }

  /**
   * Bloqueia a orientação para landscape (horizontal)
   */
  async lockToLandscape(): Promise<void> {
    if (!this.isAvailable) {
      console.warn('Controlo de orientação não disponível nesta plataforma');
      return;
    }

    try {
      await ScreenOrientation.lock({ orientation: 'landscape' });
      console.log('Orientação bloqueada para landscape');
    } catch (error) {
      console.error('Erro ao bloquear orientação:', error);
    }
  }

  /**
   * Desbloqueia a orientação (permite rotação livre)
   */
  async unlock(): Promise<void> {
    if (!this.isAvailable) {
      console.warn('Controlo de orientação não disponível nesta plataforma');
      return;
    }

    try {
      await ScreenOrientation.unlock();
      console.log('Orientação desbloqueada');
    } catch (error) {
      console.error('Erro ao desbloquear orientação:', error);
    }
  }

  /**
   * Obtém a orientação atual
   * @returns Promise com a orientação atual
   */
  async getCurrentOrientation(): Promise<string | null> {
    if (!this.isAvailable) {
      return null;
    }

    try {
      const result = await ScreenOrientation.getCurrentOrientation();
      return result.type;
    } catch (error) {
      console.error('Erro ao obter orientação atual:', error);
      return null;
    }
  }

  /**
   * Ouve mudanças na orientação
   * @param callback - Função chamada quando a orientação muda
   * @returns Função para cancelar o listener
   */
  async addOrientationChangeListener(
    callback: (orientation: string) => void
  ): Promise<() => void> {
    if (!this.isAvailable) {
      return () => {};
    }

    try {
      const listener = await ScreenOrientation.addListener('screenOrientationChange', (result) => {
        callback(result.type);
      });

      return () => {
        listener.remove();
      };
    } catch (error) {
      console.error('Erro ao adicionar listener de orientação:', error);
      return () => {};
    }
  }
}
