import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeneficiairePrPage } from './beneficiaire-pr.page';

const routes: Routes = [
  {
    path: '',
    component: BeneficiairePrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeneficiairePrPageRoutingModule {}
