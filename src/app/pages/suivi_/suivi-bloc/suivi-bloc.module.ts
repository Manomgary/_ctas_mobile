import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuiviBlocPageRoutingModule } from './suivi-bloc-routing.module';

import { SuiviBlocPage } from './suivi-bloc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuiviBlocPageRoutingModule
  ],
  declarations: [SuiviBlocPage]
})
export class SuiviBlocPageModule {}
