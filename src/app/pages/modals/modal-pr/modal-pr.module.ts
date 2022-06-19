import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPrPageRoutingModule } from './modal-pr-routing.module';

import { ModalPrPage } from './modal-pr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalPrPageRoutingModule
  ],
  declarations: [ModalPrPage]
})
export class ModalPrPageModule {}
