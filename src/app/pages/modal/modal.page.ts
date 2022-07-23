import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { Benef_activ_pms, Local_Parcelle, Loc_activ_projet, Loc_AnneeAgricole, Loc_association, Loc_Commune, Loc_culture_Pms, Loc_Espece, Loc_saison, Loc_variette } from 'src/app/interfaces/interfaces-local';
import { ApiService } from 'src/app/services/api.service';
import { ImportDataService } from 'src/app/services/import-data.service';
import { Projet } from 'src/app/utils/interface-bd';
import { LoadDataService } from '../../services/local/load-data.service';

import * as _moment from 'moment';
import { Moment } from 'moment';
import { SC } from 'src/app/utils/global-variables';

const moment = _moment;
//import 'moment/locale/ja';
//import 'moment/locale/fr';

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
  isSuiviRp: boolean = false;

  data_region: any[] = [];
  data_district: any[] = [];
  data_commune: Loc_Commune[] = [];
  //suivi Rp
  data_saison: Loc_saison[] = [];
  annee_du: any[] = ['2021', '2022'];
  data_association: Loc_association[] = [];
  data_pms: Benef_activ_pms[] =  [];
  data_pms_filtre: Benef_activ_pms[] =  [];
  data_parcelle: Local_Parcelle[] = [];
  data_parcelle_Filtre: Local_Parcelle[] = [];
  data_espece: Loc_Espece[] = [];
  data_variette: Loc_variette[] = [];
  data_variette_filter: Loc_variette[] = [];
  data_variette_filter_ea: Loc_variette[] = [];
  data_sc: any[] = SC;
  //data_ea: any[] = ['Niébé'];

  data_users: any[] = [];
  checkedProject: any[] = [];

  selected_region: any;
  selected_district: any;
  selected_commune: any;
  //suiviRp
  selected_saison: Loc_saison;
  selected_annee: Loc_AnneeAgricole;
  selected_association: Loc_association;//selected_association: any;
  selected_pms: Benef_activ_pms;// selected_pms: Benef_activ_pms;
  selected_parcelle: any;
  selected_espece: Loc_Espece;
  selected_espece_ea: Loc_Espece;
  selected_variette: Loc_variette;
  //selected_variette_ea: Loc_variette;
  selected_variette_ea: any;
  selected_sc: any;
  selected_ea: any;
  isCulteAssocie: boolean = false;
  isSelectedVarEa: boolean = false;
  isSelectedOtherCulte: boolean = false;
  autreCultureEa: string;
  dateSemis: Moment;
  ddp: Moment;
  sfce: number;
  qsa: number;
  dd_modifie: Moment;

  task: Task = {
    nom: 'selectionner tout',
    completed: false,
    color: 'primary',
    subtasks: [],
  };

  allComplete: boolean = false;
  Activite_Projet: any[];
  selectedActivite: Loc_activ_projet;
  isBloc: boolean = false;
  data_suivi_edit: Loc_culture_Pms;

  data_annee_agricole: Loc_AnneeAgricole[] = [];
  
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
      
    } else if (this.navParams.get('isHome') || this.navParams.get('isModificationZone')) {
      if (this.navParams.get('isHome')) {
        this.isHome = this.navParams.get('isHome');
        this.selectedActivite = this.navParams.get('selectedActivite');
      } else {
        this.isHome = this.navParams.get('isModificationZone');
        this.selectedActivite = this.navParams.get('activite');
      }
      console.log("selected activiter ===> ", this.selectedActivite);

      if (this.selectedActivite.intitule.toUpperCase() === 'BLOC') {
        this.isBloc = true;
      }

      this.loadData.loadRegion().subscribe((res) => {
        console.log("*** MODAL CONTROLLER REGION ****");
        console.log(res);
        this.data_region = res;
        console.log(this.data_region);
      });
    } else if (this.navParams.get('isSuiviRp')) {
      let espece: Loc_Espece[] = [];
      this.isSuiviRp = this.navParams.get('isSuiviRp');
      this.data_association = this.navParams.get('association');
      this.data_pms = this.navParams.get('pms');
      this.data_saison = this.navParams.get('saison');
      this.data_parcelle = this.navParams.get('parcelle');
      this.data_annee_agricole = this.navParams.get('annee_agricole');

      espece = this.navParams.get('espece');
      this.data_espece = espece.filter(item => {return item.id_categ === 1}); // semences en graine
      this.data_variette = this.navParams.get('variette');
      this.data_suivi_edit = this.navParams.get('data_edit') != undefined? this.navParams.get('data_edit'): undefined;

      if (this.data_suivi_edit != undefined) {
        console.log("is Mode Edition ::: ", this.navParams.get('data_edit'));
        console.log(this.data_suivi_edit);
        let ddp_: Moment = moment(this.data_suivi_edit.ddp, 'YYYY-MM-DD');
        let dds_: Moment = moment(this.data_suivi_edit.dds, 'YYYY-MM-DD');
        this.data_association.filter(item => {
          if (item.code_ass === this.data_suivi_edit.code_ass) {
            console.log(item);
            this.selected_association = item;
          }
        });
        this.onSelectAssoc();
        this.data_pms_filtre.filter(item => {
          if (item.code_benef_pms === this.data_suivi_edit.code_benef_pms) {
            console.log("item data_pms selected ", item);
            this.selected_pms = item;
          }
        });
        //this.selected_pms.code_benef_pms = this.data_suivi_edit.code_benef_pms;
        this.onSelectPms();
        this.data_parcelle_Filtre.filter(item => {
          if (item.code_parce === this.data_suivi_edit.id_parce) {
            console.log("item data_parcelle ::: ", item);
            this.selected_parcelle = item;
          }
        });
        // Spéculation
        this.data_espece.filter(item => {
          if (item.code_espece === this.data_suivi_edit.code_espece) {
            this.selected_espece = item;
          }
        });
        this.onSelectEspece();
        this.data_variette_filter.filter(elem => {
          if (elem.code_var === this.data_suivi_edit.id_var) {
            this.selected_variette = elem;
          }
        });
        this.qsa = this.data_suivi_edit.qsa;
        this.sfce = this.data_suivi_edit.sfce;
        this.dateSemis = dds_;
        this.ddp = ddp_;
        this.data_sc.filter(item => {
          if (item.value === this.data_suivi_edit.sc) {
            this.selected_sc = item;
          }
        });
        this.onSeletSc();
        if (this.data_suivi_edit.ea_id_variette !== null) {
          this.data_espece.filter(item => {
            if (item.code_espece === this.data_suivi_edit.ea_id_espece) {
              this.selected_espece_ea = item;
            }
          });
          this.onSelectEspeceAutre('espece');
          this.data_variette_filter_ea.filter(item => {
            if (item.code_var === this.data_suivi_edit.ea_id_variette) {
              this.selected_variette_ea = item;
            }
          });
        } else if (this.data_suivi_edit.ea_autres !== null) {
          this.onSelectEspeceAutre('autre');
          this.autreCultureEa = this.data_suivi_edit.ea_autres;
        }
        this.data_saison.filter(item => {
          if (item.code_saison === this.data_suivi_edit.id_saison) {
            this.selected_saison = item;
          }
        });
        this.data_annee_agricole.filter(item_annee => {
          if (item_annee.code === this.data_suivi_edit.id_annee) {
            this.selected_annee = item_annee;
          }
        });
      }
    }
  }

  // compare with mat-select object
  compareObjectsAssoc(ec1: Loc_association, ec2: Loc_association) {
    console.log(ec1);
    console.log(ec2);
    return ec1 && ec2? ec1.code_ass === ec2.code_ass : ec1 === ec2;
  }
  compareObjectsPms(pms1: Benef_activ_pms, pms2: Benef_activ_pms) {
    console.log(pms1);
    console.log(pms2);
    return pms1 && pms2? pms1.code_benef_pms === pms2.code_benef_pms : pms1 === pms2;
  }
  /**compareObjectsParce(prc1: Benef_activ_pms, prc2: Benef_activ_pms) {
    console.log(prc1);
    console.log(prc2);
    return prc1 && prc2? prc1.code_parce === prc2.code_parce : prc1 === prc2;
  }*/
  compareObjectsEspece(esp1: Loc_Espece, esp2: Loc_Espece) {
    return esp1 && esp2? esp1.code_espece === esp2.code_espece: esp1 === esp2;
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
  revenirModal() {
    this.modalCtrl.dismiss();
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
        }, 11000);
      }
    });
  }

  // Suivi Rp
  addCulture() {
    console.log(this.selected_variette_ea);
    const dataCulture = {
      code_saison: this.selected_saison.code_saison,
      saison: this.selected_saison.intitule,
      saison_descr: this.selected_saison.description,
      annee: this.selected_annee,
      order_assoc: this.selected_association.numero,
      code_ass: this.selected_association.code_ass,
      association: this.selected_association.nom_ass,
      ancronyme: this.selected_association.ancronyme,
      code_pms: this.selected_pms.code_benef_pms,
      code_achat: this.selected_pms.code_achat,
      pms: this.selected_pms.nom_benef,
      parcelle: this.selected_parcelle.code_parce,
      espece: this.selected_espece.nom_espece,
      code_variette: this.selected_variette.code_var,
      variette: this.selected_variette.nom_var,
      sc: this.selected_sc.value,
      ea_id_variette: this.selected_variette_ea != undefined && this.selected_variette_ea.code_var != null ? this.selected_variette_ea.code_var: null,
      ea: this.culturerEa(),
      dateSemis: this.dateSemis,
      ddp:this.ddp,
      sfce: this.sfce,
      qsa: this.qsa
    }
    const dismissed = {
      new_cult: dataCulture,
      dismissed: true
    }
    this.modalCtrl.dismiss(dismissed);
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
    this.data_commune = [];
    console.log("Selected District!!!");
    console.log(this.selected_district.code_dist);
    let id_dist = {
      code_dist: this.selected_district.code_dist
    };
    this.loadData.loadCommune(id_dist).then(res => {
      console.log("*** MODAL CONTROLLER COMMUNE ****");
      console.log(res);
      res.values.forEach(elem_com => {
        this.data_commune.push(elem_com);
      });
    },
    error => {
      console.log("Modal error Request response ==> " + error);
    });
  }

  onCommune() {
    console.log("Selected Commune!!!");
    console.log(this.selected_commune);
  }

  // suivi PMS
  onSelectAssoc() {
    console.log(this.selected_association);
    console.log(this.data_pms);
    this.data_pms_filtre = [];
    //this.data_pms_filtre = this.data_pms.filter(elem =>{ return elem.id_association === this.selected_association.code_ass});
    this.data_pms_filtre = this.data_pms.filter(item => {return item.id_saison === this.selected_saison.code_saison && item.id_annee === this.selected_annee.code && item.id_association === this.selected_association.code_ass});
    console.log(this.data_pms_filtre);
  }

  onSelectPms() {
    console.log(this.selected_parcelle);
    console.log(this.data_parcelle);
    //this.data_parcelle_Filtre = this.data_parcelle.filter(elem => {return elem.code_benef_pms  === this.selected_pms.code_benef_pms});
    this.data_parcelle_Filtre = this.data_parcelle.filter(item => {return item.id_saison === this.selected_saison.code_saison && item.id_annee === this.selected_annee.code && item.code_benef_pms === this.selected_pms.code_benef_pms});
    console.log(this.data_parcelle_Filtre);
  }

  onSelectEspece() {
    console.log(this.selected_espece);
    console.log(this.data_variette);
    this.data_variette_filter = this.data_variette.filter(elem => {return elem.id_espece === this.selected_espece.code_espece});
  }

  onSeletSc() {
    if (this.selected_sc.value === "C.associé") {
      if (this.selected_variette_ea != undefined && this.selected_variette_ea.code_var != null) {
        this.selected_variette_ea = Object.keys(this.selected_variette_ea).reduce((accumulator, key) => {
          return {...accumulator, [key]: null};
        }, {});
      }
      this.autreCultureEa = null;
      this.isSelectedOtherCulte = false;
      this.isCulteAssocie = true;
    } else {
      if (this.selected_variette_ea != undefined && this.selected_variette_ea.code_var != null) {
        this.selected_variette_ea = Object.keys(this.selected_variette_ea).reduce((accumulator, key) => {
          return {...accumulator, [key]: null};
        }, {});
      }
      this.autreCultureEa = null;
      this.isSelectedOtherCulte = false;
      this.isCulteAssocie = false;
    }
  }
  onSelectEspeceAutre(data: any) {
    if (data === 'autre') {
      this.isSelectedOtherCulte = true;
      if (this.selected_variette_ea != undefined) {
        this.selected_variette_ea = Object.keys(this.selected_variette_ea).reduce((accumulator, key) => {
          return {...accumulator, [key]: null};
        }, {}); // set null value selected_variette_ea
      }
    } else if (data === 'espece') {
      this.autreCultureEa = null;
      this.isSelectedOtherCulte = false;
      this.data_variette_filter_ea = this.data_variette.filter(elem => {return elem.id_espece === this.selected_espece_ea.code_espece});
    }
  }
  // on select annee agricole 
  onSelectAnneeAgricole() {
    //this.selected_annee
    console.log("Select Annnee", this.selected_annee);
    this.data_pms_filtre = [];
    this.data_parcelle_Filtre = [];
  }
  //onSelectSaison()
  onSelectSaison() {
    //this.selected_saison
    this.data_pms_filtre = [];
    this.data_parcelle_Filtre = [];
  }

  culturerEa() {
    if (this.selected_variette_ea != undefined && this.selected_variette_ea.code_var != null) {
      return this.selected_variette_ea.nom_var;
    } 
    if (this.autreCultureEa != null) {
      return this.autreCultureEa;
    } 
    return null;
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
