import { Injectable } from '@angular/core';

/**
 * Translation Service
 * 
 * Serviço simples para gestão de traduções.
 * Carrega traduções de ficheiros JSON e fornece métodos
 * para obter strings traduzidas.
 * 
 * @service TranslationService
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  /**
   * Traduções carregadas
   */
  private translations: any = {};

  /**
   * Idioma atual
   */
  private currentLang: string = 'pt';

  /**
   * Indica se as traduções foram carregadas
   */
  private loaded: boolean = false;

  constructor() {
    this.loadTranslations();
  }

  /**
   * Carrega as traduções do ficheiro JSON
   */
  private async loadTranslations(): Promise<void> {
    try {
      const response = await fetch(`/assets/i18n/${this.currentLang}.json`);
      if (response.ok) {
        this.translations = await response.json();
        this.loaded = true;
      } else {
        console.warn('Ficheiro de traduções não encontrado, usando fallback');
        this.loaded = true;
      }
    } catch (error) {
      console.error('Erro ao carregar traduções:', error);
      this.loaded = true;
    }
  }

  /**
   * Obtém uma string traduzida
   * @param key - Chave da tradução (ex: 'common.save')
   * @param params - Parâmetros para substituir (ex: {name: 'Teste'})
   * @returns String traduzida ou a chave se não encontrada
   */
  translate(key: string, params?: { [key: string]: any }): string {
    if (!this.loaded) {
      return key;
    }

    const keys = key.split('.');
    let value: any = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Retornar a chave se não encontrada
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Substituir parâmetros
    if (params) {
      Object.keys(params).forEach(paramKey => {
        value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), params[paramKey]);
      });
    }

    return value;
  }

  /**
   * Obtém o idioma atual
   * @returns Código do idioma
   */
  getCurrentLang(): string {
    return this.currentLang;
  }

  /**
   * Define o idioma
   * @param lang - Código do idioma
   */
  async setLanguage(lang: string): Promise<void> {
    if (lang === this.currentLang) {
      return;
    }

    this.currentLang = lang;
    this.loaded = false;
    await this.loadTranslations();
  }

  /**
   * Verifica se as traduções foram carregadas
   * @returns true se carregadas
   */
  isLoaded(): boolean {
    return this.loaded;
  }
}
