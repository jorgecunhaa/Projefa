import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Core Module
 * 
 * Módulo singleton que contém serviços que devem ser instanciados apenas uma vez
 * na aplicação. Este módulo deve ser importado apenas no AppModule.
 * 
 * Serviços disponíveis (providedIn: 'root'):
 * - DatabaseService: Gestão da base de dados SQLite
 * - StorageService: Gestão do Ionic Storage (fallback para web)
 * - NotificationService: Gestão de notificações locais
 * - DataSyncService: Sincronização entre SQLite e Storage
 * 
 * @module CoreModule
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    // Os serviços são fornecidos via providedIn: 'root'
    // mas podem ser adicionados aqui se necessário para testes
  ]
})
export class CoreModule {
  /**
   * Construtor que garante que o CoreModule seja importado apenas uma vez
   * @param parentModule - Referência ao módulo pai
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule já foi carregado. Importe-o apenas no AppModule.');
    }
  }
}
