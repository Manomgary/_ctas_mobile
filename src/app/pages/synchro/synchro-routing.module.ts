import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SynchroPage } from './synchro.page';

const routes: Routes = [
  {
    path: '',
    component: SynchroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SynchroPageRoutingModule {}
