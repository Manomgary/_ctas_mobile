import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { UpdateMepPR, UpdateSuiviMepPR } from 'src/app/interfaces/interface-insertDb';
import { LocalFile, Loc_activ_projet, Loc_categEspece, Loc_cep_PR, Loc_Espece, Loc_MepPR, Loc_PR, Loc_projet, Loc_saison, Loc_Suivi_MepPR, Loc_variette } from 'src/app/interfaces/interfaces-local';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { ACTIVE, EC_CULTURAL, MV, PA, SG, STC, SYNC, UPDATE } from 'src/app/utils/global-variables';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalPrPage } from '../../modals/modal-pr/modal-pr.page';
import * as _moment from 'moment';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaptureImageService } from 'src/app/services/capture-image.service';
const moment = _moment;

interface Update_Mep {
  annee: string,
  saison: Loc_saison,
  beneficiaire: Loc_PR,
  parcelle: Loc_cep_PR,
  ddp: string,
  qso: number,
  dt_distribution: string,
  dds: string,
  sfce: number,
  nbre_ligne: number,
  long_ligne: number,
  sc: any,
  categorie_ea: Loc_categEspece,
  espece: Loc_Espece,
  espece_ea: Loc_Espece,
  variette: Loc_variette,
  variette_ea: Loc_variette,
  autreCultureEa: string
}
interface Update_Suivi {
  ddp: string,
  stc: any,
  ec: any,
  ql: number,
  qr: number,
  hauteur: number,
  long_ligne: number,
  nbre_ligne: number,
  nbre_pied: number,
  estimation: number,
  img_culture: string
}

