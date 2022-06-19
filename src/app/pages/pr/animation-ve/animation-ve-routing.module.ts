import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnimationVePage } from './animation-ve.page';

const routes: Routes = [
  {
    path: '',
    component: AnimationVePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnimationVePageRoutingModule {}
