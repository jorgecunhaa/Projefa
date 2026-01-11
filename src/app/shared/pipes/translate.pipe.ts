import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';
import { Subscription } from 'rxjs';

/**
 * Translate Pipe
 * 
 * Pipe para traduzir strings na template.
 * 
 * @pipe TranslatePipe
 * 
 * @example
 * ```html
 * <h1>{{ 'common.save' | translate }}</h1>
 * <p>{{ 'tasks.deleteConfirm' | translate: {title: task.title} }}</p>
 * ```
 */
@Pipe({
  name: 'translate',
  pure: false,
  standalone: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private lastKey: string = '';
  private lastValue: string = '';
  private lastParams: any = null;
  private subscription?: Subscription;

  constructor(
    private translationService: TranslationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   * Transforma a chave de tradução numa string traduzida
   * @param key - Chave da tradução
   * @param params - Parâmetros opcionais
   * @returns String traduzida
   */
  transform(key: string, params?: any): string {
    if (!key) {
      return '';
    }

    // Cache simples para melhor performance
    if (key === this.lastKey && params === this.lastParams) {
      return this.lastValue;
    }

    this.lastKey = key;
    this.lastParams = params;
    this.lastValue = this.translationService.translate(key, params);

    return this.lastValue;
  }

  /**
   * Limpa recursos ao destruir
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
