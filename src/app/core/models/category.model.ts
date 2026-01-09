/**
 * Modelo de Categoria
 * 
 * Representa uma categoria de projetos na aplicação.
 * Exemplos: Escola, Trabalho, Pessoal
 */
export interface Category {
  /** Identificador único da categoria */
  id: string;
  
  /** Nome da categoria */
  name: string;
  
  /** Cor da categoria (hexadecimal) */
  color: string;
  
  /** Ícone da categoria (nome do ícone Ionic) */
  icon: string;
  
  /** Data de criação */
  createdAt: string;
  
  /** Data de última atualização */
  updatedAt: string;
}

/**
 * Dados para criar uma nova categoria
 */
export interface CreateCategoryDto {
  name: string;
  color: string;
  icon: string;
}

/**
 * Dados para atualizar uma categoria existente
 */
export interface UpdateCategoryDto {
  name?: string;
  color?: string;
  icon?: string;
}
