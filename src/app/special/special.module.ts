import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialPageRoutingModule } from './special-routing.module';

import { SpecialPage } from './special.page';

import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialPageRoutingModule,
    MatTabsModule
  ],
  declarations: [SpecialPage]
})
export class SpecialPageModule {}
