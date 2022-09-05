import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
// Import
import { IonAccordionGroup, LoadingController, ModalController, Platform } from '@ionic/angular';
import * as _moment from 'moment';
import { AddMepBloc, UpdateSuiviBloc } from 'src/app/interfaces/interface-insertDb';
import { Local_benef_activ_bl, Local_bloc_parce, Local_bloc_zone, Loc_all_suivi_bloc, Loc_all_suivi_mep, Loc_AnneeAgricole, Loc_Bloc, Loc_categEspece, Loc_Commune, Loc_Espece, Loc_export_excel, Loc_mep_bloc, Loc_saison, Loc_suivi_mep, Loc_sv_bloc, Loc_variette, Update_FormModal_Suivi_Mep_Bloc } from 'src/app/interfaces/interfaces-local';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { ACTIVE, EC, EC_CULTURAL, IMAGE_DIR, MV, PA, SC, SG, STC, SYNC, UPDATE } from 'src/app/utils/global-variables';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalBlocPage } from '../../modals/modal-bloc/modal-bloc.page';

// import excelle
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ModalPrPage } from '../../modals/modal-pr/modal-pr.page';
import { ExportExcelService } from 'src/app/services/export-excel.service';

const moment = _moment;

interface update_Mep_form {
  annee: Loc_AnneeAgricole,
  saison: Loc_saison,
  bloc: Loc_Bloc,
  beneficiaire: Local_benef_activ_bl,
  parcelle: Local_bloc_parce,
  ddp: string,
  qso: number,
  dt_distribution: string,
  dds: string,
  sfce: number,
  nbre_ligne: number,
  long_ligne: number,
  usage: string,
  sc: any,
  categorie_ea: Loc_categEspece,
  espece: Loc_Espece,
  espece_ea: Loc_Espece,
  variette: Loc_variette,
  variette_ea: Loc_variette,
  autreCultureEa: string
}

