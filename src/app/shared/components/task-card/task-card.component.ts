import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../core/models/task.model';

/**
 * Task Card Component
 * 
 * Componente reutilizável para exibir uma tarefa em formato de card.
 * Inclui informações principais, estado de conclusão, data limite
 * e indicadores visuais para tarefas em atraso.
 * 
 * @component TaskCardComponent
 * 
 * @example
 * ```html
 * <app-task-card
 *   [task]="task"
 *   [showProject]="true"
 *   (click)="onTaskClick($event)"
 *   (complete)="onTaskComplete($event)"
 *   (delete)="onTaskDelete($event)">
 * </app-task-card>
 * ```
 */
@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  standalone: false
})
export class TaskCardComponent {
  /**
   * Tarefa a exibir
   */
  @Input() task!: Task;

  /**
   * Indica se deve mostrar o nome do projeto
   * @default false
   */
  @Input() showProject: boolean = false;

  /**
   * Nome do projeto (opcional, para exibição)
   */
  @Input() projectName?: string;

  /**
   * Indica se o card é clicável
   * @default true
   */
  @Input() clickable: boolean = true;

  /**
   * Evento emitido quando o card é clicado
   */
  @Output() click = new EventEmitter<Task>();

  /**
   * Evento emitido quando a tarefa é marcada como concluída
   */
  @Output() complete = new EventEmitter<Task>();

  /**
   * Evento emitido quando a tarefa é eliminada
   */
  @Output() delete = new EventEmitter<Task>();

  /**
   * Verifica se a tarefa está em atraso
   * @returns true se a data limite já passou e a tarefa não está concluída
   */
  isOverdue(): boolean {
    if (this.task.completed) {
      return false;
    }
    const dueDate = new Date(this.task.dueDate);
    const now = new Date();
    return dueDate < now;
  }

  /**
   * Verifica se a tarefa está próxima da data limite
   * @returns true se faltam menos de 24 horas para a data limite
   */
  isDueSoon(): boolean {
    if (this.task.completed || this.isOverdue()) {
      return false;
    }
    const dueDate = new Date(this.task.dueDate);
    const now = new Date();
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 24;
  }

  /**
   * Manipula o clique no card
   */
  onCardClick(): void {
    if (this.clickable) {
      this.click.emit(this.task);
    }
  }

  /**
   * Manipula a marcação de conclusão
   * @param event - Evento do checkbox
   */
  onCompleteChange(event: any): void {
    event.stopPropagation();
    this.complete.emit(this.task);
  }

  /**
   * Manipula a eliminação da tarefa
   * @param event - Evento do botão
   */
  onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.task);
  }

  /**
   * Obtém a URL da imagem ou null
   * @returns URL da imagem em Base64 ou null
   */
  getImageUrl(): string | null {
    if (this.task.image) {
      return `data:image/jpeg;base64,${this.task.image}`;
    }
    return null;
  }
}
