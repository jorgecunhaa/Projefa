import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Shared Module
 * 
 * Módulo compartilhado que contém componentes, pipes e diretivas
 * reutilizáveis em toda a aplicação.
 * 
 * @module SharedModule
 */
@NgModule({
  declarations: [
    // Componentes compartilhados serão adicionados aqui
    // Pipes compartilhados serão adicionados aqui
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
    // Componentes e pipes serão exportados aqui
  ]
})
export class SharedModule { }
