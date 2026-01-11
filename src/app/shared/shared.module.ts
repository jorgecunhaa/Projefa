import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Pipes
import { DateFormatPipe } from './pipes/date-format.pipe';
import { TranslatePipe } from './pipes/translate.pipe';

// Components
import { TaskCardComponent } from './components/task-card/task-card.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { CategoryBadgeComponent } from './components/category-badge/category-badge.component';
import { QuoteCardComponent } from './components/quote-card/quote-card.component';

/**
 * Shared Module
 * 
 * Módulo compartilhado que contém componentes, pipes e diretivas
 * reutilizáveis em toda a aplicação.
 * 
 * Componentes exportados:
 * - TaskCardComponent: Card para exibir tarefas
 * - ProjectCardComponent: Card para exibir projetos
 * - CategoryBadgeComponent: Badge para exibir categorias
 * 
 * Pipes exportados:
 * - DateFormatPipe: Formatação de datas
 * 
 * @module SharedModule
 */
@NgModule({
  declarations: [
    // Pipes
    DateFormatPipe,
    TranslatePipe,
    
    // Components
    TaskCardComponent,
    ProjectCardComponent,
    CategoryBadgeComponent,
    QuoteCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    
    // Pipes
    DateFormatPipe,
    TranslatePipe,
    
    // Components
    TaskCardComponent,
    ProjectCardComponent,
    CategoryBadgeComponent,
    QuoteCardComponent
  ]
})
export class SharedModule { }
