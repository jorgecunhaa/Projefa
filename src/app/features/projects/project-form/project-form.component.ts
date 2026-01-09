import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ProjectService } from '../services/project.service';
import { CategoryService } from '../../categories/services/category.service';
import { Project, CreateProjectDto, UpdateProjectDto, ProjectWithCategory } from '../../../core/models/project.model';
import { Category } from '../../../core/models/category.model';

/**
 * Project Form Component
 * 
 * Componente de formulário para criar ou editar um projeto.
 * Utiliza Reactive Forms para validação e gestão do estado.
 * 
 * @component ProjectFormComponent
 */
@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  standalone: false
})
export class ProjectFormComponent implements OnInit {
  /**
   * Projeto a editar (null se for criação)
   */
  @Input() project: Project | ProjectWithCategory | null = null;

  /**
   * Formulário reativo
   */
  projectForm!: FormGroup;

  /**
   * Indica se está em modo de edição
   */
  isEditMode: boolean = false;

  /**
   * Lista de categorias disponíveis
   */
  categories: Category[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private projectService: ProjectService,
    private categoryService: CategoryService
  ) {
    this.initializeForm();
  }

  /**
   * Inicializa o componente
   */
  async ngOnInit(): Promise<void> {
    await this.loadCategories();
    this.setupForm();
  }

  /**
   * Inicializa o formulário
   */
  private initializeForm(): void {
    this.projectForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      categoryId: ['', Validators.required]
    });
  }

  /**
   * Carrega as categorias disponíveis
   */
  private async loadCategories(): Promise<void> {
    try {
      this.categories = await this.categoryService.getAllCategories();
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      this.categories = [];
    }
  }

  /**
   * Configura o formulário com dados do projeto (se em modo edição)
   */
  private setupForm(): void {
    if (this.project) {
      this.isEditMode = true;
      
      this.projectForm.patchValue({
        name: this.project.name,
        categoryId: this.project.categoryId
      });
    } else {
      this.isEditMode = false;
      
      // Selecionar primeira categoria por padrão se existir
      if (this.categories.length > 0) {
        this.projectForm.patchValue({
          categoryId: this.categories[0].id
        });
      }
    }
  }

  /**
   * Submete o formulário
   */
  async onSubmit(): Promise<void> {
    if (this.projectForm.invalid) {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.projectForm.controls).forEach(key => {
        this.projectForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.projectForm.value;

    try {
      if (this.isEditMode && this.project) {
        // Atualizar projeto existente
        const updates: UpdateProjectDto = {
          name: formValue.name,
          categoryId: formValue.categoryId
        };
        await this.projectService.updateProject(this.project.id, updates);
      } else {
        // Criar novo projeto
        const createData: CreateProjectDto = {
          name: formValue.name,
          categoryId: formValue.categoryId
        };
        await this.projectService.createProject(createData);
      }

      // Fechar modal e retornar sucesso
      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
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
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtém a mensagem de erro de um campo
   * @param fieldName - Nome do campo
   * @returns Mensagem de erro ou string vazia
   */
  getErrorMessage(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    
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

  /**
   * Obtém a categoria selecionada
   * @returns Categoria selecionada ou null
   */
  getSelectedCategory(): Category | null {
    const categoryId = this.projectForm.get('categoryId')?.value;
    return this.categories.find(c => c.id === categoryId) || null;
  }
}
