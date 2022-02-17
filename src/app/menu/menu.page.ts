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
    activite: string = '';
    projet: any = {};
    zoneInter: any = [];
    firstNavigate: boolean = false;
    benefRoute: string = '';
    private isBloc: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private isPms: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private isPr: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private isBi: BehaviorSubject<boolean> = new BehaviorSubject(false);

    pages_pms = [
      { title: 'Identification de beneficiaire', url: '/menu/beneficiaire_rp', icone: 'person', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite},
      { title: 'Carnet de suivi pms', url: '/menu/suivi', icone: 'navigate', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite},
      { title: 'Synchronisation', url: '/menu/synchronisation', icone: 'cloud-upload', color: 'success', data: this.zoneInter, projet: this.projet, activite: this.activite}      
    ];

    pages_bloc = [
      { title: 'Identification de beneficiaire', url: '/menu/beneficiaire_bloc', icone: 'person', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite},
      { title: 'Carnet de suivi bloc', url: '/menu/suivi', icone: 'navigate', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite},
      { title: 'Synchronisation', url: '/menu/synchronisation', icone: 'cloud-upload', color: 'success', data: this.zoneInter, projet: this.projet, activite: this.activite}      
    ];

    pages_pr = [
      { title: 'Identification de beneficiaire', url: '/menu/beneficiaire_rp', icone: 'person', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite},
      { title: 'Carnet de suivi PR', url: '/menu/suivi', icone: 'navigate', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite},
      { title: 'Synchronisation', url: '/menu/synchronisation', icone: 'cloud-upload', color: 'success', data: this.zoneInter, projet: this.projet , activite: this.activite}      
    ];

    pages_bi = [
      { title: 'Identification de beneficiaire', url: '/menu/beneficiaire_rp', icone: 'person', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite},
      { title: 'Carnet de suivi BI', url: '/menu/suivi', icone: 'navigate', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite},
      { title: 'Synchronisation', url: '/menu/synchronisation', icone: 'cloud-upload', color: 'success', data: this.zoneInter, projet: this.projet, activite: this.activite}      
    ];


    selectedPath = '';

  constructor(public router: Router, public modalCtrl: ModalController) { 
    console.log("***Menu*** :::::constructeur:::::");

    if (this.router.getCurrentNavigation().extras.state) {
      this.firstNavigate = true;

      const routeState = this.router.getCurrentNavigation().extras.state;
      this.zoneInter = JSON.parse(routeState.zone);
      this.projet = JSON.parse(routeState.projet);
      this.activite = routeState.activite;
      console.log(routeState);

      if (this.activite.toUpperCase() === 'BLOC') {
        this.pages_bloc.forEach(elements => {
          elements.data = this.zoneInter;
          elements.projet = this.projet;
          elements.activite = this.activite;
        });
        this.benefRoute = 'beneficiaire_bloc';
        this.isBloc.next(true);
        this.goToRoot();
      } else if (this.activite.toUpperCase() === 'RP') {
        this.pages_pms.forEach(elements => {
          elements.data = this.zoneInter;
          elements.projet = this.projet;
          elements.activite = this.activite;
        });
        this.benefRoute = 'beneficiaire_rp';
        this.isPms.next(true);
        this.goToRoot();
      } else if (this.activite.toUpperCase() === 'PR') {
        this.pages_pr.forEach(elements => {
          elements.data = this.zoneInter;
          elements.projet = this.projet;
          elements.activite = this.activite;
        });
        this.benefRoute = 'beneficiaire_rp';
        this.isPr.next(true);
        this.goToRoot();
      } else if (this.activite.toUpperCase() === 'BI') {
        this.pages_pr.forEach(elements => {
          elements.data = this.zoneInter;
          elements.projet = this.projet;
          elements.activite = this.activite;
        });
        this.benefRoute = 'beneficiaire_rp';
        this.isBi.next(true);
        this.goToRoot();
      }
    }
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        if(this.firstNavigate) {
          this.selectedPath = event.url;
          this.firstNavigate = false;
        } else this.selectedPath = event.url;
          console.log("========= selected === " + this.selectedPath);
      }
    });
  } 
  ngOnInit() {
    console.log("ngOnit:::::::::");

  }

  onClick(url) {
    console.log("=====url clicked ===> " + url);
  }

  goToUrl(data: any) {
    console.log(data);
    const navigationExtras: NavigationExtras = {
      state : {
        zone: JSON.stringify(data.data),
        projet: JSON.stringify(data.projet)
      }
    };
    console.log("Menu Page =====>");
    console.log(navigationExtras.state);
    this.router.navigate([data.url], navigationExtras);
  }

  goToRoot() {
    const navigationExtras: NavigationExtras = {
      state : {
        zone: JSON.stringify(this.zoneInter),
        projet: JSON.stringify(this.projet)
      }
    };
    console.log("Menu Page =====>");
    console.log(navigationExtras.state)
    this.router.navigate(['menu/' + this.benefRoute], navigationExtras);
  }

}
