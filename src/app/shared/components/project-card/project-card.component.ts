import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Project } from '../../../core/models/project.model';

/**
 * Project Card Component
 * 
 * Componente reutilizável para exibir um projeto em formato de card.
 * Inclui informações do projeto, categoria e estatísticas básicas.
 * 
 * @component ProjectCardComponent
 * 
 * @example
 * ```html
 * <app-project-card
 *   [project]="project"
 *   [categoryName]="category.name"
 *   [categoryColor]="category.color"
 *   [categoryIcon]="category.icon"
 *   [taskCount]="5"
 *   (click)="onProjectClick($event)"
 *   (delete)="onProjectDelete($event)">
 * </app-project-card>
 * ```
 */
@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  standalone: false
})
export class ProjectCardComponent {
  /**
   * Projeto a exibir
   */
  @Input() project!: Project;

  /**
   * Nome da categoria do projeto
   */
  @Input() categoryName?: string;

  /**
   * Cor da categoria (hexadecimal)
   */
  @Input() categoryColor: string = '#8B0000';

  /**
   * Ícone da categoria
   */
  @Input() categoryIcon: string = 'folder-outline';

  /**
   * Número de tarefas no projeto
   */
  @Input() taskCount: number = 0;

  /**
   * Número de tarefas concluídas
   */
  @Input() completedTaskCount: number = 0;

  /**
   * Número de tarefas em atraso
   */
  @Input() overdueTaskCount: number = 0;

  /**
   * Indica se o card é clicável
   * @default true
   */
  @Input() clickable: boolean = true;

  /**
   * Evento emitido quando o card é clicado
   */
  @Output() click = new EventEmitter<Project>();

  /**
   * Evento emitido quando o projeto é eliminado
   */
  @Output() delete = new EventEmitter<Project>();

  /**
   * Manipula o clique no card
   */
  onCardClick(): void {
    if (this.clickable) {
      this.click.emit(this.project);
    }
  }

  /**
   * Manipula a eliminação do projeto
   * @param event - Evento do botão
   */
  onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.project);
  }

  /**
   * Calcula a percentagem de tarefas concluídas
   * @returns Percentagem (0-100)
   */
  getCompletionPercentage(): number {
    if (this.taskCount === 0) {
      return 0;
    }
    return Math.round((this.completedTaskCount / this.taskCount) * 100);
  }

  /**
   * Obtém o estilo de cor da categoria
   * @returns Objeto com estilos CSS
   */
  getCategoryStyle(): { [key: string]: string } {
    return {
      '--category-color': this.categoryColor
    };
  }
}
