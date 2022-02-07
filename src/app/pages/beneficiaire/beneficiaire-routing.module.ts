import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeneficiairePage } from './beneficiaire.page';


const routes: Routes = [
  {
    path: '',
    component: BeneficiairePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeneficiairePageRoutingModule {}
