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
        path: 'beneficiaire_rp',
        loadChildren: () => import('../pages/beneficiaire/beneficiaire-routing.module').then( m => m.BeneficiairePageRoutingModule)
      },
      {
        path: 'beneficiaire_bloc',
        loadChildren: () => import('../pages/beneficiaire-bloc/beneficiaire-bloc-routing.module').then( m => m.BeneficiaireBlocPageRoutingModule)
      },
      {
        path: 'suivi_rp',
        loadChildren: () => import('../pages/suivi_/suivi/suivi-routing.module').then( m => m.SuiviPageRoutingModule)
      },
      {
        path: 'suivi_bloc',
        loadChildren: () => import('../pages/suivi_/suivi-bloc/suivi-bloc-routing.module').then( m => m.SuiviBlocPageRoutingModule)
      }/**,
      {
        path: 'synchronisation',
        loadChildren: () => import('../pages/tabs/tabs-routing.module').then( m => m.TabsPageRoutingModule)
      },
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
