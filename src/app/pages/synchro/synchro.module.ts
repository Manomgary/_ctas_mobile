import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SynchroPageRoutingModule } from './synchro-routing.module';

import { SynchroPage } from './synchro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SynchroPageRoutingModule
  ],
  declarations: [SynchroPage]
})
export class SynchroPageModule {}
