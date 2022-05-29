import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalBlocPageRoutingModule } from './modal-bloc-routing.module';

import { ModalBlocPage } from './modal-bloc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalBlocPageRoutingModule
  ],
  declarations: [ModalBlocPage]
})
export class ModalBlocPageModule {}
