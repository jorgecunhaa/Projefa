import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchService, SearchResult } from './services/search.service';

/**
 * Search Page
 * 
 * Página de pesquisa global na aplicação.
 * Permite pesquisar em categorias, projetos e tarefas.
 * 
 * @component SearchPage
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false
})
export class SearchPage implements OnInit, OnDestroy {
  /**
   * Termo de pesquisa atual
   */
  searchQuery: string = '';

  /**
   * Resultados da pesquisa
   */
  results: SearchResult[] = [];

  /**
   * Indica se está a pesquisar
   */
  isSearching: boolean = false;

  /**
   * Indica se há resultados
   */
  hasResults: boolean = false;

  /**
   * Subject para debounce da pesquisa
   */
  private searchSubject = new Subject<string>();

  /**
   * Subscription para o searchSubject
   */
  private searchSubscription?: any;

  /**
   * Filtro de tipo ('' = todos, 'category' = categorias, 'project' = projetos, 'task' = tarefas)
   */
  typeFilter: string = '';

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  /**
   * Inicializa o componente
   */
  ngOnInit(): void {
    // Configurar debounce para pesquisa (300ms)
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.performSearch(query);
      });
  }

  /**
   * Limpa subscriptions ao destruir o componente
   */
  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  /**
   * Manipula a mudança no campo de pesquisa
   * @param event - Evento do input
   */
  onSearchChange(event: any): void {
    const query = event.detail.value || '';
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  /**
   * Executa a pesquisa
   * @param query - Termo de pesquisa
   */
  private async performSearch(query: string): Promise<void> {
    if (!query || query.trim().length === 0) {
      this.results = [];
      this.hasResults = false;
      return;
    }

    this.isSearching = true;
    try {
      let allResults = await this.searchService.searchAll(query);
      
      // Aplicar filtro de tipo se selecionado
      if (this.typeFilter) {
        allResults = allResults.filter(r => r.type === this.typeFilter);
      }
      
      this.results = allResults;
      this.hasResults = this.results.length > 0;
    } catch (error) {
      console.error('Erro ao pesquisar:', error);
      this.results = [];
      this.hasResults = false;
    } finally {
      this.isSearching = false;
    }
  }

  /**
   * Manipula a mudança de filtro de tipo
   * @param value - Valor do segment (pode ser string, number ou undefined)
   */
  async onTypeFilterChange(value: any): Promise<void> {
    const type = value ? String(value) : '';
    await this.filterByType(type);
  }

  /**
   * Filtra resultados por tipo
   * @param type - Tipo a filtrar
   */
  async filterByType(type: string): Promise<void> {
    this.typeFilter = type;
    if (this.searchQuery) {
      await this.performSearch(this.searchQuery);
    }
  }

  /**
   * Limpa a pesquisa
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.results = [];
    this.hasResults = false;
    this.typeFilter = '';
  }

  /**
   * Navega para o item selecionado
   * @param result - Resultado da pesquisa
   */
  navigateToResult(result: SearchResult): void {
    switch (result.type) {
      case 'category':
        // Não há página de detalhes de categoria, apenas lista
        this.router.navigate(['/categories']);
        break;
      case 'project':
        this.router.navigate(['/projects', result.item.id]);
        break;
      case 'task':
        this.router.navigate(['/tasks', result.item.id]);
        break;
    }
  }

  /**
   * Obtém o ícone para o tipo de resultado
   * @param type - Tipo do resultado
   * @returns Nome do ícone
   */
  getTypeIcon(type: string): string {
    switch (type) {
      case 'category':
        return 'folder-outline';
      case 'project':
        return 'briefcase-outline';
      case 'task':
        return 'checkmark-circle-outline';
      default:
        return 'help-outline';
    }
  }

  /**
   * Obtém a cor para o tipo de resultado
   * @param type - Tipo do resultado
   * @returns Nome da cor
   */
  getTypeColor(type: string): string {
    switch (type) {
      case 'category':
        return 'secondary';
      case 'project':
        return 'primary';
      case 'task':
        return 'success';
      default:
        return 'medium';
    }
  }

  /**
   * Obtém o nome do tipo em português
   * @param type - Tipo do resultado
   * @returns Nome em português
   */
  getTypeName(type: string): string {
    switch (type) {
      case 'category':
        return 'Categoria';
      case 'project':
        return 'Projeto';
      case 'task':
        return 'Tarefa';
      default:
        return 'Desconhecido';
    }
  }

  /**
   * Obtém o título do item
   * @param result - Resultado da pesquisa
   * @returns Título do item
   */
  getItemTitle(result: SearchResult): string {
    switch (result.type) {
      case 'category':
        return (result.item as any).name;
      case 'project':
        return (result.item as any).name;
      case 'task':
        return (result.item as any).title;
      default:
        return '';
    }
  }

  /**
   * Obtém a descrição do item
   * @param result - Resultado da pesquisa
   * @returns Descrição do item
   */
  getItemDescription(result: SearchResult): string {
    switch (result.type) {
      case 'category':
        return '';
      case 'project':
        return (result.item as any).description || '';
      case 'task':
        return (result.item as any).description || '';
      default:
        return '';
    }
  }

  /**
   * Destaca o termo de pesquisa no texto
   * @param text - Texto original
   * @returns Texto com destaque
   */
  highlightText(text: string): string {
    return this.searchService.highlightText(text, this.searchQuery);
  }
}
