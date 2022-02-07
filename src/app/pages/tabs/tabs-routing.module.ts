import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

/**const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/tab1/tab1-routing.module').then( m => m.Tab1PageRoutingModule)
          }
        ]
      },
      {
        path: 'tab2',
        loadChildren: () => import('../pages/tab2/tab2-routing.module').then( m => m.Tab2PageRoutingModule)
      },
      {
        path: '',
        redirectTo: 'home/menu/first/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home/menu/first/tab1',
    pathMatch: 'full'
  }
];*/
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1-routing.module').then(m => m.Tab1PageRoutingModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2-routing.module').then(m => m.Tab2PageRoutingModule)
      },
      {
        path: '',
        redirectTo: 'tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
