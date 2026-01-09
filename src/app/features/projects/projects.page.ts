import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectService } from './services/project.service';
import { CategoryService } from '../categories/services/category.service';
import { ProjectWithCategory } from '../../core/models/project.model';
import { Category } from '../../core/models/category.model';
import { ProjectFormComponent } from './project-form/project-form.component';

/**
 * Projects Page
 * 
 * Página principal para gestão de projetos.
 * Permite visualizar, criar, editar e eliminar projetos.
 * Inclui filtro por categoria e visualização de estatísticas.
 * 
 * @component ProjectsPage
 */
@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  standalone: false
})
export class ProjectsPage implements OnInit, OnDestroy {
  /**
   * Lista de projetos com informações da categoria
   */
  projects: ProjectWithCategory[] = [];

  /**
   * Lista de todas as categorias (para filtro)
   */
  categories: Category[] = [];

  /**
   * Categoria selecionada para filtro ('' = todas)
   */
  selectedCategoryId: string = '';

  /**
   * Indica se está a carregar dados
   */
  isLoading: boolean = false;

  /**
   * Subscription para o observable de projetos
   */
  private projectsSubscription?: Subscription;

  /**
   * Subscription para o observable de categorias
   */
  private categoriesSubscription?: Subscription;

  constructor(
    private projectService: ProjectService,
    private categoryService: CategoryService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  /**
   * Inicializa o componente
   */
  ngOnInit(): void {
    this.loadData();
    this.subscribeToData();
  }

  /**
   * Limpa subscriptions ao destruir o componente
   */
  ngOnDestroy(): void {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }

  /**
   * Carrega projetos e categorias
   */
  async loadData(): Promise<void> {
    this.isLoading = true;
    try {
      await Promise.all([
        this.projectService.loadProjects(),
        this.categoryService.loadCategories()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      await this.showToast('Erro ao carregar dados', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Subscreve aos observables de projetos e categorias
   */
  private subscribeToData(): void {
    // Subscrever a projetos
    this.projectsSubscription = this.projectService.projects$.subscribe(
      async (projects) => {
        await this.updateProjectsWithCategory();
      }
    );

    // Subscrever a categorias
    this.categoriesSubscription = this.categoryService.categories$.subscribe(
      (categories) => {
        this.categories = categories;
      }
    );
  }

  /**
   * Atualiza a lista de projetos com informações da categoria
   */
  private async updateProjectsWithCategory(): Promise<void> {
    if (this.selectedCategoryId && this.selectedCategoryId !== '') {
      this.projects = await this.projectService.getProjectsByCategoryWithInfo(this.selectedCategoryId);
    } else {
      this.projects = await this.projectService.getAllProjectsWithCategory();
    }
  }

  /**
   * Filtra projetos por categoria
   * @param categoryId - ID da categoria ('' para todas)
   */
  async filterByCategory(categoryId: string): Promise<void> {
    this.selectedCategoryId = categoryId || '';
    await this.updateProjectsWithCategory();
  }

  /**
   * Abre o modal para criar um novo projeto
   */
  async openCreateModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: ProjectFormComponent,
      componentProps: {
        project: null // null indica criação
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.saved) {
      await this.showToast('Projeto criado com sucesso!', 'success');
    }
  }

  /**
   * Abre o modal para editar um projeto
   * @param project - Projeto a editar
   */
  async openEditModal(project: ProjectWithCategory): Promise<void> {
    const modal = await this.modalController.create({
      component: ProjectFormComponent,
      componentProps: {
        project: project
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.saved) {
      await this.showToast('Projeto atualizado com sucesso!', 'success');
    }
  }

  /**
   * Navega para a página de detalhes do projeto
   * @param projectId - ID do projeto
   */
  navigateToProjectDetail(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  /**
   * Elimina um projeto após confirmação
   * @param project - Projeto a eliminar
   */
  async deleteProject(project: ProjectWithCategory): Promise<void> {
    // Verificar se o projeto tem tarefas
    const hasTasks = await this.projectService.hasTasks(project.id);
    
    if (hasTasks) {
      const alert = await this.alertController.create({
        header: 'Eliminar Projeto',
        message: 'Este projeto tem tarefas associadas. Todas as tarefas serão eliminadas. Continuar?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Eliminar Tudo',
            role: 'destructive',
            handler: async () => {
              await this.performDelete(project.id);
            }
          }
        ]
      });
      await alert.present();
    } else {
      // Confirmar eliminação
      const alert = await this.alertController.create({
        header: 'Eliminar Projeto',
        message: `Tens a certeza que queres eliminar o projeto "${project.name}"?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Eliminar',
            role: 'destructive',
            handler: async () => {
              await this.performDelete(project.id);
            }
          }
        ]
      });
      await alert.present();
    }
  }

  /**
   * Executa a eliminação do projeto
   * @param projectId - ID do projeto
   */
  private async performDelete(projectId: string): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'A eliminar...'
    });
    await loading.present();

    try {
      await this.projectService.deleteProject(projectId);
      await this.showToast('Projeto eliminado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao eliminar projeto:', error);
      await this.showToast('Erro ao eliminar projeto', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Mostra um toast (notificação)
   * @param message - Mensagem a exibir
   * @param color - Cor do toast
   */
  private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  /**
   * Atualiza a lista (pull to refresh)
   * @param event - Evento do refresher
   */
  async doRefresh(event: any): Promise<void> {
    await this.loadData();
    event.target.complete();
  }
}
