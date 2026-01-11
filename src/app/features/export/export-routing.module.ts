import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportPage } from './export.page';

/**
 * Rotas do módulo de exportação
 */
const routes: Routes = [
  {
    path: '',
    component: ExportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportRoutingModule {}
