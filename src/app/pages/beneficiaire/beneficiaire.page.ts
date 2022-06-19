import { AfterViewInit, Component, OnChanges, OnInit, Output, EventEmitter, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// Imports 
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Loc_association, Benef_activ_pms, Local_Parcelle, Loc_projet } from 'src/app/interfaces/interfaces-local';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { SharedService } from 'src/app/services/shared.service';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalPage } from '../modal/modal.page';

export interface UserData {
  id: string;
  nom: string;
  fokontany: string;
}

@Component({
  selector: 'app-beneficiaire',
  templateUrl: './beneficiaire.page.html',
  styleUrls: ['./beneficiaire.page.scss'],
})
export class BeneficiairePage implements OnInit, AfterViewInit, OnDestroy {

  displayedColumnsBenef: string[] = ['association', 'fokontany', 'code_pms', 'code_ahat', 'pms', 'sexe', 'age', 'cin', 'village', 'collaborateur', 'nb_parcelle', 'sum_parce'];
  displayedColumns: string[] = ['fokontany', 'association', 'nb_pms', 'code_benef', 'pa', 'sexe', 'cin', 'surnom', 'technicien'];
  displayedColumnsParce: string[] = ['code_parce', 'code_pms', 'code_ahat', 'nom', 'ref_gps', 'lat', 'log', 'superficie', 'nb_cultures', 'cultures'];
  displayedColumnsParceSingle: string[] = ['code_pms', 'code_ahat', 'nom', 'code_parce', 'ref_gps', 'lat', 'log', 'superficie', 'nb_cultures', 'cultures'];
  filterDataAssoc: string[] = [];
  filterData: Loc_association[] = [];
  filterDataParce: Local_Parcelle[] = [];
  data_pms: Benef_activ_pms[] = [];
  parcelle_pms: Local_Parcelle[] = [];
  nb_parce_ass_filter: number = 0;
  association: Loc_association[] = []; 
  expandedElement: Benef_activ_pms | null;
  isClickedBenef: boolean = false;
  selectedAssoc: string;
  selectedAssocPms: string;
  selectedAssocParce: string;
  isFiltered: boolean = false;
  dataSource = new MatTableDataSource<Loc_association>();
  dataSourceBenef = new MatTableDataSource<Benef_activ_pms>();
  dataSourceParce = new MatTableDataSource<Local_Parcelle>(); 
  dataSourceParceSingle = new MatTableDataSource<Local_Parcelle>();
  
  private isRouterActive: boolean = false;

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
  activite: string;

  private fokontany: any[] = [];

