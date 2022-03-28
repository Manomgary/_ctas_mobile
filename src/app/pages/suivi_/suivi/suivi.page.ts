import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalPage } from '../../modal/modal.page';

const DATA_CULTURE = [
  {
    saison : 'CS', 
    association :'AVOTRE', 
    code_pms : 'PMS_001', 
    nom_pms:'nom_pms', 
    code_parce : 'PARC_001', 
    variette : 'Mil Besomotse', 
    qsa : 1.5, 
    img_fact : '', 
    dds : '12-06-95', 
    sfce : 4100, 
    objectif : 4000, 
    sc : 'levier', 
    ea : 'manioc'
  }, 
  {
    saison : 'CS', 
    association :'SOAFIAVY', 
    code_pms : 'PMS_002', 
    nom_pms:'RAKOTO jean noel', 
    code_parce : 'PARC_002', 
    variette : 'Mil Besomotse', 
    qsa : 1.5, 
    img_fact : '', 
    dds : '12-06-65', 
    sfce : 2500, 
    objectif : 4000, 
    sc : 'levier', 
    ea : 'manioc'
  },
  {
    saison : 'GS', 
    association :'RANOVELO AVIAVY', 
    code_pms : 'PMS_003', 
    nom_pms:'MANAGNOHATSE', 
    code_parce : 'PARC_003', 
    variette : 'Mil Besomotse', 
    qsa : 1.5, 
    img_fact : '', 
    dds : '12-06-85', 
    sfce : 3000, 
    objectif : 4000, 
    sc : 'levier', 
    ea : 'manioc'
  }
];

@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.page.html',
  styleUrls: ['./suivi.page.scss'],
})
export class SuiviPage implements OnInit {

  private isRouterActive: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private region: any;
  private district: any;
  private commune: any;
  private projet: any;
  private user: Utilisateurs[];
  private isUpdated: boolean = false;
  private isEditableCulte: boolean = false;
  private indexRowEdit: number;
  private isNewCultureClicked: boolean = false;
  /**Filtre */
  private selectedAssoc: any;
  private selectedBeneficiare: any;
  private selectedParcelle: any;
  private filterDataAssoc: any[];
  private filterDataBenef: any[];
  private filterDataParce: any [];


  private displayedColumns: string[] = ['saison', 'association', 'code_pms', 'nom_pms', 'code_parce', 'variette', 'qsa', 'img_fact', 'dds', 'sfce', 'objectif', 'sc', 'ea'];
  private displayedColumnsNew: string[] = ['new_saison', 'new_association', 'new_code_pms', 'new_nom_pms', 'new_code_parce', 'new_variette', 'new_qsa', 'new_img_fact', 'new_dds', 'new_sfce', 'new_objectif', 'new_sc', 'new_ea', 'new_action'];

  private dataSource = new MatTableDataSource<any>(DATA_CULTURE);

  constructor(private router: Router, 
              private loadService: LoadDataService,
              private modalCtrl: ModalController) { 
    const routeState = this.router.getCurrentNavigation().extras.state;
    if (routeState) {
      let zone: any;
      zone = JSON.parse(routeState.zone);
      this.projet = JSON.parse(routeState.projet);
      this.user = JSON.parse(routeState.user);

      console.log(zone);
      console.log(this.projet);
      console.log(this.user);

      this.region = zone.data.region;
      this.district = zone.data.district;
      this.commune = zone.data.commune;

      this.isRouterActive.next(true);
    } else console.log("Router Suivi is not current");

    this.isRouterActive.subscribe(isActive => {
      if (isActive) {
        console.log("Constructeur Beneficiaire Active router");
        this.isRouterActive.next(false);
      }
    });
  }

  ngOnInit() {
  }

  onUpdate() {
    this.isUpdated = true;
    this.displayedColumns.push('action');
  }
  onAdd() {
    this.presentModal();
  }
  onCancelSauvegarde() {
    this.initDataTable();
  }
  onSauvegarde() {
    
  }
  onClickModifElement(index, row) {
    console.log('index ' + index);
    console.log('row ');
    console.log(row);
    this.isEditableCulte = true;
    this.indexRowEdit = index;
  }
  openDialog(row) {
    console.log(row);
  }

  /**
   * 
   * Edit action
   * 
   */
   onClickEditDoneAction(table, row) {
    if (table === 'culture') {
      console.log(row);
      this.isEditableCulte = !this.isEditableCulte;
    }
   }
   onClickEditCancelAction(table) {
    if (table === 'culture') {
      this.isEditableCulte = !this.isEditableCulte;
    }
   }

   /** Add new Elem */
  onClickDoneAction() {
    this.isNewCultureClicked = !this.isNewCultureClicked;
  }
  onClickCancelAction() {
    this.isNewCultureClicked = !this.isNewCultureClicked;
  }

  // Modal Data
  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      cssClass: 'my-custom-modal-suivi',
      backdropDismiss: false,
      componentProps: {
        isSuiviRp: true,
        data: {}
      }
    });
    // dismissed
    modal.onDidDismiss().then((data) => {
      console.log("*** Modal Suivi dismissed ****");
      console.log(data);
      this.isNewCultureClicked = !this.isNewCultureClicked;
    });
    await modal.present();
  }

  initDataTable() {
    this.isUpdated = false;
    this.displayedColumns.pop();//remove the last element
    this.isEditableCulte = false;
    this.isNewCultureClicked = false;
    this.indexRowEdit = null;
  }

}
