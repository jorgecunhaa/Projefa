import { Injectable } from '@angular/core';

/**
 * Logger Service
 * 
 * Serviço centralizado para logging da aplicação.
 * Permite controlar o nível de logging e facilita a manutenção.
 * 
 * @service LoggerService
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private readonly isProduction = false; // Mudar para true em produção
  private readonly enableLogging = !this.isProduction;

  /**
   * Log de informação
   * @param message - Mensagem a logar
   * @param data - Dados adicionais (opcional)
   */
  log(message: string, ...data: any[]): void {
    if (this.enableLogging) {
      console.log(`[Projefa] ${message}`, ...data);
    }
  }

  /**
   * Log de erro
   * @param message - Mensagem de erro
   * @param error - Objeto de erro (opcional)
   */
  error(message: string, error?: any): void {
    // Erros devem sempre ser logados, mesmo em produção
    console.error(`[Projefa] ERROR: ${message}`, error || '');
  }

  /**
   * Log de aviso
   * @param message - Mensagem de aviso
   * @param data - Dados adicionais (opcional)
   */
  warn(message: string, ...data: any[]): void {
    if (this.enableLogging) {
      console.warn(`[Projefa] WARN: ${message}`, ...data);
    }
  }

  /**
   * Log de debug
   * @param message - Mensagem de debug
   * @param data - Dados adicionais (opcional)
   */
  debug(message: string, ...data: any[]): void {
    if (this.enableLogging) {
      console.debug(`[Projefa] DEBUG: ${message}`, ...data);
    }
  }
}
