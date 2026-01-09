import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksPage } from './tasks.page';
import { TaskDetailPage } from './task-detail/task-detail.page';

/**
 * Rotas do módulo de tarefas
 */
const routes: Routes = [
  {
    path: '',
    component: TasksPage
  },
  {
    path: ':id',
    component: TaskDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {}
