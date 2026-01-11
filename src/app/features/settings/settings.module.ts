import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SettingsPage } from './settings.page';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../../shared/shared.module';

/**
 * Settings Module
 * 
 * Módulo de funcionalidades para configurações da aplicação.
 * Permite configurar modo escuro, notificações e outras preferências.
 * 
 * @module SettingsModule
 */
@NgModule({
  declarations: [
    SettingsPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule {}
