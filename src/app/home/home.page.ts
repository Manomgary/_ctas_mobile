import { AfterViewInit, Component, OnInit } from '@angular/core';
//import { DatabaseService } from '../services/database.service';
import { Users } from '../utils/interface-benef';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalPage } from '../pages/modal/modal.page';
import { LoadingController, ModalController } from '@ionic/angular';
import { Participe_proj_activ, Utilisateurs } from '../utils/interface-bd';
import { LoadDataService } from '../services/local/load-data.service';
import { ApiService } from '../services/api.service';
import { Loc_activ_projet, Loc_projet } from '../interfaces/interfaces-local';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  modalData: any;
  users: Utilisateurs[];
  Activite_Projet: Loc_activ_projet[] = [];
  projets: Loc_projet[] = [];
  nomPrjt: string = '';
  usersReady: boolean = false;
  isFirstConnection: boolean = false;
  selectedActive: Loc_activ_projet = {
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
  selectedProjet: Loc_projet = {
    numero: null,
    code_proj: null,
    nom: null,
    description: null,
    logo: null,
    statuts: null,
    ancronyme: null
  };
 
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
  }

  async presentModal(data) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      cssClass: 'my-custom-modal',
      //backdropDismiss: false,
      componentProps: {
        'isHome': true,
        'selectedActivite': data
      }
    });
    modal.onDidDismiss().then(async (data_dism) => {
        console.log(data_dism);
        if (data_dism.data != undefined) {
          console.log("*****Modal Data*****");
          this.modalData = data_dism;
          const navigationExtras: NavigationExtras = {
            state : {
              zone: JSON.stringify(this.modalData),
              projet: JSON.stringify(this.selectedProjet),
              activite: this.selectedActive, // intituler de l'activité
              users: this.users
            }
          };
          console.log(navigationExtras);
          this.route.navigate(['menu'], navigationExtras);          
        }
    });
    await modal.present();
  }
  doMenu(data: Loc_activ_projet) {
    this.selectedActive = data;
    if (this.selectedActive.intitule == "PR") {
      const navigationExtras: NavigationExtras = {
        state : {
          projet: JSON.stringify(this.selectedProjet),
          activite: this.selectedActive, // intituler de l'activité
          users: this.users
        }
      };
      this.route.navigate(['menu'], navigationExtras);
    } else {
      this.presentModal(this.selectedActive);
    }
  }

  loadProjet() {
    this.loadData.loadAllProjet({}).subscribe(res => {
      this.projets = res;
      console.log("***get Projet home page***");
      console.log(this.projets);
      if (this.projets.length > 0) {
        this.selectedProjet = this.projets[0];
        if (!(Object.keys(this.selectedProjet).length === 0)) {
          let data_ = {
            id_projet: this.selectedProjet.code_proj,
            code_equipe: this.users[this.users.length - 1].id_equipe
          }
          this.loadActivitePr(data_);
        }
      }
    });
  }

  /**projetChange(value) {
    console.log("==== ngModel change ====");
    console.log(value);
    console.log(this.selectedProjet);
    let data_ = {
      id_projet: this.selectedProjet.code_proj,
      code_equipe: this.users[this.users.length - 1].id_equipe
    }
    this.loadActivitePr(data_);
  }*/
  onSelectProjet() {
    console.log(":::Selected projet::::", this.selectedProjet);
    let data_ = {
      id_projet: this.selectedProjet.code_proj,
      code_equipe: this.users[this.users.length - 1].id_equipe
    }
    this.loadActivitePr(data_);
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

  goToRoot() {
    const navigationExtras: NavigationExtras = {
      state : {
        projet: JSON.stringify(this.selectedProjet),
        users: JSON.stringify(this.users)
      }
    };
    console.log("Sync Homme Page =====>");
    console.log(navigationExtras.state)
    this.route.navigate(['synchro/'], navigationExtras);
  }
}
