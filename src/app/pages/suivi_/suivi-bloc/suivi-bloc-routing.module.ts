import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuiviBlocPage } from './suivi-bloc.page';

const routes: Routes = [
  {
    path: '',
    component: SuiviBlocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuiviBlocPageRoutingModule {}
