import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CalendarPage } from './calendar.page';
import { CalendarRoutingModule } from './calendar-routing.module';
import { SharedModule } from '../../shared/shared.module';

/**
 * Calendar Module
 * 
 * Módulo de funcionalidades para visualização de tarefas no calendário.
 * Permite navegar entre meses e visualizar tarefas por data.
 * 
 * @module CalendarModule
 */
@NgModule({
  declarations: [
    CalendarPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarRoutingModule,
    SharedModule
  ]
})
export class CalendarModule {}