  constructor(
              public modalCtrl: ModalController, 
              private router: Router, 
              private loadData: LoadDataService,
              private loadingCtrl: LoadingController,
              private route: ActivatedRoute,
              private sharedService: SharedService) {
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
    console.log("+++++++++++++++++ngOnInit Beneficiare++++++++++++++++++++++");
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
        //this.dataSource.data = this.association;
      } else {
        // Initialized data 
        this.initPropr();
        this.dataSource.filter = '';
        this.dataSourceBenef.filter = '';    
        this.dataSourceParce.filter = '';
        this.dataSource.data = this.association;
        this.dataSourceBenef.data =  this.data_pms;
        this.dataSourceParce.data = this.parcelle_pms;
      }
    }
    console.log(":::::LifeCycle beneficiare function::::: ionViewWillEnter::", this.isRouterActive);
  }
  ionViewDidEnter() {
    console.log(":::::LifeCycle Beneficiaire function:::: ionViewDidEnter:::");
    setTimeout(() => {
      this.initPropr();
      this.dataSource.filter = '';
      this.dataSourceBenef.filter = '';    
      this.dataSourceParce.filter  = '';
      this.dataSource.data = this.association;
      this.dataSourceBenef.data =  this.data_pms;
      this.dataSourceParce.data = this.parcelle_pms;
      this.loadingCtrl.dismiss();
    }, 1000);
  }
  ionViewDidLeave(){
    console.log(":::::LifeCycle beneficiare function:::::: ionViewDidLeave:::");
    this.isRouterActive = false;
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
    let fkt = [];
    this.fokontany = [];
    this.dataSource.data = [];
    this.dataSourceBenef.data = [];
    this.data_pms = [];
    this.parcelle_pms = [];
    this.association = [];
    this.filterDataAssoc = [];
    let code_equipe: number;
    let count = 0;
    console.log("::::BENEFICIAIRE FOKONTANY::: " + count);
    console.log(this.commune);
    let id_commune = {
      code_commune: this.commune.code_com
    }
    this.loadData.loadFokontany(id_commune).then((res) => {
      count ++;
      console.log(res.values);
      res.values.forEach(element => {
        this.fokontany.push({
          nom_reg: element.nom_reg,
          id_dist: element.id_dist, 
          nom_dist: element.nom_dist,  
          id_com: element.id_com, 
          nom_com: element.nom_com,
          code_fkt: element.code_fkt,
          nom_fkt: element.nom_fkt
        });
      });

      console.log("::RESPONSE BENEFICIAIRE FOKONTANY::: this.fokontany");
      console.log(this.fokontany);
        if (this.fokontany.length > 0) {
          this.fokontany.forEach((elements, i) => {
            console.log(elements);
            console.log(this.projet);
            this.user.forEach((elem_user, ind) => {
              console.log("********ELEMENT USER BENEFICIAIRE PAGE*************");
              console.log(elem_user);
              if ((this.user.length - 1) ===ind) {
                code_equipe = elem_user.id_equipe;
              }
            });
            const data = {
              id_fkt: elements.code_fkt,
              code_pr: this.projet.code_proj,
              code_equipe: code_equipe
            }
            this.loadData.loadAssociation(data).then((res_assoc) => {
              console.log("response assocciation");
              console.log(res_assoc);
              res_assoc.values.forEach(elem => {
                const data_pms = {
                  code_ass: elem.code_ass
                }
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
                this.loadData.loadBeneficiairePms(elem.code_ass).then((res_pms) => {
                  console.log(res_pms);
                  res_pms.values.forEach((elem_pms: Benef_activ_pms) => {
                    this.data_pms.push(elem_pms);
                  });
                });
                this.loadData.loadParcelle(data_pms).then(res_parce => {
                  console.log(res_parce);
                  res_parce.values.forEach(elem_parce => {
                    this.parcelle_pms.push(elem_parce);
                  });
                });
              });
              this.dataSourceParce.data = this.parcelle_pms;
              this.dataSourceBenef.data = this.data_pms;
              this.dataSource.data = this.association;
              console.log(this.dataSource.data);
              console.log(this.dataSourceBenef.data);
              console.log(this.filterDataAssoc);

            });

            if ((this.fokontany.length - 1) === i) {
              console.log("****Dernier boucle fkt***");
              this.fokontany = [];
              //return this.isFktLoaded.next(true);
            }    
          });
        }
    });

  }

  onRowClicked(row) {
    console.log(row);
    if (this.expandedElement === row) this.expandedElement = null 
    else this.expandedElement = row;
  }

  onRowClickedBenef(row) {
    const data_parce_benef: Local_Parcelle[] = [];
    console.log(row);
    this.isClickedBenef = true;
    console.log(this.isClickedBenef);
    const data = {
      code_benef_pms: row.code_benef_pms
    }   
    this.loadData.loadParcelle(data).then(res_val => {
      console.log(res_val.values);
      if (res_val.values.length != 0) {
        res_val.values.forEach(elem_val => {
          data_parce_benef.push(elem_val);
        });
        this.dataSourceParceSingle.data = data_parce_benef;
        console.log(data_parce_benef);
      } else this.dataSourceParceSingle.data = data_parce_benef;
    });
    
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
    this.isClickedBenef = false;
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

  addData() {
    console.log(this.data_pms);
    /**this.dataSourceBenef = new MatTableDataSource<Benef_activ_pms>(this.data_pms);
    console.log(this.dataSourceBenef.data);*/
  }

}
