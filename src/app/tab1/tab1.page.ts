import { Component } from '@angular/core';

/**
 * Tab1 Page (Home)
 * 
 * Página inicial da aplicação.
 * Mostra uma citação inspiradora e links rápidos para as principais funcionalidades.
 * 
 * @component Tab1Page
 */
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  /**
   * Links rápidos para as principais funcionalidades
   */
  quickLinks = [
    { label: 'Projetos', route: '/projects', icon: 'briefcase-outline', color: 'primary' },
    { label: 'Tarefas', route: '/tasks', icon: 'checkmark-circle-outline', color: 'success' },
    { label: 'Calendário', route: '/calendar', icon: 'calendar-outline', color: 'primary' },
    { label: 'Categorias', route: '/categories', icon: 'folder-outline', color: 'secondary' },
    { label: 'Estatísticas', route: '/statistics', icon: 'stats-chart-outline', color: 'tertiary' },
    { label: 'Pesquisa', route: '/search', icon: 'search-outline', color: 'medium' }
  ];

  constructor() {}
}
