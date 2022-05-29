import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalBlocPage } from './modal-bloc.page';

const routes: Routes = [
  {
    path: '',
    component: ModalBlocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalBlocPageRoutingModule {}
