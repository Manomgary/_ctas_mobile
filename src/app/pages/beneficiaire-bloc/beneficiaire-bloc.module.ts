import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeneficiaireBlocPageRoutingModule } from './beneficiaire-bloc-routing.module';

import { BeneficiaireBlocPage } from './beneficiaire-bloc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeneficiaireBlocPageRoutingModule
  ],
  declarations: [BeneficiaireBlocPage]
})
export class BeneficiaireBlocPageModule {}
