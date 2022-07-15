import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeneficiairePrPageRoutingModule } from './beneficiaire-pr-routing.module';

import { BeneficiairePrPage } from './beneficiaire-pr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeneficiairePrPageRoutingModule
  ],
  declarations: [BeneficiairePrPage]
})
export class BeneficiairePrPageModule {}
