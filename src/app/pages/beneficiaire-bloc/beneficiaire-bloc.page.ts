import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Local_benef_activ_bl, Local_bloc_parce, Local_bloc_zone, Loc_Bloc, Loc_Commune } from 'src/app/interfaces/interfaces-local';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { Utilisateurs } from 'src/app/utils/interface-bd';


@Component({
  selector: 'app-beneficiaire-bloc',
  templateUrl: './beneficiaire-bloc.page.html',
  styleUrls: ['./beneficiaire-bloc.page.scss'],
})
export class BeneficiaireBlocPage implements OnInit {
  private isRouterActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isCommuneLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private data_bloc: Loc_Bloc[] = [];
  private data_benef: Local_benef_activ_bl[] = [];

  // Displayed Column
  displayedColumns: string[] = ['code_bloc', 'nom_bloc', 'nom_com', 'nb_fkt_concerner'];
  displayedColumnsZone: string[] = ['code_bloc', 'nom_bloc', 'commune', 'fkt', 'km_responsable'];
  displayedColumnsBenef: string[] = ['nom_bloc', 'code_benef_bl', 'code_achat', 'nom', 'sexe', 'surnom', 'cin', 'nom_com', 'nom_fkt', 'nb_parcelle', 'sum_superficie'];
  displayedColumnsParcelle: string[] = ['id_parce', 'nom_bloc', 'code_benef_bl', 'nom', 'km_responsable', 'fokontany', 'lat', 'log', 'superficie', 'nb_culture'];
  displayedColumnsParceBenef: string[] = ['nom_bloc', 'code_benef', 'nom_benef', 'code_parce', 'ref_gps', 'lat', 'log', 'superficie', 'nb_culture'];

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
              private loadingCtrl: LoadingController) { 
    if (this.router.getCurrentNavigation().extras.state) {
      let data: any;
      const routeState = this.router.getCurrentNavigation().extras.state;
      console.log(routeState);
      data = JSON.parse(routeState.zone);
      this.projet = JSON.parse(routeState.projet);
      this.user = JSON.parse(routeState.user);
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
  }

  ngAfterViewInit() {
    this.blocSort.disableClear = true;
    this.dataSource.paginator = this.blocPaginator;
    this.dataSource.sort = this.blocSort;

    this.benefSort.disableClear = true;
    this.dataSourceBenef.paginator = this.benefPaginator;
    this.dataSourceBenef.sort = this.benefSort;

    this.parcelleSort.disableClear = true;
    this.dataSourceParcelle.paginator = this.parcellePaginator;
    this.dataSourceParcelle.sort = this.parcelleSort;
  }

  loadCommuneBloc(){  
    // zone bloc
    /**const loading = await this.loadingCtrl.create();
    await loading.present();*/
    let commune: Loc_Commune[] = [];
    let code_equipe: number;
    this.data_bloc = [];
    this.data_benef = [];

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
                let code_bloc = {
                  code_bloc: elem_bloc.code_bloc
                }
                this.data_bloc.push(elem_bloc);
                this.filterDataBloc.push(elem_bloc.nom_bloc);
                this.loadData.loadBenefBloc(elem_bloc.code_bloc).then(res_benef => {
                  console.log(res_benef);
                  res_benef.values.forEach(elem_benef => {
                    this.data_benef.push(elem_benef);
                  });
                });
                this.loadData.loadBlocParce(code_bloc).then(parce_bloc => {
                  console.log(parce_bloc);
                  if (parce_bloc.values.length > 0) {
                    parce_bloc.values.forEach(elem_blparc => {
                      console.log(elem_blparc);
                      this.data_bloc_parce.push(elem_blparc);
                    });
                  }
                });
              });
              this.dataSource.data = this.data_bloc;
              this.dataSourceParcelle.data = this.data_bloc_parce;
            } else {
              console.log("Aucune Bloc Disponible dans le Commune: ");
              console.log(data);
            }
          });

          // Fin du boucle
          if ((commune.length - 1) === i) {
            console.log("Fin du bloc");
            //this.loadingCtrl.dismiss();
          }
        });
      } //else //this.loadingCtrl.dismiss();
    });
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

  selectMatTab(index: number) {
    console.log("index Mat-Tab Selected : " + index);
    this.initData();
    if (index == 0) {
      this.dataSource.filter = '';
      this.dataSource.data = this.data_bloc;
    } else if (index == 1) {  
      this.dataSourceBenef.filter = ''; 
      this.dataSourceBenef.data = this.data_benef;
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
