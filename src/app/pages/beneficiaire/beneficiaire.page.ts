import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, Output, EventEmitter, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// Imports 
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Loc_association, Benef_activ_pms, Local_Parcelle, Loc_projet, Loc_district, Loc_Commune, Loc_Fokontany, Loc_region, Update_infos_benef, Loc_activ_projet, Loc_Collabo_Activite } from 'src/app/interfaces/interfaces-local';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { SharedService } from 'src/app/services/shared.service';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalPage } from '../modal/modal.page';
import { ModalPrPage } from '../modals/modal-pr/modal-pr.page';

import * as _moment from 'moment';
import { ACTIVE, SYNC} from 'src/app/utils/global-variables';
import { UpdateBenef, UpdatedBenefActivPms } from 'src/app/interfaces/interface-insertDb';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
const moment = _moment;

export interface UserData {
  id: string;
  nom: string;
  fokontany: string;
}

@Component({
  selector: 'app-beneficiaire',
  templateUrl: './beneficiaire.page.html',
  styleUrls: ['./beneficiaire.page.scss'],
  animations: [ //utiliser pour @detailExpand (table expendable)
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class BeneficiairePage implements OnInit, AfterViewInit, OnDestroy {

  displayedColumnsBenef: string[] = ['association', 'fokontany', 'code_pms', 'code_ahat', 'pms', 'sexe', 'age', 'cin', 'village', 'collaborateur', 'action'];
  displayedColumnsAddBenef: string[] = ['new_association', 'new_fokontany', 'new_code_pms', 'new_code_ahat', 'new_pms', 'new_sexe', 'new_age', 'new_cin', 'new_village', 'new_collaborateur', 'new_action'];
  displayedColumns: string[] = ['fokontany', 'association', 'nb_pms', 'code_benef', 'pa', 'sexe', 'cin', 'surnom', 'technicien'];
  displayedColumnsParce: string[] = ['code_parce', 'code_pms', 'code_ahat', 'nom', 'ref_gps', 'lat', 'log', 'superficie', 'nb_cultures', 'cultures'];
  displayedColumnsParcePms: string[] = ['code_parce', 'ref_gps', 'lat', 'log', 'superficie', 'action'];

  filterDataAssoc: string[] = [];
  filterData: Loc_association[] = [];
  filterDataParce: Local_Parcelle[] = [];
  data_pms: Benef_activ_pms[] = [];
  parcelle_pms: Local_Parcelle[] = [];
  nb_parce_ass_filter: number = 0;
  association: Loc_association[] = []; 
  expandedElement: Benef_activ_pms | null;
  selectedAssoc: string;
  selectedAssocPms: string;
  selectedAssocParce: string;
  isFiltered: boolean = false;
  dataSource = new MatTableDataSource<Loc_association>();
  dataSourceBenef = new MatTableDataSource<Benef_activ_pms>();
  dataSourceParce = new MatTableDataSource<Local_Parcelle>(); 

  private update_pms: Update_infos_benef = {
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
    collaborateur: null
  };

  isUpdate: boolean = false;
  isAddPms: boolean = false;
  isEditRowPms: boolean = false;

  indexEditRowPms: number;
  isTablePRExpanded: boolean = false;

  data_region: Loc_region[] = [];
  data_district: Loc_district[] = [];
  data_commune: Loc_Commune[] = [];
  data_fokontany: Loc_Fokontany[] = [];

  data_collaborateur: Loc_Collabo_Activite[] = [];

  // Association Paginator
  @ViewChild('assocPaginator') assocPaginator: MatPaginator;
  @ViewChild('assocSort') assocSort: MatSort;

  // Beneficiaire pms Paginator
  @ViewChild('benfPaginator') benfPaginator: MatPaginator;
  @ViewChild('benefSort') benefSort: MatSort;

  // Parcelle pms
  @ViewChild('parcePaginator') parcePaginator: MatPaginator;
  @ViewChild('parceSort') parceSort: MatSort;

  @Output('zone_benef') zone: EventEmitter<any> = new EventEmitter();

  region: any;
  district: any;
  commune: any;
  projet: Loc_projet;
  user: Utilisateurs[];
  activite: Loc_activ_projet;
  isRouterActive: boolean = false;

  constructor(
              public modalCtrl: ModalController, 
              private router: Router, 
              private loadData: LoadDataService,
              private loadingCtrl: LoadingController,
              private route: ActivatedRoute,
              private sharedService: SharedService,
              private crudService: CrudDbService) {
    this.loading();
    const routeState = this.router.getCurrentNavigation().extras.state;
    console.log(":::::CONSTRUCTEUR Beneficiaire::::::::::::::::::::::::", routeState);
    if (routeState) {
      console.log(":::::CONSTRUCTEUR Beneficiaire::::::::::::::::::::::::")
      let data: any;
      let projet: Loc_projet;
      
      data = JSON.parse(routeState.zone);
      projet = JSON.parse(routeState.projet);
      this.user = JSON.parse(routeState.user);
      this.activite = routeState.activite;
      ///this.region = JSON.parse(data.data);
      console.log("Beneficiaire RP=====>");
      console.log(routeState);
      console.log(data);
      console.log(projet);
      console.log(this.user);

      this.region = data.data.region;
      this.district = data.data.district;
      this.commune = data.data.commune;
      this.projet = projet;
      this.loadFktAssociation();
      this.isRouterActive = true;

    } else console.log("router Beneficiaire is not current");
  }
  ngOnDestroy(): void {
    console.log(":::::Component beneficiare function destroy:::::::::::::::::::::::");
    if (this.sharedService.getData() != null) {
      this.sharedService.setData(null);
    }
  }

  ngOnInit() {
    this.loadZone();
    this.loadCollaborateur();
  }

  ngAfterViewInit() {
    console.log(":::::Component beneficiare function AfterViewInit:::::::::::::::::::::::");
    this.assocSort.disableClear = true;
    this.dataSource.paginator = this.assocPaginator;
    this.dataSource.sort = this.assocSort;

    this.benefSort.disableClear = true;
    this.dataSourceBenef.paginator = this.benfPaginator;
    this.dataSourceBenef.sort = this.benefSort;

    this.dataSourceParce.paginator = this.parcePaginator;
    this.dataSourceParce.sort = this.parceSort;
  }
  /** Navigation LifeCycle event component */
  ionViewDidLoad() {
    console.log(":::::LifeCycle beneficiare function:::: ionViewDidLoad:::");
  }
  ionViewWillEnter(){
    if (this.isRouterActive) {
      console.log("::::::Contructeur loaded:::::");

    } else {
      this.loading();
      console.log("::::::Contructeur unloaded:::::", this.sharedService.getData());
      if (this.sharedService.getData() != null) {
        let data = this.sharedService.getData();
        this.region = data.data.region;
        this.district = data.data.district;
        this.commune = data.data.commune;
        this.loadFktAssociation();
      } else {
        // Initialized data 
        this.initPropr();
        this.dataSource.filter = '';
        this.dataSourceBenef.filter = '';    
        this.dataSourceParce.filter = '';
        this.refreshDataSource();
      }
    }
    //console.log(":::::LifeCycle beneficiare function::::: ionViewWillEnter::", this.isRouterActive);
  }
  ionViewDidEnter() {
    console.log(":::::LifeCycle Beneficiaire function:::: ionViewDidEnter:::");
    setTimeout(() => {
      this.initPropr();
      this.dataSource.filter = '';
      this.dataSourceBenef.filter = '';    
      this.dataSourceParce.filter  = '';
      this.refreshDataSource();
      this.loadingCtrl.dismiss();
    }, 1000);
  }
  ionViewDidLeave(){
    console.log(":::::LifeCycle beneficiare function:::::: ionViewDidLeave:::");
    //this.isRouterActive = false;
    this.loadingCtrl.dismiss();
  }
  ionViewWillUnload() {
    console.log(":::::LifeCycle beneficiare function:::::: ionViewWillUnload:::");
  }

  async loading() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilterSelect(value, table: string) {
    console.log(value);
    if (value != undefined) {
      const filterValue = value;
      if (table === 'association') {
        this.dataSource.filter = filterValue.trim();
  
        this.filterData = this.dataSource.data.filter(elem => {
            return elem.nom_ass === filterValue;
        });
        console.log("Filtered value!!!");
        console.log(this.filterData);
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
        this.isFiltered = true;
      } else if (table === 'pms') {
        this.dataSourceBenef.filter = filterValue.trim();
        // actualiser la paginator
        this.benfPaginator._changePageSize(this.benfPaginator.pageSize);
      } else if (table === 'parcelle') {
        this.dataSourceParce.filter  = filterValue.trim();

        this.filterDataParce = this.dataSourceParce.data.filter(elem_parce => {
          return elem_parce.nom_ass === filterValue;
        });
        this.nb_parce_ass_filter = this.filterData.length;
        console.log("Filtered value!!!");
        console.log(this.filterDataParce);
        this.isFiltered = true;
      }
    }
  }

  applyFilterTout(table: string) {
    if (table === 'pms') {
      this.dataSourceBenef.filter = '';
      this.dataSourceBenef.data =  this.data_pms;
      /**if (this.dataSourceBenef.paginator) {
        this.dataSourceBenef.paginator.firstPage();
      }*/
    } else if(table === 'association') {
      this.dataSource.filter = '';
      this.dataSource.data = this.association;
      /**if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }*/
    } else if (table === 'parcelle') {
      this.dataSourceParce.filter = '';
      this.dataSourceParce.data = this.parcelle_pms;
      /**if (this.dataSourceParce.paginator) {
        this.dataSourceParce.paginator.firstPage();
      }*/
    }
    this.isFiltered = false;
    this.selectedAssoc = '';
  }

  async loadFktAssociation() {
    let fokontany: Loc_Fokontany[] = [];
    this.dataSource.data = [];
    this.dataSourceBenef.data = [];
    //this.data_pms = [];
    //this.parcelle_pms = [];
    this.association = [];
    this.filterDataAssoc = [];
    //let code_equipe: number;
    //let count = 0;
    console.log(this.commune);
    let id_commune = {
      code_commune: this.commune.code_com
    }
    this.loadData.loadFokontany(id_commune).then((res) => {
      console.log(res.values);
      fokontany = res.values;
      if (fokontany.length > 0) {
        fokontany.forEach((elements, ind_fkt) => {
          console.log(this.projet);
          /**this.user.forEach((elem_user, ind) => {
            console.log("********ELEMENT USER BENEFICIAIRE PAGE*************");
            console.log(elem_user);
            if ((this.user.length - 1) ===ind) {
              code_equipe = elem_user.id_equipe;
            }
          });*/
          const data = {
            id_fkt: elements.code_fkt,
            code_pr: this.projet.code_proj,
            code_equipe: this.user[0].id_equipe
          }
          this.loadData.loadAssociation(data).then((res_assoc) => {
            console.log(":::Association Fokontany:::", res_assoc);
            if (res_assoc.values.length > 0) {
              res_assoc.values.forEach(elem => {
                this.association.push({
                  numero: elem.numero,
                  id_prjt: elem.id_prjt,
                  code_proj: elem.code_proj, 
                  nom_pr: elem.nom_pr, 
                  id_fkt:  elem.id_fkt, 
                  nom_fkt: elem.nom_fkt,
                  code_ass: elem.code_ass, 
                  nom_ass: elem.nom_ass,
                  ancronyme: elem.ancronyme,
                  id_tech: elem.id_tech, 
                  technicien: elem.technicien,
                  nb_benef: elem.nb_benef, 
                  nom_pa: elem.nom_pa,
                  prenom: elem.prenom,
                  sexe: elem.sexe,
                  cin: elem.cin,
                  dt_delivrance: elem.dt_delivrance,
                  lieu_delivrance: elem.lieu_delivrance,
                  img_benef: elem.img_benef,
                  surnom: elem.surnom,
                  status: elem.status
                });
                this.filterDataAssoc.push(elem.nom_ass);
              });
            }
            
            //fin du boucle
            if ((fokontany.length - 1) === ind_fkt) {
              console.log("****Dernier boucle fkt***");
              this.loadPmsAsso();
            }
          });    
        });
      }
    });

  }

  loadPmsAsso() {
    this.data_pms = [];
    this.parcelle_pms = [];
    if (this.association.length > 0 ) {
      this.association.forEach(((elem_assoc, ind_assoc) => {
        const data_pms = {
          code_ass: elem_assoc.code_ass
        }
        this.loadData.loadParcelle(data_pms).then(res_parce => {
          console.log(res_parce);
          res_parce.values.forEach(elem_parce => {
            this.parcelle_pms.push(elem_parce);
          });
        });
        this.loadData.loadBeneficiairePms(elem_assoc.code_ass).then((res_pms) => {
          console.log(res_pms);
          res_pms.values.forEach((elem_pms: Benef_activ_pms) => {
            elem_pms.parcelle = [];
            this.data_pms.push(elem_pms);
          });
        });
        
        // fin du boucle
        if ((this.association.length - 1) === ind_assoc) {
         // refresh data source
        }
      }));
    }
  }
  refreshDataSource() {
    if (this.data_pms.length > 0) {
      this.data_pms.forEach(elem_pms => {
        if (this.parcelle_pms.length > 0) {
          elem_pms.parcelle = this.parcelle_pms.filter(item_parce => {return item_parce.code_benef_pms === elem_pms.code_benef_pms});
        } else elem_pms.parcelle = [];
      });
    }
    this.dataSourceParce.data = this.parcelle_pms;
    this.dataSourceBenef.data = this.data_pms;
    this.dataSource.data = this.association;
    console.log(":::Data pms:::::", this.data_pms);
  }
  // Exporter 
  onExport() {
    console.log("Exporter.....");
  }

  // Finish
  onFinish() {
    this.isUpdate = false;
  }
  // Update
  onUpdate() {
    this.isUpdate = true;
  }

  onAddPms() {
    this.isAddPms = true;
  }

  // save pms
  onCancelAddPms(data: any) {
    if (data.src === 'add') {
      this.isAddPms = false;
      this.update_pms = <Update_infos_benef>{};
    } else if (data.src === 'edit') {
      this.isEditRowPms = false;
      this.update_pms = <Update_infos_benef>{};
      this.indexEditRowPms = null;
    }
  }

  onSaveAddPms(data) {
    if (data.src === 'add') {
      console.log(":::Data to Add:::", this.update_pms);
      let code_benef: string = 'B' + '-' + this.user[this.user.length - 1].id_equipe + '-' + moment().format('YYYYMMDD-HHmmss');
      let img_cin: string[] = [];
      if (this.update_pms.img_cin_1.data != null) {
        img_cin.push(this.update_pms.img_cin_1.data);
      } 
      
      if (this.update_pms.img_cin_2.data != null) {
        img_cin.push(this.update_pms.img_cin_2.data);
      }

      let data_to_add: UpdateBenef = {
        code_benef: code_benef,
        img_benef: this.update_pms.img_pr != null? this.update_pms.img_pr.data: null,
        nom: this.update_pms.nom,
        prenom: this.update_pms.prenom,
        sexe: this.update_pms.sexe,             
        dt_nais: this.update_pms.dt_naissance,
        dt_nais_vers: this.update_pms.dt_naissance_vers,
        surnom: this.update_pms.surnom,
        cin: this.update_pms.cin,
        dt_delivrance: this.update_pms.dt_delivrance,
        lieu_delivrance: this.update_pms.lieu_delivrance,
        img_cin:  img_cin.length > 0? JSON.stringify(img_cin.join("-")):null,
        contact: this.update_pms.contact,
        id_fkt: this.update_pms.fokontany != null?this.update_pms.fokontany.code_fkt:null,
        id_commune: this.update_pms.village != null?this.update_pms.commune.code_com: null,
        village: this.update_pms.village,
        dt_Insert: moment().format("YYYY-MM-DD"),
        etat: SYNC,
        statut: ACTIVE
      };
      this.crudService.AddBenef_(data_to_add).then(res => {
        let code_pr: string = 'B' + '-' + this.update_pms.association.numero + this.projet.ancronyme + this.update_pms.association.ancronyme + '-' + moment().format('YYYYMMDD-HHmmss');
        let add_pms: UpdatedBenefActivPms = {
          code_benef_pms: code_pr,
          code_achat: this.update_pms.code_achat,
          id_proj: this.projet.code_proj,
          id_benef: code_benef,
          id_activ: this.activite.id_activ,
          id_association: this.update_pms.association.code_ass,
          id_collaborateur: this.update_pms.collaborateur.id_col,
          etat: SYNC,
          status: ACTIVE
        }
        console.log(":::::Pms ToAdd Data:::", add_pms);
        this.crudService.AddPms(add_pms).then(res => {
          this.loadPmsAsso();
          this.refreshDataSource();
          this.isAddPms = false;
          this.update_pms = <Update_infos_benef>{};
        });
      });
    } else if (data.src === 'edit') {
      console.log(":::Data to Add:::", this.update_pms);
      this.isEditRowPms = false;
      this.update_pms = <Update_infos_benef>{};
      this.indexEditRowPms = null;
    }
  }
  // Update Pms
  async onUpdatePms(data: any) {
    let data_: any;
    if (data.src === 'add') {
      data_ = {
        isPms: true,
        isAdd: true,
        zone: {
          region: this.data_region,
          district: this.data_district,
          commune: this.data_commune,
          fokontany: this.data_fokontany
        },
        association: this.association,
        collaborateur: this.data_collaborateur
      }
    } else if (data.src === 'edit') {
      data_ = { 
        isPms: true,
        isEdit: true,
        zone: {
          region: this.data_region,
          district: this.data_district,
          commune: this.data_commune,
          fokontany: this.data_fokontany
        },
        association: this.association,
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
        this.update_pms = data_modal.data;
        this.update_pms.dt_naissance = data_modal.data.dt_naissance != null? data_modal.data.dt_naissance.format("YYYY-MM-DD"): data_modal.data.dt_naissance;
        this.update_pms.dt_delivrance = data_modal.data.dt_delivrance != null? data_modal.data.dt_delivrance.format("YYYY-MM-DD"): data_modal.data.dt_delivrance;
        
        if (data.src === 'add') {
          this.isAddPms = true;
        } else if (data.src === 'edit') {
          this.isEditRowPms = true;
          this.indexEditRowPms = data.ind_pms;
        }
      }
    });
    await modal.present();
  }

  onRowClicked(row) {
    console.log(row);
    if (this.expandedElement === row) this.expandedElement = null 
    else this.expandedElement = row;
  }

  selectMatTab(index: number) {
    console.log("index Mat-Tab Selected : " + index);
    this.initPropr();
    if (index == 0) {
      this.dataSource.filter = '';
      this.dataSource.data = this.association;
    } else if (index == 1) {
      console.log(this.data_pms);
      this.dataSourceBenef.filter = '';
      this.dataSourceBenef.data =  this.data_pms;
      console.log(this.dataSourceBenef.data);      
    } else if(index == 2) {
      this.dataSourceParce.filter = '';
      this.dataSourceParce.data = this.parcelle_pms;
    }
  }

  initPropr() {
    this.isFiltered = false;
    this.selectedAssoc = '';
    this.selectedAssocParce = '';
    this.selectedAssocPms = '';
  }

  async presentModal() {
    console.log("Activité:::", this.activite);
    console.log("Projet:::", this.projet);
    console.log("Users:::", this.user);
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: {
        'isModificationZone': true,
        'activite': this.activite
      }
    });
    modal.onDidDismiss().then(async (data_dism) => {
      console.log(data_dism);
      if (data_dism.data != undefined) {
        console.log("***Modal Data***", data_dism);
        // Initialized data source an property
        this.initPropr();
        this.dataSource.filter = '';
        this.dataSourceBenef.filter = '';    
        this.dataSourceParce.filter = '';
        // load data
        this.sharedService.setData(data_dism); // shared zone selected to other component
        this.region = data_dism.data.region;
        this.district = data_dism.data.district;
        this.commune = data_dism.data.commune;
        this.loadFktAssociation();

        // Initialized data
        setTimeout(() => {
          this.dataSource.data = this.association;
          this.dataSourceBenef.data =  this.data_pms;
          this.dataSourceParce.data = this.parcelle_pms;
        }, 1000);

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['./'], {
          relativeTo: this.route
        })
      }
    });
    await modal.present();
  }

  onToggleTableRows() {
    this.isTablePRExpanded = !this.isTablePRExpanded;
    this.dataSourceBenef.data.forEach(row => {
      if (row.parcelle.length > 0) {
        row.isExpanded = this.isTablePRExpanded;
      } else {
        if (row.isExpanded) {
          row.isExpanded = false;
        }
      }
    });
  }

  onAddShowPms(data: any) {
    //let data_ = {data: row, index_: i}
    console.log(data);
    this.dataSourceBenef.data.forEach((row, ind) => {
      if (ind === data.index_) {
        row.isExpanded = true;
      }
    });
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

}
