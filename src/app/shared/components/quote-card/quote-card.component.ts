import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { QuotesService, Quote } from '../../../core/services/quotes.service';

/**
 * Quote Card Component
 * 
 * Componente para exibir uma citação inspiradora.
 * Atualiza automaticamente a citação periodicamente.
 * 
 * @component QuoteCardComponent
 */
@Component({
  selector: 'app-quote-card',
  templateUrl: './quote-card.component.html',
  styleUrls: ['./quote-card.component.scss'],
  standalone: false
})
export class QuoteCardComponent implements OnInit {
  /**
   * Indica se deve atualizar automaticamente
   * @default true
   */
  @Input() autoRefresh: boolean = true;

  /**
   * Intervalo de atualização em minutos
   * @default 30
   */
  @Input() refreshInterval: number = 30;

  /**
   * Citação atual
   */
  quote: Quote | null = null;

  /**
   * Indica se está a carregar
   */
  isLoading: boolean = false;

  /**
   * Interval ID para auto-refresh
   */
  private refreshIntervalId?: any;

  constructor(private quotesService: QuotesService) {}

  /**
   * Inicializa o componente
   */
  ngOnInit(): void {
    this.loadQuote();
    
    if (this.autoRefresh) {
      this.startAutoRefresh();
    }
  }

  /**
   * Limpa o intervalo ao destruir
   */
  ngOnDestroy(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
  }

  /**
   * Carrega uma nova citação
   */
  loadQuote(): void {
    this.isLoading = true;
    this.quotesService.getRandomQuote().subscribe({
      next: (quote) => {
        this.quote = quote;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar citação:', error);
        this.quote = this.quotesService.getFallbackQuote();
        this.isLoading = false;
      }
    });
  }

  /**
   * Inicia o auto-refresh
   */
  private startAutoRefresh(): void {
    const intervalMs = this.refreshInterval * 60 * 1000; // Converter minutos para milissegundos
    this.refreshIntervalId = setInterval(() => {
      this.loadQuote();
    }, intervalMs);
  }

  /**
   * Atualiza manualmente a citação
   */
  refreshQuote(): void {
    this.loadQuote();
  }
}
