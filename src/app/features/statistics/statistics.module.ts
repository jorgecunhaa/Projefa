import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StatisticsPage } from './statistics.page';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { SharedModule } from '../../shared/shared.module';

/**
 * Statistics Module
 * 
 * Módulo de funcionalidades para visualização de estatísticas.
 * Mostra estatísticas gerais, por projeto e por categoria.
 * 
 * @module StatisticsModule
 */
@NgModule({
  declarations: [
    StatisticsPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatisticsRoutingModule,
    SharedModule
  ]
})
export class StatisticsModule {}
