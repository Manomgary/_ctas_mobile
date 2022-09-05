import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { UpdateBenef, UpdatedBenefBloc, UpdateParceBloc } from 'src/app/interfaces/interface-insertDb';
import { Local_benef_activ_bl, Local_bloc_parce, Local_bloc_zone, Loc_activ_projet, Loc_Bloc, Loc_Collabo_Activite, Loc_Commune, Loc_district, Loc_Fokontany, Loc_region, Update_infos_benef } from 'src/app/interfaces/interfaces-local';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalPrPage } from '../modals/modal-pr/modal-pr.page';

import * as _moment from 'moment';
import { ACTIVE, ISSYNC, SYNC, UPDATE, VALIDE} from 'src/app/utils/global-variables';



const moment = _moment;

interface Update_Parce_bl {
  bloc: Loc_Bloc,
  ref_gps: string,
  latitude: number,
  longitude: number,
  superficie: number,
  region: Loc_region,
  district: Loc_district,
  commune: Loc_Commune,
  fokontany: Loc_Fokontany,
  village: string,
  indication: string
}

@Component({
  selector: 'app-beneficiaire-bloc',
  templateUrl: './beneficiaire-bloc.page.html',
  styleUrls: ['./beneficiaire-bloc.page.scss'],
  animations: [ //utiliser pour @detailExpand (table expendable)
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class BeneficiaireBlocPage implements OnInit {
  private isRouterActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isCommuneLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private data_bloc: Loc_Bloc[] = [];
  private data_benef: Local_benef_activ_bl[] = [];

  private update_benef: Update_infos_benef = {
    img_pr: null,
    nom: null,
    prenom: null,
    surnom: null,
    sexe: null,
    dt_naissance: null,
    dt_naissance_vers: null,
    cin: null,
    img_cin_1: null,
    img_cin_2: null,
    dt_delivrance: null,
    lieu_delivrance: null,
    code_achat: null,
    contact: null,
    region: null,
    district: null,
    commune: null,
    fokontany: null,
    village: null,
    association: null,
    collaborateur: null,
    bloc: null
  };

  // Displayed Column
  displayedColumns: string[] = ['code_bloc', 'nom_bloc', 'nom_com', 'nb_fkt_concerner'];
  displayedColumnsZone: string[] = ['code_bloc', 'nom_bloc', 'commune', 'fkt', 'km_responsable'];
  displayedColumnsBenef: string[] = ['nom_bloc', 'code_benef_bl', 'code_achat', 'nom', 'sexe', 'dt_nais', 'cin', 'nom_com', 'nom_fkt', 'nb_parcelle', 'sum_superficie', 'action'];
  displayedColumnsAddBenef: string[] = ['new_nom_bloc', 'new_code_benef_bl', 'new_code_achat', 'new_nom', 'new_sexe', 'new_dt_nais', 'new_cin', 'new_nom_com', 'new_nom_fkt', 'new_nb_parcelle', 'new_sum_superficie', 'new_action'];
  displayedColumnsParceBenef: string[] = ['code_parce', 'ref_gps', 'lat', 'log', 'superficie', 'commune', 'fokontany', 'indication', 'action'];
  displayedColumnsAddParceBenef: string[] = ['new_code_parce', 'new_ref_gps', 'new_lat', 'new_log', 'new_superficie', 'new_commune', 'new_fokontany', 'new_indication', 'new_action'];
  displayedColumnsParcelle: string[] = ['id_parce', 'nom_bloc', 'code_benef_bl', 'nom', 'km_responsable', 'fokontany', 'lat', 'log', 'superficie', 'nb_culture'];

  // Data Source
  dataSource = new MatTableDataSource<Loc_Bloc>();
  dataSourceZone = new MatTableDataSource<Local_bloc_zone>();
  dataSourceBenef = new MatTableDataSource<Local_benef_activ_bl>();
  dataSourceParcelle = new MatTableDataSource<Local_bloc_parce>();
  dataSourceParceBenef = new MatTableDataSource<Local_bloc_parce>();
  filterDataBloc: any[] = [];

  region: any;
  district: any;
  isClickedBloc: boolean = false;
  isClickedBenef: boolean = false;
  selectedBloc: string;
  user: Utilisateurs[];
  data_bloc_zone: Local_bloc_zone[] = [];
  data_bloc_parce: Local_bloc_parce[] = [];
  projet: any;
  activite: Loc_activ_projet;

  data_region: Loc_region[] = [];
  data_district: Loc_district[] = [];
  data_commune: Loc_Commune[] = [];
  data_fokontany: Loc_Fokontany[] = [];

  data_collaborateur: Loc_Collabo_Activite[] = [];

  private update_parce: Update_Parce_bl = <Update_Parce_bl>{};

  isUpdate: boolean = false;
  isAddBenef: boolean = false;
  isEditRowBenef: boolean = false;

  indexEditRowBenef: number;

  isAddParce: boolean = false;
  isRowEditParce: boolean = false;
  indexEditRowparce: number;

  isTableBenefExpanded = false;

  // Bloc Paginator
  @ViewChild('blocPaginator') blocPaginator: MatPaginator;
  @ViewChild('blocSort') blocSort: MatSort;

  // Beneficiaire Paginator
  @ViewChild('benefPaginator') benefPaginator: MatPaginator;
  @ViewChild('benefSort') benefSort: MatSort;

  // Parcelle Paginator
  @ViewChild('parcellePaginator') parcellePaginator: MatPaginator;
  @ViewChild('parcelleSort') parcelleSort: MatSort;

  constructor(private router: Router, 
              private loadData: LoadDataService,
              private loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              private crudDb: CrudDbService) { 
    if (this.router.getCurrentNavigation().extras.state) {
      let data: any;
      const routeState = this.router.getCurrentNavigation().extras.state;
      console.log(routeState);
      data = JSON.parse(routeState.zone);
      this.projet = JSON.parse(routeState.projet);
      this.user = JSON.parse(routeState.user);
      this.activite = routeState.activite;
      console.log("Beneficiaire Bloc =====>");
      console.log(data);
      this.region = data.data.region;
      this.district = data.data.district;


      console.log(this.region);
      console.log(this.district);

      this.isRouterActive.next(true);
      /**
      * {code_dist: 'D01', nom_dist: 'Ambovombe-Androy', id_reg: 'R01'}
      */
      //{"code_proj":"P02","nom":"AFAFI SUD Lot 1","description":"null","logo":"null","statuts":"activer"}
    }
    this.isRouterActive.subscribe(isActive => {
      if (isActive) {
        console.log("Constructeur Beneficiaire Active router");
        if (!this.isCommuneLoaded.value) {
          console.log(this.isCommuneLoaded.value);
          this.loadCommuneBloc();
        }
        this.isRouterActive.next(false);
      }
    });
  }

  ngOnInit() {
    console.log(":::Ng oninit::Data beneficiaire avec parcelle", this.data_benef);
    this.loadZone();
    this.loadCollaborateur();
  }

  ngAfterViewInit() {
    /**this.blocSort.disableClear = true;
    this.dataSource.paginator = this.blocPaginator;
    this.dataSource.sort = this.blocSort;

    this.benefSort.disableClear = true;
    this.dataSourceBenef.paginator = this.benefPaginator;
    this.dataSourceBenef.sort = this.benefSort;

    this.parcelleSort.disableClear = true;
    this.dataSourceParcelle.paginator = this.parcellePaginator;
    this.dataSourceParcelle.sort = this.parcelleSort;*/
  }

  loadCommuneBloc(){  
    let commune: Loc_Commune[] = [];
    let code_equipe: number;
    this.data_bloc = [];

    console.log(this.district);
    let id_dist = {
      code_dist: this.district.code_dist
    };
    this.loadData.loadCommune(id_dist).then(res_com => {
      console.log(res_com);
      res_com.values.forEach(elem_val => {
        commune.push(elem_val);
      });

      console.log(commune);
      if (commune.length > 0) {
        // Loop commune district
        commune.forEach((elem_com, i) => {
          // loop user "Code equipe"
          this.user.forEach((elem_user, ind) => {
            console.log("********ELEMENT USER BENEFICIAIRE BLOC PAGE*************");
            console.log(elem_user);
            if ((this.user.length - 1) ===ind) {
              code_equipe = elem_user.id_equipe;
            }
          });
          const data = {
            code_com: elem_com.code_com,
            code_projet: this.projet.code_proj,
            id_tech: code_equipe
          }
          //load Bloc par zone et par equipe
          this.loadData.loadBlocEquipeZone(data).then(res_bloc => {
            console.log(res_bloc);
            if (res_bloc.values.length > 0) {
              res_bloc.values.forEach(elem_bloc => {
                this.data_bloc.push(elem_bloc);
                this.filterDataBloc.push(elem_bloc.nom_bloc);
              });
              this.dataSource.data = this.data_bloc;
              this.dataSourceParcelle.data = this.data_bloc_parce;
            } else {
              console.log("Aucune Bloc Disponible dans le Commune: ");
              console.log(data);
            }
            // Fin du boucle
            if ((commune.length - 1) === i) {
              console.log("Fin du bloc");
              this.loadBenefBloc();
            }
          });
        });
      }
    });
  }

  loadBenefBloc() {
    if (this.data_bloc.length > 0) {
      this.data_benef = [];
      this.data_bloc_parce = [];
      this.data_bloc.forEach((elem_bloc, ind_bloc) => {
        let code_bloc = {
          code_bloc: elem_bloc.code_bloc
        }
        this.loadData.loadBlocParce(code_bloc).then(parce_bloc => {
          console.log(parce_bloc);
          if (parce_bloc.values.length > 0) {
            parce_bloc.values.forEach(elem_blparc => {
              console.log(elem_blparc);
              elem_blparc.parcelle = [];
              this.data_bloc_parce.push(elem_blparc);
            });
          }
        });
        this.loadData.loadBenefBloc({code_bloc: elem_bloc.code_bloc}).then(res_benef => {
          console.log(res_benef);
          res_benef.values.forEach(elem_benef => {
            this.data_benef.push(elem_benef);
          });
          if ((this.data_bloc.length - 1) === ind_bloc) {
            if (this.data_benef.length > 0) {
              this.data_benef.forEach(item_bnf => {
                item_bnf.parcelle = this.data_bloc_parce.filter(elem_parce => {return elem_parce.code_benef_bl === item_bnf.code_benef_bl});
              });
              console.log(":::Data beneficiaire avec parcelle", this.data_benef);
            }
          }
        });
      });
    }
  }

  applyFilterSelect(value: any, table: string) {
    console.log("Selected filter " + value + " " + table);
    this.isClickedBloc = false;
    if (value != undefined) {
      const filterValue = value;
      if (table === 'bloc') {
        this.dataSource.filter = filterValue.trim();
      } else if(table === 'beneficiaire') {
        this.dataSourceBenef.filter = filterValue.trim();
      } else if (table === 'parcelle') {
        this.dataSourceParcelle.filter = filterValue.trim();
      }
    }
  }
  applyFilterTout(table: string) {
    console.log("apply filter");
    this.isClickedBloc = false;
    if (table === 'bloc') {
      this.dataSource.filter = '';
      this.dataSource.data =  this.data_bloc;
    } else if (table === 'beneficiaire') {
      this.dataSourceBenef.filter = '';
      this.dataSourceBenef.data =  this.data_benef;      
    } else if (table === 'parcelle') {
      this.dataSourceParcelle.filter = '';
      this.dataSourceParcelle.data = this.data_bloc_parce;
    }
      this.selectedBloc = '';
  }

  onExport() {

  }
  
  onFinish() {
    this.resfreshTb();
    this.isUpdate = false;
    this.isAddBenef = false;
    this.isEditRowBenef = false;
    this.indexEditRowBenef = null;
    this.update_benef = <Update_infos_benef>{};
    //Parce
    this.isAddParce = false;
    this.indexEditRowparce = null;
    this.isRowEditParce = false;
  }

  onUpdate() {
    this.isUpdate = true;
  }

  // save pms
  onCancelAddBenef(data: any) {
    if (data.src === 'add') {
      this.isAddBenef = false;
      this.update_benef = <Update_infos_benef>{};
    } else if (data.src === 'edit') {
      this.isEditRowBenef = false;
      this.update_benef = <Update_infos_benef>{};
      this.indexEditRowBenef = null;
    }
  }
  onSaveAddBenef(data: any) {
    let img_cin: string[] = [];
    if (this.update_benef.img_cin_1.data != null) {
      img_cin.push(this.update_benef.img_cin_1.data);
    } 
    
    if (this.update_benef.img_cin_2.data != null) {
      img_cin.push(this.update_benef.img_cin_2.data);
    }
    let data_to_add: UpdateBenef = {
      code_benef: null,
      img_benef: this.update_benef.img_pr != null? this.update_benef.img_pr.data: null,
      nom: this.update_benef.nom,
      prenom: this.update_benef.prenom,
      sexe: this.update_benef.sexe,             
      dt_nais: this.update_benef.dt_naissance,
      dt_nais_vers: this.update_benef.dt_naissance_vers,
      surnom: this.update_benef.surnom,
      cin: this.update_benef.cin,
      dt_delivrance: this.update_benef.dt_delivrance,
      lieu_delivrance: this.update_benef.lieu_delivrance,
      img_cin:  img_cin.length > 0? JSON.stringify(img_cin.join("-")):null,
      contact: this.update_benef.contact,
      id_fkt: this.update_benef.fokontany != null?this.update_benef.fokontany.code_fkt:null,
      id_commune: this.update_benef.village != null?this.update_benef.commune.code_com: null,
      village: this.update_benef.village,
      dt_Insert: null,
      etat: null,
      statut: null
    };
    let add_benef_bloc: UpdatedBenefBloc = {
      code_benef_bl: null,
      code_benef_bl_temp: null,
      id_proj: this.projet.code_proj,
      id_activ: this.activite.id_activ,
      id_benef: null,
      id_bloc: this.update_benef.bloc != null?this.update_benef.bloc.code_bloc:null,
      code_achat: this.update_benef.code_achat,
      id_collaborateur: this.update_benef.collaborateur != null?this.update_benef.collaborateur.id_col:null,
      etat: null,
      status: null
    }
    if (data.src === 'add') {
      let code_benef: string = 'B' + '-' + this.user[this.user.length - 1].id_equipe + '-' + moment().format('YYYYMMDD-HHmmss');
      let order_benef: number = 0;

      data_to_add.code_benef = code_benef;
      data_to_add.dt_Insert = moment().format("YYYY-MM-DD");
      data_to_add.etat = SYNC;
      data_to_add.statut = ACTIVE;

      this.loadData.loadBenefBloc({code_bloc: this.update_benef.bloc.code_bloc}).then(res_benef => {
        order_benef = res_benef.values.length + 1;
        console.log("code temporaire de beneficiaire:::", order_benef);
      });

      this.crudDb.AddBenef_(data_to_add).then(res_benef_info => {
        let code_benef_bl: string = 'B' + '-' + this.update_benef.bloc.ordre + this.update_benef.bloc.ancronyme + '-' + moment().format('YYYYMMDD-HHmmss');
        let code_benef_bl_temp: string = 'B' + '-' + this.update_benef.bloc.ordre + this.update_benef.bloc.ancronyme + '-' + order_benef;
        add_benef_bloc.code_benef_bl = code_benef_bl;
        add_benef_bloc.code_benef_bl_temp = code_benef_bl_temp;
        add_benef_bloc.id_benef = code_benef;
        add_benef_bloc.etat = SYNC;
        add_benef_bloc.status = ACTIVE;
        console.log(":::::Benef bloc ToAdd Data:::", add_benef_bloc);
        this.crudDb.AddBenefBl(add_benef_bloc).then(insert_benef => {
          this.loadData.loadBenefBloc({code_benef: add_benef_bloc.code_benef_bl}).then(res_benef_bl => {
            if (res_benef_bl.values.length > 0) {
              res_benef_bl.values[0].parcelle = [];
              this.dataSourceBenef.data = [res_benef_bl.values[0], ...this.dataSourceBenef.data];
            }
          });
          console.log("Benef Added");
          this.isAddBenef = false;
          this.update_benef = <Update_infos_benef>{};
        });
      });
    } else if (data.src === 'edit') {
      console.log("Edit info benef:::", data_to_add);
      console.log("Edit Activiter:::", add_benef_bloc);
      let elem_benef: Local_benef_activ_bl = data.elem_benef;
      data_to_add.code_benef = elem_benef.code_benef;
      data_to_add.etat = elem_benef.etat_bnf === SYNC?SYNC:UPDATE;
      data_to_add.statut = ACTIVE;
      this.crudDb.UpdateBenef(data_to_add).then(res_benef_info => {
        add_benef_bloc.code_benef_bl = elem_benef.code_benef_bl;
        add_benef_bloc.code_benef_bl_temp = elem_benef.code_benef_bl_temp;
        add_benef_bloc.id_benef = elem_benef.id_benef;
        add_benef_bloc.etat = elem_benef.etat === SYNC?SYNC:UPDATE;
        add_benef_bloc.status = ACTIVE;
        let update_data = {
          isUpdateBenefBloc: true,
          data_benef_bl: add_benef_bloc
        }
        this.crudDb.UpdateBenefBl(update_data).then(up_benef_bl => {
          this.resfreshTb();
          this.isEditRowBenef = false;
          this.update_benef = <Update_infos_benef>{};
          this.indexEditRowBenef = null;
        });
      });
    }
  }
  /*******************
   * Save parce
   *****************/
   onCancelParce(data: any) {
    if (data.src === 'add') {
      this.isAddParce = false;
      this.indexEditRowBenef = null;
    } else if (data.src === 'edit') {
      this.indexEditRowparce = null;
      this.indexEditRowBenef = null;
      this.isRowEditParce = false;
    }
  }
  onSaveParce(data: any) {
    let element_bnf: Local_benef_activ_bl = data.elem_benef;
    let order_parce_bl: number;
    console.log(":::DATA Parce:::", this.update_parce);

    let add_parce: UpdateParceBloc = {
      code_parce: null,
      code_parce_temp: null,
      id_bloc: this.update_parce.bloc != null?this.update_parce.bloc.code_bloc:null,
      id_benef: element_bnf.id_benef,
      ref_gps: this.update_parce.ref_gps,
      lat: this.update_parce.latitude,
      log: this.update_parce.longitude,
      superficie: this.update_parce.superficie,
      id_fkt: this.update_parce.fokontany != null?this.update_parce.fokontany.code_fkt:null,
      id_commune: this.update_parce.village != null && this.update_parce.fokontany == null?this.update_parce.commune.code_com:null,
      village: this.update_parce.village,
      anne_adheran: null,
      indication: this.update_parce.indication,
      etat: null,
      status: null
    }
    /**let code_bloc = {
      code_bloc: this.update_parce.bloc != null?this.update_parce.bloc.code_bloc:null
    }
    this.loadData.loadBlocParce(code_bloc).then(parce_bloc => {
      console.log(parce_bloc);
      if (parce_bloc.values.length > 0) {
        parce_bloc.values.forEach(elem_blparc => {
          console.log(elem_blparc);
          elem_blparc.parcelle = [];
          this.data_bloc_parce.push(elem_blparc);
        });
      }
    });*/
    if (data.src === 'add') {
      let code_parce: string = this.update_parce.bloc.ordre + this.update_parce.bloc.ancronyme + '-' + moment().format('YYYYMMDD-HHmmss');
      add_parce.code_parce = code_parce;
      add_parce.code_parce_temp = null;// A refaire
      add_parce.etat = SYNC;
      add_parce.status = ACTIVE,
      this.crudDb.AddParceBloc(add_parce).then(res_ => {
        console.log("::::Parcelle Added:::", res_);
        this.loadData.loadBlocParce({code_benef_bl: element_bnf.code_benef_bl}).then(parce_bloc => {
          console.log(parce_bloc);
          if (parce_bloc.values.length > 0) {
            this.dataSourceBenef.data.forEach(src_bnf => {
              if (src_bnf.code_benef_bl === element_bnf.code_benef_bl) {
                src_bnf.parcelle = parce_bloc.values;
              }
            });
          }
        });
      });
      this.isAddParce = false;
      this.indexEditRowBenef = null;
    } else if (data.src === 'edit') {
      /**
       * Edit
       */
      let elem_parce_bl: Local_bloc_parce = data.elem_parce;
      add_parce.code_parce = elem_parce_bl.code_parce;
      add_parce.code_parce_temp = null;// A refaire
      add_parce.etat = elem_parce_bl.etat === SYNC?SYNC:UPDATE;
      add_parce.status = ACTIVE;
      let data_update = {
        isUpdateParceBl: true,
        data_parce_bl: add_parce
      }
      this.crudDb.UpdateParceBl(data_update).then(res => {
        this.loadData.loadBlocParce({code_benef_bl: element_bnf.code_benef_bl}).then(parce_bloc => {
          console.log(parce_bloc);
          if (parce_bloc.values.length > 0) {
            this.dataSourceBenef.data.forEach(src_bnf => {
              if (src_bnf.code_benef_bl === element_bnf.code_benef_bl) {
                src_bnf.parcelle = parce_bloc.values;
              }
            });
          }
          this.indexEditRowparce = null;
          this.indexEditRowBenef = null;
          this.isRowEditParce = false;
        });
      });
    }
  }

  async resfreshTb() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.loadBenefBloc();
    setTimeout(() => {
      this.dataSourceBenef.data = this.data_benef;
      this.loadingCtrl.dismiss();
    }, 500);
  }
  async onUpdatedParce(data: any) {
    //{src: 'add', data_pr: element, index_: i}
    let data_: any;
    if (data.src === 'add') {
      data_ = {
        isParceBl: true,
        isAddCep: true,
        zone: {
          region: this.data_region,
          district: this.data_district,
          commune: this.data_commune,
          fokontany: this.data_fokontany
        },
        bloc: this.data_bloc,
        elem_benef: data.data_benef
      }
    } else if (data.src === 'edit') {
      //{src: 'edit', data_benef: element, data_parce: row, index_parce: inde, index_benef: i}
      data_ = {
        isParceBl: true,
        isEditCep: true,
        zone: {
          region: this.data_region,
          district: this.data_district,
          commune: this.data_commune,
          fokontany: this.data_fokontany
        },
        bloc: this.data_bloc,
        elem_benef: data.data_benef,
        elem_parce: data.data_parce
      }
    }
    let modal = await this.modalCtrl.create({
      component: ModalPrPage,
      cssClass: 'modal-custum-pr-cep',
      backdropDismiss: true,
      componentProps: data_
    });
    modal.onDidDismiss().then(modal_data => {
      console.log("::::Data Parce Dismissed:::", modal_data.data);
      if (modal_data.data != undefined) {
        this.update_parce = modal_data.data;
        if (data.src === 'add') {
          this.isAddParce = true;
          this.indexEditRowBenef = data.index_;
        } else if (data.src === 'edit') {
          this.indexEditRowparce = data.index_parce;
          this.indexEditRowBenef = data.index_benef;
          this.isRowEditParce = true;
        }
      }
    });
    await modal.present();
  }

  async onUpdateBenef(data: any) {
    let data_: any;
    if (data.src === 'add') {
      data_ = {
        isBenefBloc: true,
        isAdd: true,
        zone: {
          region: this.data_region,
          district: this.data_district,
          commune: this.data_commune,
          fokontany: this.data_fokontany
        },
        bloc: this.data_bloc,
        collaborateur: this.data_collaborateur
      }
    } else if (data.src === 'edit') {
      data_ = { 
        isBenefBloc: true,
        isEdit: true,
        zone: {
          region: this.data_region,
          district: this.data_district,
          commune: this.data_commune,
          fokontany: this.data_fokontany
        },
        bloc: this.data_bloc,
        collaborateur: this.data_collaborateur,
        element: data.element
      }
    }
    let modal = await this.modalCtrl.create({
      component: ModalPrPage,
      cssClass: 'modal-custum-pms',
      backdropDismiss: true,
      componentProps: data_
    });
    modal.onDidDismiss().then(data_modal => {
      console.log("Modal Dismissed!!");
      if (data_modal.data != undefined) {
        console.log("Modal Data with data", data_modal.data);
        this.update_benef = data_modal.data;
        this.update_benef.dt_naissance = data_modal.data.dt_naissance != null? data_modal.data.dt_naissance.format("YYYY-MM-DD"): data_modal.data.dt_naissance;
        this.update_benef.dt_delivrance = data_modal.data.dt_delivrance != null? data_modal.data.dt_delivrance.format("YYYY-MM-DD"): data_modal.data.dt_delivrance;
        
        if (data.src === 'add') {
          this.isAddBenef = true;
        } else if (data.src === 'edit') {
          this.isEditRowBenef = true;
          this.indexEditRowBenef = data.ind_benef;
        }
      }
    });
    await modal.present();
  }

  // loadZone
  loadZone() {
    this.loadData.loadRegion().subscribe(res => {
      if (res.length > 0) {
        res.forEach(item => {
          this.data_region.push(item);
        });
      }
    });
    this.loadData.loadAllDistrict().then(res => {
      let dist: Loc_district[] = res.values;
      if (dist.length > 0) {
        dist.forEach(item => {
          this.data_district.push(item);
        });
      }
    });
    this.loadData.loadCommune({}).then(res => {
      let commune: Loc_Commune[] = res.values;
      if (commune.length > 0) {
        commune.forEach(item => {
          this.data_commune.push(item);
        });
      }
    });
    this.loadData.loadFokontany({}).then(res => {
      let fkt: Loc_Fokontany[] = res.values;
      if (fkt.length > 0) {
        fkt.forEach(elem => {
          this.data_fokontany.push(elem);
        });
      }
    });
  }

  // load Collabvorateur
  loadCollaborateur() {
    console.log(":::::activite::::", this.activite);
    this.loadData.loadCollaborateursActivite(this.activite.id_activ).then(res => {
      this.data_collaborateur = res.values;
    });
  }

  onRowClickedBloc(data: any) {
    this.isClickedBloc = true;
    this.data_bloc_zone = [];
    console.log(data);
    this.loadData.loadBlocZone(data.code_bloc).then(res_val => {
      console.log(res_val);
      if (res_val.values.length > 0) {
        res_val.values.forEach(elem_bloc_zone => {
          this.data_bloc_zone.push(elem_bloc_zone);
        });
        this.dataSourceZone.data = this.data_bloc_zone;
        console.log(this.dataSourceZone.data);
        console.log(this.data_bloc_zone);
      }
    });
  }

  onRowBenefClicked(data: any) {
    console.log(data);
    let data_bloc_parce_benef: Local_bloc_parce[] = [];
    let code_benef = {
      code_benef_bl: data.code_benef_bl
    }
    this.isClickedBenef = true;
    this.loadData.loadBlocParce(code_benef).then(parce_benef => {
      console.log(parce_benef);
      if (parce_benef.values.length > 0) {
        parce_benef.values.forEach(elem_blparc => {
          console.log(elem_blparc);
          data_bloc_parce_benef.push(elem_blparc);
        });
        this.dataSourceParceBenef.data = data_bloc_parce_benef;
      } else this.dataSourceParceBenef.data = data_bloc_parce_benef;
    });
  }

  onClose() {
    if (this.isClickedBloc) {
      this.isClickedBloc = false;
    }

    if (this.isClickedBenef) {
      this.isClickedBenef = false;
    }
  }

  onToggleTableRows(data: any) {
    if (data === 'beneficiaire') {
      this.isTableBenefExpanded = !this.isTableBenefExpanded;
      this.dataSourceBenef.data.forEach(row => {
        if (row.parcelle.length > 0) {
          row.isExpanded = this.isTableBenefExpanded;
        } else {
          if (row.isExpanded) {
            row.isExpanded = false;
          }
        }
      });
    }
  }

  selectMatTab(index: number) {
    console.log("index Mat-Tab Selected : " + index);
    this.initData();
    if (index == 0) {
      this.dataSource.filter = '';
      this.dataSource.data = this.data_bloc;
    } else if (index == 1) { 
      setTimeout(async () => {
        const loading = await this.loadingCtrl.create();
        await loading.present();
        this.dataSourceBenef.filter = ''; 
        this.dataSourceBenef.data = this.data_benef;
        this.loadingCtrl.dismiss();
      }, 500);
    } else if(index == 2) {
      this.dataSourceParcelle.filter = '';
      this.dataSourceParcelle.data = this.data_bloc_parce;
    }
  }

  initData() {
    this.isClickedBloc = false;
    this.isClickedBenef = false;
    this.data_bloc_zone = [];
    this.selectedBloc = '';
  }

}