@Component({
  selector: 'app-suivi-pr',
  templateUrl: './suivi-pr.page.html',
  styleUrls: ['./suivi-pr.page.scss'],
  animations: [ //utiliser pour @detailExpand (table expendable)
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class SuiviPrPage implements OnInit {
  private projet: Loc_projet;
  private user: Utilisateurs[];
  private activite: Loc_activ_projet;

  updated_Mep: Update_Mep = <Update_Mep>{};
  updated_Suivi: Update_Suivi = <Update_Suivi>{};

  data_saison: Loc_saison[]  = [];
  data_espece: Loc_Espece[] = [];
  data_var: Loc_variette[] = [];
  data_categ: Loc_categEspece[] = [];
  data_pr: Loc_PR[] = [];
  data_parce: Loc_cep_PR[] = [];

  data_mep_pr: Loc_MepPR[] = [];
  mep_sg: Loc_MepPR[] = [];
  mep_pa: Loc_MepPR[] = [];
  mep_mv: Loc_MepPR[] = [];

  displayedColumnsMepSg: string[] = ['annee', 'saison', 'code_mep', 'code_parce', 'sfce_reel', 'code_benef', 'nom', 'ddp', 'variette', 'qso', 'dds', 'sc', 'sfce_embl', 'nb_ligne', 'long_ligne', 'ea', 'action'];
  displayedColumnsMepPa: string[] = ['annee', 'code_mep', 'code_parce', 'sfce_reel', 'code_benef', 'nom', 'ddp', 'espece', 'qso', 'dt_dist', 'dds', 'nbre_ligne', 'long_ligne', 'action'];
  displayedColumnsMepMv: string[] = ['annee', 'saison', 'code_mep', 'code_parce', 'sfce_reel', 'code_benef', 'nom', 'ddp', 'espece', 'qso', 'dds', 'sfce_embl', 'nbre_ligne', 'long_ligne', 'sc', 'ea', 'action'];
  // displayed newMepSg
  displayedColumnsNewMepSg: string[] = ['new_annee', 'new_saison', 'new_code_mep', 'new_code_parce', 'new_sfce_reel', 'new_code_benef', 'new_nom', 'new_ddp', 'new_variette', 'new_qso', 'new_dds', 'new_sc', 'new_sfce_embl', 'new_nb_ligne', 'new_long_ligne', 'new_ea', 'new_action'];
  displayedColumnsNewMepPa: string[] = ['new_annee', 'new_code_mep', 'new_code_parce', 'new_sfce_reel', 'new_code_benef', 'new_nom', 'new_ddp', 'new_espece', 'new_qso', 'new_dt_dist', 'new_dds', 'new_nbre_ligne', 'new_long_ligne', 'new_action'];
  displayedColumnsNewMepMv: string[] = ['new_annee', 'new_saison', 'new_code_mep', 'new_code_parce', 'new_sfce_reel', 'new_code_benef', 'new_nom', 'new_ddp', 'new_espece', 'new_qso', 'new_dds', 'new_sfce_embl', 'new_nbre_ligne', 'new_long_ligne', 'new_sc', 'new_ea', 'new_action'];
  // displayed column suivi
  displayedColumnsSvSg: string[] = ['ddp', 'stc', 'etat_cultural', 'long_ligne', 'nbre_ligne', 'img', 'ex'];
  displayedColumnsSvPa: string[] = ['ddp', 'ql', 'qr', 'etat_pa', 'nb_ligne', 'hauteur', 'img_cult'];
  displayedColumnsSvMv: string[] = ['code_sv', 'ddp', 'nbre_pied', 'Long_ligne', 'nbre_ligne', 'ex'];
  // new sv
  displayedColumnsNewSvSg: string[] = ['new_ddp', 'new_stc', 'new_etat_cultural', 'new_long_ligne', 'new_nbre_ligne', 'new_img', 'new_ex', 'new_action'];
  displayedColumnsNewSvPa: string[] = ['new_ddp', 'new_ql', 'new_qr', 'new_etat_pa', 'new_nb_ligne', 'new_hauteur', 'new_img_cult', 'new_action'];
  displayedColumnsNewSvMv: string[] = ['new_code_sv', 'new_ddp', 'new_nbre_pied', 'new_Long_ligne', 'new_nbre_ligne', 'new_ex','new_action'];

  // data Source MEP
  dataSourceMepSg = new MatTableDataSource<Loc_MepPR>();
  dataSourceMepPa = new MatTableDataSource<Loc_MepPR>();
  dataSourceMepMv = new MatTableDataSource<Loc_MepPR>();

  isTableSgExpanded = false;
  isTablePaExpanded = false;
  isTableMvExpanded = false;

  isUpdated: boolean = false;
  isAddSg: boolean = false;
  isAddPa: boolean = false;
  isAddMv: boolean = false;
  //Edit
  isEditRowSg: boolean = false;
  isEditRowPa: boolean = false;
  isEditRowMv: boolean = false;
  // 
  isAddSvSg: boolean = false;
  isAddSvPa: boolean = false;
  isAddSvMv: boolean = false;
    // 
  isEditSvSg: boolean = false;
  isEditSvPa: boolean = false;
  isEditSvMv: boolean = false;
  // index
  indexRowMepSg: number;
  indexRowMepPa: number;
  indexRowMepMv: number;
  // ind Row suivi
  indexRowMepSvSg: number;
  indexRowMepSvPa: number;
  indexRowMepSvMv: number;

  data_stc: any[] = STC;
  data_ec: any[] = EC_CULTURAL;

  constructor(
    private router: Router,
     private loadData: LoadDataService,
     private modalCtrl: ModalController,
     private crudDb: CrudDbService,
     private formBuilder: FormBuilder,
     private captureImg: CaptureImageService,
     private loadingCtrl: LoadingController
    ) { 
      const routeState = this.router.getCurrentNavigation().extras.state;
      console.log("Route state::::", routeState);
        if (routeState) {
          let projet: Loc_projet;
    
          projet = JSON.parse(routeState.projet);
          this.user = JSON.parse(routeState.user);
          this.activite = routeState.activite;
          this.projet = projet;
          console.log(":::Projet:::", this.projet);
          console.log(":::USers::::", this.user);
          console.log(":::Activiter::::", this.activite);
          this.loadMep();
          this.loadDataInitial();
          this.loadPRBloc();
        }
    }

  ngOnInit() {}
  /********************
   * Action btn
   *********************/
   async onUpdate() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    setTimeout(() => {
      this.isUpdated = true;
      this.displayedColumnsSvSg.push('action');
      this.displayedColumnsSvPa.push('action');
      this.displayedColumnsSvMv.push('action');
      this.loadingCtrl.dismiss();
    }, 500);
   }
   async onFinished() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    setTimeout(async () => {
      this.isUpdated = true;
      this.isUpdated = false;

      if (this.isAddSg) {
        this.isAddSg = false;
        this.initUpdatedMep();
      }
      if (this.isAddPa) {
        this.isAddPa = false;
        this.initUpdatedMep();
      }
      if (this.isAddMv) {
        this.isAddMv = false;
        this.initUpdatedMep();
      }

      // 
      if (this.isEditRowSg) {
        this.isEditRowSg = false;
        this.indexRowMepSg = null;
        this.initUpdatedMep();
      }
      if (this.isEditRowPa) {
        this.isEditRowPa = false;
        this.indexRowMepPa = null;
        this.initUpdatedMep();
      }
      if (this.isEditRowMv) {
        this.isEditRowMv = false;
        this.indexRowMepMv = null;
        this.initUpdatedMep();
      }
      /////
      if ( this.isAddSvSg) {
        this.isAddSvSg = false;
        this.updated_Suivi = <Update_Suivi>{};
        this.indexRowMepSg = null;
      }
      if (this.isAddSvPa) {
        this.isAddSvPa = false;
        this.updated_Suivi = <Update_Suivi>{};
        this.indexRowMepPa = null;
      }
      if (this.isAddSvMv) {
        this.isAddSvMv = false;
        this.updated_Suivi = <Update_Suivi>{};
        this.indexRowMepMv = null;
      }
      //
      if (this.isEditSvSg) {
        this.isEditSvSg = false;
        this.indexRowMepSvSg = null;
        this.indexRowMepSg = null;
        this.updated_Suivi = <Update_Suivi>{};
      }
      if (this.isEditSvPa) {
        this.isEditSvPa = false;
        this.indexRowMepSvPa = null;
        this.indexRowMepPa = null;
        this.updated_Suivi = <Update_Suivi>{};
      }
      if (this.isEditSvMv) {
        this.isEditSvMv = false;
        this.indexRowMepSvMv = null;
        this.indexRowMepMv = null;
        this.updated_Suivi = <Update_Suivi>{};
      }
      
      // 
      this.displayedColumnsSvSg.pop();
      this.displayedColumnsSvPa.pop();
      this.displayedColumnsSvMv.pop();
      this.loadingCtrl.dismiss();
    }, 400);
   }
   onExport() {

   }
   onExportCateg(parent) {
    switch(parent) {
      case 'mep-sg':
        console.log(":::::Export SG::::::");
        break;
      case 'mep-pa':
        console.log(":::::Export PA::::::");
        break;
      case 'mep-mv':
        console.log(":::::Export MV::::::");
        break;
      default:
        console.log("default")
        break;
    }
   }
   // On Add new Mep
   onAdd(parent) {
    let data = {
      saison: this.data_saison,
      pr: this.data_pr,
      parcelle: this.data_parce,
      categorie: this.data_categ,
      espece: this.data_espece,
      variette: this.data_var
    }
    switch(parent) {
      case 'mep-sg':
        console.log(":::::ADD SG::::::");
        let data_sg = {
          src: 'mep-sg',
          action: 'add',
          data_initial: data
        }
        this.onPresentModal(data_sg);
        //this.isAddSg = true;
        break;
      case 'mep-pa':
        console.log(":::::ADD PA::::::");
        let data_pa = {
          src: 'mep-pa',
          action: 'add',
          data_initial: data
        }
        this.onPresentModal(data_pa);
        //this.isAddPa = true;
        break;
      case 'mep-mv':
        console.log(":::::ADD MV::::::");
        let data_mv = {
          src: 'mep-mv',
          action: 'add',
          data_initial: data
        }
        this.onPresentModal(data_mv);
      //this.isAddMv = true;
        break;
      default:
        console.log("default");
        break;
    }
   }
  onAddShowSuivi(data: any) {
    //let data_ = {data: row, index_: i}
    console.log(data);
    switch(data.src) {
      case 'mep-sg':
        this.dataSourceMepSg.data.forEach((row, ind) => {
          if (ind === data.index_) {
            row.isExpanded = true;
          }
        });
        break;
      case 'mep-pa':
        this.dataSourceMepPa.data.forEach((row, ind) => {
          if (ind === data.index_) {
            row.isExpanded = true;
          }
        });
        break;
      case 'mep-mv':
        this.dataSourceMepMv.data.forEach((row, ind) => {
          if (ind === data.index_) {
            row.isExpanded = true;
          }
        });
        break;
      default:
        console.log("default");
        break;
    }
  }
   // on Edit
   onEditRow(parent: any) {
    console.log(":::::Edit SG::::::", parent);
    let data = {
      saison: this.data_saison,
      pr: this.data_pr,
      parcelle: this.data_parce,
      categorie: this.data_categ,
      espece: this.data_espece,
      variette: this.data_var
    }
    parent.data_initial = data;
    switch(parent.src) {
      case 'mep-sg':
        this.indexRowMepSg = parent.index;
        this.onPresentModal(parent);
        break;
      case 'mep-pa':
        this.indexRowMepPa = parent.index;
        this.onPresentModal(parent);
        break;
      case 'mep-mv':
        this.indexRowMepMv = parent.index;
        this.onPresentModal(parent);
        break;
      default:
        console.log("default");
        break;
    }
   }
   
   // on Edit Row suivi
   onEditRowSuivi(data: any) {
    // {src: 'mep-sg', row: element, index: ind}
    console.log("::::Data EditRow suivi::::", data);
    switch(data.src) {
      case 'mep-sg':
        this.indexRowMepSvSg = data.index;
        this.isEditSvSg = true;
        break;
      case 'mep-pa':
        this.indexRowMepSvPa = data.index;
        this.isEditSvPa = true;
        break;
      case 'mep-mv':
        this.indexRowMepSvMv = data.index;
        this.isEditSvMv = true;
        break;
      default:
        console.log("default");
        break;
    }
   }
  onCancelMep(data: any) {
    switch(data) {
      case 'mep-sg':
        this.isAddSg = false;
        this.initUpdatedMep();
        break;
      case 'mep-pa':
        this.isAddPa = false;
        this.initUpdatedMep();
        break;
      case 'mep-mv':
        this.isAddMv = false;
        this.initUpdatedMep();
        break;
      default:
        console.log("default");
        break;
    }
  }
  onSaveMep(data: any) {
    let insert_Mep: UpdateMepPR = {
      code_culture: null,
      id_parce: this.updated_Mep.parcelle.code_parce,
      id_espece: null,
      id_var: null,
      id_saison: this.updated_Mep.saison != null?this.updated_Mep.saison.code_saison:null,
      annee_du: this.updated_Mep.annee,
      ddp: this.updated_Mep.ddp,
      qso: this.updated_Mep.qso,
      dt_distribution: this.updated_Mep.dt_distribution,
      dds: this.updated_Mep.dds,
      sfce: this.updated_Mep.sfce,
      nbre_ligne: this.updated_Mep.nbre_ligne,
      long_ligne: this.updated_Mep.long_ligne,
      sc: this.updated_Mep.sc != null?this.updated_Mep.sc.value:null,
      ea_autres: this.updated_Mep.autreCultureEa,
      ea_id_variette: this.updated_Mep.variette_ea != null?this.updated_Mep.variette_ea.code_var:null,
      dt_creation: moment().format("YYYY-MM-DD"),
      dt_modification: moment().format("YYYY-MM-DD"),
      status: ACTIVE,
      etat: SYNC,
      id_equipe: this.user[this.user.length - 1].id_equipe,
      type: null
    }
    switch(data) {
      case 'mep-sg':
        insert_Mep.code_culture = this.generateCodeMep() + SG.toUpperCase() + '-' + moment().format('YYYYMMDD-HHmmss');
        insert_Mep.id_var = this.updated_Mep.variette.code_var;
        insert_Mep.type = SG;
        console.log(":::Data Mep SG to Add::::", insert_Mep);
        this.crudDb.AddMepPR(insert_Mep).then(res => {
          console.log("::::Mep SG PR Added::::");
          this.initUpdatedMep();
          this.loadMep();
        });
        this.isAddSg = false;
        break;
      case 'mep-pa':
        insert_Mep.code_culture = this.generateCodeMep() + PA.toUpperCase() + '-' + moment().format('YYYYMMDD-HHmmss');
        insert_Mep.id_espece = this.updated_Mep.espece.code_espece;
        insert_Mep.type = PA;
        console.log(":::Data Mep PA to Add::::", insert_Mep);
        this.crudDb.AddMepPR(insert_Mep).then(res => {
          console.log("::::Mep PA PR Added::::");
          this.initUpdatedMep();
          this.loadMep();
        });
        this.isAddPa = false;
        break;
      case 'mep-mv':
        insert_Mep.code_culture = this.generateCodeMep() + MV.toUpperCase() + '-' + moment().format('YYYYMMDD-HHmmss');
        insert_Mep.id_espece = this.updated_Mep.espece.code_espece;
        insert_Mep.type = MV;
        console.log(":::Data Mep MV to Add::::", insert_Mep);
        this.crudDb.AddMepPR(insert_Mep).then(res => {
          console.log("::::Mep PA PR Added::::");
          this.initUpdatedMep();
          this.loadMep();
        });
        this.isAddMv = false;
        break;
      default:
        console.log("default");
        break;
    }
  }
  onCancelEdit(data: any) {
    switch(data) {
      case 'mep-sg':
        this.indexRowMepSg = null;
        this.isEditRowSg = false;
        break;
      case 'mep-pa':
        this.indexRowMepPa = null;
        this.isEditRowPa = false;
        break;
      case 'mep-mv':
        this.indexRowMepMv = null;
        this.isEditRowMv = false;
        break;
      default:
        console.log("default");
        break;
    }
  }
  onSaveEdit(data){
    console.log("::::DATA MV EDIT:::", data);
    let elem_mep: Loc_MepPR = data.row;
    let update_Mep: UpdateMepPR = {
      code_culture: elem_mep.code_culture,
      id_parce: this.updated_Mep.parcelle.code_parce,
      id_espece: null,
      id_var: null,
      id_saison: this.updated_Mep.saison != null?this.updated_Mep.saison.code_saison:null,
      annee_du: this.updated_Mep.annee,
      ddp: this.updated_Mep.ddp,
      qso: this.updated_Mep.qso,
      dt_distribution: this.updated_Mep.dt_distribution,
      dds: this.updated_Mep.dds,
      sfce: this.updated_Mep.sfce,
      nbre_ligne: this.updated_Mep.nbre_ligne,
      long_ligne: this.updated_Mep.long_ligne,
      sc: this.updated_Mep.sc != null?this.updated_Mep.sc.value:null,
      ea_autres: this.updated_Mep.autreCultureEa,
      ea_id_variette: this.updated_Mep.variette_ea != null?this.updated_Mep.variette_ea.code_var:null,
      dt_creation: elem_mep.dt_creation,
      dt_modification: moment().format("YYYY-MM-DD"),
      status: ACTIVE,
      etat: elem_mep.etat_mep.toUpperCase() === SYNC.toUpperCase()?SYNC:UPDATE,
      id_equipe: elem_mep.id_equipe,
      type: elem_mep.type
    }
    switch(data.src) {
      case 'mep-sg':
        update_Mep.id_var = this.updated_Mep.variette.code_var;
        let data_mep_update_sg: any = {
          isUpdateMepSuivi: true,
          data_mep: update_Mep
        }
        console.log("::::DATA TO SG UPDATE:::", data_mep_update_sg);
        this.crudDb.UpdatedMepPR(data_mep_update_sg).then(res => {
          console.log(":::Update SG::::", res);
          this.loadMep();
          this.indexRowMepSg = null;
          this.isEditRowSg = false;
        });
        break;
      case 'mep-pa':
        update_Mep.id_espece = this.updated_Mep.espece.code_espece;
        let data_mep_update_pa: any = {
          isUpdateMepSuivi: true,
          data_mep: update_Mep
        }
        console.log("::::DATA TO PA UPDATE:::", data_mep_update_pa);
        this.crudDb.UpdatedMepPR(data_mep_update_pa).then(res => {
          console.log(":::Update SG::::", res);
          this.loadMep();
          this.indexRowMepPa = null;
          this.isEditRowPa = false;
        });
        break;
      case 'mep-mv':
        update_Mep.id_espece = this.updated_Mep.espece.code_espece;
        let data_mep_update_mv: any = {
          isUpdateMepSuivi: true,
          data_mep: update_Mep
        }
        console.log("::::DATA TO MV UPDATE:::", data_mep_update_mv);
        this.crudDb.UpdatedMepPR(data_mep_update_mv).then(res => {
          console.log(":::Update SG::::", res);
          this.loadMep();
          this.indexRowMepMv = null;
          this.isEditRowMv = false;
        });
        break;
      default:
        console.log("default");
        break;
    }
  }
  // Save suivi
  onCancelAddSv(data: any) {
    switch(data) {
      case 'mep-sg':
        this.isAddSvSg = false;
        this.updated_Suivi = <Update_Suivi>{};
        this.indexRowMepSg = null;
        break;
      case 'mep-pa':
        this.isAddSvPa = false;
        this.updated_Suivi = <Update_Suivi>{};
        this.indexRowMepPa = null;
        break;
      case 'mep-mv':
        this.isAddSvMv = false;
        this.updated_Suivi = <Update_Suivi>{};
        this.indexRowMepMv = null;
        break;
      default:
        console.log("default");
        break;
    }
  }
  onSaveAddSv(data: any) {
    //{src: 'mep-sg', row_mep: element_mep}
    let elem_mep: Loc_MepPR = data.row_mep;
    console.log("::::SAVE DATA ELEMENT MEP:::::", data);
    let insert_suivi: UpdateSuiviMepPR = {
      code_sv: elem_mep.code_culture + '_' + moment().format('YYMMDD:HHmm'),
      id_culture: elem_mep.code_culture,
      ddp: this.updated_Suivi.ddp,
      stc: this.updated_Suivi.stc != null?this.updated_Suivi.stc.value:null,
      ql: this.updated_Suivi.ql,
      qr: this.updated_Suivi.qr,
      long_ligne: this.updated_Suivi.long_ligne,
      nbre_ligne: this.updated_Suivi.nbre_ligne,
      nbre_pied: this.updated_Suivi.nbre_pied,
      hauteur: this.updated_Suivi.hauteur,
      ec: this.updated_Suivi.ec != null?this.updated_Suivi.ec.value:null,
      img_cult: this.updated_Suivi.img_culture,
      dt_capture: null,
      ex: this.updated_Suivi.estimation,
      dt_creation: moment().format('YYYY-MM-DD'),
      dt_modification: moment().format('YYYY-MM-DD'),
      etat: SYNC
    }
    switch(data.src) {
      case 'mep-sg':
        this.crudDb.AddSuiviMepPR(insert_suivi).then(res => {
          console.log("::::SUIVI SG ADDED::");
          this.isAddSvSg = false;
          this.updated_Suivi = <Update_Suivi>{};
          this.indexRowMepSg = null;
          this.loadMep();
          console.log(":::Updated_Suivi::::", this.updated_Suivi);
        });
        break;
      case 'mep-pa':
        this.crudDb.AddSuiviMepPR(insert_suivi).then(res => {
          console.log("::::SUIVI MV ADDED::");
          this.isAddSvPa = false;
          this.indexRowMepPa = null;
          this.updated_Suivi = <Update_Suivi>{};
          this.loadMep();
          console.log(":::Updated_Suivi::::", this.updated_Suivi);
        });
        break;
      case 'mep-mv':
        this.crudDb.AddSuiviMepPR(insert_suivi).then(res => {
          console.log("::::SUIVI MV ADDED::");
          this.isAddSvMv = false;
          this.indexRowMepMv = null;
          this.updated_Suivi = <Update_Suivi>{};
          this.loadMep();
          console.log(":::Updated_Suivi::::", this.updated_Suivi);
        });
        break;
      default:
        console.log("default");
        break;
    }
  }
  onCancelEditSuivi(data: any) {
    //
    switch(data) {
      case 'mep-sg':
        this.isEditSvSg = false;
        this.indexRowMepSvSg = null;
        this.indexRowMepSg = null;
        this.updated_Suivi = <Update_Suivi>{};
        break;
      case 'mep-pa':
        this.isEditSvPa = false;
        this.indexRowMepSvPa = null;
        this.indexRowMepPa = null;
        this.updated_Suivi = <Update_Suivi>{};
        break;
      case 'mep-mv':
        this.isEditSvMv = false;
        this.indexRowMepSvMv = null;
        this.indexRowMepMv = null;
        this.updated_Suivi = <Update_Suivi>{};
        break;
      default:
        console.log("default");
        break;
    }
  }
  onSaveEditSuivi(data: any) {
    //{src: 'mep-sg', row_suivi: row}
    let elem_suivi: Loc_Suivi_MepPR = data.row_suivi;
    let updated_suivi: UpdateSuiviMepPR = {
      code_sv: elem_suivi.code_sv,
      id_culture: elem_suivi.id_culture,
      ddp: this.updated_Suivi.ddp,
      stc: this.updated_Suivi.stc != null?this.updated_Suivi.stc.value:null,
      ql: this.updated_Suivi.ql,
      qr: this.updated_Suivi.qr,
      long_ligne: this.updated_Suivi.long_ligne,
      nbre_ligne: this.updated_Suivi.nbre_ligne,
      nbre_pied: this.updated_Suivi.nbre_pied,
      hauteur: this.updated_Suivi.hauteur,
      ec: this.updated_Suivi.ec != null?this.updated_Suivi.ec.value:null,
      img_cult: this.updated_Suivi.img_culture,
      dt_capture: null,
      ex: this.updated_Suivi.estimation,
      dt_creation: elem_suivi.dt_creation,
      dt_modification: moment().format('YYYY-MM-DD'),
      etat: elem_suivi.etat_suivi === SYNC?SYNC:UPDATE
    }
    let data_to_up = {
      isUpdateSuivi: true,
      data_suivi: updated_suivi
    }
    console.log(":::DATA TO UPDATE:::", data_to_up);
    switch(data.src) {
      case 'mep-sg':
        this.crudDb.UpdateSuiviMepPR(data_to_up).then(res => {
          console.log(":::DATA SG UPDATED:::");
          this.isEditSvSg = false;
          this.indexRowMepSvSg = null;
          this.indexRowMepSg = null;
          this.updated_Suivi = <Update_Suivi>{};
          this.loadMep();
        });
        break;
      case 'mep-pa':
        this.crudDb.UpdateSuiviMepPR(data_to_up).then(res => {
          console.log(":::DATA SG UPDATED:::");
          this.isEditSvPa = false;
          this.indexRowMepSvPa = null;
          this.indexRowMepPa = null;
          this.updated_Suivi = <Update_Suivi>{};
          this.loadMep();
        });
        break;
      case 'mep-mv':
        this.crudDb.UpdateSuiviMepPR(data_to_up).then(res => {
          console.log(":::DATA SG UPDATED:::");
          this.isEditSvMv = false;
          this.indexRowMepSvMv = null;
          this.indexRowMepMv = null;
          this.updated_Suivi = <Update_Suivi>{};
          this.loadMep();
        });
        break;
      default:
        console.log("default");
        break;
    }
  }

  // load Data
  loadMep() {
    let data = {
      code_projet: this.projet.code_proj,
      code_equipe: this.user[this.user.length - 1].id_equipe
    }
    let data_suivi_mep: Loc_Suivi_MepPR[] = [];
    this.data_mep_pr = [];
    this.mep_mv = [];
    this.mep_sg = [];
    this.mep_pa = [];

    this.loadData.loadSuiviMepPR(data).then(res_suivi => {
      console.log("::::Data suivi Mep::::", res_suivi);
      if (res_suivi.values.length > 0) {
        res_suivi.values.forEach(elem_suivi => {
          data_suivi_mep.push(elem_suivi);
        });
      }
    });
    this.loadData.loadMepPR(data).then(res_mep => {
      console.log(":::Data Mep::::", res_mep);
      if (res_mep.values.length > 0) {
        res_mep.values.forEach(elem_mep => {
          this.data_mep_pr.push(elem_mep);
        });
        // filter datasource MEP
        if (this.data_mep_pr.length > 0) {
          this.data_mep_pr.forEach(item_mep => {
            if (data_suivi_mep.length > 0) {
              item_mep.suivi_Mep = data_suivi_mep.filter(item_suivi => {return item_suivi.id_culture === item_mep.code_culture});
            } else item_mep.suivi_Mep = [];
          });
          this.mep_sg = this.data_mep_pr.filter(item_sg => {return item_sg.type.toLowerCase() === SG});
          this.mep_pa = this.data_mep_pr.filter(item_pa => {return item_pa.type.toLowerCase() === PA});
          this.mep_mv = this.data_mep_pr.filter(item_mv => {return item_mv.type.toLowerCase() === MV});
        }
        this.dataSourceMepSg.data = this.mep_sg;
        this.dataSourceMepPa.data = this.mep_pa;
        this.dataSourceMepMv.data = this.mep_mv;
      }
      console.log("::::data SG:::", this.mep_sg);
      console.log("::::data PA:::", this.mep_pa);
      console.log("::::data MV:::", this.mep_mv);
    });
  }

  // load Data initiale
  loadDataInitial() {
    this.loadData.loadSaison().then(res_saison => {
      console.log(res_saison);
      if (res_saison.values.length > 0) {
        res_saison.values.forEach(elem_s => {
          this.data_saison.push(elem_s);
        });
      }
    });
    // load Categorie Espece
    this.loadData.loadCategEspece().then(res_categorie => {
      console.log(res_categorie);
      if (res_categorie.values.length > 0) {
        res_categorie.values.forEach(elem => {
          this.data_categ.push(elem);
        });
      }
    });
    // load Espece
    this.loadData.loadEspece().then(res_Espec => {
      console.log(res_Espec);
      if (res_Espec.values.length > 0) {
        res_Espec.values.forEach(elem_esp => {
          this.data_espece.push(elem_esp);
        });
      }
    });
    // load variette
    this.loadData.loadVariette().then(res_var => {
      console.log(res_var);
      if (res_var.values.length > 0) {
        res_var.values.forEach(elem_var => {
          this.data_var.push(elem_var);
        });
      }
    });
  }
  // load Data initial
  loadPRBloc() {
    let data = {
      code_projet: this.projet.code_proj,
      id_tech: this.user[this.user.length - 1].id_equipe
    }

    this.loadData.loadPRParceBloc(data).then(res => {
      this.data_parce = res.values;
      console.log("Parcelle PR::::", this.data_parce);
    });
    this.loadData.loadPRBloc(data).then(res => {
      this.data_pr = res.values;
      console.log("PR::::", this.data_pr);
    });
  }
  // init PC
  initUpdatedMep() {
    this.updated_Mep = <Update_Mep>{}
  }
  //
  generateCodeMep() {
    let code_mep: string = '';
    let annee_ = this.updated_Mep.annee.charAt(2) + this.updated_Mep.annee.charAt(3);

    if (this.updated_Mep.saison != null) {
      //return code_mep = annee_ + this.updated_Mep.saison.intitule + '-' + this.user[this.user.length - 1].id_equipe +  this.projet.ancronyme + '-' + 'Mep';
      return code_mep = annee_ + this.updated_Mep.saison.intitule + '-' + this.user[this.user.length - 1].id_equipe + '-' + 'Mep';  
    } else {
      return code_mep =  annee_ + '-' + this.user[this.user.length - 1].id_equipe + 'Mep'; 
    }
  }

  // modal
  async onPresentModal(data: any) {
    let data_: any;
    if (data.action === 'add') {
      if (data.src === 'mep-sg') {
        data_ = {
          isSuiviPR: true,
          isAddMepSg: true,
          data_init: data.data_initial
        }
      } else if (data.src === 'mep-pa') {
        data_ = {
          isSuiviPR: true,
          isAddMepPa: true,
          data_init: data.data_initial
        }
      } else if (data.src === 'mep-mv') {
        data_ = {
          isSuiviPR: true,
          isAddMepMv: true,
          data_init: data.data_initial
        }
      }
    } else if (data.action === 'edit') {
      //let data_ = {src: 'add', data: element, index: i};
      if (data.src === 'mep-sg') {
        data_ = {
          isSuiviPR: true,
          isEditMepSg: true,
          element: data.row,
          data_init: data.data_initial
        }
      } else if (data.src === 'mep-pa') {
        data_ = {
          isSuiviPR: true,
          isEditMepPa: true,
          element: data.row,
          data_init: data.data_initial
        }
      } else if (data.src === 'mep-mv') {
        data_ = {
          isSuiviPR: true,
          isEditMepMv: true,
          element: data.row,
          data_init: data.data_initial
        }
      }
    }
    let modal = await this.modalCtrl.create({
      component: ModalPrPage,
      cssClass: 'modal-custum-suivi-pr',
      backdropDismiss: true,
      componentProps: data_
    });
    modal.onDidDismiss().then(data_modal => {
      console.log("Modal Dismissed!!", data_modal.data);
      if (data_modal.data != undefined) {
        console.log("::::DATA MODAL:::", data_modal.data);
        this.updated_Mep = data_modal.data;
        this.updated_Mep.ddp = data_modal.data.ddp.format("YYYY-MM-DD");
        this.updated_Mep.dds = data_modal.data.dds.format("YYYY-MM-DD");
        this.updated_Mep.dt_distribution = data_modal.data.dt_distribution != null?data_modal.data.dt_distribution.format("YYYY-MM-DD"):null;
        //this.updated_Mep.autreCultureEa = data_modal.data.autreCultureEa != null?data_modal.data.autreCultureEa:data_modal.data.espece_ea != null?data_modal.data.espece_ea.nom_espece:null
        
        if (data.action === 'add') {
          if (data.src === 'mep-sg') {
            this.isAddSg = true;
          } else if (data.src === 'mep-pa') {
            this.isAddPa = true;
          } else if (data.src === 'mep-mv') {
            this.isAddMv = true;
          }
        } else if (data.action === 'edit') {
          //let data_ = {src: 'add', data: element, index: i};
          if (data.src === 'mep-sg') {
            this.isEditRowSg = true;
          } else if (data.src === 'mep-pa') {
            this.isEditRowPa = true;
          } else if (data.src === 'mep-mv') {
            this.isEditRowMv = true;
          }
        }
      }
    });
    await modal.present();
  }
  // modal updated suivi
  async onPresentMadalSuivi(data: any) {
    let data_: any;
    if (data.action === 'add') {
      if (data.src === 'mep-sg') {
        data_ = {
          isSuiviSvPR: true,
          isAddSvSg: true,
          data_mep: data.row_mep
        }
      } else if (data.src === 'mep-pa') {
        data_ = {
          isSuiviSvPR: true,
          isAddSvPa: true,
          data_mep: data.row_mep
        }
      } else if (data.src === 'mep-mv') {
        data_ = {
          isSuiviSvPR: true,
          isAddSvMv: true,
          data_mep: data.row_mep
        }
      }
    } else if (data.action === 'edit') {
      //let data_ = {src: 'add', data: element, index: i};
      if (data.src === 'mep-sg') {
        data_ = {
          isSuiviSvPR: true,
          isEditSvSg: true,
          data_mep: data.row_mep,
          data_elem_suivi: data.row_suivi
        }
      } else if (data.src === 'mep-pa') {
        data_ = {
          isSuiviSvPR: true,
          isEditSvPa: true,
          data_mep: data.row_mep,
          data_elem_suivi: data.row_suivi
        }
      } else if (data.src === 'mep-mv') {
        data_ = {
          isSuiviSvPR: true,
          isEditSvMv: true,
          data_mep: data.row_mep,
          data_elem_suivi: data.row_suivi
        }
      }
    }
    let modal = await this.modalCtrl.create({
      component: ModalPrPage,
      cssClass: 'modal-custum-suivi-sv-pr',
      backdropDismiss: true,
      componentProps: data_
    });
    modal.onDidDismiss().then(modal_data => {
      console.log("::::Data modal Suivi::", modal_data.data);
      if (modal_data.data != undefined) {
        this.updated_Suivi = modal_data.data;
        this.updated_Suivi.ddp = modal_data.data.ddp.format("YYYY-MM-DD");
        if (data.action === 'add') {
          switch(data.src) {
            case 'mep-sg':
              this.isAddSvSg = true;
              this.indexRowMepSg = data.index_mep;
              break;
            case 'mep-pa':
              this.isAddSvPa = true;
              this.indexRowMepPa = data.index_mep;
              break;
            case 'mep-mv':
              this.isAddSvMv = true;
              this.indexRowMepMv = data.index_mep;
              break;
            default:
              console.log("default");
              break;
          }
        } else if (data.action === 'edit') {
          //let data_ = {src: 'add', data: element, index: i};
          switch(data.src) {
            case 'mep-sg':
              this.isEditSvSg = true;
              this.indexRowMepSg = data.index_mep;
              this.indexRowMepSvSg = data.index_mep_suivi;
              break;
            case 'mep-pa':
              this.isEditSvPa = true;
              this.indexRowMepPa = data.index_mep;
              this.indexRowMepSvPa = data.index_mep_suivi;
              break;
            case 'mep-mv':
              this.isEditSvMv = true;
              this.indexRowMepMv = data.index_mep;
              this.indexRowMepSvMv = data.index_mep_suivi;
              break;
            default:
              console.log("default");
              break;
          }
        }
      }
    });
    await modal.present();
  }

  // Toggel Rows
  toggleTableRows(src:any) {
    switch(src.src) {
      case 'mep-sg':
        this.isTableSgExpanded = !this.isTableSgExpanded;
        this.dataSourceMepSg.data.forEach((row: Loc_MepPR) => {
          if (row.suivi_Mep.length > 0) {
            row.isExpanded = this.isTableSgExpanded;
          } else {
            if (row.isExpanded) {
              row.isExpanded = false;
            }
          }
        });
        break;
      case 'mep-pa':
        this.isTablePaExpanded = !this.isTablePaExpanded;
        this.dataSourceMepPa.data.forEach((row: Loc_MepPR) => {
          if (row.suivi_Mep.length > 0) {
            row.isExpanded = this.isTablePaExpanded;
          } else {
            if (row.isExpanded) {
              row.isExpanded = false;
            }
          }
        });
        break;
      case 'mep-mv':
        this.isTableMvExpanded = !this.isTableMvExpanded;
        this.dataSourceMepMv.data.forEach((row: Loc_MepPR) => {
          if (row.suivi_Mep.length > 0) {
            row.isExpanded = this.isTableMvExpanded;
          } else {
            if (row.isExpanded) {
              row.isExpanded = false;
            }
          }
        });
        break
    }
  }
}
