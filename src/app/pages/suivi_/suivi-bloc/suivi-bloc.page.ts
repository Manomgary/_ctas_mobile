import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
// Import
import { IonAccordionGroup, LoadingController, ModalController, Platform } from '@ionic/angular';
import * as _moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { AddMepBloc, UpdateSuiviBloc } from 'src/app/interfaces/interface-insertDb';
import { Local_benef_activ_bl, Local_bloc_parce, Local_bloc_zone, Loc_all_suivi_bloc, Loc_all_suivi_mep, Loc_Bloc, Loc_categEspece, Loc_Commune, Loc_Espece, Loc_mep_bloc, Loc_saison, Loc_suivi_mep, Loc_sv_bloc, Loc_variette } from 'src/app/interfaces/interfaces-local';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { ACTIVE, EC, EC_CULTURAL, IMAGE_DIR, MV, PA, SC, SG, STC, SYNC, UPDATE } from 'src/app/utils/global-variables';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalBlocPage } from '../../modals/modal-bloc/modal-bloc.page';

// import excelle
import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file/ngx';

const moment = _moment;

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-suivi-bloc',
  templateUrl: './suivi-bloc.page.html',
  styleUrls: ['./suivi-bloc.page.scss'],
})
export class SuiviBlocPage implements OnInit {
  private isRouterActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  suivi_sgForm: FormGroup;
  suivi_paForm: FormGroup;
  suivi_mvForm: FormGroup;
  // Aliment data source
  private src_MepSg: Loc_mep_bloc[] = [];
  private src_SvSg: Loc_sv_bloc[] = [];
  private src_MepPa: Loc_mep_bloc[] = [];
  private src_SvPa: Loc_sv_bloc[] = [];
  private src_MepMv: Loc_mep_bloc[] = [];
  private src_SvMv: Loc_sv_bloc[] = [];
  private data_Mep: Loc_mep_bloc[] = [];

  private data_all_suivi_mep: Loc_all_suivi_bloc[] = [];
  private src_AllSvSg: Loc_all_suivi_bloc[] = [];
  private src_AllSvMv: Loc_all_suivi_bloc[] = [];
  private src_AllSvPa: Loc_all_suivi_bloc[] = [];

  
  // Displayed column
  private displayedColumnsMepSg: string[] = ['annee', 'saison', 'bloc', 'parcelle', 'code_benef', 'nom_benef', 'ddp', 'variette', 'qso', 'dds', 'sfce_embl', 'sc', 'ea', 'nbre_ligne', 'long_ligne',];
  private displayedColumnsAddMepSg: string[] = ['new_annee', 'new_saison', 'new_bloc', 'new_parcelle', 'new_code_benef', 'new_nom_benef', 'new_ddp', 'new_variette', 'new_qso', 'new_dds', 'new_sfce_embl', 'new_sc', 'new_ea', 'new_nbre_ligne', 'new_long_ligne', 'new_action'];
  private displayedColumnsSuiviSg: string[] = ['ddp', 'stc', 'ec', 'long_ligne', 'nbre_ligne', 'img_cult', 'estimation', 'action'];
  private displayedColumnsAddSuiviSg: string[] = ['new_ddp', 'new_stc', 'new_ec', 'new_long_ligne', 'new_nbre_ligne', 'new_img_cult', 'new_estimation', 'new_action'];
  private displayedColumnsMepPa: string[] = ['annee', 'bloc', 'parcelle', 'code_benef', 'nom_benef', 'ddp', 'espece', 'qo', 'dt_dist', 'dt_mep', 'nbre_ligne', 'long_ligne'];
  private displayedColumnsAddMepPa: string[] = ['new_annee', 'new_bloc', 'new_parcelle', 'new_code_benef', 'new_nom_benef', 'new_ddp', 'new_espece', 'new_qo', 'new_dt_dist', 'new_dt_mep', 'new_nbre_ligne', 'new_long_ligne', 'new_action'];
  private displayedColumnsSuiviPa: string[] = ['ddp', 'ql', 'ec', 'nbre_ligne', 'hauteur', 'img_cult', 'qr', 'action'];
  private displayedColumnsAddSuiviPa: string[] = ['new_ddp', 'new_ql', 'new_ec', 'new_nbre_ligne', 'new_hauteur', 'new_img_cult', 'new_qr', 'new_action'];
  private displayedColumnsMepMv: string[] = ['annee', 'saison', 'bloc', 'parcelle', 'code_benef', 'nom_benef', 'ddp', 'espece', 'qso', 'dt_mep', 'sfce_embl', 'nbre_ligne', 'long_ligne', 'sc', 'ea'];
  private displayedColumnsAddMepMv: string[] = ['new_annee', 'new_saison', 'new_bloc', 'new_parcelle', 'new_code_benef', 'new_nom_benef', 'new_ddp', 'new_espece', 'new_qso', 'new_dt_mep', 'new_sfce_embl', 'new_nbre_ligne', 'new_long_ligne', 'new_sc', 'new_ea', 'new_action'];
  private displayedColumnsSuiviMv: string[] = ['ddp', 'nbre_pieds', 'long_ligne', 'nbre_ligne', 'estimation', 'action'];
  private displayedColumnsAddSuiviMv: string[] = ['new_ddp', 'new_nbre_pieds', 'new_long_ligne', 'new_nbre_ligne', 'new_estimation', 'new_action'];
  
  private displayedColumnsAllSvSg: string[] = ['code_suivi', 'bloc', 'parcelle', 'code_benef', 'nom', 'variette', 'qso', 'dds', 'sfce_emb', 'sc', 'ddp', 'stc', 'ec', 'long_ligne', 'nbre_ligne', 'img_cult', 'ex'];
  private displayedColumnsAllSvMv: string[] = ['code_suivi', 'bloc', 'parcelle', 'code_benef', 'nom', 'ddp', 'espece', 'qso', 'dds', 'sfce_emb', 'sc', 'nbre_pied', 'long_ligne', 'nbre_ligne', 'ex'];
  private displayedColumnsAllSvPa: string[] = ['code_suivi', 'bloc', 'parcelle', 'code_benef', 'nom', 'ddp', 'espece', 'qso', 'dds', 'sfce_emb', 'ql', 'ec', 'nbre_ligne', 'hauteur', 'img_cult', 'qr'];
  

  /***************************
   * Data Source
   ***************************/
  private dataSourceMepSg = new MatTableDataSource<Loc_mep_bloc>();
  private dataSourceSuiviSg = new MatTableDataSource<Loc_sv_bloc>();
  private dataSourceMepPa = new MatTableDataSource<Loc_mep_bloc>();
  private dataSourceSuiviPa = new MatTableDataSource<Loc_sv_bloc>();
  private dataSourceMepMv = new MatTableDataSource<Loc_mep_bloc>();
  private dataSourceSuiviMv = new MatTableDataSource<Loc_sv_bloc>();

  private dataSourceAllSuiviSg= new MatTableDataSource<Loc_all_suivi_bloc>();
  private dataSourceAllSuiviMv= new MatTableDataSource<Loc_all_suivi_bloc>();
  private dataSourceAllSuiviPa= new MatTableDataSource<Loc_all_suivi_bloc>();

  /**********************
   * boolean button
   ********************/ 
  isUpdated: boolean = false;
  isSuiviSg: boolean = false;
  isSuiviPa: boolean = false;
  isSuiviMv: boolean = false;
  // row Mep Suivi
  isRowMepSgSv: boolean = false;
  isRowMepPaSv: boolean = false;
  isRowMepMvSv: boolean = false;
  // row Mep Edit
  isRowMepSgEdit: boolean = false;
  isRowMepPaEdit: boolean = false;
  isRowMepMvEdit: boolean = false;
  // row Mep Add
  isAddMepSg: boolean = false;
  isAddMepPa: boolean = false;
  isAddMepMv: boolean = false;
  // row suivi Edit
  isRowSvSgEdit: boolean = false;
  isRowSvPaEdit: boolean = false;
  isRowSvMvEdit: boolean = false;
  // New Element Suivi
  isAddSuiviSg: boolean = false;
  isAddSuiviPa: boolean = false;
  isAddSuiviMv: boolean = false;

  // Index
  indexSg: number;
  indexPa: number;
  indexMv: number;

  // index Edit mep
  indexRowEditMepSg: number;
  indexRowEditMepPa: number;
  indexRowEditMepMv: number;

  // Accordion value level 2
  accordion_val_sg: string = 'mep-sg';
  accordion_val_pa: string = 'mep-pa';
  accordion_val_mep: string = 'mep-mv';

  /*********************************
   * Autre
   **********************************/
   region: any;
   district: any;
   projet: any;
   user: Utilisateurs[];
   data_bloc_parce: Local_bloc_parce[] = [];
   data_bloc: Loc_Bloc[] = [];
   data_benef: Local_benef_activ_bl[] = [];
   data_saison: Loc_saison[]  = [];
   data_espece: Loc_Espece[] = [];
   data_var: Loc_variette[] = [];
   data_categ: Loc_categEspece[] = [];

   // Filter Data
   filterBeneficiaire: Local_benef_activ_bl[] = [];
   filterParcelle: Local_bloc_parce[] = [];
   // Mep
   mep_selected_sg: Loc_mep_bloc;
   mep_selected_mv: Loc_mep_bloc;
   mep_selected_pa: Loc_mep_bloc;

   data_sc: any[] = SC;
   data_stc: any[] = STC;
   data_ec: any[] = EC_CULTURAL;

   update_mep: any = {};

   // image
  fileImgSvSg: LocalFile = {
    name: null,
    path: null,
    data: null
  };

