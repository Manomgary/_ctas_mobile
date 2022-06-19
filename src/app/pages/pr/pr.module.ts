import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficiairePage } from './beneficiaire/beneficiaire.page';
import { AnimationVePage } from './animation-ve/animation-ve.page';
import { SuiviPage } from './suivi/suivi.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    BeneficiairePage,
    AnimationVePage,
    SuiviPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularMaterialModule,
    FlexLayoutModule
  ]
})
export class PrModule { }
