import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeneficiaireBlocPage } from './beneficiaire-bloc.page';

const routes: Routes = [
  {
    path: '',
    component: BeneficiaireBlocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeneficiaireBlocPageRoutingModule {}
