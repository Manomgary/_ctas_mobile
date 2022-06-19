import { Component, OnInit } from '@angular/core';

// Imports
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular'; 
import { ProjetEquipe, Utilisateurs } from '../utils/interface-bd';
import { Storage } from '@capacitor/storage';
import { ImportDataService } from '../services/import-data.service';
import { LoadDataService } from '../services/local/load-data.service';
import { FIRST_CONNECT_KEY } from '../utils/global-variables';
import { BehaviorSubject } from 'rxjs';
import { element } from 'protractor';
import { ModalPage } from '../pages/modal/modal.page';

const DATA_IMPORT_KEY = 'first_import';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup = new FormGroup({
    userName: new FormControl(''),
    passWord: new FormControl('')
  });
  submitted = false;
  hide = true;
  users: Utilisateurs[];
  isConnected = true;
  Activite_Projet: any[] = [];
  private isAuthenticate: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isValidate: boolean = false;
  isDataReady: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(
              public navCtrl: NavController, 
              private route: Router,
              private api: ApiService,
              private importData: ImportDataService,
              private loadData: LoadDataService,
              private importService: ImportDataService,
              private formBuilder: FormBuilder,
              public toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController,
              ) {}
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['', [
                  Validators.required,
                  Validators.minLength(3)
                ]
              ],
      passWord:  ['', [
          Validators.required,
          Validators.minLength(3)
        ]
      ],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }

  async doLogin() {

    //this.loginForm.reset();
    this.isValidate = true;
    this.submitted = true;
    const firstConnect = await Storage.get({ key: FIRST_CONNECT_KEY });

    if (this.loginForm.invalid) {
      this.isValidate = false;
      return;
    }
    console.log(this.loginForm.value);

    if (!firstConnect.value) {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      if (this.isConnected) {
        this.api.getLogin(JSON.stringify(this.loginForm.value)).subscribe(async (res: any) => {
          if (res.status == 1) {
            console.log(res.message);
            this.openToast(res.message);
            loading.dismiss();
          } else if (res.status == 2) {
            console.log(res.message);
            this.openToast(res.message);
            loading.dismiss();
          } else {
            this.users = res.data;
            console.log("Array Object");
            console.log(res.data);
            (await this.importData.loadData(this.users)).subscribe(isReady => {
              if (isReady) {
                console.log("----Data isReady---- " + isReady);
                setTimeout(() => {
                  //this.presentModal();
                  this.isDataReady.next(true);
                  //loading.dismiss();
                }, 7000);
              } else console.log("-----Data is not Ready---- " + isReady);
            });

            // Import DataProjet
            this.isDataReady.subscribe(isRead => {
              if (isRead) {
                console.log("******Data is Ready*******Login****");
                this.users.forEach((elem_user, i) => {
                  if ((this.users.length -1) == i) {
                    let data = {
                      code_equipe: elem_user.id_equipe
                    }
                    let data_equipe_pr: ProjetEquipe[];
                    let isAllDataReady = false;
                    // Insert Projet
                    this.api.getProjetEquipe(data).subscribe(async (res: ProjetEquipe[]) => {  
                      console.log("************************Load login ::: PROJET EQUIPE....");
                      console.log(res);
                      data_equipe_pr = res;
  
                      if (data_equipe_pr.length > 0) {
                        data_equipe_pr.forEach(async (elem_pr_equip, i) => {
                          console.log(elem_pr_equip);
                          /**
                           * inserer tous les données de l'équipe projet concerné
                           */
                          let id_pr = {
                            id_projet: elem_pr_equip.id_projet,
                            id_equipe: elem_user.id_equipe
                          }
                          /**
                           * pour inserer juste le données de l'utilisateurs connecter
                           */
                          this.importService.loadProjet(id_pr);
              
                          if (i == (data_equipe_pr.length - 1)) {
                            console.log("==Fin du boucle ProjetEquipe===========<> Importation terminer");
                            let isFinish: BehaviorSubject<boolean> = new BehaviorSubject(false);
                            setTimeout(() => {
                              this.modalCtrl.dismiss();
                              isFinish.next(true);
                              loading.dismiss();
                            }, 11000);

                            /**
                             * go to Url page homme
                             */
                            isFinish.subscribe(isFinished => {
                              if (isFinished) {
                                const navigationExtras: NavigationExtras = {
                                  state : {
                                    users: JSON.stringify(this.users),
                                    //activeProjet: JSON.stringify(this.Activite_Projet),
                                    isFirstConnect: true
                                  }
                                };
                                this.route.navigate(['homes'], navigationExtras);
                              }
                            });
                            await Storage.set({ key: FIRST_CONNECT_KEY, value:  '1'});
                          }
                        });
                      } else {
                        console.log(":::::::::::::::Aucun Equipe pour Projet:::::::::::", data);
                        loading.dismiss();
                      }
                    });
                  }
                });
              } else console.log("---------Data initiale is not ready-------");
            });
          }
        }, error => {
          loading.dismiss();
          this.openToast("Erreur serveur ou vérifier votre réseaux!");
        });
      } else {
        this.openToast("Merci d'activez votre wifi!");
      }
    } else {
      console.log("Connection sur bdd Local ");
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.loadData.loadUsers(this.loginForm.value);
      this.loadData.getStateQuer().subscribe(isReady => {
        if (isReady) {
          this.loadData.getUsers().subscribe(res => {
            console.log("******** Login Response ****");
            console.log(res);
            this.users = res;
            if (this.users != null && this.users.length > 0) {
              const navigationExtras: NavigationExtras = {
                state : {
                  users: JSON.stringify(this.users),
                  isFirstConnect: false
                }
              };
              this.route.navigate(['homes'], navigationExtras);
              loading.dismiss();
            } else {
              this.openToast("votre mot identifiant est incorrecte ou mot de passe!");
              loading.dismiss();
            }
          });
        }
      });
    }
    this.isValidate = false;
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      cssClass: 'my-custom-modal',
      backdropDismiss: false,
      componentProps: {
        'users': JSON.stringify(this.users),
        'isLogin': true
      }
    });
    modal.onDidDismiss().then(async (data) => {
      if (!(Object.keys(data).length === 0 && data.constructor === Object)) {
        const navigationExtras: NavigationExtras = {
          state : {
            users: JSON.stringify(this.users),
            //activeProjet: JSON.stringify(this.Activite_Projet),
            isFirstConnect: true
          }
        };
        this.route.navigate(['homes'], navigationExtras);
        await Storage.set({ key: FIRST_CONNECT_KEY, value:  '1'});
      }
    });
    await modal.present();
  }

  async openToast(msg: any) {  
    const toast = await this.toastCtrl.create({  
      message: msg,   
      duration: 4000  
    });  
    toast.present();  
  }  

}
