import { AfterViewInit, Component, OnInit } from '@angular/core';
//import { DatabaseService } from '../services/database.service';
import { Users } from '../utils/interface-benef';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalPage } from '../pages/modal/modal.page';
import { LoadingController, ModalController } from '@ionic/angular';
import { Participe_proj_activ, Utilisateurs } from '../utils/interface-bd';
import { LoadDataService } from '../services/local/load-data.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  modalData: any;
  users: Utilisateurs[];
  Activite_Projet: any[] = [];
  projets: any[] = [];
  nomPrjt: string = '';
  usersReady: boolean = false;
  isFirstConnection: boolean = false;
  selectedActive: string = '';
  selectedProjet: any = {};
 
  constructor(
              private route: Router,
              private loadData: LoadDataService,
              private modalCtrl: ModalController,
              private api: ApiService,
              private loadingCtrl: LoadingController) 
              {
                console.log("<========Constructeur Homme Page=================>");
                if (this.route.getCurrentNavigation().extras.state) {
                  const routeState = this.route.getCurrentNavigation().extras.state;
                  if (routeState)
                  {
                    console.log("*******************");
                    this.users = JSON.parse(routeState.users);
                    this.isFirstConnection = routeState.isFirstConnect;
                    console.log(this.users);
                  }
                }
              }
  ngOnInit() {
    console.log("<=======NgOnInit Homme Page=================>");
    this.loadProjet();
    this.loadUsers();
  }

  async presentModal(data) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      cssClass: 'my-custom-modal',
      backdropDismiss: false,
      componentProps: {
        'isHome': true,
        'selectedActivite': data
      }
    });
    modal.onDidDismiss().then((data) => {
        this.modalData = data;
        console.log(this.modalData);
        if (!this.modalData.dismissed) {
          console.log("*****Modal Data*****");
          const navigationExtras: NavigationExtras = {
            state : {
              zone: JSON.stringify(this.modalData),
              projet: JSON.stringify(this.selectedProjet),
              activite: this.selectedActive
            }
          };
          console.log(navigationExtras);
          this.route.navigate(['menu'], navigationExtras);
          
        }
    });
    await modal.present();
  }
  doMenu(data: any) {
    this.selectedActive = data;
    this.presentModal(this.selectedActive);
  }

  loadProjet() {
    this.loadData.loadAllProjet({}).subscribe(res => {
      this.projets = res;
      console.log("***get Projet home page***");
      console.log(this.projets);
      if (this.projets.length > 0) {
        this.selectedProjet = this.projets[0];
        if (!(Object.keys(this.selectedProjet).length === 0)) {
          this.loadActivitePr(this.selectedProjet.code_proj);
        }
      }
    });
  }

  projetChange(value) {
    console.log("==== ngModel change ====");
    console.log(value);
    console.log(this.selectedProjet);
    this.loadActivitePr(this.selectedProjet.code_proj);
  }

  loadActivitePr(id_projet) {
    this.loadData.loadActiveProjet(id_projet).subscribe(data => {
      console.log("-------Homme Page ACTIVITE-------");
      console.log(data);
      this.Activite_Projet = [];
      this.Activite_Projet = data;
      console.log(this.Activite_Projet);
      this.Activite_Projet.forEach((elem) => {
        this.nomPrjt = elem.nom;
      });
    });
  }

  loadUsers() {
    if (this.users != null && this.users.length > 0) {
      this.users.forEach(async element => {
        console.log("-------Homme Page USERS DATA-------");
        console.log(element);  
      });
    } else console.log("users vide::: Home page");
  }
}
