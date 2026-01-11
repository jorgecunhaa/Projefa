import { Component, OnInit } from '@angular/core';
import { ExportService } from '../../core/services/export.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

/**
 * Export Page
 * 
 * Página para exportação de dados da aplicação.
 * Permite exportar dados em formato JSON ou CSV.
 * 
 * @component ExportPage
 */
@Component({
  selector: 'app-export',
  templateUrl: './export.page.html',
  styleUrls: ['./export.page.scss'],
  standalone: false
})
export class ExportPage implements OnInit {
  /**
   * Formato selecionado ('json' | 'csv')
   */
  selectedFormat: 'json' | 'csv' = 'json';

  /**
   * Tipo de dados selecionado ('all' | 'categories' | 'projects' | 'tasks')
   */
  selectedType: 'all' | 'categories' | 'projects' | 'tasks' = 'all';

  constructor(
    private exportService: ExportService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  /**
   * Inicializa o componente
   */
  ngOnInit(): void {
    // Nada a fazer
  }

  /**
   * Exporta os dados selecionados
   */
  async exportData(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'A exportar dados...'
    });
    await loading.present();

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (this.selectedFormat === 'json') {
        mimeType = 'application/json';
        switch (this.selectedType) {
          case 'all':
            content = await this.exportService.exportAllAsJSON();
            filename = this.exportService.generateFilename('projefa_export_all', 'json');
            break;
          case 'categories':
            content = await this.exportService.exportCategoriesAsJSON();
            filename = this.exportService.generateFilename('projefa_export_categories', 'json');
            break;
          case 'projects':
            content = await this.exportService.exportProjectsAsJSON();
            filename = this.exportService.generateFilename('projefa_export_projects', 'json');
            break;
          case 'tasks':
            content = await this.exportService.exportTasksAsJSON();
            filename = this.exportService.generateFilename('projefa_export_tasks', 'json');
            break;
        }
      } else {
        mimeType = 'text/csv';
        switch (this.selectedType) {
          case 'all':
            content = await this.exportService.exportAllAsCSV();
            filename = this.exportService.generateFilename('projefa_export_all', 'csv');
            break;
          case 'categories':
            content = await this.exportService.exportCategoriesAsCSV();
            filename = this.exportService.generateFilename('projefa_export_categories', 'csv');
            break;
          case 'projects':
            content = await this.exportService.exportProjectsAsCSV();
            filename = this.exportService.generateFilename('projefa_export_projects', 'csv');
            break;
          case 'tasks':
            content = await this.exportService.exportTasksAsCSV();
            filename = this.exportService.generateFilename('projefa_export_tasks', 'csv');
            break;
        }
      }

      this.exportService.downloadFile(content, filename, mimeType);
      await this.showToast('Dados exportados com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      await this.showToast('Erro ao exportar dados', 'danger');
    } finally {
      await loading.dismiss();
    }
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
}
