import { Component, OnInit } from '@angular/core';
import { SettingsService } from './core/services/settings.service';

/**
 * App Component
 * 
 * Componente raiz da aplicação.
 * Inicializa configurações globais ao iniciar.
 * 
 * @component AppComponent
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private settingsService: SettingsService) {}

  /**
   * Inicializa o componente
   */
  async ngOnInit(): Promise<void> {
    // Inicializar configurações (modo escuro, etc.)
    await this.settingsService.initializeSettings();
  }
}
