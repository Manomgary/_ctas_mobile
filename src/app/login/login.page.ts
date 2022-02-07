import { Component, OnInit } from '@angular/core';

// Imports
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular'; 
import { Utilisateurs } from '../utils/interface-bd';
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

  constructor(
              public navCtrl: NavController, 
              private route: Router,
              private api: ApiService,
              private importData: ImportDataService,
              private loadData: LoadDataService,
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

    this.submitted = true;
    const firstConnect = await Storage.get({ key: FIRST_CONNECT_KEY });

    if (this.loginForm.invalid) {
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
            this.importData.loadData(this.users);
            this.importData.getStateImp().subscribe(isReady => {
              console.log("Login isReady *** " + isReady);
              if (isReady) {
                setTimeout(() => {
                  this.presentModal();
                  loading.dismiss();
                }, 5000);
              }
            });
          }
        }, error => {
          console.log(error);
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