@Component({
  selector: 'app-suivi-bloc',
  templateUrl: './suivi-bloc.page.html',
  styleUrls: ['./suivi-bloc.page.scss'],
  animations: [ //utiliser pour @detailExpand (table expendable)
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class SuiviBlocPage implements OnInit {
  // Aliment data source
  private src_MepSg: Loc_mep_bloc[] = [];
  private src_MepPa: Loc_mep_bloc[] = [];
  private src_MepMv: Loc_mep_bloc[] = [];
  private data_Mep: Loc_mep_bloc[] = [];
  private updated_Suivi: Update_FormModal_Suivi_Mep_Bloc = <Update_FormModal_Suivi_Mep_Bloc>{};

  private data_all_suivi_mep: Loc_all_suivi_bloc[] = [];
  private src_AllSvSg: Loc_all_suivi_bloc[] = [];
  private src_AllSvMv: Loc_all_suivi_bloc[] = [];
  private src_AllSvPa: Loc_all_suivi_bloc[] = [];

  
  // Displayed column
  private displayedColumnsMepSg: string[] = ['annee', 'saison', 'bloc', 'parcelle', 'code_benef', 'nom_benef', 'ddp', 'variette', 'qso', 'dds', 'sfce_embl', 'sc', 'ea', 'nbre_ligne', 'long_ligne', 'action'];
  private displayedColumnsAddMepSg: string[] = ['new_annee', 'new_saison', 'new_bloc', 'new_parcelle', 'new_code_benef', 'new_nom_benef', 'new_ddp', 'new_variette', 'new_qso', 'new_dds', 'new_sfce_embl', 'new_sc', 'new_ea', 'new_nbre_ligne', 'new_long_ligne', 'new_action'];
  private displayedColumnsSuiviSg: string[] = ['ddp', 'stc', 'ec', 'long_ligne', 'nbre_ligne', 'img_cult', 'estimation', 'action'];
  private displayedColumnsAddSuiviSg: string[] = ['new_ddp', 'new_stc', 'new_ec', 'new_long_ligne', 'new_nbre_ligne', 'new_img_cult', 'new_estimation', 'new_action'];
  //
  private displayedColumnsMepPa: string[] = ['annee', 'bloc', 'parcelle', 'code_benef', 'nom_benef', 'ddp', 'espece', 'qo', 'dt_dist', 'dt_mep', 'nbre_ligne', 'long_ligne', 'action'];
  private displayedColumnsAddMepPa: string[] = ['new_annee', 'new_bloc', 'new_parcelle', 'new_code_benef', 'new_nom_benef', 'new_ddp', 'new_espece', 'new_qo', 'new_dt_dist', 'new_dt_mep', 'new_nbre_ligne', 'new_long_ligne', 'new_action'];
  private displayedColumnsSuiviPa: string[] = ['ddp', 'ql', 'ec', 'nbre_ligne', 'hauteur', 'img_cult', 'qr', 'action'];
  private displayedColumnsAddSuiviPa: string[] = ['new_ddp', 'new_ql', 'new_ec', 'new_nbre_ligne', 'new_hauteur', 'new_img_cult', 'new_qr', 'new_action'];

  private displayedColumnsMepMv: string[] = ['annee', 'saison', 'bloc', 'parcelle', 'code_benef', 'nom_benef', 'ddp', 'espece', 'qso', 'dt_mep', 'sfce_embl', 'nbre_ligne', 'long_ligne', 'sc', 'ea', 'action'];
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
  private dataSourceMepPa = new MatTableDataSource<Loc_mep_bloc>();
  private dataSourceMepMv = new MatTableDataSource<Loc_mep_bloc>();

  private dataSourceAllSuiviSg= new MatTableDataSource<Loc_all_suivi_bloc>();
  private dataSourceAllSuiviMv= new MatTableDataSource<Loc_all_suivi_bloc>();
  private dataSourceAllSuiviPa= new MatTableDataSource<Loc_all_suivi_bloc>();

  /**********************
   * boolean button
   ********************/ 
  isUpdated: boolean = false;

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
  // expanded btn
  isTableSgExpanded = false;
  isTablePaExpanded = false;
  isTableMvExpanded = false;

  // Index
  indexSg: number;
  indexPa: number;
  indexMv: number;

  // index Edit mep
  indexRowEditMepSg: number;
  indexRowEditMepPa: number;
  indexRowEditMepMv: number;


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
   data_annee_agricole: Loc_AnneeAgricole[] = [];

   data_sc: any[] = SC;
   data_stc: any[] = STC;
   data_ec: any[] = EC_CULTURAL;

   update_mep: update_Mep_form = <update_Mep_form>{};

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
    private exportExcel: ExportExcelService
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
    setTimeout(async () => {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.refreshDataSource();
      this.loadDataExportSg();
      this.loadDataExportPa();
      this.loadDataExportMv();
      this.loadAnneeAgricole();
      this.loadingCtrl.dismiss();
    }, 1000);
  }
  ionViewDidEnter() {
    console.log(":::::LifeCycle Suivi bLOC function:::: ionViewDidEnter:::");
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
        res_com.values.forEach((elem_com, ind) => {
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
              res_bloc.values.forEach((elem_bloc, ind_bloc) => {
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
              });
            } else {
              console.log("Bloc non identifié!!!!!, commune :::", elem_com.nom_com);
            }
            if((res_com.values.length - 1) === ind) {
              console.log(":::::FIN du BOUCLE COMMUNE Data bloc::::" , this.data_bloc);
              this.loadMepBloc();
            }
          });
        });
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
      this.data_all_suivi_mep = [];
      
      this.data_bloc.forEach((elem_bloc, ind) => {
        let data = {
          id_bloc: elem_bloc.code_bloc
        }
        // loadAll suivi
        this.loadData.loadAllSuiviBloc({id_bloc: elem_bloc.code_bloc}).then(res_suivi => {
          console.log("Response All suivi Bloc::::", res_suivi);
          if (res_suivi.values.length > 0) {
            res_suivi.values.forEach((elem_suivi, index) => {
              this.data_all_suivi_mep.push(elem_suivi);
            });
          }
        });
        this.loadData.loadMepBloc(data).then(res_mep => {
          console.log("Response load Mep Bloc:::", res_mep);
          if (res_mep.values.length > 0) {
            res_mep.values.forEach(elem_mep => {
              this.data_Mep.push(elem_mep);
              /**this.data_Mep.forEach(item_mep => {
                item_mep.suivi_Mep = [];
              });*/
            });
            console.log("data_mep::::: ", this.data_Mep);
          }
            // fin du boucle
          if ((this.data_bloc.length - 1) === ind) {
            console.log("::::Data Mep With element:::", this.data_Mep);
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
        variette: this.data_var,
        annee_agricole: this.data_annee_agricole
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
        data_row: data.data,
        annee_agricole: this.data_annee_agricole
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
  // Save Add Mep
  async onSaveAddMep(source) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    let order = 1;
    let new_mep: AddMepBloc = {
      code_culture: this.generateCodeMep(),
      id_parce: this.update_mep.parcelle != null?this.update_mep.parcelle.code_parce:null,
      id_espece: this.update_mep.variette != null? null:this.update_mep.espece.code_espece,
      id_var: this.update_mep.variette != null?this.update_mep.variette.code_var:null,
      id_saison: this.update_mep.saison != null?this.update_mep.saison.code_saison:null,
      id_annee: this.update_mep.annee != null?this.update_mep.annee.code:null,
      ddp: this.update_mep.ddp,
      qso: this.update_mep.qso,
      dt_distribution: this.update_mep.dt_distribution,
      dds: this.update_mep.dds,
      sfce: this.update_mep.sfce,
      nbre_ligne: this.update_mep.nbre_ligne,
      long_ligne:this.update_mep.long_ligne,
      sc: this.update_mep.sc != null?this.update_mep.sc.value:null,
      usage: this.update_mep.usage,
      ea_autres: this.update_mep.autreCultureEa,
      ea_id_variette: this.update_mep.variette_ea != null?this.update_mep.variette_ea.code_var:null,
      dt_creation: moment().format("YYYY-MM-DD"),
      dt_modification: moment().format("YYYY-MM-DD"),
      status: EC,
      etat: SYNC,
      id_equipe: this.user[this.user.length - 1].id_equipe,
      type: null
    }
    switch(source) {
      case 'mep-sg':
        // insertion
        new_mep.type = SG;
        let data_sg = {
          type: SG, 
          id_bloc: this.update_mep.bloc != null?this.update_mep.bloc.code_bloc:null, 
          id_saison: this.update_mep.saison != null?this.update_mep.saison.code_saison:null, 
          annee_du: this.update_mep.annee != null?this.update_mep.annee.code:null
        }
        
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
            this.loadData.loadMepBloc({type: SG, id_bloc: this.update_mep.bloc != null?this.update_mep.bloc.code_bloc:null}).then(res_mep => {
              console.log("Response load Mep SG Bloc:::", res_mep);
              if (res_mep.values.length > 0) {
                res_mep.values.forEach((elem_mep, i) => {
                  if ((res_mep.values.length - 1) === i)  {
                    this.src_MepSg = [elem_mep, ...this.src_MepSg]; // push item first position
                  }
                });
                this.src_MepSg[0].suivi_Mep = [];
                this.dataSourceMepSg.data = this.src_MepSg;
              }
              this.isAddMepSg = false;
              this.update_mep = <update_Mep_form>{};
            });
            setTimeout(() => {
              this.loadingCtrl.dismiss();
            }, 200);
          }, err => {
            this.loadingCtrl.dismiss();
          });
        });
        break;
      case 'mep-pa':
        // insertion
        console.log("New Data jeunes plants::: ", this.update_mep);
        let data_pa = {
          type: PA, 
          id_bloc: this.update_mep.bloc != null?this.update_mep.bloc.code_bloc:null, 
          annee_du: this.update_mep.annee != null?this.update_mep.annee.code:null
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
            this.loadData.loadMepBloc({type: PA, id_bloc: this.update_mep.bloc != null?this.update_mep.bloc.code_bloc:null}).then(res_mep => {
              console.log("Response load Mep PA Bloc:::", res_mep);
              if (res_mep.values.length > 0) {
                res_mep.values.forEach((elem_mep, i) => {
                  if ((res_mep.values.length - 1) === i)  {
                    this.src_MepPa = [elem_mep, ...this.src_MepPa]; // push item first position
                  }
                });
                this.src_MepPa[0].suivi_Mep = [];
                this.dataSourceMepPa.data = this.src_MepPa;
              }
              this.isAddMepPa = false;
              this.update_mep = <update_Mep_form>{};
            });
            setTimeout(() => {
              this.loadingCtrl.dismiss();
            }, 300);
          }, err => {
            this.loadingCtrl.dismiss();
          });

        });
        break;
      case 'mep-mv':
        // insertion
        console.log("New Data Materiels vegetaux::: ", this.update_mep);
        let data_mv: any;
        if (this.update_mep.saison != null) {
          data_mv = {
            type: MV, 
            id_bloc: this.update_mep.bloc != null?this.update_mep.bloc.code_bloc:null, 
            id_saison: this.update_mep.saison != null?this.update_mep.saison.code_saison:null, 
            annee_du: this.update_mep.annee != null?this.update_mep.annee.code:null
          }
        } else {
          data_mv = {
            type: MV, 
            id_bloc: this.update_mep.bloc != null?this.update_mep.bloc.code_bloc:null, 
            annee_du: this.update_mep.annee != null?this.update_mep.annee.code:null
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
            this.loadData.loadMepBloc({type: MV, id_bloc: this.update_mep.bloc != null?this.update_mep.bloc.code_bloc:null}).then(res_mep => {
              console.log("Response load Mep PA Bloc:::", res_mep);
              if (res_mep.values.length > 0) {
                res_mep.values.forEach((elem_mep, i) => {
                  if ((res_mep.values.length - 1) === i)  {
                    this.src_MepMv = [elem_mep, ...this.src_MepMv]; // push item first position
                  }
                });
                this.src_MepMv[0].suivi_Mep = [];
                this.dataSourceMepMv.data = this.src_MepMv;
              }
              this.isAddMepMv = false;
              this.update_mep = <update_Mep_form>{};
            });
            setTimeout(() => {
              this.loadingCtrl.dismiss();
            }, 200);
          }, err => {
            this.loadingCtrl.dismiss();
          });

        });
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
        this.update_mep = <update_Mep_form>{};
        break;
      case 'mep-pa':
        this.isAddMepPa = false;
        this.update_mep = <update_Mep_form>{};
        break;
      case 'mep-mv':
        this.isAddMepMv = false;
        this.update_mep = <update_Mep_form>{};
        break;
    }
  }
  // Save Edit Mep
  onClickSaveEdit(source: any) {
    let data_row: Loc_mep_bloc = source.data;
    let updated_mep_: AddMepBloc = {
      code_culture: data_row.code_culture,
      id_parce: this.update_mep.parcelle != null?this.update_mep.parcelle.code_parce:null,
      id_espece: this.update_mep.variette != null? null:this.update_mep.espece.code_espece,
      id_var: this.update_mep.variette != null?this.update_mep.variette.code_var:null,
      id_saison: this.update_mep.saison != null?this.update_mep.saison.code_saison:null,
      id_annee: this.update_mep.annee != null?this.update_mep.annee.code:null,
      ddp: this.update_mep.ddp,
      qso: this.update_mep.qso,
      dt_distribution: this.update_mep.dt_distribution,
      dds: this.update_mep.dds,
      sfce: this.update_mep.sfce,
      nbre_ligne: this.update_mep.nbre_ligne,
      long_ligne:this.update_mep.long_ligne,
      usage: this.update_mep.usage,
      sc: this.update_mep.sc != null?this.update_mep.sc.value:null,
      ea_autres: this.update_mep.autreCultureEa,
      ea_id_variette: this.update_mep.variette_ea != null?this.update_mep.variette_ea.code_var:null,
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
        this.update_mep = <update_Mep_form>{};
        // Save Edit
        break;
      case 'mep-pa':
        console.log("SAVE Data To Edit PA::::", updated_mep_);
        this.isRowMepPaEdit = false;
        this.indexRowEditMepPa = null;
        this.update_mep = <update_Mep_form>{};
        // Save Edit
        break;
      case 'mep-mv':
        console.log("SAVE Data To Edit MV::::", updated_mep_);
        this.isRowMepMvEdit = false;
        this.indexRowEditMepMv = null;
        this.update_mep = <update_Mep_form>{};
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
        this.update_mep = <update_Mep_form>{};
        break;
      case 'mep-pa':
        console.log("Cancel Edit PA::::", this.update_mep);
        this.isRowMepPaEdit = false;
        this.indexRowEditMepPa = null;
        this.update_mep = <update_Mep_form>{};
        // Save Edit
        break;
      case 'mep-mv':
        console.log("Cancel Edit MV::::", this.update_mep);
        this.isRowMepMvEdit = false;
        this.indexRowEditMepMv = null;
        this.update_mep = <update_Mep_form>{};
        // Save Edit
        break;
      default:
        break;
    }
  }
  // Save Add suivi
  onSaveAddSuivi(src: any) {
    // {src: 'sv-sg', row_mep: element_mep}
    let row_mep_selected: Loc_mep_bloc = src.row_mep;
    let add_suivi: UpdateSuiviBloc = {
      code_sv: row_mep_selected.code_culture + '_' + moment().format('YYMMDD:HHmmss'),
      id_culture: row_mep_selected.code_culture,
      ddp: this.updated_Suivi.ddp,
      stc: this.updated_Suivi.stc != null?this.updated_Suivi.stc.value:null,
      ec: this.updated_Suivi.ec != null?this.updated_Suivi.ec.value:null,
      ql: this.updated_Suivi.ql,
      qr: this.updated_Suivi.qr,
      long_ligne: this.updated_Suivi.long_ligne,
      nbre_ligne: this.updated_Suivi.nbre_ligne,
      nbre_pied: this.updated_Suivi.nbre_pied,
      hauteur: this.updated_Suivi.hauteur,
      dt_creation: moment().format('YYYY-MM-DD'),
      dt_modification: moment().format('YYYY-MM-DD'),
      img_cult: this.updated_Suivi.img_culture,
      dt_capture: null,
      ex: this.updated_Suivi.estimation,
      etat: SYNC
    }
    switch(src.src) {
      case 'sv-sg':
        this.crudDb.AddSuiviBl(add_suivi).then(res => {
          console.log("Res_ponse Add suivi:::", res);
          //this.suivi_sgForm.reset();

          this.loadData.loadAllSuiviBloc({code_suivi: add_suivi.code_sv}).then(res_suivi => {
            console.log("Response load Suivi Mep bloc::: ", res_suivi);
            this.isAddSuiviSg = false;
            this.indexRowEditMepSg = null;
            this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
            if (res_suivi.values.length > 0) {
              this.dataSourceMepSg.data.forEach(elem_sg => {
                if (elem_sg.code_culture === row_mep_selected.code_culture) {
                  elem_sg.suivi_Mep = [res_suivi.values[0], ...elem_sg.suivi_Mep];
                }
              });
            }
          });
        });
        break;
      case 'sv-pa':
        this.crudDb.AddSuiviBl(add_suivi).then(res => {
          console.log("Res_ponse Add suivi:::", res);
          //this.suivi_paForm.reset();
          this.loadData.loadAllSuiviBloc({code_suivi: add_suivi.code_sv}).then(res_suivi => {
            console.log("Response load Suivi Mep bloc::: ", res_suivi);
            this.isAddSuiviPa = false;
            this.indexRowEditMepPa = null;
            this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
            if (res_suivi.values.length > 0) {
              this.dataSourceMepPa.data.forEach(elem_pa => {
                if (elem_pa.code_culture === row_mep_selected.code_culture) {
                  elem_pa.suivi_Mep = [res_suivi.values[0], ...elem_pa.suivi_Mep];
                }
              });
            }
          });
        });
        break;
      case 'sv-mv':

        this.crudDb.AddSuiviBl(add_suivi).then(res => {
          console.log("Res_ponse Add suivi:::", res);

          this.loadData.loadAllSuiviBloc({code_suivi: add_suivi.code_sv}).then(res_suivi => {
            console.log("Response load Suivi Mep bloc::: ", res_suivi);
            this.isAddSuiviMv = false;
            this.indexRowEditMepMv = null;
            this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
            if (res_suivi.values.length > 0) {
              this.dataSourceMepMv.data.forEach(elem_mv => {
                if (elem_mv.code_culture === row_mep_selected.code_culture) {
                  elem_mv.suivi_Mep = [res_suivi.values[0], ...elem_mv.suivi_Mep];
                }
              });
            }
          });
        });
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
        this.indexRowEditMepSg = null;
        this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
        break;
      case 'sv-pa':
        this.isAddSuiviPa = false;
        this.indexRowEditMepPa = null;
        this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
        break;
      case 'sv-mv':
        this.isAddSuiviMv = false;
        this.indexRowEditMepMv = null;
        this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
        break;
      default:
        console.log('default Caancel suivi')
        break;
    }
  }
  // Save Edit suivi
  onSaveEditSuivi(_data_: any) {
    let data_row: Loc_sv_bloc = _data_.data;
    let data_update: UpdateSuiviBloc = {
      code_sv: data_row.code_sv,
      id_culture: data_row.id_culture,
      ddp: this.updated_Suivi.ddp,
      stc: this.updated_Suivi.stc != null?this.updated_Suivi.stc.value:null,
      ec: this.updated_Suivi.ec != null?this.updated_Suivi.ec.value:null,
      ql: this.updated_Suivi.ql,
      qr: this.updated_Suivi.qr,
      long_ligne: this.updated_Suivi.long_ligne,
      nbre_ligne: this.updated_Suivi.nbre_ligne,
      nbre_pied: this.updated_Suivi.nbre_pied,
      hauteur: this.updated_Suivi.hauteur,
      dt_creation: moment().format('YYYY-MM-DD'),
      dt_modification: moment().format('YYYY-MM-DD'),
      img_cult: this.updated_Suivi.img_culture,
      dt_capture: null,
      ex: this.updated_Suivi.estimation,
      etat: data_row.etat === SYNC?SYNC:UPDATE
    }
    switch(_data_.src) {
      case 'sv-sg':
        let _data_update_sg = {
          updated: data_update
        }
        this.crudDb.UpdateSuiviBl(_data_update_sg).then(res => {
          console.log("Res_ponse Add suivi:::", res);
          this.isRowSvSgEdit = false;
          this.indexRowEditMepSg = null;
          this.indexSg = null;
          this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
          this.loadData.loadAllSuiviBloc({code_culture: data_update.id_culture}).then(res_suivi => {
            console.log("Response load Suivi Mep bloc::: ", res_suivi);
            if (res_suivi.values.length > 0) {
              this.dataSourceMepSg.data.forEach(elem_sg => {
                if (elem_sg.code_culture === data_update.id_culture) {
                  elem_sg.suivi_Mep = res_suivi.values;
                }
              });
            }
          });      
        });
        
        break;
      case 'sv-pa':
        let _data_update_pa = {
          updated: data_update
        }
        this.crudDb.UpdateSuiviBl(_data_update_pa).then(res => {
          console.log("Res_ponse Add suivi:::", res);
          this.isRowSvPaEdit = false;
          this.indexRowEditMepPa = null;
          this.indexPa = null;
          this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};

          this.loadData.loadAllSuiviBloc({code_culture: data_update.id_culture}).then(res_suivi => {
            console.log("Response load Suivi Mep bloc::: ", res_suivi);
            if (res_suivi.values.length > 0) {
              this.dataSourceMepPa.data.forEach(elem_pa => {
                if (elem_pa.code_culture === data_update.id_culture) {
                  elem_pa.suivi_Mep = res_suivi.values;
                }
              });
            }
          });
        });
        break;
      case 'sv-mv':
        let _data_update_mv = {
          updated: data_update
        }
        this.crudDb.UpdateSuiviBl(_data_update_mv).then(res => {
          console.log("Res_ponse Add suivi:::", res);
          this.isRowSvMvEdit = false;
          this.indexRowEditMepMv = null;
          this.indexMv = null;
          this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
          
          this.loadData.loadAllSuiviBloc({code_culture: data_update.id_culture}).then(res_suivi => {
            console.log("Response load Suivi Mep bloc::: ", res_suivi);
            if (res_suivi.values.length > 0) {
              this.dataSourceMepMv.data.forEach(elem_mv => {
                if (elem_mv.code_culture === data_update.id_culture) {
                  elem_mv.suivi_Mep = res_suivi.values;
                }
              });
            }
          }); 
        });
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
        this.indexRowEditMepSg = null;
        this.indexSg = null;
        this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
        break;
      case 'sv-pa':
        this.isRowSvPaEdit = false;
        this.indexRowEditMepPa = null;
        this.indexPa = null;
        this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
        break;
      case 'sv-mv':
        this.isRowSvMvEdit = false;
        this.indexRowEditMepMv = null;
        this.indexMv = null;
        this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
        break;
      default:
        console.log('default Caancel suivi')
        break;
    }
  }

  /**************************
  * Export Excelle
  **************************/
  onExport(parent: any) {
    switch(parent) {
    case 'mep-sg':
      let export_sg: Loc_export_excel[] = [
        {
          data: this.mep_export_sg,
          name_feuille: 'MEP SG',
          name_file: 'MEP_SG' + '_' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme
        }
      ]
      this.exportExcel.onExport(export_sg);
      break;
    case 'mep-pa':
      let export_pa: Loc_export_excel[] = [
        {
          data: this.mep_export_pa,
          name_feuille: 'MEP PA',
          name_file: 'MEP_PA' + '_' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme
        }
      ]
      this.exportExcel.onExport(export_pa);
      break;
    case 'mep-mv':
      let export_mv: Loc_export_excel[] = [
        {
          data: this.mep_export_mv,
          name_feuille: 'MEP MV',
          name_file: 'MEP_MV' + '_' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme
        }
      ]
      this.exportExcel.onExport(export_mv);
      break;
    case 'sv-sg':
      let export_sv_sg: Loc_export_excel[] = [
        {
          data: this.mep_export_sg,
          name_feuille: 'MEP SG',
          name_file: 'SV_SG' + '_' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme
        },
        {
          data: this.sv_export_sg,
          name_feuille: 'SV SG',
          name_file: 'SV_SG' + '_' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme
        }
      ]
      this.exportExcel.onExport(export_sv_sg);
      break;
    case 'sv-mv':
      let export_sv_mv: Loc_export_excel[] = [
        {
          data: this.mep_export_mv,
          name_feuille: 'MEP MV',
          name_file: 'SV_MV' + '_' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme
        },
        {
          data: this.sv_export_mv,
          name_feuille: 'SV MV',
          name_file: 'SV_MV' + '_' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme
        }
      ]
      this.exportExcel.onExport(export_sv_mv);
      break;
    case 'sv-pa':
      let export_sv_pa: Loc_export_excel[] = [
        {
          data: this.mep_export_pa,
          name_feuille: 'MEP PA',
          name_file: 'SV_PA' + '_' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme
        },
        {
          data: this.sv_export_pa,
          name_feuille: 'SV PA',
          name_file: 'SV_PA' + '_' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme
        }
      ]
      this.exportExcel.onExport(export_sv_pa);
      break;
    }
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
    let annee_ = this.update_mep.annee.annee_du.toString().charAt(2) + this.update_mep.annee.annee_du.toString().charAt(3) + this.update_mep.annee.annee_au.toString().charAt(2) + this.update_mep.annee.annee_au.toString().charAt(3);

    if (this.update_mep.saison != null) {
      return code_mep = this.update_mep.saison.intitule + annee_ + '-' +  this.update_mep.bloc.ordre + this.update_mep.bloc.ancronyme.toUpperCase() + '-' + 'Mep'; 
    } else {
      return code_mep =  this.update_mep.bloc.ordre + this.update_mep.bloc.ancronyme.toUpperCase() + '-' + annee_ + 'Mep'; 
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
      ///this.update_mep = {};

      if (res_modal.data != undefined) {
        let data_modal = res_modal.data;
        if ((data_modal.isAddMepSg != undefined && data_modal.isAddMepSg) || (data_modal.isAddMepPa != undefined && data_modal.isAddMepPa) || (data_modal.isAddMepMv != undefined &&  data_modal.isAddMepMv)) {
          this.update_mep = data_modal.data_;
          this.update_mep.ddp = this.update_mep.ddp != null?data_modal.data_.ddp.format("YYYY-MM-DD"):null;
          this.update_mep.dds = this.update_mep.dds != null?data_modal.data_.dds.format("YYYY-MM-DD"):null;
          this.update_mep.dt_distribution = this.update_mep.dt_distribution != null?data_modal.data_.dt_distribution.format("YYYY-MM-DD"):null;
  
          if ((data_modal.isAddMepSg != undefined && data_modal.isAddMepSg) || (data_modal.isAddMepMv != undefined &&  data_modal.isAddMepMv)) {
            
            if (data_modal.isAddMepMv != undefined &&  data_modal.isAddMepMv) {
              this.isAddMepMv = true;
              console.log('Dismissed Add MV..', data_modal.data_);
            } else if(data_modal.isAddMepSg != undefined && data_modal.isAddMepSg) {
              console.log('Dismissed Add Sg..', data_modal.data_);
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
      //this.update_mep = {};
      if (res_modal.data != undefined) {
        let data_modal: any = res_modal.data;
        this.update_mep = data_modal.data_;
        this.update_mep.ddp = this.update_mep.ddp != null?data_modal.data_.ddp.format("YYYY-MM-DD"):null;
        this.update_mep.dds = this.update_mep.dds != null?data_modal.data_.dds.format("YYYY-MM-DD"):null;
        this.update_mep.dt_distribution = this.update_mep.dt_distribution != null?data_modal.data_.dt_distribution.format("YYYY-MM-DD"):null;

        if ((data_modal.isEditMepSg != undefined && data_modal.isEditMepSg) || (data_modal.isEditMepMv != undefined && data_modal.isEditMepMv) || (data_modal.isEditMepPa != undefined && data_modal.isEditMepPa)) {
          console.log('Dismissed Edit Mep...', this.update_mep);

          if ((data_modal.isEditMepSg != undefined && data_modal.isEditMepSg) ||  (data_modal.isEditMepMv != undefined && data_modal.isEditMepMv)) {
  
            if (data_modal.isEditMepSg != undefined && data_modal.isEditMepSg) {
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

  // modal updated suivi
  async onUpdateSuivi(data: any) {
    let data_: any;
    if (data.action === 'add') {
      if (data.src === 'mep-sg') {
        data_ = {
          isSuiviMepBloc: true,
          isAddSvSg: true,
          data_mep: data.row_mep
        }
      } else if (data.src === 'mep-pa') {
        data_ = {
          isSuiviMepBloc: true,
          isAddSvPa: true,
          data_mep: data.row_mep
        }
      } else if (data.src === 'mep-mv') {
        data_ = {
          isSuiviMepBloc: true,
          isAddSvMv: true,
          data_mep: data.row_mep
        }
      }
    } else if (data.action === 'edit') {
      //let data_ = {src: 'add', data: element, index: i};
      if (data.src === 'mep-sg') {
        data_ = {
          isSuiviMepBloc: true,
          isEditSvSg: true,
          data_mep: data.row_mep,
          data_elem_suivi: data.row_suivi
        }
      } else if (data.src === 'mep-pa') {
        data_ = {
          isSuiviMepBloc: true,
          isEditSvPa: true,
          data_mep: data.row_mep,
          data_elem_suivi: data.row_suivi
        }
      } else if (data.src === 'mep-mv') {
        data_ = {
          isSuiviMepBloc: true,
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
              this.isAddSuiviSg = true;
              this.indexRowEditMepSg = data.index_mep;
              break;
            case 'mep-pa':
              this.isAddSuiviPa = true;
              this.indexRowEditMepPa = data.index_mep;
              break;
            case 'mep-mv':
              this.isAddSuiviMv = true;
              this.indexRowEditMepMv = data.index_mep;
              break;
            default:
              console.log("default");
              break;
          }
        } else if (data.action === 'edit') {
          //let data_ = {src: 'add', data: element, index: i};
          switch(data.src) {
            case 'mep-sg':
              this.isRowSvSgEdit = true;
              this.indexRowEditMepSg = data.index_mep;
              this.indexSg = data.index_mep_suivi;
              break;
            case 'mep-pa':
              this.isRowSvPaEdit = true;
              this.indexRowEditMepPa = data.index_mep;
              this.indexPa = data.index_mep_suivi;
              break;
            case 'mep-mv':
              this.isRowSvMvEdit = true;
              this.indexRowEditMepMv = data.index_mep;
              this.indexMv = data.index_mep_suivi;
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

  initAction() {
    if (this.isUpdated) {
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
      this.update_mep = <update_Mep_form>{};
      //this.update_mep = null;
    }
    // init Suivi semences en grains
    if (this.isAddSuiviSg) {
      this.isAddSuiviSg = false;
      this.indexRowEditMepSg = null;
      this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
    }
    if (this.isRowSvSgEdit) {
      this.isRowSvSgEdit = false;
      this.indexRowEditMepSg = null;
      this.indexMv = null;
      this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
    }
    
    // init  Suivi plants d'arbres
    if (this.isAddSuiviPa) {
      this.isAddSuiviPa = false;
      this.indexRowEditMepPa = null;
      this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
    }
    if (this.isRowSvPaEdit) {
      this.isRowSvPaEdit = false;
      this.indexRowEditMepPa = null;
      this.indexPa = null;
      this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
    }

    // init Suivi Materials cultures
    if (this.isAddSuiviMv) {
      this.isAddSuiviMv = false;
      this.indexRowEditMepMv = null;
      this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
    }
    if (this.isRowSvMvEdit) {
      this.isRowSvMvEdit = false;
      this.indexRowEditMepMv = null;
      this.indexMv = null;
      this.updated_Suivi = <Update_FormModal_Suivi_Mep_Bloc>{};
    }
  }

  // refresh data source
  refreshDataSource() {
    this.src_MepMv = [];
    this.src_MepPa = [];
    this.src_MepSg = [];
    if (this.data_Mep.length > 0) {
      this.data_Mep.forEach(item_mep => {
        if (this.data_all_suivi_mep.length > 0) {
          item_mep.suivi_Mep = this.data_all_suivi_mep.filter(item_suivi => {return item_suivi.id_culture === item_mep.code_culture});
        } else item_mep.suivi_Mep = [];
      });
    }
    this.src_MepSg = this.data_Mep.length > 0? this.data_Mep.filter(item => {return item.type === SG}):[];
    this.src_MepPa = this.data_Mep.length > 0? this.data_Mep.filter(item => {return item.type === PA}):[];
    this.src_MepMv = this.data_Mep.length > 0? this.data_Mep.filter(item => {return item.type === MV}):[];
    this.dataSourceMepSg.data = this.src_MepSg;
    this.dataSourceMepPa.data = this.src_MepPa;
    this.dataSourceMepMv.data = this.src_MepMv;
    console.log("Data MV::::", this.src_MepMv);
    console.log("Data PA::::", this.src_MepPa);
    console.log("Data SG::::", this.src_MepSg);
    console.log("::::Data Mep With element:::", this.data_Mep);
    console.log("::::Data SUIVI data_all_suivi_mep With element:::", this.data_all_suivi_mep);
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

  // Toggel Rows
  toggleTableRows(src:any) {
    switch(src.src) {
      case 'mep-sg':
        this.isTableSgExpanded = !this.isTableSgExpanded;
        this.dataSourceMepSg.data.forEach((row: Loc_mep_bloc) => {
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
        this.dataSourceMepPa.data.forEach((row: Loc_mep_bloc) => {
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
        this.dataSourceMepMv.data.forEach((row: Loc_mep_bloc) => {
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

  loadAnneeAgricole() {
    this.loadData.loadAnneeAgricole().then(res => {
      this.data_annee_agricole = res.values;
    });
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
function data_sg(data_sg: { type: string; id_bloc: string; id_saison: string; annee_du: number; }) {
  throw new Error('Function not implemented.');
}

