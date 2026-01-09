import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CategoryService } from '../services/category.service';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../../core/models/category.model';

/**
 * Category Form Component
 * 
 * Componente de formulário para criar ou editar uma categoria.
 * Utiliza Reactive Forms para validação e gestão do estado.
 * 
 * @component CategoryFormComponent
 */
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  standalone: false
})
export class CategoryFormComponent implements OnInit {
  /**
   * Categoria a editar (null se for criação)
   */
  @Input() category: Category | null = null;

  /**
   * Formulário reativo
   */
  categoryForm!: FormGroup;

  /**
   * Indica se está em modo de edição
   */
  isEditMode: boolean = false;

  /**
   * Cores predefinidas disponíveis
   */
  availableColors: string[] = [];

  /**
   * Ícones predefinidos disponíveis
   */
  availableIcons: string[] = [];

  /**
   * Cor selecionada
   */
  selectedColor: string = '#8B0000';

  /**
   * Ícone selecionado
   */
  selectedIcon: string = 'folder-outline';

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private categoryService: CategoryService
  ) {
    this.initializeForm();
  }

  /**
   * Inicializa o componente
   */
  ngOnInit(): void {
    this.loadDefaults();
    this.setupForm();
  }

  /**
   * Inicializa o formulário
   */
  private initializeForm(): void {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      color: ['#8B0000', Validators.required],
      icon: ['folder-outline', Validators.required]
    });
  }

  /**
   * Carrega cores e ícones predefinidos
   */
  private loadDefaults(): void {
    this.availableColors = this.categoryService.getDefaultColors();
    this.availableIcons = this.categoryService.getDefaultIcons();
  }

  /**
   * Configura o formulário com dados da categoria (se em modo edição)
   */
  private setupForm(): void {
    if (this.category) {
      this.isEditMode = true;
      this.selectedColor = this.category.color;
      this.selectedIcon = this.category.icon;
      
      this.categoryForm.patchValue({
        name: this.category.name,
        color: this.category.color,
        icon: this.category.icon
      });
    } else {
      this.isEditMode = false;
    }
  }

  /**
   * Manipula a seleção de cor
   * @param color - Cor selecionada
   */
  selectColor(color: string): void {
    this.selectedColor = color;
    this.categoryForm.patchValue({ color });
  }

  /**
   * Manipula a seleção de ícone
   * @param icon - Ícone selecionado
   */
  selectIcon(icon: string): void {
    this.selectedIcon = icon;
    this.categoryForm.patchValue({ icon });
  }

  /**
   * Submete o formulário
   */
  async onSubmit(): Promise<void> {
    if (this.categoryForm.invalid) {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.categoryForm.value;

    try {
      if (this.isEditMode && this.category) {
        // Atualizar categoria existente
        const updates: UpdateCategoryDto = {
          name: formValue.name,
          color: formValue.color,
          icon: formValue.icon
        };
        await this.categoryService.updateCategory(this.category.id, updates);
      } else {
        // Criar nova categoria
        const createData: CreateCategoryDto = {
          name: formValue.name,
          color: formValue.color,
          icon: formValue.icon
        };
        await this.categoryService.createCategory(createData);
      }

      // Fechar modal e retornar sucesso
      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      // O erro será tratado pelo serviço, mas podemos adicionar um toast aqui se necessário
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
    const field = this.categoryForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtém a mensagem de erro de um campo
   * @param fieldName - Nome do campo
   * @returns Mensagem de erro ou string vazia
   */
  getErrorMessage(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
    
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
