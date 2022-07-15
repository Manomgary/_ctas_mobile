import { Component, OnInit, ViewChild } from '@angular/core';

import { NavigationExtras, Router, RouterEvent } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Loc_activ_projet, Loc_projet } from '../interfaces/interfaces-local';
import { SharedService } from '../services/shared.service';
import { Utilisateurs } from '../utils/interface-bd';

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
    activite: Loc_activ_projet = {
      code: null,
      id_proj: null,
      nom: null,
      id_equipe: null,
      id_volet: null,
      id_activ: null,
      intitule: null,
      description: null,
      statuts: null
    };
    projet: Loc_projet = {
      numero: null,
      code_proj: null,
      nom: null,
      description: null,
      logo: null,
      statuts: null,
      ancronyme: null
    };
    zoneInter: any = [];
    users: Utilisateurs[] = [];
    firstNavigate: boolean = false;
    benefRoute: string = '';
    private isBloc: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private isPms: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private isPr: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private isBi: BehaviorSubject<boolean> = new BehaviorSubject(false);

    pages_pms = [
      { title: 'Identification de beneficiaire', url: '/menu/beneficiaire_rp', icone: 'person', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite, user: this.users},
      { title: 'Carnet de suivi pms', url: '/menu/suivi_rp', icone: 'navigate', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite, user: this.users}
      //{ title: 'Synchronisation', url: '/menu/synchronisation', icone: 'cloud-upload', color: 'success', data: this.zoneInter, projet: this.projet, activite: this.activite , user: this.users}      
    ];

    pages_bloc = [
      { title: 'Identification de beneficiaire', url: '/menu/beneficiaire_bloc', icone: 'person', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite, user: this.users},
      { title: 'Carnet de suivi bloc', url: '/menu/suivi_bloc', icone: 'navigate', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite, user: this.users},
      //{ title: 'Synchronisation', url: '/menu/synchronisation', icone: 'cloud-upload', color: 'success', data: this.zoneInter, projet: this.projet, activite: this.activite, user: this.users}      
    ];

    pages_pr = [
      { title: 'Identification Paysant Relais', url: '/menu/beneficiaire_pr', icone: 'person', color: 'primary', projet: this.projet, activite: this.activite, user: this.users},
      { title: 'Animation/Visite Echange', url: '/menu/animation-ve', icone: 'person', color: 'primary', projet: this.projet, activite: this.activite, user: this.users},
      { title: 'Carnet de suivi PR', url: '/menu/suivi_pr', icone: 'navigate', color: 'primary', projet: this.projet, activite: this.activite, user: this.users},
      //{ title: 'Synchronisation', url: '/menu/synchronisation', icone: 'cloud-upload', color: 'success',  projet: this.projet , activite: this.activite, user: this.users}      
    ];

    pages_bi = [
      { title: 'Identification de beneficiaire', url: '/menu/beneficiaire_rp', icone: 'person', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite, user: this.users},
      { title: 'Carnet de suivi BI', url: '/menu/suivi', icone: 'navigate', color: 'primary', data: this.zoneInter, projet: this.projet, activite: this.activite, user: this.users},
      //{ title: 'Synchronisation', url: '/menu/synchronisation', icone: 'cloud-upload', color: 'success', data: this.zoneInter, projet: this.projet, activite: this.activite, user: this.users}      
    ];

    selectedPath = '';

  constructor(
    public router: Router, 
    public modalCtrl: ModalController,
    private sharedService: SharedService) { 
    console.log("***Menu*** :::::constructeur:::::");

    if (this.router.getCurrentNavigation().extras.state) {
      this.firstNavigate = true;

      const routeState = this.router.getCurrentNavigation().extras.state;
      console.log("***Menu Router state zone*** :::::constructeur:::::", routeState.zone);
      this.zoneInter = routeState.zone != undefined? JSON.parse(routeState.zone): null;
      this.projet = JSON.parse(routeState.projet);
      this.activite = routeState.activite;
      this.users = routeState.users;
      console.log(routeState);
      this.navigateRouter();
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
    this.selectedPath = data.url;
    if (this.sharedService.getData() != null) {
      data.data = this.sharedService.getData();
      switch(this.activite.intitule.trim().toUpperCase()) {
        case 'BLOC':
          this.pages_bloc.forEach(elements => {
            elements.data = this.sharedService.getData();
          });
          break;
        case 'RP':
          this.pages_pms.forEach(elements => {
            elements.data = this.sharedService.getData();
          });
          break;
      }
    }
    let navigationExtras: NavigationExtras;
    switch(this.activite.intitule.trim().toUpperCase()) {
      case 'PR' || 'BI':
        navigationExtras = {
          state : {
            projet: JSON.stringify(data.projet),
            user: JSON.stringify(data.user),
            activite: this.activite
          }
        };
        break;
      default:
        navigationExtras = {
          state : {
            zone: JSON.stringify(data.data),
            projet: JSON.stringify(data.projet),
            user: JSON.stringify(data.user),
            activite: this.activite
          }
        };
        break;
    }
    console.log("Menu Page =====>");
    console.log(navigationExtras.state);
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([data.url], navigationExtras);
  }

  goToRoot() {
    let navigationExtras: NavigationExtras;
    switch(this.activite.intitule.trim().toUpperCase()) {
      case 'PR' || 'BI':
        navigationExtras = {
          state : {
            projet: JSON.stringify(this.projet),
            user: JSON.stringify(this.users),
            activite: this.activite
          }
        };
        break;
      default:
        navigationExtras = {
          state : {
            zone: JSON.stringify(this.zoneInter),
            projet: JSON.stringify(this.projet),
            user: JSON.stringify(this.users),
            activite: this.activite
          }
        };
        break;
    }
    console.log("Menu Page =====>");
    console.log(navigationExtras.state)
    this.router.navigate(['menu/' + this.benefRoute], navigationExtras);
  }

  onSync() {
    let navigationExtras: NavigationExtras = {
      state : {
        projet: JSON.stringify(this.projet),
        users: JSON.stringify(this.users)
      }
    };
    this.router.navigate(['/synchro'], navigationExtras);
  }

  navigateRouter() {
    if (this.activite.intitule.trim().toUpperCase() === 'BLOC') {
      this.pages_bloc.forEach(elements => {
        elements.data = this.zoneInter;
        elements.projet = this.projet;
        elements.activite = this.activite;
        elements.user = this.users;
      });
      this.benefRoute = 'beneficiaire_bloc';
      this.isBloc.next(true);
      this.goToRoot();
    } else if (this.activite.intitule.trim().toUpperCase() === 'RP') {
      this.pages_pms.forEach(elements => {
        elements.data = this.zoneInter;
        elements.projet = this.projet;
        elements.activite = this.activite;
        elements.user = this.users;
      });
      this.benefRoute = 'beneficiaire_rp';
      this.isPms.next(true);
      this.goToRoot();
    } else if (this.activite.intitule.trim().toUpperCase() === 'PR') {
      this.pages_pr.forEach(elements => {
        elements.projet = this.projet;
        elements.activite = this.activite;
        elements.user = this.users;
      });
      this.benefRoute = 'beneficiaire_pr';
      this.isPr.next(true);
      this.goToRoot();
    } else if (this.activite.intitule.trim().toUpperCase() === 'BI') {
      this.pages_pr.forEach(elements => {
        elements.projet = this.projet;
        elements.activite = this.activite;
        elements.user = this.users;
      });
      this.benefRoute = 'beneficiaire_rp';
      this.isBi.next(true);
      this.goToRoot();
    }
  }
}
