import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatisticsService, GeneralStatistics, ProjectStatistics, CategoryStatistics } from './services/statistics.service';

/**
 * Statistics Page
 * 
 * Página de estatísticas da aplicação.
 * Mostra estatísticas gerais, por projeto e por categoria.
 * 
 * @component StatisticsPage
 */
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  standalone: false
})
export class StatisticsPage implements OnInit {
  /**
   * Estatísticas gerais
   */
  generalStats: GeneralStatistics | null = null;

  /**
   * Estatísticas por projeto
   */
  projectStats: ProjectStatistics[] = [];

  /**
   * Estatísticas por categoria
   */
  categoryStats: CategoryStatistics[] = [];

  /**
   * Distribuição de tarefas por mês
   */
  monthlyStats: Array<{ month: string; created: number; completed: number }> = [];

  /**
   * Indica se está a carregar dados
   */
  isLoading: boolean = false;

  /**
   * Segmento selecionado (general, projects, categories, timeline)
   */
  selectedSegment: string = 'general';

  /**
   * Manipula a mudança de segmento
   * @param value - Valor do segment
   */
  onSegmentChange(value: any): void {
    this.selectedSegment = value ? String(value) : 'general';
  }

  constructor(
    private statisticsService: StatisticsService,
    private router: Router
  ) {}

  /**
   * Inicializa o componente
   */
  async ngOnInit(): Promise<void> {
    await this.loadStatistics();
  }

  /**
   * Carrega todas as estatísticas
   */
  async loadStatistics(): Promise<void> {
    this.isLoading = true;
    try {
      await Promise.all([
        this.loadGeneralStatistics(),
        this.loadProjectStatistics(),
        this.loadCategoryStatistics(),
        this.loadMonthlyStatistics()
      ]);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Carrega estatísticas gerais
   */
  private async loadGeneralStatistics(): Promise<void> {
    this.generalStats = await this.statisticsService.getGeneralStatistics();
  }

  /**
   * Carrega estatísticas por projeto
   */
  private async loadProjectStatistics(): Promise<void> {
    this.projectStats = await this.statisticsService.getProjectStatistics();
  }

  /**
   * Carrega estatísticas por categoria
   */
  private async loadCategoryStatistics(): Promise<void> {
    this.categoryStats = await this.statisticsService.getCategoryStatistics();
  }

  /**
   * Carrega estatísticas mensais
   */
  private async loadMonthlyStatistics(): Promise<void> {
    this.monthlyStats = await this.statisticsService.getTasksByMonth();
  }

  /**
   * Navega para um projeto
   * @param projectId - ID do projeto
   */
  navigateToProject(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  /**
   * Navega para a lista de projetos de uma categoria
   * @param categoryId - ID da categoria
   */
  navigateToCategoryProjects(categoryId: string): void {
    this.router.navigate(['/projects'], { queryParams: { categoryId } });
  }

  /**
   * Obtém a cor da barra de progresso baseada na percentagem
   * @param percentage - Percentagem (0-100)
   * @returns Nome da cor
   */
  getProgressColor(percentage: number): string {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  }

  /**
   * Formata uma percentagem
   * @param value - Valor (0-100)
   * @returns String formatada
   */
  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  /**
   * Obtém o máximo de tarefas criadas para normalização
   * @returns Número máximo
   */
  getMaxCreated(): number {
    if (this.monthlyStats.length === 0) return 1;
    return Math.max(...this.monthlyStats.map(m => m.created), 1);
  }

  /**
   * Obtém o máximo de tarefas concluídas para normalização
   * @returns Número máximo
   */
  getMaxCompleted(): number {
    if (this.monthlyStats.length === 0) return 1;
    return Math.max(...this.monthlyStats.map(m => m.completed), 1);
  }
}
