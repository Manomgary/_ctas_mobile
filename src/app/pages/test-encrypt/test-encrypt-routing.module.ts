import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestEncryptPage } from './test-encrypt.page';

const routes: Routes = [
  {
    path: '',
    component: TestEncryptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestEncryptPageRoutingModule {}
