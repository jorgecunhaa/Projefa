import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Interface para uma citação
 */
export interface Quote {
  text: string;
  author: string;
  source?: string;
}

/**
 * Quotes Service
 * 
 * Serviço responsável pela obtenção de citações inspiradoras
 * de uma API externa. Usa fallback local se a API falhar.
 * 
 * @service QuotesService
 */
@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  /**
   * URL da API de citações (usando quotable.io - API gratuita)
   */
  private readonly QUOTES_API_URL = 'https://api.quotable.io/random';

  /**
   * Citações de fallback (caso a API não esteja disponível)
   */
  private readonly FALLBACK_QUOTES: Quote[] = [
    {
      text: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.',
      author: 'Robert Collier'
    },
    {
      text: 'A única forma de fazer um excelente trabalho é amar o que fazes.',
      author: 'Steve Jobs'
    },
    {
      text: 'Não importa o quão devagar vás, desde que não pares.',
      author: 'Confúcio'
    },
    {
      text: 'A persistência é o caminho do êxito.',
      author: 'Charles Chaplin'
    },
    {
      text: 'O futuro pertence àqueles que acreditam na beleza dos seus sonhos.',
      author: 'Eleanor Roosevelt'
    },
    {
      text: 'A melhor maneira de prever o futuro é criá-lo.',
      author: 'Peter Drucker'
    },
    {
      text: 'Acredita em ti próprio e tudo será possível.',
      author: 'Desconhecido'
    },
    {
      text: 'O sucesso não é final, o fracasso não é fatal: é a coragem de continuar que conta.',
      author: 'Winston Churchill'
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Obtém uma citação aleatória da API
   * @returns Observable com uma citação
   */
  getRandomQuote(): Observable<Quote> {
    return this.http.get<any>(this.QUOTES_API_URL).pipe(
      map(response => ({
        text: response.content || response.quote || '',
        author: response.author || 'Desconhecido',
        source: 'quotable.io'
      })),
      catchError(error => {
        console.warn('Erro ao obter citação da API, usando fallback:', error);
        // Retornar citação aleatória do fallback
        const randomIndex = Math.floor(Math.random() * this.FALLBACK_QUOTES.length);
        return of(this.FALLBACK_QUOTES[randomIndex]);
      })
    );
  }

  /**
   * Obtém uma citação de fallback aleatória
   * @returns Citação aleatória
   */
  getFallbackQuote(): Quote {
    const randomIndex = Math.floor(Math.random() * this.FALLBACK_QUOTES.length);
    return this.FALLBACK_QUOTES[randomIndex];
  }

  /**
   * Obtém múltiplas citações
   * @param count - Número de citações a obter
   * @returns Observable com array de citações
   */
  getMultipleQuotes(count: number = 5): Observable<Quote[]> {
    const quotes: Quote[] = [];
    const requests: Observable<Quote>[] = [];

    for (let i = 0; i < count; i++) {
      requests.push(this.getRandomQuote());
    }

    return new Observable(observer => {
      let completed = 0;
      requests.forEach((request, index) => {
        request.subscribe({
          next: (quote) => {
            quotes[index] = quote;
            completed++;
            if (completed === count) {
              observer.next(quotes);
              observer.complete();
            }
          },
          error: () => {
            quotes[index] = this.getFallbackQuote();
            completed++;
            if (completed === count) {
              observer.next(quotes);
              observer.complete();
            }
          }
        });
      });
    });
  }
}
