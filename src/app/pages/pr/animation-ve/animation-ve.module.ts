import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimationVePageRoutingModule } from './animation-ve-routing.module';

import { AnimationVePage } from './animation-ve.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimationVePageRoutingModule
  ],
  declarations: [AnimationVePage]
})
export class AnimationVePageModule {}
