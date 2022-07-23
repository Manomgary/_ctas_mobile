import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationVePage } from './animation-ve/animation-ve.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BeneficiairePrPage } from './beneficiaire-pr/beneficiaire-pr.page';
import { SuiviPrPage } from './suivi-pr/suivi-pr.page';



@NgModule({
  declarations: [
    BeneficiairePrPage,
    AnimationVePage,
    SuiviPrPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AngularMaterialModule,
    FlexLayoutModule
  ]
})
export class PrModule { }
