import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsPage } from './projects.page';
import { ProjectDetailPage } from './project-detail/project-detail.page';

/**
 * Rotas do módulo de projetos
 */
const routes: Routes = [
  {
    path: '',
    component: ProjectsPage
  },
  {
    path: ':id',
    component: ProjectDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
