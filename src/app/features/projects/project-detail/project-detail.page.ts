import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { ProjectService } from '../services/project.service';
import { ProjectWithCategory } from '../../../core/models/project.model';
import { ProjectFormComponent } from '../project-form/project-form.component';

/**
 * Project Detail Page
 * 
 * Página de detalhes de um projeto específico.
 * Mostra informações do projeto, estatísticas e lista de tarefas.
 * Permite editar e eliminar o projeto.
 * 
 * @component ProjectDetailPage
 */
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.page.html',
  styleUrls: ['./project-detail.page.scss'],
  standalone: false
})
export class ProjectDetailPage implements OnInit {
  /**
   * Projeto atual
   */
  project: ProjectWithCategory | null = null;

  /**
   * Estatísticas do projeto
   */
  statistics = {
    total: 0,
    completed: 0,
    overdue: 0,
    percentage: 0
  };

  /**
   * Indica se está a carregar dados
   */
  isLoading: boolean = false;

  /**
   * ID do projeto (da rota)
   */
  private projectId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  /**
   * Inicializa o componente
   */
  async ngOnInit(): Promise<void> {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    if (this.projectId) {
      await this.loadProject();
      await this.loadStatistics();
    } else {
      await this.showToast('Projeto não encontrado', 'danger');
      this.router.navigate(['/projects']);
    }
  }

  /**
   * Carrega os dados do projeto
   */
  async loadProject(): Promise<void> {
    this.isLoading = true;
    try {
      this.project = await this.projectService.getProjectByIdWithCategory(this.projectId);
      if (!this.project) {
        await this.showToast('Projeto não encontrado', 'danger');
        this.router.navigate(['/projects']);
      }
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      await this.showToast('Erro ao carregar projeto', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Carrega as estatísticas do projeto
   */
  async loadStatistics(): Promise<void> {
    try {
      this.statistics = await this.projectService.getProjectStatistics(this.projectId);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  /**
   * Abre o modal para editar o projeto
   */
  async openEditModal(): Promise<void> {
    if (!this.project) {
      return;
    }

    const modal = await this.modalController.create({
      component: ProjectFormComponent,
      componentProps: {
        project: this.project
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.saved) {
      await this.loadProject();
      await this.loadStatistics();
      await this.showToast('Projeto atualizado com sucesso!', 'success');
    }
  }

  /**
   * Elimina o projeto após confirmação
   */
  async deleteProject(): Promise<void> {
    if (!this.project) {
      return;
    }

    const hasTasks = await this.projectService.hasTasks(this.project.id);
    
    const message = hasTasks
      ? 'Este projeto tem tarefas associadas. Todas as tarefas serão eliminadas. Continuar?'
      : `Tens a certeza que queres eliminar o projeto "${this.project.name}"?`;

    const alert = await this.alertController.create({
      header: 'Eliminar Projeto',
      message: message,
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
              await this.projectService.deleteProject(this.project!.id);
              await this.showToast('Projeto eliminado com sucesso!', 'success');
              this.router.navigate(['/projects']);
            } catch (error) {
              console.error('Erro ao eliminar projeto:', error);
              await this.showToast('Erro ao eliminar projeto', 'danger');
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
   * Navega para criar uma tarefa neste projeto
   */
  navigateToCreateTask(): void {
    // Será implementado no módulo de tarefas
    // this.router.navigate(['/tasks/create'], { queryParams: { projectId: this.projectId } });
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
   * Atualiza a página (pull to refresh)
   * @param event - Evento do refresher
   */
  async doRefresh(event: any): Promise<void> {
    await Promise.all([
      this.loadProject(),
      this.loadStatistics()
    ]);
    event.target.complete();
  }
}
