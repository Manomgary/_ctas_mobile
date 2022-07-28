import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficiaireBlocPage } from './beneficiaire-bloc/beneficiaire-bloc.page';
import { SuiviBlocPage } from './suivi_/suivi-bloc/suivi-bloc.page';
import { CustomDatePipe } from '../utils/custom.datepipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DefaultModule } from './default/default.module';



@NgModule({
  declarations: [
    BeneficiaireBlocPage,
    SuiviBlocPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AngularMaterialModule,
    FlexLayoutModule,
    DefaultModule
  ]
})
export class BlocModule { }
