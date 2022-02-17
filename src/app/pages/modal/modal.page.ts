import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ImportDataService } from 'src/app/services/import-data.service';
import { Projet } from 'src/app/utils/interface-bd';
import { LoadDataService } from '../../services/local/load-data.service';

export interface Task {
  nom: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: any[];
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  // Data passed in by componentProps
  isHome: boolean = false;
  isLogin: boolean = false;

  data_region: any[] = [];
  data_district: any[] = [];
  data_commune: any[] = [];

  data_users: any[] = [];
  checkedProject: any[] = [];

  selected_region: any;
  selected_district: any;
  selected_commune: any;

  task: Task = {
    nom: 'selectionner tout',
    completed: false,
    color: 'primary',
    subtasks: [],
  };

  allComplete: boolean = false;
  Activite_Projet: any[];
  selectedActivite: string;
  isBloc: boolean = false;


  constructor(
              private modalCtrl: ModalController,
              private navParams: NavParams,
              private loadData: LoadDataService,
              private loadingCtrl: LoadingController,
              private api: ApiService,
              private importService: ImportDataService
              ) {
                this.loadInitiale();
              }

  ngOnInit() {}

  async loadInitiale() {
    console.log(this.navParams.get('isHome'));
    console.log(this.navParams.get('isLogin'));
    if(this.navParams.get('isLogin')) {
      let data: any;
      this.isLogin = this.navParams.get('isLogin');
      data = this.navParams.get('users');
      console.log(data);
      this.data_users = JSON.parse(data);
      console.log(this.data_users);
      this.data_users.forEach((element, i) => {
        console.log(element);  
        let id_pr = {
          id_projet: element.id_proj
        }
        if (i == (this.data_users.length - 1)) {
          this.loadProjet();
        }
      });
      
    } else if (this.navParams.get('isHome')) {

      this.isHome = this.navParams.get('isHome');
      this.selectedActivite = this.navParams.get('selectedActivite');
      console.log("selected activiter ===> ", this.selectedActivite);

      if (this.selectedActivite.toUpperCase() === 'BLOC') {
        this.isBloc = true;
      }

      this.loadData.loadRegion().subscribe((res) => {
        console.log("*** MODAL CONTROLLER REGION ****");
        console.log(res);
        this.data_region = res;
        console.log(this.data_region);
      });
    }
  }

  async loadProjet() {
    let data_projet: Projet[];
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.api.getProjet().subscribe((res: Projet[]) => {  
      data_projet = res;
      console.log(data_projet);
      data_projet.forEach((elem, i) => {
        console.log(elem);
        this.task.subtasks.push({
          code_projet: elem.code_proj,
          nom: elem.nom, 
          completed: false, 
          color: 'primary'
        });
        if (i == (data_projet.length - 1)) {
          console.log("==Fin du boucle projet==");
          loading.dismiss();
        }
      });
    });
  }

  // close modal
  closeModal() {
    const zone_dest = {
      region: this.selected_region,
      district: this.selected_district,
      commune: this.selected_commune,
      valide: true,
      dismissed: false
    }
    console.log(zone_dest);
    this.modalCtrl.dismiss(zone_dest);
    this.isHome = false;
    this.isBloc = false;
  }
  async revenirModal() {
    await this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async importData() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    console.log(this.task);
    this.task.subtasks.forEach((item, i) => {
      console.log(item);
      if(item.completed) {
        this.checkedProject.push({
          code_projet: item.code_projet
        });
      }
      if (i == (this.task.subtasks.length - 1)) {
        console.log(this.checkedProject);
        this.checkedProject.forEach((elem, i) => {
          console.log("************* Project loaded ********");
          console.log(elem);
          let id_pr = {
            id_projet: elem.code_projet
          }
          this.importService.loadProjet(id_pr);

        });
        setTimeout(() => {
          this.modalCtrl.dismiss();
          this.isLogin = false;
          loading.dismiss();
        }, 15000);
      }
    });
  }

  onRegion() {
    console.log("Selected Region!!!!");
    console.log(this.selected_region.code_reg);
    this.loadData.loadDistrict(this.selected_region.code_reg).subscribe(res => {
      console.log("*** MODAL CONTROLLER DISTRICT ****");
      console.log(res);
      this.data_district = res;
    }, error => {
      console.log("Modal error Request response ==> " + error);
    });
  }

  onDistrict() {
    console.log("Selected District!!!");
    console.log(this.selected_district.code_dist);
    let id_dist = this.selected_district.code_dist;
    this.loadData.loadCommune(id_dist).subscribe(res => {
      console.log("*** MODAL CONTROLLER COMMUNE ****");
      console.log(res);
      this.data_commune = res;
    },
    error => {
      console.log("Modal error Request response ==> " + error);
    });
  }

  onCommune() {
    console.log("Selected Commune!!!");
    console.log(this.selected_commune);
  }

  /**
   * ANGULAR CHECKBOX
   */
   updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
  }

}
