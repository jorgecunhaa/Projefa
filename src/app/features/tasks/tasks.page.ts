import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskService } from './services/task.service';
import { ProjectService } from '../projects/services/project.service';
import { Task, TaskWithProject } from '../../core/models/task.model';
import { Project } from '../../core/models/project.model';
import { TaskFormComponent } from './task-form/task-form.component';

/**
 * Tasks Page
 * 
 * Página principal para gestão de tarefas.
 * Permite visualizar, criar, editar e eliminar tarefas.
 * Inclui filtros por projeto, estado e ordenação.
 * 
 * @component TasksPage
 */
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false
})
export class TasksPage implements OnInit, OnDestroy {
  /**
   * Lista de tarefas
   */
  tasks: Task[] = [];

  /**
   * Lista de projetos (para filtro)
   */
  projects: Project[] = [];

  /**
   * Projeto selecionado para filtro ('' = todos)
   */
  selectedProjectId: string = '';

  /**
   * Filtro de estado ('' = todas, 'completed' = concluídas, 'pending' = pendentes, 'overdue' = em atraso)
   */
  statusFilter: string = '';

  /**
   * Indica se está a carregar dados
   */
  isLoading: boolean = false;

  /**
   * Subscription para o observable de tarefas
   */
  private tasksSubscription?: Subscription;

  /**
   * ID do projeto da rota (se vier de um projeto específico)
   */
  private routeProjectId?: string;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Inicializa o componente
   */
  async ngOnInit(): Promise<void> {
    // Verificar se há projectId na rota
    this.routeProjectId = this.route.snapshot.queryParams['projectId'];
    if (this.routeProjectId) {
      this.selectedProjectId = this.routeProjectId;
    }

    await this.loadData();
    this.subscribeToData();
  }

  /**
   * Limpa subscriptions ao destruir o componente
   */
  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  /**
   * Carrega tarefas e projetos
   */
  async loadData(): Promise<void> {
    this.isLoading = true;
    try {
      await Promise.all([
        this.taskService.loadTasks(),
        this.projectService.loadProjects()
      ]);
      await this.updateTasksList();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      await this.showToast('Erro ao carregar dados', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Subscreve ao observable de tarefas
   */
  private subscribeToData(): void {
    this.tasksSubscription = this.taskService.tasks$.subscribe(
      async () => {
        await this.updateTasksList();
      }
    );
  }

  /**
   * Atualiza a lista de tarefas com base nos filtros
   */
  private async updateTasksList(): Promise<void> {
    let allTasks: Task[] = [];

    // Obter tarefas por projeto ou todas
    if (this.selectedProjectId && this.selectedProjectId !== '') {
      allTasks = await this.taskService.getTasksByProject(this.selectedProjectId);
    } else {
      allTasks = await this.taskService.getAllTasks();
    }

    // Aplicar filtro de estado
    if (this.statusFilter === 'completed') {
      this.tasks = allTasks.filter(t => t.completed);
    } else if (this.statusFilter === 'pending') {
      this.tasks = allTasks.filter(t => !t.completed);
    } else if (this.statusFilter === 'overdue') {
      const now = new Date().toISOString();
      this.tasks = allTasks.filter(t => !t.completed && t.dueDate < now);
    } else {
      this.tasks = allTasks;
    }

    // Ordenar por ordem e depois por data
    this.tasks.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  /**
   * Filtra tarefas por projeto
   * @param projectId - ID do projeto ('' para todos)
   */
  async filterByProject(projectId: string): Promise<void> {
    this.selectedProjectId = projectId || '';
    await this.updateTasksList();
  }

  /**
   * Filtra tarefas por estado
   * @param status - Estado ('', 'completed', 'pending', 'overdue')
   */
  async filterByStatus(status: string): Promise<void> {
    this.statusFilter = status || '';
    await this.updateTasksList();
  }

  /**
   * Abre o modal para criar uma nova tarefa
   */
  async openCreateModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: TaskFormComponent,
      componentProps: {
        task: null,
        projectId: this.selectedProjectId || undefined
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.saved) {
      await this.showToast('Tarefa criada com sucesso!', 'success');
    }
  }

  /**
   * Abre o modal para editar uma tarefa
   * @param task - Tarefa a editar
   */
  async openEditModal(task: Task): Promise<void> {
    const modal = await this.modalController.create({
      component: TaskFormComponent,
      componentProps: {
        task: task
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.saved) {
      await this.showToast('Tarefa atualizada com sucesso!', 'success');
    }
  }

  /**
   * Navega para a página de detalhes da tarefa
   * @param taskId - ID da tarefa
   */
  navigateToTaskDetail(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  /**
   * Marca uma tarefa como concluída ou não concluída
   * @param task - Tarefa a alterar
   */
  async toggleTaskCompletion(task: Task): Promise<void> {
    try {
      await this.taskService.toggleTaskCompletion(task.id, !task.completed);
      await this.showToast(
        task.completed ? 'Tarefa marcada como pendente' : 'Tarefa marcada como concluída',
        'success'
      );
    } catch (error) {
      console.error('Erro ao alterar estado da tarefa:', error);
      await this.showToast('Erro ao alterar estado da tarefa', 'danger');
    }
  }

  /**
   * Elimina uma tarefa após confirmação
   * @param task - Tarefa a eliminar
   */
  async deleteTask(task: Task): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar Tarefa',
      message: `Tens a certeza que queres eliminar a tarefa "${task.title}"?`,
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
              await this.taskService.deleteTask(task.id);
              await this.showToast('Tarefa eliminada com sucesso!', 'success');
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
