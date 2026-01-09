import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CategoriesPage } from './categories.page';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from '../../shared/shared.module';

/**
 * Categories Module
 * 
 * Módulo de funcionalidades para gestão de categorias.
 * Inclui a página principal de categorias e o formulário
 * para criar/editar categorias.
 * 
 * @module CategoriesModule
 */
@NgModule({
  declarations: [
    CategoriesPage,
    CategoryFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CategoriesRoutingModule,
    SharedModule
  ]
})
export class CategoriesModule {}
