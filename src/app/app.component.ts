import { Component, OnInit } from '@angular/core';
import { SettingsService } from './core/services/settings.service';
import { OrientationService } from './core/services/orientation.service';
import { SeedService } from './core/services/seed.service';

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
  constructor(
    private settingsService: SettingsService,
    private orientationService: OrientationService,
    private seedService: SeedService
  ) {}

  /**
   * Inicializa o componente
   */
  async ngOnInit(): Promise<void> {
    // Executar seed se necessário (apenas na primeira vez)
    await this.seedService.seedIfNeeded();
    
    // Inicializar configurações (modo escuro, etc.)
    await this.settingsService.initializeSettings();
  }
}
