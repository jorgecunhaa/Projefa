import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SearchPage } from './search.page';
import { SearchRoutingModule } from './search-routing.module';
import { SharedModule } from '../../shared/shared.module';

/**
 * Search Module
 * 
 * Módulo de funcionalidades para pesquisa global na aplicação.
 * Permite pesquisar em categorias, projetos e tarefas.
 * 
 * @module SearchModule
 */
@NgModule({
  declarations: [
    SearchPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchRoutingModule,
    SharedModule
  ]
})
export class SearchModule {}
