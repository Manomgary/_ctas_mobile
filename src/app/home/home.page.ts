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
  nomPrjt: string = '';
  usersReady: boolean = false;
  isFirstConnection: boolean = false;
  selectedActive: string = '';
  selectedProjet = {};
 
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
                    /**if (this.isFirstConnection) {
                      console.log("**première connection**");
                      //this.Activite_Projet = JSON.parse(routeState.activeProjet);
                      this.users.forEach((element) => {
                        console.log(element);  
                        let id_pr = {
                          id_projet: element.id_proj
                        }
                        this.api.getListActiveProjet(id_pr).subscribe((res: any[]) => {
                          console.log("--------Homme API::: ActiveProjet....");
                          let count = 0;
                          console.log(res);
                          console.log(this.Activite_Projet);
                          res.forEach((element) => {
                            count ++;
                            this.Activite_Projet.push({
                              code: element.code,
                              id_proj: element.id_proj,
                              nom: element.nom,
                              id_activ: element.id_activ,
                              intitule: element.intitule,
                              description: element.description,
                              statuts: element.statuts
                            });
                            if (count === res.length) this.nomPrjt = element.nom;
                          });
                          console.log(this.Activite_Projet);
                        });
                      });
                      console.log(this.Activite_Projet);
                    } else {
                      console.log("**Deuxiemes connection local**");
                      this.getUsers();
                    }*/
                    this.getUsers();
                    console.log(this.users);
                  }
                }
              }
  ngOnInit() {
    console.log("<=======NgOnInit Homme Page=================>");
    if (this.isFirstConnection) {}
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
      if (!(Object.keys(data).length === 0 && data.constructor === Object)) {
        this.modalData = data;
        console.log("*****Modal Data*****");
        console.log(this.modalData);
        const navigationExtras: NavigationExtras = {
          state : {
            zone: JSON.stringify(this.modalData),
            activite: this.selectedActive
          }
        };
        this.route.navigate(['menu'], navigationExtras);
      }
    });
    await modal.present();
  }
  doMenu(data: any) {
    this.selectedActive = data;
    this.presentModal(this.selectedActive);
  }

  getProjet() {
    
  }

  getUsers() {
    if (this.users != null && this.users.length > 0) {
      this.users.forEach(async element => {
        console.log(element);  
        await this.loadData.loadActiveProjet(element.id_proj);
        await this.loadData.getStateQuer().subscribe(isReady => {
            if (isReady) {
              this.loadData.getActivitePr().subscribe(data => {
                console.log("-------Homme Page response-------");
                console.log(data);
                this.Activite_Projet = [];
                this.Activite_Projet = data;
                console.log(this.Activite_Projet);
                this.Activite_Projet.forEach((elem) => {
                  this.nomPrjt = elem.nom;
                });
              });
            }
          });
      });
    } else console.log("users vide::: Home page");
  }
}
