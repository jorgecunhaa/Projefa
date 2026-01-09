import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TasksPage } from './tasks.page';
import { TaskDetailPage } from './task-detail/task-detail.page';
import { TaskFormComponent } from './task-form/task-form.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { SharedModule } from '../../shared/shared.module';

/**
 * Tasks Module
 * 
 * Módulo de funcionalidades para gestão de tarefas.
 * Inclui a página principal de tarefas, página de detalhes
 * e formulário para criar/editar tarefas.
 * 
 * @module TasksModule
 */
@NgModule({
  declarations: [
    TasksPage,
    TaskDetailPage,
    TaskFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TasksRoutingModule,
    SharedModule
  ]
})
export class TasksModule {}
