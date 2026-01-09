import { Component, Input } from '@angular/core';

/**
 * Category Badge Component
 * 
 * Componente reutilizável para exibir um badge de categoria.
 * Mostra o nome da categoria com cor e ícone personalizados.
 * 
 * @component CategoryBadgeComponent
 * 
 * @example
 * ```html
 * <app-category-badge
 *   [name]="'Escola'"
 *   [color]="'#8B0000'"
 *   [icon]="'school-outline'">
 * </app-category-badge>
 * ```
 */
@Component({
  selector: 'app-category-badge',
  templateUrl: './category-badge.component.html',
  styleUrls: ['./category-badge.component.scss'],
  standalone: false
})
export class CategoryBadgeComponent {
  /**
   * Nome da categoria
   */
  @Input() name: string = '';

  /**
   * Cor da categoria (hexadecimal)
   * @default '#8B0000'
   */
  @Input() color: string = '#8B0000';

  /**
   * Ícone da categoria (nome do ícone Ionic)
   * @default 'folder-outline'
   */
  @Input() icon: string = 'folder-outline';

  /**
   * Tamanho do badge
   * @default 'medium'
   */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Indica se deve mostrar o ícone
   * @default true
   */
  @Input() showIcon: boolean = true;

  /**
   * Obtém o estilo de cor da categoria
   * @returns Objeto com estilos CSS
   */
  getCategoryStyle(): { [key: string]: string } {
    return {
      '--category-color': this.color,
      '--category-bg': this.color + '20', // 20% de opacidade
      '--category-border': this.color
    };
  }

  /**
   * Obtém a classe de tamanho
   * @returns String com a classe de tamanho
   */
  getSizeClass(): string {
    return `badge-${this.size}`;
  }
}
