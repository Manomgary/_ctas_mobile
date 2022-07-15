import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuiviPrPageRoutingModule } from './suivi-pr-routing.module';

import { SuiviPrPage } from './suivi-pr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuiviPrPageRoutingModule
  ],
  declarations: [SuiviPrPage]
})
export class SuiviPrPageModule {}
