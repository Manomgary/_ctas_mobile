import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'beneficiaire',
        loadChildren: () => import('../pages/beneficiaire/beneficiaire-routing.module').then( m => m.BeneficiairePageRoutingModule)
      },
      {
        path: 'suivi',
        loadChildren: () => import('../pages/suivi/suivi-routing.module').then( m => m.SuiviPageRoutingModule)
      },
      {
        path: 'synchronisation',
        loadChildren: () => import('../pages/tabs/tabs-routing.module').then( m => m.TabsPageRoutingModule)
      }/**,
      {
        path: '',
        redirectTo: 'beneficiaire',
        pathMatch: 'full'
      }*/
    ]
  }/**,
  {
    path: '',
    redirectTo: 'beneficiaire',
    pathMatch: 'full'
  } */
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}