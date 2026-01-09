import { Pipe, PipeTransform } from '@angular/core';

/**
 * Date Format Pipe
 * 
 * Pipe personalizado para formatar datas de forma consistente
 * em toda a aplicação. Suporta múltiplos formatos e localização.
 * 
 * @pipe DateFormatPipe
 * 
 * @example
 * ```html
 * {{ task.dueDate | dateFormat }}
 * {{ task.dueDate | dateFormat:'short' }}
 * {{ task.dueDate | dateFormat:'relative' }}
 * ```
 */
@Pipe({
  name: 'dateFormat',
  standalone: false
})
export class DateFormatPipe implements PipeTransform {

  /**
   * Transforma uma data para o formato especificado
   * 
   * @param value - Data a formatar (string ISO ou Date)
   * @param format - Formato desejado:
   *   - 'full': Data completa (ex: "15 de Janeiro de 2024")
   *   - 'short': Data curta (ex: "15/01/2024")
   *   - 'time': Apenas hora (ex: "14:30")
   *   - 'datetime': Data e hora (ex: "15/01/2024 14:30")
   *   - 'relative': Relativa (ex: "há 2 dias", "em 3 horas")
   *   - 'day': Apenas dia da semana (ex: "Segunda-feira")
   *   - 'default': Formato padrão (ex: "15 Jan 2024")
   * @returns String formatada
   */
  transform(value: string | Date | null | undefined, format: string = 'default'): string {
    // Verificar se o valor é válido
    if (!value) {
      return '-';
    }

    // Converter string para Date se necessário
    const date = typeof value === 'string' ? new Date(value) : value;

    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return '-';
    }

    // Aplicar o formato solicitado
    switch (format) {
      case 'full':
        return this.formatFull(date);
      case 'short':
        return this.formatShort(date);
      case 'time':
        return this.formatTime(date);
      case 'datetime':
        return this.formatDateTime(date);
      case 'relative':
        return this.formatRelative(date);
      case 'day':
        return this.formatDay(date);
      default:
        return this.formatDefault(date);
    }
  }

  /**
   * Formata data completa em português
   * Ex: "15 de Janeiro de 2024"
   */
  private formatFull(date: Date): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }

  /**
   * Formata data curta
   * Ex: "15/01/2024"
   */
  private formatShort(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Formata apenas a hora
   * Ex: "14:30"
   */
  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Formata data e hora
   * Ex: "15/01/2024 14:30"
   */
  private formatDateTime(date: Date): string {
    return `${this.formatShort(date)} ${this.formatTime(date)}`;
  }

  /**
   * Formata data relativa
   * Ex: "há 2 dias", "em 3 horas", "hoje"
   */
  private formatRelative(date: Date): string {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Verificar se é hoje
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      if (diffHours === 0) {
        if (diffMinutes === 0) {
          return 'agora';
        }
        return diffMinutes > 0 ? `em ${diffMinutes} min` : `há ${Math.abs(diffMinutes)} min`;
      }
      return diffHours > 0 ? `em ${diffHours}h` : `há ${Math.abs(diffHours)}h`;
    }

    // Verificar se é amanhã ou ontem
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === tomorrow.toDateString()) {
      return 'amanhã';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'ontem';
    }

    // Formato relativo para dias
    if (Math.abs(diffDays) < 7) {
      return diffDays > 0 ? `em ${diffDays} dias` : `há ${Math.abs(diffDays)} dias`;
    }

    // Para datas mais distantes, usar formato curto
    return this.formatShort(date);
  }

  /**
   * Formata apenas o dia da semana
   * Ex: "Segunda-feira"
   */
  private formatDay(date: Date): string {
    const days = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return days[date.getDay()];
  }

  /**
   * Formato padrão
   * Ex: "15 Jan 2024"
   */
  private formatDefault(date: Date): string {
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
}
