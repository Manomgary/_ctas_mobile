import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// Imports 
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Association } from 'src/app/interfaces/interfaces-local';
import { LoadDataService } from 'src/app/services/local/load-data.service';

export interface UserData {
  id: string;
  nom: string;
  fokontany: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'Anjatoka III',
  'Tanambao',
  'berary',
  'Mangarivotse',
  'Beabo',
  'Ambaro',
];
const BENEFICIAIRES: any[] = [
    {
      fokontany: 'ambaninato', 
      association: 'Soafiavy', 
      code_pms: 'AFAF_SF1_01', 
      pms: 'FEDRAZA Emilien', 
      sexe: 'H', 
      age: 45, 
      cin: 510111000222, 
      village: 'Ambaninato', 
      commune: 'Erada', 
      role: 'PA', 
      nb_parcelle: 3
    },
    {
      fokontany: 'ambaninato', 
      association: 'Soafiavy', 
      code_pms: 'AFAF_SF1_02', 
      pms: 'Mahasonjo Soamare', 
      sexe: 'H', 
      age: 48, 
      cin: 510211400422, 
      village: 'Ambanikily', 
      commune: 'Erada', 
      role: 'PMS', 
      nb_parcelle: 1
    },
    {
      fokontany: 'ambaninato', 
      association: 'Soafiavy', 
      code_pms: 'AFAF_SF1_03', 
      pms: 'Manantsoa Albert', 
      sexe: 'F', 
      age: 50, 
      cin: 510111000222, 
      village: 'Ambaninato', 
      commune: 'Erada', 
      role: 'PMS', 
      nb_parcelle: 1
    },
    {
      fokontany: 'ambaninato', 
      association: 'Soafiavy', 
      code_pms: 'AFAF_SF1_04', 
      pms: 'Mahasoa', 
      sexe: 'F', 
      age: 40, 
      cin: 510111000222, 
      village: 'Ambaninato', 
      commune: 'Erada', 
      role: 'PMS', 
      nb_parcelle: 2
    }
];


@Component({
  selector: 'app-beneficiaire',
  templateUrl: './beneficiaire.page.html',
  styleUrls: ['./beneficiaire.page.scss'],
})
export class BeneficiairePage implements OnInit, AfterViewInit {

  displayedColumnsBenef: string[] = ['fokontany', 'association', 'code_pms', 'pms', 'sexe', 'age', 'cin', 'village', 'commune', 'role', 'nb_parcelle'];
  displayedColumns: string[] = ['fokontany', 'association', 'nb_pms', 'code_benef', 'pa', 'sexe', 'cin', 'surnom', 'technicien'];
  dataSource = new MatTableDataSource<Association>();
  dataSourceBenef = new MatTableDataSource<any>(BENEFICIAIRES);
  private isFktLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isRouterActive: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  region: any;
  district: any;
  commune: any;
  projet: any;

  private fokontany: any[] = [];

  constructor(public modalCtrl: ModalController, 
              private router: Router, 
              private loadData: LoadDataService,
              private loadingCtrl: LoadingController,) {
        
    if (this.router.getCurrentNavigation().extras.state) {
      let data: any;
      let projet: any;
      this.fokontany = [];
      const routeState = this.router.getCurrentNavigation().extras.state;
      data = JSON.parse(routeState.zone);
      projet = JSON.parse(routeState.projet);
      ///this.region = JSON.parse(data.data);
      console.log("Beneficiaire RP=====>");
      console.log(routeState);
      console.log(data);
      console.log(projet);
      this.region = data.data.region;
      this.district = data.data.district;
      this.commune = data.data.commune;
      this.projet = projet;

      this.isRouterActive.next(true);

    } else console.log("router Beneficiaire is not current");
            // Assign the data to the data source for the table to render
    this.isRouterActive.subscribe(isActive => {
      if (isActive) {
        console.log("Constructeur Beneficiaire Active router");
        if (!this.isFktLoaded.value) {
          console.log(this.isFktLoaded.value);
          this.loadFktAssociation();
        }
        this.isRouterActive.next(false);
      }
    });
  }

  ngOnInit() {
    console.log("+++++++++++++++++ngOnInit Beneficiare++++++++++++++++++++++");
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async loadFktAssociation() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    let fkt = [];
    this.dataSource.data = [];
    let association: Association[] = []; 
    let count = 0;
    console.log("::::BENEFICIAIRE FOKONTANY::: " + count);
    console.log(this.commune);
    this.loadData.loadFokontany(this.commune.code_com).then((res) => {
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
            const data = {
              id_fkt: elements.code_fkt,
              code_pr: this.projet.code_proj
            }
            if (this.isFktLoaded.value) {
              console.log("Fkt is all loaded");
            } else {
              console.log("Fkt is notv all loaded");
            }

            this.loadData.loadAssociation(data).then((res_assoc) => {
              console.log("response assocciation");
              console.log(res_assoc);
              res_assoc.values.forEach(elem => {
                association.push({
                  id_prjt: elem.id_prjt,
                  code_proj: elem.code_proj, 
                  nom_pr: elem.nom_pr, 
                  id_fkt: elem.id_fkt, 
                  nom_fkt: elem.nom_fkt,
                  code_ass: elem.code_ass, 
                  nom_ass: elem.nom_ass, 
                  id_tech: elem.id_tech, 
                  id_pms: elem.id_pms, 
                  nom_benf: elem.nom_benf, 
                  sexe:  elem.sexe,
                  cin: elem.cin,
                  surnom: elem.surnom,
                  status: elem.status
                });
              });
              this.dataSource.data = association;
              console.log(this.dataSource.data);

            });

            if ((this.fokontany.length - 1) === i) {
              console.log("****Dernier boucle fkt***");
              this.fokontany = [];
              association = [];
              this.loadingCtrl.dismiss();
              return this.isFktLoaded.next(true);
            }    
          });
        } else this.loadingCtrl.dismiss();
    });

  }

  onRowClicked(row) {
    console.log(row);
  }

  onRowClickedBenef(row) {
    console.log(row);
  }

}
