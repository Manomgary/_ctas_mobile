import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestEncryptPageRoutingModule } from './test-encrypt-routing.module';

import { TestEncryptPage } from './test-encrypt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestEncryptPageRoutingModule
  ],
  declarations: [TestEncryptPage]
})
export class TestEncryptPageModule {}
