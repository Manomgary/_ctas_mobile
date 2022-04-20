import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login-routing.module').then( m => m.LoginPageRoutingModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home/:usersId',
    loadChildren: () => import('./home/home-routing.module').then( m => m.HomePageRoutingModule)
  },
  {
    path: 'homes',
    loadChildren: () => import('./home/home-routing.module').then( m => m.HomePageRoutingModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu-routing.module').then( m => m.MenuPageRoutingModule)
  },
  {
    path: 'beneficiaire-bloc',
    loadChildren: () => import('./pages/beneficiaire-bloc/beneficiaire-bloc.module').then( m => m.BeneficiaireBlocPageModule)
  },
  {
    path: 'suivi-bloc',
    loadChildren: () => import('./pages/suivi_/suivi-bloc/suivi-bloc.module').then( m => m.SuiviBlocPageModule)
  },
  {
    path: 'synchro',
    loadChildren: () => import('./pages/synchro/synchro-routing.module').then( m => m.SynchroPageRoutingModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
