import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProjectsPage } from './projects.page';
import { ProjectDetailPage } from './project-detail/project-detail.page';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from '../../shared/shared.module';

/**
 * Projects Module
 * 
 * Módulo de funcionalidades para gestão de projetos.
 * Inclui a página principal de projetos, página de detalhes
 * e formulário para criar/editar projetos.
 * 
 * @module ProjectsModule
 */
@NgModule({
  declarations: [
    ProjectsPage,
    ProjectDetailPage,
    ProjectFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProjectsRoutingModule,
    SharedModule
  ]
})
export class ProjectsModule {}
