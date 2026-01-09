import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Category } from '../models/category.model';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';

/**
 * Database Service
 * 
 * Serviço responsável pela gestão da base de dados SQLite.
 * Fornece métodos para criar, ler, atualizar e eliminar dados
 * das tabelas: categories, projects e tasks.
 * 
 * @service DatabaseService
 */
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqliteConnection!: SQLiteConnection;
  private db!: SQLiteDBConnection;
  private readonly DB_NAME = 'projefa_db';
  private readonly DB_VERSION = 1;
  private isInitialized = false;

  constructor() {
    this.initializeDatabase();
  }

  /**
   * Inicializa a base de dados SQLite
   * Cria a conexão e as tabelas necessárias
   */
  private async initializeDatabase(): Promise<void> {
    try {
      // Verificar se está em plataforma nativa
      if (!Capacitor.isNativePlatform()) {
        console.warn('SQLite só está disponível em plataformas nativas. Usando fallback para web.');
        this.isInitialized = true;
        return;
      }

      // Criar conexão SQLite
      this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
      
      // Verificar se a base de dados existe
      const ret = await this.sqliteConnection.checkConnectionsConsistency();
      const isConn = (await this.sqliteConnection.isConnection(this.DB_NAME, false)).result;

      if (!ret.result && isConn) {
        await this.sqliteConnection.closeConnection(this.DB_NAME, false);
      }

      // Abrir ou criar a base de dados
      this.db = await this.sqliteConnection.createConnection(
        this.DB_NAME,
        false,
        'no-encryption',
        this.DB_VERSION,
        false
      );

      await this.db.open();

      // Criar tabelas
      await this.createTables();
      
      this.isInitialized = true;
      console.log('Base de dados SQLite inicializada com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar a base de dados:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Cria todas as tabelas necessárias na base de dados
   */
  private async createTables(): Promise<void> {
    try {
      // Tabela de categorias
      const createCategoriesTable = `
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          color TEXT NOT NULL,
          icon TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );
      `;

      // Tabela de projetos
      const createProjectsTable = `
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          categoryId TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
        );
      `;

      // Tabela de tarefas
      const createTasksTable = `
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY NOT NULL,
          projectId TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          dueDate TEXT NOT NULL,
          image TEXT,
          completed INTEGER NOT NULL DEFAULT 0,
          "order" INTEGER NOT NULL DEFAULT 0,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
        );
      `;

      // Criar índices para melhor performance
      const createIndexes = `
        CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(categoryId);
        CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(projectId);
        CREATE INDEX IF NOT EXISTS idx_tasks_dueDate ON tasks(dueDate);
        CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
      `;

      await this.db.execute(createCategoriesTable);
      await this.db.execute(createProjectsTable);
      await this.db.execute(createTasksTable);
      await this.db.execute(createIndexes);

      console.log('Tabelas criadas com sucesso');
    } catch (error) {
      console.error('Erro ao criar tabelas:', error);
      throw error;
    }
  }

  /**
   * Verifica se a base de dados está inicializada
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Base de dados não está inicializada');
    }
    if (!Capacitor.isNativePlatform()) {
      throw new Error('SQLite só está disponível em plataformas nativas');
    }
  }

  // ==================== CATEGORIES ====================

  /**
   * Obtém todas as categorias
   */
  async getAllCategories(): Promise<Category[]> {
    this.ensureInitialized();
    try {
      const result = await this.db.query('SELECT * FROM categories ORDER BY name ASC');
      return result.values || [];
    } catch (error) {
      console.error('Erro ao obter categorias:', error);
      throw error;
    }
  }

  /**
   * Obtém uma categoria por ID
   */
  async getCategoryById(id: string): Promise<Category | null> {
    this.ensureInitialized();
    try {
      const result = await this.db.query('SELECT * FROM categories WHERE id = ?', [id]);
      return result.values && result.values.length > 0 ? result.values[0] : null;
    } catch (error) {
      console.error('Erro ao obter categoria:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova categoria
   */
  async createCategory(category: Category): Promise<void> {
    this.ensureInitialized();
    try {
      const query = `
        INSERT INTO categories (id, name, color, icon, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await this.db.run(query, [
        category.id,
        category.name,
        category.color,
        category.icon,
        category.createdAt,
        category.updatedAt
      ]);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma categoria existente
   */
  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    this.ensureInitialized();
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.name !== undefined) {
        fields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.color !== undefined) {
        fields.push('color = ?');
        values.push(updates.color);
      }
      if (updates.icon !== undefined) {
        fields.push('icon = ?');
        values.push(updates.icon);
      }

      fields.push('updatedAt = ?');
      values.push(new Date().toISOString());
      values.push(id);

      const query = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;
      await this.db.run(query, values);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  }

  /**
   * Elimina uma categoria
   */
  async deleteCategory(id: string): Promise<void> {
    this.ensureInitialized();
    try {
      await this.db.run('DELETE FROM categories WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erro ao eliminar categoria:', error);
      throw error;
    }
  }

  // ==================== PROJECTS ====================

  /**
   * Obtém todos os projetos
   */
  async getAllProjects(): Promise<Project[]> {
    this.ensureInitialized();
    try {
      const result = await this.db.query('SELECT * FROM projects ORDER BY createdAt DESC');
      return result.values || [];
    } catch (error) {
      console.error('Erro ao obter projetos:', error);
      throw error;
    }
  }

  /**
   * Obtém projetos por categoria
   */
  async getProjectsByCategory(categoryId: string): Promise<Project[]> {
    this.ensureInitialized();
    try {
      const result = await this.db.query(
        'SELECT * FROM projects WHERE categoryId = ? ORDER BY createdAt DESC',
        [categoryId]
      );
      return result.values || [];
    } catch (error) {
      console.error('Erro ao obter projetos por categoria:', error);
      throw error;
    }
  }

  /**
   * Obtém um projeto por ID
   */
  async getProjectById(id: string): Promise<Project | null> {
    this.ensureInitialized();
    try {
      const result = await this.db.query('SELECT * FROM projects WHERE id = ?', [id]);
      return result.values && result.values.length > 0 ? result.values[0] : null;
    } catch (error) {
      console.error('Erro ao obter projeto:', error);
      throw error;
    }
  }

  /**
   * Cria um novo projeto
   */
  async createProject(project: Project): Promise<void> {
    this.ensureInitialized();
    try {
      const query = `
        INSERT INTO projects (id, name, categoryId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?)
      `;
      await this.db.run(query, [
        project.id,
        project.name,
        project.categoryId,
        project.createdAt,
        project.updatedAt
      ]);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  }

  /**
   * Atualiza um projeto existente
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    this.ensureInitialized();
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.name !== undefined) {
        fields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.categoryId !== undefined) {
        fields.push('categoryId = ?');
        values.push(updates.categoryId);
      }

      fields.push('updatedAt = ?');
      values.push(new Date().toISOString());
      values.push(id);

      const query = `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`;
      await this.db.run(query, values);
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  }

  /**
   * Elimina um projeto
   */
  async deleteProject(id: string): Promise<void> {
    this.ensureInitialized();
    try {
      await this.db.run('DELETE FROM projects WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erro ao eliminar projeto:', error);
      throw error;
    }
  }

  // ==================== TASKS ====================

  /**
   * Obtém todas as tarefas
   */
  async getAllTasks(): Promise<Task[]> {
    this.ensureInitialized();
    try {
      const result = await this.db.query('SELECT * FROM tasks ORDER BY "order" ASC, createdAt DESC');
      return result.values?.map((task: any) => ({
        ...task,
        completed: task.completed === 1
      })) || [];
    } catch (error) {
      console.error('Erro ao obter tarefas:', error);
      throw error;
    }
  }

  /**
   * Obtém tarefas por projeto
   */
  async getTasksByProject(projectId: string): Promise<Task[]> {
    this.ensureInitialized();
    try {
      const result = await this.db.query(
        'SELECT * FROM tasks WHERE projectId = ? ORDER BY "order" ASC, createdAt DESC',
        [projectId]
      );
      return result.values?.map((task: any) => ({
        ...task,
        completed: task.completed === 1
      })) || [];
    } catch (error) {
      console.error('Erro ao obter tarefas por projeto:', error);
      throw error;
    }
  }

  /**
   * Obtém tarefas em atraso
   */
  async getOverdueTasks(): Promise<Task[]> {
    this.ensureInitialized();
    try {
      const now = new Date().toISOString();
      const result = await this.db.query(
        'SELECT * FROM tasks WHERE dueDate < ? AND completed = 0 ORDER BY dueDate ASC',
        [now]
      );
      return result.values?.map((task: any) => ({
        ...task,
        completed: task.completed === 1
      })) || [];
    } catch (error) {
      console.error('Erro ao obter tarefas em atraso:', error);
      throw error;
    }
  }

  /**
   * Obtém uma tarefa por ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    this.ensureInitialized();
    try {
      const result = await this.db.query('SELECT * FROM tasks WHERE id = ?', [id]);
      if (result.values && result.values.length > 0) {
        const task = result.values[0];
        return {
          ...task,
          completed: task.completed === 1
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter tarefa:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova tarefa
   */
  async createTask(task: Task): Promise<void> {
    this.ensureInitialized();
    try {
      const query = `
        INSERT INTO tasks (id, projectId, title, description, dueDate, image, completed, "order", createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await this.db.run(query, [
        task.id,
        task.projectId,
        task.title,
        task.description,
        task.dueDate,
        task.image || null,
        task.completed ? 1 : 0,
        task.order,
        task.createdAt,
        task.updatedAt
      ]);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma tarefa existente
   */
  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    this.ensureInitialized();
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.projectId !== undefined) {
        fields.push('projectId = ?');
        values.push(updates.projectId);
      }
      if (updates.title !== undefined) {
        fields.push('title = ?');
        values.push(updates.title);
      }
      if (updates.description !== undefined) {
        fields.push('description = ?');
        values.push(updates.description);
      }
      if (updates.dueDate !== undefined) {
        fields.push('dueDate = ?');
        values.push(updates.dueDate);
      }
      if (updates.image !== undefined) {
        fields.push('image = ?');
        values.push(updates.image);
      }
      if (updates.completed !== undefined) {
        fields.push('completed = ?');
        values.push(updates.completed ? 1 : 0);
      }
      if (updates.order !== undefined) {
        fields.push('"order" = ?');
        values.push(updates.order);
      }

      fields.push('updatedAt = ?');
      values.push(new Date().toISOString());
      values.push(id);

      const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
      await this.db.run(query, values);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  }

  /**
   * Elimina uma tarefa
   */
  async deleteTask(id: string): Promise<void> {
    this.ensureInitialized();
    try {
      await this.db.run('DELETE FROM tasks WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erro ao eliminar tarefa:', error);
      throw error;
    }
  }

  /**
   * Atualiza a ordem de múltiplas tarefas
   */
  async updateTasksOrder(tasks: { id: string; order: number }[]): Promise<void> {
    this.ensureInitialized();
    try {
      for (const task of tasks) {
        await this.db.run('UPDATE tasks SET "order" = ?, updatedAt = ? WHERE id = ?', [
          task.order,
          new Date().toISOString(),
          task.id
        ]);
      }
    } catch (error) {
      console.error('Erro ao atualizar ordem das tarefas:', error);
      throw error;
    }
  }

  /**
   * Fecha a conexão com a base de dados
   */
  async closeDatabase(): Promise<void> {
    if (this.db && Capacitor.isNativePlatform()) {
      try {
        await this.sqliteConnection.closeConnection(this.DB_NAME, false);
        this.isInitialized = false;
      } catch (error) {
        console.error('Erro ao fechar base de dados:', error);
      }
    }
  }
}
