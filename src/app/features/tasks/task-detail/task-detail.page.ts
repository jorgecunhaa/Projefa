import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { ProjectService } from '../../projects/services/project.service';
import { TaskWithProject } from '../../../core/models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';

/**
 * Task Detail Page
 * 
 * Página de detalhes de uma tarefa específica.
 * Mostra todas as informações da tarefa e permite editar e eliminar.
 * 
 * @component TaskDetailPage
 */
@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
  standalone: false
})
export class TaskDetailPage implements OnInit {
  /**
   * Tarefa atual
   */
  task: TaskWithProject | null = null;

  /**
   * Indica se está a carregar dados
   */
  isLoading: boolean = false;

  /**
   * ID da tarefa (da rota)
   */
  private taskId: string = '';

  /**
   * URL da imagem para exibição
   */
  imageUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
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
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    if (this.taskId) {
      await this.loadTask();
    } else {
      await this.showToast('Tarefa não encontrada', 'danger');
      this.router.navigate(['/tasks']);
    }
  }

  /**
   * Carrega os dados da tarefa
   */
  async loadTask(): Promise<void> {
    this.isLoading = true;
    try {
      this.task = await this.taskService.getTaskByIdWithProject(this.taskId);
      if (!this.task) {
        await this.showToast('Tarefa não encontrada', 'danger');
        this.router.navigate(['/tasks']);
        return;
      }

      // Preparar URL da imagem
      if (this.task.image) {
        this.imageUrl = `data:image/jpeg;base64,${this.task.image}`;
      }
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      await this.showToast('Erro ao carregar tarefa', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Abre o modal para editar a tarefa
   */
  async openEditModal(): Promise<void> {
    if (!this.task) {
      return;
    }

    const modal = await this.modalController.create({
      component: TaskFormComponent,
      componentProps: {
        task: this.task
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.saved) {
      await this.loadTask();
      await this.showToast('Tarefa atualizada com sucesso!', 'success');
    }
  }

  /**
   * Marca a tarefa como concluída ou não concluída
   */
  async toggleCompletion(): Promise<void> {
    if (!this.task) {
      return;
    }

    try {
      await this.taskService.toggleTaskCompletion(this.task.id, !this.task.completed);
      await this.loadTask();
      await this.showToast(
        this.task.completed ? 'Tarefa marcada como pendente' : 'Tarefa marcada como concluída',
        'success'
      );
    } catch (error) {
      console.error('Erro ao alterar estado da tarefa:', error);
      await this.showToast('Erro ao alterar estado da tarefa', 'danger');
    }
  }

  /**
   * Elimina a tarefa após confirmação
   */
  async deleteTask(): Promise<void> {
    if (!this.task) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Eliminar Tarefa',
      message: `Tens a certeza que queres eliminar a tarefa "${this.task.title}"?`,
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
              await this.taskService.deleteTask(this.task!.id);
              await this.showToast('Tarefa eliminada com sucesso!', 'success');
              this.router.navigate(['/tasks']);
            } catch (error) {
              console.error('Erro ao eliminar tarefa:', error);
              await this.showToast('Erro ao eliminar tarefa', 'danger');
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
   * Verifica se a tarefa está em atraso
   */
  isOverdue(): boolean {
    if (!this.task || this.task.completed) {
      return false;
    }
    const dueDate = new Date(this.task.dueDate);
    const now = new Date();
    return dueDate < now;
  }

  /**
   * Navega para o projeto da tarefa
   */
  navigateToProject(): void {
    if (this.task) {
      this.router.navigate(['/projects', this.task.projectId]);
    }
  }

  /**
   * Mostra um toast (notificação)
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
   */
  async doRefresh(event: any): Promise<void> {
    await this.loadTask();
    event.target.complete();
  }
}
