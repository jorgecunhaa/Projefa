import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataSyncService } from '../../../core/services/data-sync.service';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../../core/models/category.model';
import { generateId } from '../../../core/utils/id-generator.util';

/**
 * Category Service
 * 
 * Serviço responsável pela gestão de categorias na aplicação.
 * Fornece métodos para criar, ler, atualizar e eliminar categorias,
 * além de gerenciar o estado das categorias com observables.
 * 
 * @service CategoryService
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  /**
   * Subject para gerenciar o estado das categorias
   */
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  
  /**
   * Observable das categorias (para componentes se inscreverem)
   */
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  /**
   * Cores predefinidas para categorias
   */
  private readonly DEFAULT_COLORS = [
    '#8B0000', // Bordô
    '#A52A2A', // Bordô claro
    '#5C0000', // Bordô escuro
    '#2E7D32', // Verde
    '#1976D2', // Azul
    '#F57C00', // Laranja
    '#7B1FA2', // Roxo
    '#C2185B', // Rosa
    '#00796B', // Verde água
    '#5D4037'  // Castanho
  ];

  /**
   * Ícones predefinidos para categorias
   */
  private readonly DEFAULT_ICONS = [
    'folder-outline',
    'school-outline',
    'briefcase-outline',
    'home-outline',
    'heart-outline',
    'fitness-outline',
    'musical-notes-outline',
    'book-outline',
    'car-outline',
    'gift-outline'
  ];

  constructor(private dataSync: DataSyncService) {
    this.loadCategories();
  }

  /**
   * Carrega todas as categorias da base de dados
   */
  async loadCategories(): Promise<void> {
    try {
      const categories = await this.dataSync.getAllCategories();
      this.categoriesSubject.next(categories);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      this.categoriesSubject.next([]);
    }
  }

  /**
   * Obtém todas as categorias
   * @returns Promise com array de categorias
   */
  async getAllCategories(): Promise<Category[]> {
    return await this.dataSync.getAllCategories();
  }

  /**
   * Obtém uma categoria por ID
   * @param id - ID da categoria
   * @returns Promise com a categoria ou null
   */
  async getCategoryById(id: string): Promise<Category | null> {
    return await this.dataSync.getCategoryById(id);
  }

  /**
   * Cria uma nova categoria
   * @param data - Dados da categoria a criar
   * @returns Promise com a categoria criada
   */
  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const now = new Date().toISOString();
    const category: Category = {
      id: generateId(),
      name: data.name,
      color: data.color,
      icon: data.icon,
      createdAt: now,
      updatedAt: now
    };

    try {
      await this.dataSync.createCategory(category);
      await this.loadCategories(); // Recarregar lista
      return category;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma categoria existente
   * @param id - ID da categoria
   * @param updates - Dados a atualizar
   * @returns Promise
   */
  async updateCategory(id: string, updates: UpdateCategoryDto): Promise<void> {
    try {
      await this.dataSync.updateCategory(id, updates);
      await this.loadCategories(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  }

  /**
   * Elimina uma categoria
   * @param id - ID da categoria
   * @returns Promise
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      await this.dataSync.deleteCategory(id);
      await this.loadCategories(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao eliminar categoria:', error);
      throw error;
    }
  }

  /**
   * Obtém cores predefinidas
   * @returns Array de cores hexadecimais
   */
  getDefaultColors(): string[] {
    return [...this.DEFAULT_COLORS];
  }

  /**
   * Obtém ícones predefinidos
   * @returns Array de nomes de ícones
   */
  getDefaultIcons(): string[] {
    return [...this.DEFAULT_ICONS];
  }

  /**
   * Verifica se uma categoria está a ser usada por algum projeto
   * @param categoryId - ID da categoria
   * @returns Promise com true se estiver em uso
   */
  async isCategoryInUse(categoryId: string): Promise<boolean> {
    try {
      const projects = await this.dataSync.getProjectsByCategory(categoryId);
      return projects.length > 0;
    } catch (error) {
      console.error('Erro ao verificar uso da categoria:', error);
      return false;
    }
  }
}
