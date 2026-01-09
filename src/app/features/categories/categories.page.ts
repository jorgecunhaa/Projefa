import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CategoryService } from './services/category.service';
import { Category } from '../../core/models/category.model';
import { CategoryFormComponent } from './category-form/category-form.component';

/**
 * Categories Page
 * 
 * Página principal para gestão de categorias.
 * Permite visualizar, criar, editar e eliminar categorias.
 * 
 * @component CategoriesPage
 */
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false
})
export class CategoriesPage implements OnInit, OnDestroy {
  /**
   * Lista de categorias
   */
  categories: Category[] = [];

  /**
   * Indica se está a carregar dados
   */
  isLoading: boolean = false;

  /**
   * Subscription para o observable de categorias
   */
  private categoriesSubscription?: Subscription;

  constructor(
    private categoryService: CategoryService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  /**
   * Inicializa o componente
   */
  ngOnInit(): void {
    this.loadCategories();
    this.subscribeToCategories();
  }

  /**
   * Limpa subscriptions ao destruir o componente
   */
  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }

  /**
   * Carrega as categorias da base de dados
   */
  async loadCategories(): Promise<void> {
    this.isLoading = true;
    try {
      await this.categoryService.loadCategories();
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      await this.showToast('Erro ao carregar categorias', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Subscreve ao observable de categorias
   */
  private subscribeToCategories(): void {
    this.categoriesSubscription = this.categoryService.categories$.subscribe(
      (categories) => {
        this.categories = categories;
      }
    );
  }

  /**
   * Abre o modal para criar uma nova categoria
   */
  async openCreateModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: CategoryFormComponent,
      componentProps: {
        category: null // null indica criação
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.saved) {
      await this.showToast('Categoria criada com sucesso!', 'success');
    }
  }

  /**
   * Abre o modal para editar uma categoria
   * @param category - Categoria a editar
   */
  async openEditModal(category: Category): Promise<void> {
    const modal = await this.modalController.create({
      component: CategoryFormComponent,
      componentProps: {
        category: category
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.saved) {
      await this.showToast('Categoria atualizada com sucesso!', 'success');
    }
  }

  /**
   * Elimina uma categoria após confirmação
   * @param category - Categoria a eliminar
   */
  async deleteCategory(category: Category): Promise<void> {
    // Verificar se a categoria está em uso
    const isInUse = await this.categoryService.isCategoryInUse(category.id);
    
    if (isInUse) {
      await this.showAlert(
        'Não é possível eliminar',
        'Esta categoria está a ser usada por um ou mais projetos. Elimine os projetos primeiro.',
        'warning'
      );
      return;
    }

    // Confirmar eliminação
    const alert = await this.alertController.create({
      header: 'Eliminar Categoria',
      message: `Tens a certeza que queres eliminar a categoria "${category.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'A eliminar...'
            });
            await loading.present();

            try {
              await this.categoryService.deleteCategory(category.id);
              await this.showToast('Categoria eliminada com sucesso!', 'success');
            } catch (error) {
              console.error('Erro ao eliminar categoria:', error);
              await this.showToast('Erro ao eliminar categoria', 'danger');
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
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
   * Mostra um alerta
   * @param header - Cabeçalho do alerta
   * @param message - Mensagem do alerta
   * @param color - Cor do alerta
   */
  private async showAlert(header: string, message: string, color: string = 'primary'): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  /**
   * Atualiza a lista (pull to refresh)
   * @param event - Evento do refresher
   */
  async doRefresh(event: any): Promise<void> {
    await this.loadCategories();
    event.target.complete();
  }
}