  // Export
  mep_export_sg: any[] = [];
  mep_export_pa: any[] = [];
  mep_export_mv: any[] = [];
  // Export sv
  sv_export_sg: any[] = [];
  sv_export_pa: any[] = [];
  sv_export_mv: any[] = [];
  
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  constructor(
    private modalCtrl: ModalController,
    private loadData: LoadDataService,
    private router: Router,
    private crudDb: CrudDbService,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private plt: Platform,
    private file: File,
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      let data: any;
      const routeState = this.router.getCurrentNavigation().extras.state;
      console.log(routeState);
      data = JSON.parse(routeState.zone);
      this.projet = JSON.parse(routeState.projet);
      this.user = JSON.parse(routeState.user);
      this.region = data.data.region;
      this.district = data.data.district;
      console.log("Suivi bloc: data router zone::::", data);
      this.loadCommuneBloc();
      this.loadDataInitial();
    }
   }

  ngOnInit() {
    this.suivi_sgForm = this.formBuilder.group({
      ddp: [null, Validators.required],
      stc: null,
      ec: null,
      long_ligne: null,
      nbre_ligne: null,
      estimation: null
    });
    this.suivi_paForm = this.formBuilder.group({
      ddp: [null, Validators.required],
      ql: null,
      ec: null,
      nbre_ligne: null,
      hauteur: null,
      qr: null
    });
    this.suivi_mvForm = this.formBuilder.group({
      ddp: [null, Validators.required],
      nbre_pied: null,
      long_ligne: null,
      nbre_ligne: null,
      estimation: null
    });
    setTimeout(async () => {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.refreshDataSource();
      this.loadDataExportSg();
      this.loadDataExportPa();
      this.loadDataExportMv();
      this.loadingCtrl.dismiss();
    }, 2000);
  }
  /************************************
   * Load Data
   *************************************/
  async loadCommuneBloc() {

    let commune: Loc_Commune[] = [];
    let code_equipe: number;
    let id_dist = {
      code_dist: this.district.code_dist
    };
    this.loadData.loadCommune(id_dist).then(res_com => {
      console.log(res_com);
      if (res_com.values.length > 0) {
        res_com.values.forEach(elem_val => {
          commune.push(elem_val);
        });
        if (commune.length > 0) {
          // forEach commune
          commune.forEach((elem_com, i) => {
            code_equipe = this.user[this.user.length - 1].id_equipe;
            console.log("Code equipe::", code_equipe);
            // load Bloc BY ZONE BY EQUIPE
            const data = {
              code_com: elem_com.code_com,
              code_projet: this.projet.code_proj,
              id_tech: code_equipe
            }
            this.loadData.loadBlocEquipeZone(data).then(res_bloc => {
              if (res_bloc.values.length > 0) {
                res_bloc.values.forEach(elem_bloc => {
                  let code_bloc = {
                    code_bloc: elem_bloc.code_bloc
                  }
                  this.data_bloc.push(elem_bloc);
                  this.loadData.loadBenefBloc(elem_bloc.code_bloc).then(res_benef => {
                    console.log(res_benef);
                    res_benef.values.forEach(elem_benef => {
                      this.data_benef.push(elem_benef);
                      this.data_benef[0].nom;
                    });
                  });
                  this.loadData.loadBlocParce(code_bloc).then(parce_bloc => {
                    console.log(parce_bloc);
                    if (parce_bloc.values.length > 0) {
                      parce_bloc.values.forEach(elem_parce => {
                        console.log(elem_parce);
                        this.data_bloc_parce.push(elem_parce);
                      });
                    }
                  });
                  this.loadData.loadMepBloc({id_bloc: elem_bloc.code_bloc}).then(res_mep => {
                    console.log("Response load Mep Bloc:::", res_mep);
                    if (res_mep.values.length > 0) {
                      res_mep.values.forEach(elem_mep => {
                        this.data_Mep.push(elem_mep);
                      });
                      console.log("data_mep::::: ", this.data_Mep);
                    }
                  });
                  this.loadData.loadAllSuiviBloc({id_bloc: elem_bloc.code_bloc}).then(res_suivi => {
                    console.log("Response All suivi Bloc::::", res_suivi);
                    if (res_suivi.values.length > 0) {
                      res_suivi.values.forEach((elem_suivi, index) => {
                        this.data_all_suivi_mep.push(elem_suivi);
                      });
                      // filter data
                      this.src_AllSvSg = this.data_all_suivi_mep.filter(item => {return item.type === SG});
                      this.src_AllSvMv = this.data_all_suivi_mep.filter(item => {return item.type === MV});
                      this.src_AllSvPa = this.data_all_suivi_mep.filter(item => {return item.type === PA});
                    }
                  });
                });
              } else {
                console.log("Bloc non identifié!!!!!, commune :::", elem_com.nom_com);
              }
            });
            if((commune.length - 1) === i) {
              console.log("Data bloc::::" , this.data_bloc);
            }
          });
        }
      }
    });
  }
  
  // load Saison
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
  // load Mep Bloc
  loadMepBloc() {
    if (this.data_bloc.length > 0) {
      this.data_Mep = [];
      this.data_bloc.forEach((elem_bloc, i) => {
        let data = {
          id_bloc: elem_bloc.code_bloc
        }
        this.loadData.loadMepBloc(data).then(res_mep => {
          console.log("Response load Mep Bloc:::", res_mep);
          if (res_mep.values.length > 0) {
            res_mep.values.forEach(elem_mep => {
              this.data_Mep.push(elem_mep);
            });
            console.log("data_mep::::: ", this.data_Mep);
          }
        });
      });
    }
  }
  // load All Suivi Bloc
  loadAllSuiviBloc() {

    if (this.data_bloc.length > 0) {

      this.data_all_suivi_mep = [];

      this.data_bloc.forEach(elem_bloc => {
        this.loadData.loadAllSuiviBloc({id_bloc: elem_bloc.code_bloc}).then(res_suivi => {
          console.log("Response All suivi Bloc::::", res_suivi);
          if (res_suivi.values.length > 0) {
            res_suivi.values.forEach((elem_suivi, index) => {
              this.data_all_suivi_mep.push(elem_suivi);
            });
            // filter data
            this.src_AllSvSg = this.data_all_suivi_mep.filter(item => {return item.type === SG});
            this.src_AllSvMv = this.data_all_suivi_mep.filter(item => {return item.type === MV});
            this.src_AllSvPa = this.data_all_suivi_mep.filter(item => {return item.type === PA});
          }
        });
      });

      setTimeout(() => {
        // refresh data source
        this.dataSourceAllSuiviSg.data = this.src_AllSvSg;
        this.dataSourceAllSuiviMv.data = this.src_AllSvMv;
        this.dataSourceAllSuiviPa.data = this.src_AllSvPa;

        // load Export
        this.loadDataExportSvSg(this.src_AllSvSg);
        this.loadDataExportSvMv(this.src_AllSvMv);
        this.loadDataExportSvPa(this.src_AllSvPa);
        
        this.loadingCtrl.dismiss();
      }, 1000);
    }
  }

  /*************************
   * Action btn
   **************************/
  onUpdate() {
    this.isUpdated = true;
    this.displayedColumnsMepMv.push('action');
    this.displayedColumnsMepPa.push('action');
    this.displayedColumnsMepSg.push('action');
  }
  // Add MEP
  onAdd(src) {
    console.log("*****Add*******");
    const data = {
      src: src,
      data: {
        saison: this.data_saison,
        bloc: this.data_bloc,
        beneficiaire: this.data_benef,
        parcelle: this.data_bloc_parce,
        categorie: this.data_categ,
        espece: this.data_espece,
        variette: this.data_var
      }
    }

    if (src === 'mep-sg') {
      this.presentModal(data);
    } else if (src === 'mep-pa') {
      this.presentModal(data);
    } else if (src === 'mep-mv') {
      this.presentModal(data);
    }
  }
  // Add Suivi
  onAddSuivi(source: any) {
    switch(source.src) {
      case 'sv-sg':
        this.isAddSuiviSg = true;
        break;
      case 'sv-pa':
        this.isAddSuiviPa = true;
        break;
      case 'sv-mv':
        this.isAddSuiviMv = true;
        break;
      default:
        console.log("Default Addsuivi");
        break;
    }
  }
  onEditElem(data: any) {
    // Element
    console.log("Edit Element MEP", data.data);
    const data_ = {
      src: data.src,
      data_ : {
        saison: this.data_saison,
        bloc: this.data_bloc,
        beneficiaire: this.data_benef,
        parcelle: this.data_bloc_parce,
        categorie: this.data_categ,
        espece: this.data_espece,
        variette: this.data_var,
        data_row: data.data
      }
    }
    switch(data.src) {
      case 'mep-sg':
        // load Data Suivi s
        this.indexRowEditMepSg = data.index;
        this.presentModalEdit(data_);
        break;
      case 'mep-pa':
        // load Data Mep PA
        this.indexRowEditMepPa  = data.index;
        this.presentModalEdit(data_);
        break;
      case 'mep-mv':
        //load Data Suivi MV
        this.indexRowEditMepMv = data.index;
        this.presentModalEdit(data_);
        break;
      default:
        console.log("default")
        break;
    }
  }
  onEditElemSv(data: any) {
    // Element
    console.log("Suivi Data Edit:::",data.data);
    let data_: Loc_sv_bloc = data.data;
    switch(data.src) {
      case 'sv-sg':
        // load Data Suivi sg
        let stc: any = {};
        let ec: any = {};
        this.data_stc.filter(item => {
          if (item.value === data_.stc) {
            stc = item;
          }
        });
        this.data_ec.filter(item => {
          if (item.value === data_.ec) {
            ec = item
          }
        });
        this.suivi_sgForm.patchValue({
          ddp: moment(data_.ddp, "YYYY-MM-DD"),
          stc: stc,
          ec: ec,
          estimation: data_.ex,
          long_ligne: data_.long_ligne,
          nbre_ligne: data_.nbre_ligne,
          data: data_.img_cult
        });
        this.isRowSvSgEdit = true;
        this.indexSg = data.index;
        break;
      case 'sv-pa':
        // load Data Mep PA
        let ec_pa: any = {};
        this.data_ec.filter(item => {
          if (item.value === data_.ec) {
            ec_pa = item
          }
        });
        this.suivi_paForm.patchValue({
          ddp: moment(data_.ddp, "YYYY-MM-DD"),
          ql: data_.ql,
          ec: ec_pa,
          nbre_ligne: data_.nbre_ligne,
          hauteur: data_.hauteur,
          qr: data_.qr
        });
        this.isRowSvPaEdit = true;
        this.indexPa = data.index;
        break;
      case 'sv-mv':
        //load Data Suivi MV
        this.suivi_mvForm.patchValue({
          ddp: moment(data_.ddp, "YYYY-MM-DD"),
          nbre_pied: data_.nbre_pied,
          long_ligne: data_.long_ligne,
          nbre_ligne: data_.nbre_ligne,
          estimation: data_.ex
        });
        this.isRowSvMvEdit = true;
        this.indexMv = data.index;
        break;
      default:
        console.log("default")
        break;
    }
  }
  onSuivi(src: any) {
    switch(src) {
      case 'mep-sg':
        this.isSuiviSg = true;
        this.displayedColumnsMepSg.push('action');
        break;
      case 'mep-pa':
        this.isSuiviPa = true;
        this.displayedColumnsMepPa.push('action');
        break;
      case 'mep-mv':
        this.isSuiviMv = true;
        this.displayedColumnsMepMv.push('action');
        break;
      default:
        console.log("default")
        break;
    }
  }
  // clicked row mep suivi
  onRowMepSuivi(data: any) {
    console.log("Data Row Mep clicked::::", data.data);
    let data_: Loc_mep_bloc = data.data;
    this.loadData.loadSuiviBloc(data_.code_culture).then(res_suivi => {
      console.log("Response load Suivi Mep bloc::: ", res_suivi);
      switch(data.src) {
        case 'mep-sg':
          this.isRowMepSgSv = true;
          this.src_SvSg = [];
          this.mep_selected_sg = data.data;
          if (res_suivi.values.length > 0) {
            res_suivi.values.forEach(elem => {
              this.src_SvSg.push(elem);
            });
          }
          this.dataSourceSuiviSg.data = this.src_SvSg;
          this.accordion_val_sg = undefined;
          this.accordion_val_sg = "suivi-sg";
          console.log(this.accordionGroup.value);
          break;
        case 'mep-pa':
          // load Data Mep PA
          this.isRowMepPaSv = true;
          this.src_SvPa = [];
          this.mep_selected_pa = data.data;
          if (res_suivi.values.length > 0) {
            res_suivi.values.forEach(elem => {
              this.src_SvPa.push(elem);
            });
          }
          this.dataSourceSuiviPa.data = this.src_SvPa;
          break;
        case 'mep-mv':
          //load Data Suivi MV
          this.isRowMepMvSv = true;
          this.src_SvMv = [];
          this.mep_selected_mv = data.data;
          if (res_suivi.values.length > 0) {
            res_suivi.values.forEach(elem => {
              this.src_SvMv.push(elem);
            });
          }
          this.dataSourceSuiviMv.data = this.src_SvMv;
          break;
      }
    });
  }
  // Save Add Mep
  async onSaveAddMep(source) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    let order = 1;
    let new_mep: AddMepBloc = {
      code_culture: this.generateCodeMep(),
      id_parce: this.update_mep.id_parce,
      id_espece: this.update_mep.id_var != null? null:this.update_mep.id_espece,
      id_var: this.update_mep.id_var,
      id_saison: this.update_mep.id_saison,
      annee_du: this.update_mep.annee_du,
      ddp: this.update_mep.ddp,
      qso: this.update_mep.qso,
      dt_distribution: this.update_mep.dt_distribution,
      dds: this.update_mep.dds,
      sfce: this.update_mep.sfce,
      nbre_ligne: this.update_mep.nbre_ligne,
      long_ligne:this.update_mep.long_ligne,
      sc: this.update_mep.sc,
      usage: this.update_mep.usage,
      ea_autres: this.update_mep.ea_autres,
      ea_id_variette: this.update_mep.ea_id_variette,
      dt_creation: moment().format("YYYY-MM-DD"),
      dt_modification: moment().format("YYYY-MM-DD"),
      status: EC,
      etat: SYNC,
      id_equipe: this.user[this.user.length - 1].id_equipe,
      type: ''
    }
    switch(source) {
      case 'mep-sg':
        // insertion
        console.log("New Data Semences en grains::: ", this.update_mep);
        let data_sg = {
          type: SG, 
          id_bloc: this.update_mep.id_bloc, 
          id_saison: this.update_mep.id_saison, 
          annee_du: this.update_mep.annee_du
        }
        new_mep.type = SG;
        
        this.loadData.loadMepBloc(data_sg).then(res_mep => {
          console.log("Response load Mep SG Bloc:::", res_mep);
          // generer full code
          if (res_mep.values.length > 0) {
            res_mep.values.forEach((elem_mep, i) => {
              if ((res_mep.values.length - 1) === i)  {
                console.log("dernier element MEP SG::", elem_mep);
                let last_id: string = elem_mep.code_culture;
                let arr_lastId = last_id.trim().split("-");
                order = parseInt(arr_lastId[arr_lastId.length - 1]) + 1;
                new_mep.code_culture = this.generateCodeMep() + SG.toUpperCase() + '-' + order;
                console.log("Code_Mep:::", new_mep.code_culture);
              }
            });
          } else {
            new_mep.code_culture = this.generateCodeMep() + SG.toUpperCase() + '-' + order;
            console.log("Code_Mep:::", new_mep.code_culture);
          }

          // Insert new mep
          this.crudDb.AddMepBl(new_mep).then(res => {
            console.log("Data Semences en grains To Add::: ", new_mep);
            // refresh dataSource
            this.loadData.loadMepBloc({type: SG, id_bloc: this.update_mep.id_bloc}).then(res_mep => {
              console.log("Response load Mep SG Bloc:::", res_mep);
              if (res_mep.values.length > 0) {
                res_mep.values.forEach((elem_mep, i) => {
                  if ((res_mep.values.length - 1) === i)  {
                    this.src_MepSg = [elem_mep, ...this.src_MepSg]; // push item first position
                  }
                });
                this.dataSourceMepSg.data = this.src_MepSg;
              }
            });
            setTimeout(() => {
              this.loadingCtrl.dismiss();
            }, 300);
          }, err => {
            this.loadingCtrl.dismiss();
          });
        });

        this.isAddMepSg = false;
        break;
      case 'mep-pa':
        // insertion
        console.log("New Data jeunes plants::: ", this.update_mep);
        let data_pa = {
          type: PA, 
          id_bloc: this.update_mep.id_bloc, 
          annee_du: this.update_mep.annee_du
        }
        new_mep.type = PA;

        this.loadData.loadMepBloc(data_pa).then(res_mep => {
          console.log("Response load Mep PA Bloc:::", res_mep);
          // generate code
          if (res_mep.values.length > 0) {
            res_mep.values.forEach((elem_mep, i) => {
              if ((res_mep.values.length - 1) === i)  {
                console.log("dernier element MEP PA::", elem_mep);
                let last_id: string = elem_mep.code_culture;
                let arr_lastId = last_id.trim().split("-");
                order = parseInt(arr_lastId[arr_lastId.length - 1]) + 1;
                console.log("dernier element MEP PA, Code culture::", parseInt(arr_lastId[arr_lastId.length - 1]));
                // CODE Mep....
                new_mep.code_culture = this.generateCodeMep() + PA.toUpperCase() + '-' + order;
                console.log("Code_Mep:::", new_mep.code_culture);
              }
            });
          } else {
            new_mep.code_culture = this.generateCodeMep() + PA.toUpperCase() + '-' + order;
            console.log("Code_Mep:::", new_mep.code_culture);
          }

          // Insert new Mep PA
          this.crudDb.AddMepBl(new_mep).then(res => {
            console.log("Data jeunes plants To Add::: ", new_mep);
            // refresh data source
            this.loadData.loadMepBloc({type: PA, id_bloc: this.update_mep.id_bloc}).then(res_mep => {
              console.log("Response load Mep PA Bloc:::", res_mep);
              if (res_mep.values.length > 0) {
                res_mep.values.forEach((elem_mep, i) => {
                  if ((res_mep.values.length - 1) === i)  {
                    this.src_MepPa = [elem_mep, ...this.src_MepPa]; // push item first position
                  }
                });
                this.dataSourceMepPa.data = this.src_MepPa;
              }
            });
            setTimeout(() => {
              this.loadingCtrl.dismiss();
            }, 300);
          }, err => {
            this.loadingCtrl.dismiss();
          });

        });
        
        this.isAddMepPa = false;
        break;
      case 'mep-mv':
        // insertion
        console.log("New Data Materiels vegetaux::: ", this.update_mep);
        let data_mv: any;
        if (this.update_mep.id_saison != null) {
          data_mv = {
            type: MV, 
            id_bloc: this.update_mep.id_bloc, 
            id_saison: this.update_mep.id_saison, 
            annee_du: this.update_mep.annee_du
          }
        } else {
          data_mv = {
            type: MV, 
            id_bloc: this.update_mep.id_bloc, 
            annee_du: this.update_mep.annee_du
          }
        }
        new_mep.type = MV;

        this.loadData.loadMepBloc(data_mv).then(res_mep => {
          console.log("Response load Mep MV Bloc:::", res_mep);
          // Generer code MV
          if (res_mep.values.length > 0) {
            res_mep.values.forEach((elem_mep, i) => {
              if ((res_mep.values.length - 1) === i)  {
                console.log("dernier element MEP MV::", elem_mep);
                let last_id: string = elem_mep.code_culture;
                let arr_lastId = last_id.trim().split("-");
                order = parseInt(arr_lastId[arr_lastId.length - 1]) + 1;
                // CODE MEP
                new_mep.code_culture = this.generateCodeMep() + MV.toUpperCase() + '-' + order;
                console.log("Code_Mep:::", new_mep.code_culture);
              }
            });
          } else {
            new_mep.code_culture = this.generateCodeMep() + MV.toUpperCase() + '-' + order;
            console.log("Code_Mep:::", new_mep.code_culture);
          }
          // Insert new MEP MV
          this.crudDb.AddMepBl(new_mep).then(res => {
            console.log("Data Maeteriels vegetaux To Add::: ", new_mep);
            // refresh data source
            this.loadData.loadMepBloc({type: MV, id_bloc: this.update_mep.id_bloc}).then(res_mep => {
              console.log("Response load Mep PA Bloc:::", res_mep);
              if (res_mep.values.length > 0) {
                res_mep.values.forEach((elem_mep, i) => {
                  if ((res_mep.values.length - 1) === i)  {
                    this.src_MepMv = [elem_mep, ...this.src_MepMv]; // push item first position
                  }
                });
                this.dataSourceMepMv.data = this.src_MepMv;
              }
            });
            setTimeout(() => {
              this.loadingCtrl.dismiss();
            }, 300);
          }, err => {
            this.loadingCtrl.dismiss();
          });

        });

        this.isAddMepMv = false;
        break;
        default:
          this.loadingCtrl.dismiss();
          break;
    }
  }
  onCancelAddMep(source) {
    switch(source) {
      case 'mep-sg':
        this.isAddMepSg = false;
        break;
      case 'mep-pa':
        this.isAddMepPa = false;
        break;
      case 'mep-mv':
        this.isAddMepMv = false;
        break;
    }
  }
  // Save Edit Mep
  onClickSaveEdit(source: any) {
    let data_row: Loc_mep_bloc = source.data;
    let updated_mep_: AddMepBloc = {
      code_culture: data_row.code_culture,
      id_parce: this.update_mep.id_parce,
      id_espece: this.update_mep.id_var != null? null:this.update_mep.id_espece,
      id_var: this.update_mep.id_var,
      id_saison: this.update_mep.id_saison,
      annee_du: this.update_mep.annee_du,
      ddp: this.update_mep.ddp,
      qso: this.update_mep.qso,
      dt_distribution: this.update_mep.dt_distribution,
      dds: this.update_mep.dds,
      sfce: this.update_mep.sfce,
      nbre_ligne: this.update_mep.nbre_ligne,
      long_ligne:this.update_mep.long_ligne,
      usage: this.update_mep.usage,
      sc: this.update_mep.sc,
      ea_autres: this.update_mep.ea_autres,
      ea_id_variette: this.update_mep.ea_id_variette,
      dt_creation: data_row.dt_creation,
      dt_modification: moment().format("YYYY-MM-DD"),
      status: EC,
      etat: data_row.etat === SYNC?SYNC:UPDATE,
      id_equipe: this.user[this.user.length - 1].id_equipe,
      type: data_row.type
    }
    console.log("Row Data Edit::::", source.data);
    console.log("Row Data Edit 2::::", data_row);
    this.crudDb.UpdateMepBl(updated_mep_).then(res => {
      console.log("Mep Updated:::", res.changes);
      this.loadMepBloc();
      setTimeout(() => {
        this.refreshDataSource();
        this.loadingCtrl.dismiss();
      }, 500);
    });
    switch(source.src) {
      case 'mep-sg':
        console.log("SAVE Data To Edit SG::::", updated_mep_);
        this.isRowMepSgEdit = false;
        this.indexRowEditMepSg = null;
        this.update_mep = {};
        // Save Edit
        break;
      case 'mep-pa':
        console.log("SAVE Data To Edit PA::::", updated_mep_);
        this.isRowMepPaEdit = false;
        this.indexRowEditMepPa = null;
        this.update_mep = {};
        // Save Edit
        break;
      case 'mep-mv':
        console.log("SAVE Data To Edit MV::::", updated_mep_);
        this.isRowMepMvEdit = false;
        this.indexRowEditMepMv = null;
        this.update_mep = {};
        // Save Edit
        break;
      default:
        break;
    }
  }
  onClickCancelEdit(source: any) {
    switch(source) {
      case 'mep-sg':
        console.log("Cancel Edit SG::::",this.update_mep);
        this.isRowMepSgEdit = false;
        this.indexRowEditMepSg = null;
        this.update_mep = {};
        break;
      case 'mep-pa':
        console.log("Cancel Edit PA::::", this.update_mep);
        this.isRowMepPaEdit = false;
        this.indexRowEditMepPa = null;
        this.update_mep = {};
        // Save Edit
        break;
      case 'mep-mv':
        console.log("Cancel Edit MV::::", this.update_mep);
        this.isRowMepMvEdit = false;
        this.indexRowEditMepMv = null;
        this.update_mep = {};
        // Save Edit
        break;
      default:
        break;
    }
  }
  // Save Add suivi
  onSaveAddSuivi(src: any) {
    let add_suivi: UpdateSuiviBloc = {
      code_sv: null,
      id_culture: null,
      ddp: null,
      stc: null,
      ec: null,
      ql: null,
      qr: null,
      long_ligne: null,
      nbre_ligne: null,
      nbre_pied: null,
      hauteur: null,
      dt_creation: null,
      dt_modification: null,
      img_cult: null,
      dt_capture: null,
      ex: null,
      etat: SYNC
    }
    switch(src) {
      case 'sv-sg':
        let val_sg = this.suivi_sgForm.value;
        add_suivi.code_sv = this.mep_selected_sg.code_culture.concat("_1");
        add_suivi.id_culture = this.mep_selected_sg.code_culture;
        add_suivi.ddp = val_sg.ddp.format("YYYY-MM-DD");
        add_suivi.long_ligne = val_sg.long_ligne;
        add_suivi.nbre_ligne = val_sg.nbre_ligne;
        add_suivi.stc = val_sg.stc != null? val_sg.stc.value:null;
        add_suivi.ec = val_sg.ec != null? val_sg.ec.value:null;
        add_suivi.ex = val_sg.estimation;
        add_suivi.img_cult = this.fileImgSvSg.data;
        add_suivi.dt_capture = this.fileImgSvSg.data != null? moment().format("YYYY-MM-DD"):null;
        add_suivi.dt_creation = moment().format("YYYY-MM-DD");
        add_suivi.dt_modification = moment().format("YYYY-MM-DD");

        if (this.src_SvSg.length > 0) {
          let code_cult: string = this.src_SvSg[this.src_SvSg.length - 1].code_sv;
          let arr_code = code_cult.trim().split("_");
          console.log("Array code_cult", arr_code);

          arr_code.forEach((elem_, i) => {
            if ((arr_code.length - 1) === i) {
              let last_id = parseInt(elem_) + 1;
              add_suivi.code_sv = this.mep_selected_sg.code_culture.concat("_" + last_id.toString());
            }
          });
        } 
        this.crudDb.AddSuiviBl(add_suivi).then(res => {
          console.log("Res_ponse Add suivi:::", res);
          this.suivi_sgForm.reset();
          this.fileImgSvSg = {
            name: null,
            path: null,
            data: null
          };
          this.loadData.loadSuiviBloc(this.mep_selected_sg.code_culture).then(res_suivi => {
            console.log("Response load Suivi Mep bloc::: ", res_suivi);
            this.src_SvSg = [];
            if (res_suivi.values.length > 0) {
              res_suivi.values.forEach(elem => {
                this.src_SvSg.push(elem);
              });
            }
            this.dataSourceSuiviSg.data = this.src_SvSg;
          });
          //this.mep_selected_sg = null;
        });
        this.isAddSuiviSg = false;
        console.log("value suivi Add SG:::",this.suivi_sgForm.value);
        console.log("value suivi TO Add SG:::",add_suivi);
        break;
      case 'sv-pa':
        let val_pa = this.suivi_paForm.value;
        add_suivi.code_sv = this.mep_selected_pa.code_culture.concat("_1");
        add_suivi.id_culture = this.mep_selected_pa.code_culture;
        add_suivi.ddp = val_pa.ddp.format("YYYY-MM-DD");
        add_suivi.ql = val_pa.ql;
        add_suivi.ec = val_pa.ec != null? val_pa.ec.value:null;
        add_suivi.nbre_ligne = val_pa.nbre_ligne;
        add_suivi.hauteur = val_pa.hauteur;
        add_suivi.qr = val_pa.qr;
        add_suivi.img_cult = this.fileImgSvSg.data;
        add_suivi.dt_capture = this.fileImgSvSg.data != null? moment().format("YYYY-MM-DD"):null;
        add_suivi.dt_creation = moment().format("YYYY-MM-DD");
        add_suivi.dt_modification = moment().format("YYYY-MM-DD");

        if (this.src_SvPa.length > 0) {
          let code_cult: string = this.src_SvPa[this.src_SvPa.length - 1].code_sv;
          let arr_code = code_cult.trim().split("_");
          console.log("Array code_cult", arr_code);

          arr_code.forEach((elem_, i) => {
            if ((arr_code.length - 1) === i) {
              let last_id = parseInt(elem_) + 1;
              add_suivi.code_sv = this.mep_selected_pa.code_culture.concat("_" + last_id.toString());
            }
          });
        } 

        this.crudDb.AddSuiviBl(add_suivi).then(res => {
          console.log("Res_ponse Add suivi:::", res);
          this.suivi_paForm.reset();
          this.fileImgSvSg = {
            name: null,
            path: null,
            data: null
          };
          this.loadData.loadSuiviBloc(this.mep_selected_pa.code_culture).then(res_suivi => {
            console.log("Response load Suivi Mep bloc::: ", res_suivi);
            this.src_SvPa = [];
            if (res_suivi.values.length > 0) {
              res_suivi.values.forEach(elem => {
                this.src_SvPa.push(elem);
              });
            }
            this.dataSourceSuiviPa.data = this.src_SvPa;
          });
          //this.mep_selected_pa = null;
        });
        this.isAddSuiviPa = false;
        console.log("value suivi PA:::", this.suivi_paForm.value);
        console.log("value suivi TO Add PA:::",add_suivi);
        break;
      case 'sv-mv':
        let val_mv = this.suivi_mvForm.value;
        add_suivi.code_sv = this.mep_selected_mv.code_culture.concat("_1");
        add_suivi.id_culture = this.mep_selected_mv.code_culture;
        add_suivi.ddp = val_mv.ddp.format("YYYY-MM-DD");
        add_suivi.nbre_pied = val_mv.nbre_pied;
        add_suivi.long_ligne = val_mv.long_ligne;
        add_suivi.nbre_ligne = val_mv.nbre_ligne;
        add_suivi.ex = val_mv.estimation;
        add_suivi.dt_creation = moment().format("YYYY-MM-DD");
        add_suivi.dt_modification = moment().format("YYYY-MM-DD");
        
        if (this.src_SvMv.length > 0) {
          let code_cult: string = this.src_SvMv[this.src_SvMv.length - 1].code_sv;
          let arr_code = code_cult.trim().split("_");
          console.log("Array code_cult", arr_code);

          arr_code.forEach((elem_, i) => {
            if ((arr_code.length - 1) === i) {
              let last_id = parseInt(elem_) + 1;
              add_suivi.code_sv = this.mep_selected_mv.code_culture.concat("_" + last_id.toString());
            }
          });
        } 

        this.crudDb.AddSuiviBl(add_suivi).then(res => {
          console.log("Res_ponse Add suivi:::", res);
          this.suivi_mvForm.reset();
          this.loadData.loadSuiviBloc(this.mep_selected_mv.code_culture).then(res_suivi => {
            console.log("Response load Suivi Mep bloc::: ", res_suivi);
            this.src_SvMv = [];
            if (res_suivi.values.length > 0) {
              res_suivi.values.forEach(elem => {
                this.src_SvMv.push(elem);
              });
            }
            this.dataSourceSuiviMv.data = this.src_SvMv;
          });
          //this.mep_selected_mv = null;
        });

        this.isAddSuiviMv = false;
        console.log("value suivi MV:::", this.suivi_mvForm.value);
        console.log("value suivi TO Add MV:::",add_suivi);
        break;
      default:
        console.log('default Caancel suivi')
        break;
    }
  }
  onCancelAddSuivi(src: any) {
    switch(src) {
      case 'sv-sg':
        this.isAddSuiviSg = false;
        this.mep_selected_sg = null;
        this.suivi_sgForm.reset();
        break;
      case 'sv-pa':
        this.isAddSuiviPa = false;
        this.suivi_paForm.reset();
        break;
      case 'sv-mv':
        this.isAddSuiviMv = false;
        this.suivi_mvForm.reset();
        break;
      default:
        console.log('default Caancel suivi')
        break;
    }
  }
  // Save Edit suivi
  onSaveEditSuivi(_data_: any) {
    let data_row: Loc_sv_bloc = _data_.data;
    let update_suivi: UpdateSuiviBloc = {
      code_sv: null,
      id_culture: null,
      ddp: null,
      stc: null,
      ec: null,
      ql: null,
      qr: null,
      long_ligne: null,
      nbre_ligne: null,
      nbre_pied: null,
      hauteur: null,
      dt_creation: null,
      dt_modification: null,
      img_cult: null,
      dt_capture: null,
      ex: null,
      etat: data_row.etat === SYNC?SYNC:UPDATE
    }
    switch(_data_.src) {
      case 'sv-sg':
        let val_sg = this.suivi_sgForm.value;
        update_suivi.code_sv = data_row.code_sv
        update_suivi.id_culture = data_row.id_culture;
        update_suivi.ddp = val_sg.ddp.format("YYYY-MM-DD");
        update_suivi.long_ligne = val_sg.long_ligne;
        update_suivi.nbre_ligne = val_sg.nbre_ligne;
        update_suivi.stc = val_sg.stc != null? val_sg.stc.value:null;
        update_suivi.ec = val_sg.ec != null? val_sg.ec.value:null;
        update_suivi.ex = val_sg.estimation;
        update_suivi.img_cult = this.fileImgSvSg.data != null? this.fileImgSvSg.data:data_row.img_cult;
        update_suivi.dt_capture = this.fileImgSvSg.data != null? moment().format("YYYY-MM-DD"):data_row.dt_capture;
        update_suivi.dt_modification = moment().format("YYYY-MM-DD");

        let _data_update_sg = {
          updated: update_suivi
        }

        this.crudDb.UpdateSuiviBl(_data_update_sg).then(res => {
          console.log("Res_ponse Add suivi:::", res);
          this.suivi_sgForm.reset();
          this.fileImgSvSg = {
            name: null,
            path: null,
            data: null
          };
          this.loadData.loadSuiviBloc(this.mep_selected_sg.code_culture).then(res_suivi => {
            console.log("Response load Suivi bloc SG::: ", res_suivi);
            this.src_SvSg = [];
            if (res_suivi.values.length > 0) {
              res_suivi.values.forEach(elem => {
                this.src_SvSg.push(elem);
              });
            }
            this.dataSourceSuiviSg.data = this.src_SvSg;
          });
        });
        this.isRowSvSgEdit = false;
        this.indexSg = null;
        console.log("Save Edit SG:::", this.suivi_sgForm);
        break;
      case 'sv-pa':
        let val_pa = this.suivi_paForm.value;
        update_suivi.code_sv = data_row.code_sv;
        update_suivi.id_culture = data_row.id_culture;
        update_suivi.ddp = val_pa.ddp.format("YYYY-MM-DD");
        update_suivi.ql = val_pa.ql;
        update_suivi.ec = val_pa.ec != null? val_pa.ec.value:null;
        update_suivi.nbre_ligne = val_pa.nbre_ligne;
        update_suivi.hauteur = val_pa.hauteur;
        update_suivi.qr = val_pa.qr;
        update_suivi.img_cult = this.fileImgSvSg.data != null? this.fileImgSvSg.data:data_row.img_cult;
        update_suivi.dt_capture = this.fileImgSvSg.data != null? moment().format("YYYY-MM-DD"):data_row.dt_capture;
        update_suivi.dt_modification = moment().format("YYYY-MM-DD");

        let _data_update_pa = {
          updated: update_suivi
        }

        this.crudDb.UpdateSuiviBl(_data_update_pa).then(res => {
          console.log("Res_ponse Add suivi:::", res);
          this.suivi_paForm.reset();
          this.fileImgSvSg = {
            name: null,
            path: null,
            data: null
          };
          this.loadData.loadSuiviBloc(this.mep_selected_pa.code_culture).then(res_suivi => {
            console.log("Response load Suivi bloc PA::: ", res_suivi);
            this.src_SvPa = [];
            if (res_suivi.values.length > 0) {
              res_suivi.values.forEach(elem => {
                this.src_SvPa.push(elem);
              });
            }
            this.dataSourceSuiviPa.data = this.src_SvPa;
          });
        });

        this.isRowSvPaEdit = false;
        this.indexPa = null;
        console.log("Save Edit PA:::", this.suivi_paForm);
        break;
      case 'sv-mv':
        let val_mv = this.suivi_mvForm.value;
        update_suivi.code_sv = data_row.code_sv;
        update_suivi.id_culture = data_row.id_culture;
        update_suivi.ddp = val_mv.ddp.format("YYYY-MM-DD");
        update_suivi.nbre_pied = val_mv.nbre_pied;
        update_suivi.long_ligne = val_mv.long_ligne;
        update_suivi.nbre_ligne = val_mv.nbre_ligne;
        update_suivi.ex = val_mv.estimation;
        update_suivi.dt_modification = moment().format("YYYY-MM-DD");

        let _data_update_mv = {
          updated: update_suivi
        }

        this.crudDb.UpdateSuiviBl(_data_update_mv).then(res => {
          console.log("Res_ponse Add suivi:::", res);
          this.suivi_mvForm.reset();
          this.loadData.loadSuiviBloc(this.mep_selected_mv.code_culture).then(res_suivi => {
            console.log("Response load Suivi bloc MV::: ", res_suivi);
            this.src_SvMv = [];
            if (res_suivi.values.length > 0) {
              res_suivi.values.forEach(elem => {
                this.src_SvMv.push(elem);
              });
            }
            this.dataSourceSuiviMv.data = this.src_SvMv;
          });
        });
        this.isRowSvMvEdit = false;
        this.indexMv = null;
        console.log("Save Edit MV:::", this.suivi_mvForm);
        break;
      default:
        console.log('default Caancel suivi')
        break;
    }
  }
  onCancelEditSuivi(src: any) {
    switch(src) {
      case 'sv-sg':
        this.isRowSvSgEdit = false;
        this.indexSg = null;
        this.suivi_sgForm.reset();
        break;
      case 'sv-pa':
        this.isRowSvPaEdit = false;
        this.indexPa = null;
        this.suivi_paForm.reset();
        break;
      case 'sv-mv':
        this.isRowSvMvEdit = false;
        this.indexMv = null;
        this.suivi_mvForm.reset();
        break;
      default:
        console.log('default Caancel suivi')
        break;
    }
  }

  onClickAucun(src: string) {
    switch(src) {
      case 'stc-sg':
        this.suivi_sgForm.patchValue({
          stc: null
        });
        break;
      case 'ec-sg':
        this.suivi_sgForm.patchValue({
          ec: null
        });
        break;
      case 'ec-pa':
        this.suivi_paForm.patchValue({
          ec: null
        });
        break;    
    }
  }

  /**************************
  * Export Excelle
  **************************/
  onExport(parent: any) {
    switch(parent) {
    case 'mep-sg':
      var ws = XLSX.utils.json_to_sheet(this.mep_export_sg);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "MEP SEMENCES EN GRAINS");

      var buffer = XLSX.write(
        wb,
        {
          bookType: 'xlsx',
          type: 'array'
        }
      );
      this.saveToPhone(buffer);
      break;
    case 'mep-pa':
      var ws_pa = XLSX.utils.json_to_sheet(this.mep_export_pa);
      const wb_pa = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb_pa, ws_pa, "MEP Plants d'Arbre");

      var buffe_pa = XLSX.write(
        wb_pa,
        {
          bookType: 'xlsx',
          type: 'array'
        }
      );
      this.saveToPhone(buffe_pa);
      break;
    case 'mep-mv':
      var ws_mv = XLSX.utils.json_to_sheet(this.mep_export_mv);
      const wb_mv = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb_mv, ws_mv, "MEP Materiels Vegetaux");

      var buffe_mv = XLSX.write(
        wb_mv,
        {
          bookType: 'xlsx',
          type: 'array'
        }
      );
      this.saveToPhone(buffe_mv);
      break;
    case 'sv-sg':
      var ws_mep_sv = XLSX.utils.json_to_sheet(this.mep_export_sg);
      var ws_sv = XLSX.utils.json_to_sheet(this.sv_export_sg);
      const wb_sv = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb_sv, ws_mep_sv, "MEP SEMENCES EN GRAINS");
      XLSX.utils.book_append_sheet(wb_sv, ws_sv, "SV SEMENCES EN GRAINS");

      var buffer_sv = XLSX.write(
        wb_sv,
        {
          bookType: 'xlsx',
          type: 'array'
        }
      );
      this.saveToPhone(buffer_sv);
      break;
    case 'sv-mv':
      var ws_mep_sv_mv = XLSX.utils.json_to_sheet(this.mep_export_mv);
      var ws_sv_mv = XLSX.utils.json_to_sheet(this.sv_export_mv);
      const wb_sv_mv = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb_sv_mv, ws_mep_sv_mv, "MEP Materiels vegetaux");
      XLSX.utils.book_append_sheet(wb_sv_mv, ws_sv_mv, "SV Materiels vegetaux");

      var buffer_sv = XLSX.write(
        wb_sv_mv,
        {
          bookType: 'xlsx',
          type: 'array'
        }
      );
      this.saveToPhone(buffer_sv);
      break;
    case 'sv-pa':
      var ws_mep_sv_pa = XLSX.utils.json_to_sheet(this.mep_export_pa);
      var ws_sv_pa = XLSX.utils.json_to_sheet(this.sv_export_pa);
      const wb_sv_pa = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb_sv_pa, ws_mep_sv_pa, "MEP Plants d'arbre");
      XLSX.utils.book_append_sheet(wb_sv_pa, ws_sv_pa, "SV Plants d'arbre");

      var buffer_pa = XLSX.write(
        wb_sv_pa,
        {
          bookType: 'xlsx',
          type: 'array'
        }
      );
      this.saveToPhone(buffer_pa);
      break;
    }
  }
   saveToPhone(buffer) {
    var fileType= 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    var fileExtension = ".xlsx";
    var fileName = Date.now().toString();
    var data:Blob = new Blob([buffer], {type: fileType});
    this.file.writeFile(this.file.externalRootDirectory, fileName+fileExtension,data,{replace: true})
          .then(() => {
            alert("Export Réussie");
          });
  }

  // image
  async selectImage(src: string) {
    const image = await Camera.getPhoto({
      quality: 40,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      saveToGallery: false
    });

    if (image) {
      let data_ = {
        image: image,
        src: src
      }
      this.saveImage(data_);
    }
  }
  async saveImage(_data: any) {
    const image: Photo = _data.image;
    const base64 = await this.readAsBase64(image);
    console.log("base64 file::::", base64);

    const fileName = new Date().getTime() + 'jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64
    }).then(res_success => {
      console.log("File system write File sucess::: ",res_success);
    }, (err) => {
      // Folder does not yet exists!
      console.log("error write File::: Folder does not yet exists! :::", err);
    }).then(res => {
      console.log("writed file success=========", res);
        // Reload the file list
        // Improve by only loading for the new image and unshifting array!
        this.loadImage(_data);
    });
  }
  // convert to base 64
  async readAsBase64(image: Photo) {
   console.log("***** convert to base64 Mode *****", image);
   if (this.plt.is('hybrid')) {
      console.log("-------------HYBRIDE TESTE--------------");
      const file = await Filesystem.readFile({
          path: image.path
      });

      return file.data;
    } else {
        // Fetch the photo, read as a blob, then convert to base64 format
        console.log("------------web Path---------");
        const response = await fetch(image.webPath);
        const blob = await response.blob();

        return await this.convertBlobToBase64(blob) as string;
    }
  }
  // Helper function
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
  // Load Image
  loadImage(_data: any) {
    const image: Photo = _data.image;
    Filesystem.readdir({
      path: IMAGE_DIR,
      directory: Directory.Data
    }).then(result => {
      console.log('Load Image result::: ', result);
      if (result.files.length > 0) {
        // load Image
        let data_ = {
          src:  _data.src,
          result: result.files
        }
        this.loadFileDataImage(data_);
      } else console.log("Aucun Image enregistrer:::: ", result.files);
      
      // Delete image
      this.deleteLocalImage(image);

    }, async (err) => {
      // Folder does not yet exists!
      console.log("Folder doen't existe:: ", IMAGE_DIR);
      this.deleteLocalImage(image);
    });
  }
  async loadFileDataImage(_data) {
    const fileNames: string[] = _data.result;
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data
      });

      // condition 
      switch(_data.src) {
        case 'sv-sg':
          this.fileImgSvSg = {
            name: f,
            path: filePath,
            data: `data:image/jpeg;base64,${readFile.data}`
          };
          break;
      }
    }
  }
  // Delete loacal Image
  async deleteLocalImage(photo: Photo) {
    // Delete local image
    await Filesystem.deleteFile({
      path: photo.path
    });
}
  
  async onFinished() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    if (this.isUpdated) {
      this.loadMepBloc();
    }
    this.initAction();
    setTimeout(() => {
      this.refreshDataSource();
      this.loadingCtrl.dismiss();
    }, 500);
  }

  // generate code Mep
  generateCodeMep() {
    let code_mep: string = '';
    let nom_pr: string = this.projet.nom;
    let code_pr: string = '';
    let nom_bloc: string = this.update_mep.nom_bloc;
    let code_bloc: string = '';
    let annee_ = this.update_mep.annee_du.charAt(2) + this.update_mep.annee_du.charAt(3);
    
    console.log("Ordre Bloc:::", this.update_mep.ordre_bloc, "Code bloc:::::", this.update_mep.ancronyme_bloc);

    // generer code bloc
    /**let arr_bl: string[] = nom_bloc.trim().split(" ");
    arr_bl.forEach((elem, i) => {
      if (arr_bl.length === 1) {
        code_bloc = elem.charAt(0) + elem.charAt(1) + elem.charAt(2);
      } else {
        if (i === 0) {
          code_bloc = elem.charAt(0) + elem.charAt(1);
        } else if (i === 1) {
          code_bloc += elem.charAt(0);
        }
      }
    });*/
    //return code_mep = code_pr.toUpperCase() + '-' + this.update_mep.nom_saison + annee_ + '-' + code_bloc.toUpperCase() + '-' + 'Mep'; 
    if (this.update_mep.nom_saison != null && this.update_mep.nom_saison != null) {
      return code_mep = this.update_mep.nom_saison + annee_ + '-' +  this.update_mep.ordre_bloc + this.update_mep.ancronyme_bloc.toUpperCase() + '-' + 'Mep'; 
    } else {
      return code_mep =  this.update_mep.ordre_bloc + this.update_mep.ancronyme_bloc.toUpperCase() + '-' + annee_ + 'Mep'; 
    }
  }

  // modal
  async presentModal(source: any) {
    let modal: any;
    let elem = {
      component: ModalBlocPage,
      cssClass: 'bl-custom-modal-suivi',
      backdropDismiss: false,
      componentProps: {
        isSuivi: true,
        isAddMep: true,
        source_: '',
        data_: source.data
      }
    }
    switch(source.src) {
      case 'mep-sg':
        elem.componentProps.source_ = 'isAddMepSg';
        modal = await this.modalCtrl.create(elem);
        break;
      case 'mep-pa':
        elem.componentProps.source_ = 'isAddMepPa';
        modal = await this.modalCtrl.create(elem);
        break;
      case 'mep-mv':
        elem.componentProps.source_ = 'isAddMepMv';
        modal = await this.modalCtrl.create(elem);
        break;
      default:
        console.log("default Add present modale!");
        break;
    }

    modal.onDidDismiss().then((res_modal) => {
      console.log(res_modal);
      this.update_mep = {};

      if (res_modal.data != undefined) {
        let data_modal = res_modal.data;
        if ((data_modal.isAddMepSg != undefined && data_modal.isAddMepSg) || (data_modal.isAddMepPa != undefined && data_modal.isAddMepPa) || (data_modal.isAddMepMv != undefined &&  data_modal.isAddMepMv)) {
          let data_: any = data_modal.data_;
          let saison: Loc_saison;
          let bloc: Loc_Bloc;
          let benef: Local_benef_activ_bl;
          let categorie: Loc_categEspece;
          let espece: Loc_Espece;
          let parcelle: Local_bloc_parce;
          // data
          saison = data_.saison != null?data_.saison:null;
          bloc = data_.bloc;
          benef = data_.beneficiaire;
          categorie = data_.categorie_ea;
          espece = data_.espece;
          parcelle = data_.parcelle;
          this.update_mep = {
            id_bloc: bloc.code_bloc,
            nom_bloc: bloc.nom_bloc,
            ancronyme_bloc: bloc.ancronyme,
            ordre_bloc: bloc.ordre,
            id_benef: benef.code_benef_bl,
            nom_benef: benef.nom + ' ' + benef.prenom,
            id_parce: parcelle.code_parce,
            id_espece: espece.code_espece,
            nom_espece: espece.nom_espece,
            id_var: null,
            nom_var: null,
            id_saison: data_.saison != null?saison.code_saison:null,
            nom_saison:  data_.saison != null?saison.intitule:null,
            annee_du: data_.annee,
            ddp: data_.ddp.format("YYYY-MM-DD"),
            qso: data_.qso,
            dt_distribution: data_.dt_distribution != null?data_.dt_distribution.format("YYYY-MM-DD"):null,
            dds: data_.dds.format("YYYY-MM-DD"),
            sfce: data_.sfce,
            nbre_ligne: data_.nbre_ligne,
            long_ligne: data_.long_ligne,
            usage: data_.usage,
            sc: data_.sc != null? data_.sc.value: null,
            ea_autres: data_.autreCultureEa,
            ea_id_variette: null,
            ea: null
          }
  
          if ((data_modal.isAddMepSg != undefined && data_modal.isAddMepSg) || (data_modal.isAddMepMv != undefined &&  data_modal.isAddMepMv)) {
            
            //let variette_ea: Loc_variette;
            let variette_ea: any;
            let espece_ea: Loc_Espece;
            espece_ea = data_.espece_ea;
            variette_ea = data_.variette_ea;
            
            this.update_mep.ea_id_variette = variette_ea != null? variette_ea.code_var: null;
            this.update_mep.ea = data_.autreCultureEa != null || variette_ea != null?  (data_.autreCultureEa != null? data_.autreCultureEa: (espece_ea.nom_espece + ' ' + variette_ea.nom_var)): null;
            if (data_modal.isAddMepMv != undefined &&  data_modal.isAddMepMv) {
              this.isAddMepMv = true;
              console.log('Dismissed Add MV..', data_modal.data_);
            } else if(data_modal.isAddMepSg != undefined && data_modal.isAddMepSg) {
              console.log('Dismissed Add Sg..', data_modal.data_);
              let variette: Loc_variette;
              variette = data_.variette;
  
              this.update_mep.id_var = variette.code_var;
              this.update_mep.nom_var = espece.nom_espece + ' ' + variette.nom_var;
              this.isAddMepSg = true;
            }
          } else if (data_modal.isAddMepPa != undefined && data_modal.isAddMepPa) {
            this.isAddMepPa = true;
            console.log('Dismissed Add PA..', data_modal.data_);
          }
        }
      }
    });
    await modal.present();
  }

  // modal Edit
  async presentModalEdit(src: any) {
    let modal: any;
    console.log("Edit modale::::", src.data);
    switch(src.src) {
      case 'mep-sg':
        modal = await this.modalCtrl.create({
          component: ModalBlocPage,
          cssClass: 'bl-custom-modal-suivi',
          backdropDismiss: false,
          componentProps: {
            isSuivi: true,
            isEditMepSg: true,
            data_: src.data_
          }
        });
        break;
      case 'mep-pa':
        modal = modal = await this.modalCtrl.create({
          component: ModalBlocPage,
          cssClass: 'bl-custom-modal-suivi',
          backdropDismiss: false,
          componentProps: {
            isSuivi: true,
            isEditMepPa: true,
            data_: src.data_
          }
        });
        break;
      case 'mep-mv':
        modal = modal = await this.modalCtrl.create({
          component: ModalBlocPage,
          cssClass: 'bl-custom-modal-suivi',
          backdropDismiss: false,
          componentProps: {
            isSuivi: true,
            isEditMepMv: true,
            data_: src.data_
          }
        });
        break;
      default:
        console.log("default Edit")
        break;
    }
    modal.onDidDismiss().then((res_modal) => {
      console.log(res_modal);
      this.update_mep = {};
      if (res_modal.data != undefined) {
        let data_modal = res_modal.data;
        if ((data_modal.isEditMepSg != undefined && data_modal.isEditMepSg) || (data_modal.isEditMepMv != undefined && data_modal.isEditMepMv) || (data_modal.isEditMepPa != undefined && data_modal.isEditMepPa)) {
          console.log('Dismissed Edit Mep...', data_modal.data_);
          let data_: any = data_modal.data_;
          let saison: Loc_saison;
          let bloc: Loc_Bloc;
          let benef: Local_benef_activ_bl;
          let categorie: Loc_categEspece;
          let espece: Loc_Espece;
          let variette: Loc_variette;
          let parcelle: Local_bloc_parce;
          // data
          saison = data_.saison != null?data_.saison:null;
          bloc = data_.bloc;
          benef = data_.beneficiaire;
          categorie = data_.categorie_ea;
          espece = data_.espece;
          variette = data_.variette;
          parcelle = data_.parcelle;
          this.update_mep = {
            //code_culture: '001',
            id_bloc: bloc.code_bloc,
            nom_bloc: bloc.nom_bloc,
            id_benef: benef.code_benef_bl,
            nom_benef: benef.nom + ' ' + benef.prenom,
            id_parce: parcelle.code_parce,
            id_espece: espece.code_espece,
            nom_espece: espece.nom_espece,
            id_var: null,
            nom_var: null,
            id_saison: data_.saison != null?saison.code_saison:null,
            nom_saison: data_.saison != null?saison.intitule:null,
            annee_du: data_.annee,
            ddp: data_.ddp.format("YYYY-MM-DD"),
            qso: data_.qso,
            dt_distribution: data_.dt_distribution != null?data_.dt_distribution.format("YYYY-MM-DD"):null,
            dds: data_.dds.format("YYYY-MM-DD"),
            sfce: data_.sfce,
            nbre_ligne: data_.nbre_ligne,
            long_ligne: data_.long_ligne,
            usage: data_.usage,
            sc: data_.sc != null? data_.sc.value:null,
            ea_autres: data_.autreCultureEa,
            ea_id_variette: null,
            ea: null
          }
  
          if ((data_modal.isEditMepSg != undefined && data_modal.isEditMepSg) ||  (data_modal.isEditMepMv != undefined && data_modal.isEditMepMv)) {
            //let variette_ea: Loc_variette;
            let variette_ea: Loc_variette;
            let espece_ea: Loc_Espece;
            espece_ea = data_.espece_ea;
            variette_ea = data_.variette_ea;
  
            this.update_mep.ea_id_variette = variette_ea != null? variette_ea.code_var: null;
            this.update_mep.ea = data_.autreCultureEa != null  || variette_ea != null?(data_.autreCultureEa != null ? data_.autreCultureEa:(espece_ea.nom_espece + ' ' + variette_ea.nom_var)):null;
  
            if (data_modal.isEditMepSg != undefined && data_modal.isEditMepSg) {
              this.update_mep.id_var = variette.code_var;
              this.update_mep.nom_var = espece.nom_espece + ' ' + variette.nom_var;
              this.isRowMepSgEdit = true;
  
            } else if (data_modal.isEditMepMv != undefined && data_modal.isEditMepMv){
              this.isRowMepMvEdit = true;
              console.log("Dismissed Mep Edit MV:::: ", this.update_mep);
            }
          } else if (data_modal.isEditMepPa != undefined && data_modal.isEditMepPa) {
            this.isRowMepPaEdit = true;
            console.log("Dismissed Mep Edit PA:::: ", this.update_mep);
          }
        } 
      }
    });
    await modal.present();
  }

  initAction() {
    if (this.isUpdated) {
      this.displayedColumnsMepMv.pop();
      this.displayedColumnsMepPa.pop();
      this.displayedColumnsMepSg.pop();
      // remove action column
      this.isRowMepMvEdit = false;
      this.isRowMepPaEdit = false;
      this.isRowMepSgEdit = false;
      this.isAddMepSg = false;
      this.isAddMepPa = false;
      this.isAddMepMv = false;
      this.isUpdated = false;
      this.indexRowEditMepMv = null;
      this.indexRowEditMepPa  = null;
      this.indexRowEditMepSg = null;
      //this.update_mep = null;
    }
    // init Suivi semences en grains
    if (this.isSuiviSg) {
      if (this.isAddSuiviSg) {
        this.isAddSuiviSg = false;
      }
      if (this.isRowSvSgEdit) {
        this.isRowSvSgEdit = false;
      }
      // init image
      this.fileImgSvSg = {
        name: null,
        path: null,
        data: null
      };

      this.suivi_sgForm.reset();
      this.mep_selected_sg = null;
      this.src_SvSg = [];
      this.indexSg = null;
      this.isRowMepSgSv = false;
      this.displayedColumnsMepSg.pop();
      this.isSuiviSg = false;
    }
    // init  Suivi plants d'arbres
    if (this.isSuiviPa) {
      if (this.isAddSuiviPa) {
        this.isAddSuiviPa = false;
      }
      if (this.isRowSvPaEdit) {
        this.isRowSvPaEdit = false;
      }
      // init image
      this.fileImgSvSg = {
        name: null,
        path: null,
        data: null
      };
      
      this.suivi_paForm.reset();
      this.mep_selected_pa = null;
      this.src_SvPa = [];
      this.indexPa = null;
      this.isSuiviPa = false;
      this.isRowMepPaSv = false;
      this.displayedColumnsMepPa.pop();
    }
    // init Suivi Materials cultures
    if (this.isSuiviMv) {
      if (this.isAddSuiviMv) {
        this.isAddSuiviMv = false;
      }
      if (this.isRowSvMvEdit) {
        this.isRowSvMvEdit = false;
      }
      this.suivi_mvForm.reset();
      this.mep_selected_mv = null;
      this.src_SvMv = [];
      this.indexMv = null;
      this.isSuiviMv = false;
      this.isRowMepMvSv = false;
      this.displayedColumnsMepMv.pop();
    }
  }

  // refresh data source
  refreshDataSource() {
    this.src_MepMv = [];
    this.src_MepPa = [];
    this.src_MepSg = [];
    this.src_MepSg = this.data_Mep.length > 0? this.data_Mep.filter(item => {return item.type === SG}):[];
    this.src_MepPa = this.data_Mep.length > 0? this.data_Mep.filter(item => {return item.type === PA}):[];
    this.src_MepMv = this.data_Mep.length > 0? this.data_Mep.filter(item => {return item.type === MV}):[];
    this.dataSourceMepSg.data = this.src_MepSg;
    this.dataSourceMepPa.data = this.src_MepPa;
    this.dataSourceMepMv.data = this.src_MepMv;
    console.log("Data MV::::", this.src_MepMv);
    console.log("Data PA::::", this.src_MepPa);
    console.log("Data SG::::", this.src_MepSg);
  }

  loadDataExportSg() {
    if (this.src_MepSg.length > 0) {
      this.mep_export_sg = [];
      this.src_MepSg.forEach(elem => {
        this.mep_export_sg.push({
          Code_mep: elem.code_culture,
          Annee_du: elem.annee_du,
          Saison: elem.intitule, 
          Bloc: elem.nom_bl,
          Parcelle: elem.id_parce,
          Superficie_reel: elem.sfce_reel, 
          Code_benef: elem.code_benef_bl,
          Nom: elem.nom,
          Prenom: elem.prenom,
          DDP: elem.ddp,
          Variette: elem.nom_var,
          QSO: elem.qso,
          DDS: elem.dds,
          'Sfce Emblavée': elem.sfce,
          SC: elem.sc,
          EA: elem.ea,
          Nb_ligne: elem.nbre_ligne,
          Long_ligne: elem.long_ligne
        });
      });
    }
  }
  loadDataExportPa() {
    if (this.src_MepPa.length > 0) {
      this.mep_export_pa = [];
      this.src_MepPa.forEach(elem => {
        this.mep_export_pa.push({
          Code_mep: elem.code_culture,
          Annee_du: elem.annee_du,
          Saison: elem.intitule, 
          Bloc: elem.nom_bl,
          Parcelle: elem.id_parce,
          Sfce_reel: elem.sfce_reel, 
          Code_benef: elem.code_benef_bl,
          Nom: elem.nom,
          Prenom: elem.prenom,
          DDP: elem.ddp,
          Espece: elem.nom_espece,
          'Dt distribution': elem.dt_distribution,
          QO: elem.qso,
          'Dt MEP': elem.dds,
          'Nbre Ligne': elem.nbre_ligne,
          'Long ligne': elem.long_ligne
        });
      });
    }
  }
  loadDataExportMv() {
    if (this.src_MepMv.length > 0) {
      this.mep_export_mv = [];
      this.src_MepMv.forEach(elem => {
        this.mep_export_mv.push({
          Code_mep: elem.code_culture,
          Annee_du: elem.annee_du,
          Saison: elem.intitule, 
          Bloc: elem.nom_bl,
          Parcelle: elem.id_parce,
          Sfce_reel: elem.sfce_reel, 
          Code_benef: elem.code_benef_bl,
          Nom: elem.nom,
          Prenom: elem.prenom,
          DDP: elem.ddp,
          Espece: elem.nom_espece,
          QSO: elem.qso,
          Dt_MEP: elem.dds,
          'Sfce Emblavée': elem.sfce,
          SC: elem.sc,
          EA: elem.ea,
          'Nbre Ligne': elem.nbre_ligne,
          'Long ligne': elem.long_ligne
        });
      });
    }
  }

  loadDataExportSvSg(data_suivi_sg: Loc_all_suivi_bloc[]) {
    if (data_suivi_sg.length > 0) {
      this.sv_export_sg = [];
      data_suivi_sg.forEach(elem_sg => {
        this.sv_export_sg.push({
          'Code Suivi': elem_sg.code_sv,
          Annee_du: elem_sg.annee_du,
          Saison: elem_sg.saison, 
          Bloc: elem_sg.bloc,
          Parcelle: elem_sg.id_parce,
          Superficie_reel: elem_sg.sfce_reel, 
          Code_benef: elem_sg.code_benef_bl,
          Nom: elem_sg.nom,
          Prenom: elem_sg.prenom,
          DDP: elem_sg.ddp,
          Code_MEP: elem_sg.id_culture,
          Variette: elem_sg.variette,
          QSO: elem_sg.qso,
          DDS: elem_sg.dds,
          'Sfce Emblavée': elem_sg.sfce,
          SC: elem_sg.mep_sc,
          //EA: elem_sg.ea,
          stc: elem_sg.stc,
          Etat: elem_sg.ec,
          Long_ligne: elem_sg.long_ligne,
          Nbre_ligne: elem_sg.nbre_ligne,
          EX: elem_sg.ex
        });
      });
    }
  }
  loadDataExportSvMv(data_suivi_mv: Loc_all_suivi_bloc[]) {
    if (data_suivi_mv.length > 0) {
      this.sv_export_mv = [];
      data_suivi_mv.forEach(elem_mv => {
        this.sv_export_mv.push({
          'Code Suivi': elem_mv.code_sv,
          Annee_du: elem_mv.annee_du,
          Saison: elem_mv.saison, 
          Bloc: elem_mv.bloc,
          Parcelle: elem_mv.id_parce,
          Superficie_reel: elem_mv.sfce_reel, 
          Code_benef: elem_mv.code_benef_bl,
          Nom: elem_mv.nom,
          Prenom: elem_mv.prenom,
          DDP: elem_mv.ddp,
          Code_MEP: elem_mv.id_culture,
          Espece: elem_mv.espece,
          QSO: elem_mv.qso,
          Dt_MEP: elem_mv.dds,
          'Sfce Emblavée': elem_mv.sfce,
          SC: elem_mv.mep_sc,
          //EA: elem_mv.ea,
          Nbre_pieds: elem_mv.nbre_pied,
          Long_ligne: elem_mv.long_ligne,
          Nbre_ligne: elem_mv.nbre_ligne,
          EX: elem_mv.ex
        });
      });
    }
  }
  loadDataExportSvPa(data_suivi_pa: Loc_all_suivi_bloc[]) {
    if (data_suivi_pa.length > 0) {
      this.sv_export_pa = [];
      data_suivi_pa.forEach(elem_pa => {
        this.sv_export_pa.push({
          'Code Suivi': elem_pa.code_sv,
          Annee_du: elem_pa.annee_du,
          Saison: elem_pa.saison, 
          Bloc: elem_pa.bloc,
          Parcelle: elem_pa.id_parce,
          Superficie_reel: elem_pa.sfce_reel, 
          Code_benef: elem_pa.code_benef_bl,
          Nom: elem_pa.nom,
          Prenom: elem_pa.prenom,
          DDP: elem_pa.ddp,
          Code_MEP: elem_pa.id_culture,
          Espece: elem_pa.espece,
          QO: elem_pa.qso,
          Dt_MEP: elem_pa.dds,
          'Sfce Emblavée': elem_pa.sfce,
          QL: elem_pa.ql,
          Etat: elem_pa.ec,
          'Nb ligne': elem_pa.nbre_ligne,
          Hauteur: elem_pa.hauteur,
          'QR(en 1 ans)': elem_pa.qr
        });
      });
    }
  }

  // Event selected matgroupe
  async selectMatTab(index: number) {
    console.log("index Mat-Tab Selected :: " + index);
    this.initAction();
    //this.suiviForm.reset();
    if (index == 0) {
      console.log("selected index 0*******");
      this.refreshDataSource();
    } else if (index == 1) {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      console.log("selected index 1*******");
      this.loadMepBloc();
      this.loadAllSuiviBloc();
    } 
  }

  // Accordion
  logAccordionValue() {
    console.log(this.accordionGroup.value);
  }
  
  closeAccordion() {
    let null_val = '';
    if (null_val == null) {
      console.log(" Null condition, Value of::::", null_val.valueOf());
    }

    if (null_val == '') {
      console.log("'' condition, Value of::::", null_val.valueOf());
      let espece_ea: Loc_Espece;
      console.log("Espece null, Value::::", espece_ea);
    }
    this.accordionGroup.value = undefined;
  }

}
