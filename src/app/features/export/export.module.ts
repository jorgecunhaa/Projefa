import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ExportPage } from './export.page';
import { ExportRoutingModule } from './export-routing.module';
import { SharedModule } from '../../shared/shared.module';

/**
 * Export Module
 * 
 * Módulo de funcionalidades para exportação de dados.
 * Permite exportar dados em formato JSON ou CSV.
 * 
 * @module ExportModule
 */
@NgModule({
  declarations: [
    ExportPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExportRoutingModule,
    SharedModule
  ]
})
export class ExportModule {}
