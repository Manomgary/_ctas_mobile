import { Component, OnInit } from '@angular/core';

import { NavigationExtras, Router, RouterEvent } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ModalPage } from '../pages/modal/modal.page';

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
    // Basic root for our content view
    //rootPage = 'TabsPage';
    activite: string;
    zoneInter: any = [];
    firstNavigate: boolean = false;
    private isBloc: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private isPms: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private isPr: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private isBi: BehaviorSubject<boolean> = new BehaviorSubject(false);

    pages_pms = [
      { title: 'Identification de beneficiaire', url: '/menu/beneficiaire', icone: 'person', color: 'primary', data: this.zoneInter},
      { title: 'Carnet de suivi pms', url: '/menu/suivi', icone: 'navigate', color: 'primary', data: this.zoneInter },
      { title: 'Synchronisation', url: '/menu/synchronisation', icone: 'cloud-upload', color: 'success', data: this.zoneInter }      
    ];

    pages_bloc = [
      { title: 'Identification de beneficiaire', url: '/menu/beneficiaire', icone: 'person', color: 'primary', data: this.zoneInter},
      { title: 'Carnet de suivi bloc', url: '/menu/suivi', icone: 'navigate', color: 'primary', data: this.zoneInter },
      { title: 'Synchronisation', url: '/menu/synchronisation', icone: 'cloud-upload', color: 'success', data: this.zoneInter }      
    ];

    pages_pr = [
      { title: 'Identification de beneficiaire', url: '/menu/beneficiaire', icone: 'person', color: 'primary', data: this.zoneInter},
      { title: 'Carnet de suivi PR', url: '/menu/suivi', icone: 'navigate', color: 'primary', data: this.zoneInter },
      { title: 'Synchronisation', url: '/menu/synchronisation', icone: 'cloud-upload', color: 'success', data: this.zoneInter }      
    ];

    pages_bi = [
      { title: 'Identification de beneficiaire', url: '/menu/beneficiaire', icone: 'person', color: 'primary', data: this.zoneInter},
      { title: 'Carnet de suivi BI', url: '/menu/suivi', icone: 'navigate', color: 'primary', data: this.zoneInter },
      { title: 'Synchronisation', url: '/menu/synchronisation', icone: 'cloud-upload', color: 'success', data: this.zoneInter }      
    ];


    selectedPath = '';

  constructor(public router: Router, public modalCtrl: ModalController) { 
    console.log("constructeur:::::");
    if (this.router.getCurrentNavigation().extras.state) {
      this.firstNavigate = true;
      const routeState = this.router.getCurrentNavigation().extras.state;
      this.zoneInter = JSON.parse(routeState.zone);
      this.activite = routeState.activite;
      console.log(this.activite);
      if (this.activite.toUpperCase() === 'BLOC') {
        this.pages_bloc.forEach(elements => {
          elements.data = this.zoneInter;
        });
        this.isBloc.next(true);
      } else if (this.activite.toUpperCase() === 'RP') {
        this.pages_pms.forEach(elements => {
          elements.data = this.zoneInter;
        });
        this.isPms.next(true);
      } else if (this.activite.toUpperCase() === 'PR') {
        this.pages_pr.forEach(elements => {
          elements.data = this.zoneInter;
        });
        this.isPr.next(true);
      } else if (this.activite.toUpperCase() === 'BI') {
        this.pages_pr.forEach(elements => {
          elements.data = this.zoneInter;
        });
        this.isBi.next(true);
      }
      console.log(this.zoneInter);
    }
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        if(this.firstNavigate) {
          this.selectedPath = event.url + '/beneficiaire';
          this.firstNavigate = false;
        } else this.selectedPath = event.url;
          console.log("========= selected === " + this.selectedPath);
      }
    });
  } 
  ngOnInit() {
    console.log("ngOnit:::::::::");
    const navigationExtras: NavigationExtras = {
      state : {
        zone: JSON.stringify(this.zoneInter)
      }
    };
    console.log("Menu Page =====>" + navigationExtras.state);
    console.log(navigationExtras.state)
    this.router.navigate(['menu/beneficiaire'], navigationExtras);
  }

  onClick(url) {
    console.log("=====url clicked ===> " + url);
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      cssClass: 'my-custom-class'
    });
    await modal.present();
  }

  goToUrl(url: string, data: any) {
    console.log(data);
    this.router.navigate([url]);
  }

}
