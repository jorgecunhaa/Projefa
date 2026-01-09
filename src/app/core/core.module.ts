import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Core Module
 * 
 * Módulo singleton que contém serviços que devem ser instanciados apenas uma vez
 * na aplicação. Este módulo deve ser importado apenas no AppModule.
 * 
 * @module CoreModule
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: []
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
