/**
 * Modelo de Projeto
 * 
 * Representa um projeto que agrupa tarefas na aplicação.
 */
export interface Project {
  /** Identificador único do projeto */
  id: string;
  
  /** Nome do projeto */
  name: string;
  
  /** ID da categoria à qual o projeto pertence */
  categoryId: string;
  
  /** Data de criação */
  createdAt: string;
  
  /** Data de última atualização */
  updatedAt: string;
}

/**
 * Projeto com informações da categoria (para exibição)
 */
export interface ProjectWithCategory extends Project {
  /** Nome da categoria */
  categoryName: string;
  
  /** Cor da categoria */
  categoryColor: string;
  
  /** Ícone da categoria */
  categoryIcon: string;
}

/**
 * Dados para criar um novo projeto
 */
export interface CreateProjectDto {
  name: string;
  categoryId: string;
}

/**
 * Dados para atualizar um projeto existente
 */
export interface UpdateProjectDto {
  name?: string;
  categoryId?: string;
}
