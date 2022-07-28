import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from 'src/app/utils/custom.datepipe';



@NgModule({
  declarations: [
    CustomDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomDatePipe
  ]
})
export class DefaultModule { }
