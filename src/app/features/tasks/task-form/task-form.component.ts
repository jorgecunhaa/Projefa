import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { ProjectService } from '../../projects/services/project.service';
import { ImageService } from '../services/image.service';
import { Task, CreateTaskDto, UpdateTaskDto } from '../../../core/models/task.model';
import { Project } from '../../../core/models/project.model';

/**
 * Task Form Component
 * 
 * Componente de formulário para criar ou editar uma tarefa.
 * Utiliza Reactive Forms para validação e gestão do estado.
 * Inclui captura de imagem e seleção de projeto.
 * 
 * @component TaskFormComponent
 */
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: false
})
export class TaskFormComponent implements OnInit {
  /**
   * Tarefa a editar (null se for criação)
   */
  @Input() task: Task | null = null;

  /**
   * ID do projeto pré-selecionado (opcional)
   */
  @Input() projectId?: string;

  /**
   * Formulário reativo
   */
  taskForm!: FormGroup;

  /**
   * Indica se está em modo de edição
   */
  isEditMode: boolean = false;

  /**
   * Lista de projetos disponíveis
   */
  projects: Project[] = [];

  /**
   * Imagem capturada (Base64)
   */
  capturedImage: string | null = null;

  /**
   * URL da imagem para pré-visualização
   */
  imagePreviewUrl: string | null = null;

  /**
   * Data mínima para seleção (hoje)
   */
  minDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private taskService: TaskService,
    private projectService: ProjectService,
    private imageService: ImageService
  ) {
    this.initializeForm();
  }

  /**
   * Inicializa o componente
   */
  async ngOnInit(): Promise<void> {
    await this.loadProjects();
    this.setupForm();
  }

  /**
   * Inicializa o formulário
   */
  private initializeForm(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split('T')[0];

    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      dueDate: [tomorrowISO, Validators.required],
      projectId: ['', Validators.required],
      image: [null]
    });
  }

  /**
   * Carrega os projetos disponíveis
   */
  private async loadProjects(): Promise<void> {
    try {
      this.projects = await this.projectService.getAllProjects();
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      this.projects = [];
    }
  }

  /**
   * Configura o formulário com dados da tarefa (se em modo edição)
   */
  private setupForm(): void {
    if (this.task) {
      this.isEditMode = true;
      this.capturedImage = this.task.image || null;
      this.imagePreviewUrl = this.imageService.getImageUrl(this.capturedImage);
      
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        dueDate: this.task.dueDate.split('T')[0],
        projectId: this.task.projectId,
        image: this.task.image
      });
    } else {
      this.isEditMode = false;
      
      // Selecionar projeto pré-definido ou primeiro projeto
      if (this.projectId) {
        this.taskForm.patchValue({ projectId: this.projectId });
      } else if (this.projects.length > 0) {
        this.taskForm.patchValue({ projectId: this.projects[0].id });
      }
    }
  }

  /**
   * Mostra action sheet para escolher fonte da imagem
   */
  async showImageSourceOptions(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecionar Imagem',
      buttons: [
        {
          text: 'Câmera',
          icon: 'camera-outline',
          handler: () => {
            this.captureImage('camera');
          }
        },
        {
          text: 'Galeria',
          icon: 'images-outline',
          handler: () => {
            this.captureImage('gallery');
          }
        },
        {
          text: 'Remover Imagem',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.removeImage();
          },
          cssClass: this.capturedImage ? '' : 'ion-hide'
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  /**
   * Captura uma imagem
   * @param source - Fonte da imagem
   */
  async captureImage(source: 'camera' | 'gallery'): Promise<void> {
    try {
      const base64 = await this.imageService.captureImage(source);
      if (base64) {
        // Redimensionar imagem para otimizar
        const resized = await this.imageService.resizeImage(base64, 800, 800);
        this.capturedImage = resized;
        this.imagePreviewUrl = this.imageService.getImageUrl(resized);
        this.taskForm.patchValue({ image: resized });
      }
    } catch (error) {
      console.error('Erro ao capturar imagem:', error);
    }
  }

  /**
   * Remove a imagem
   */
  removeImage(): void {
    this.capturedImage = null;
    this.imagePreviewUrl = null;
    this.taskForm.patchValue({ image: null });
  }

  /**
   * Submete o formulário
   */
  async onSubmit(): Promise<void> {
    if (this.taskForm.invalid) {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.taskForm.value;
    const dueDateISO = new Date(formValue.dueDate).toISOString();

    try {
      if (this.isEditMode && this.task) {
        // Atualizar tarefa existente
        const updates: UpdateTaskDto = {
          title: formValue.title,
          description: formValue.description,
          dueDate: dueDateISO,
          projectId: formValue.projectId,
          image: formValue.image
        };
        await this.taskService.updateTask(this.task.id, updates);
      } else {
        // Criar nova tarefa
        const createData: CreateTaskDto = {
          title: formValue.title,
          description: formValue.description,
          dueDate: dueDateISO,
          projectId: formValue.projectId,
          image: formValue.image
        };
        await this.taskService.createTask(createData);
      }

      // Fechar modal e retornar sucesso
      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  }

  /**
   * Cancela e fecha o modal
   */
  async cancel(): Promise<void> {
    await this.modalController.dismiss({ saved: false });
  }

  /**
   * Verifica se um campo tem erro
   * @param fieldName - Nome do campo
   * @returns true se o campo tem erro e foi touched
   */
  hasError(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtém a mensagem de erro de um campo
   * @param fieldName - Nome do campo
   * @returns Mensagem de erro ou string vazia
   */
  getErrorMessage(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    
    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'Este campo é obrigatório';
    }
    if (field.errors['minlength']) {
      return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (field.errors['maxlength']) {
      return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
    }

    return 'Valor inválido';
  }
}
