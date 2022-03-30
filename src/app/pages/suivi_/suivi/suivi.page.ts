import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalPage } from '../../modal/modal.page';

import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file/ngx';

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
  private new_culte: any = {};
  /**Filtre */
  private selectedAssoc: any;
  private selectedBeneficiare: any;
  private selectedParcelle: any;
  private filterDataAssoc: any[];
  private filterDataBenef: any[];
  private filterDataParce: any [];

  arr:any[] = [];


  private displayedColumns: string[] = ['saison', 'association', 'code_pms', 'nom_pms', 'code_parce', 'variette', 'qsa', 'img_fact', 'dds', 'sfce', 'objectif', 'sc', 'ea'];
  private displayedColumnsNew: string[] = ['new_saison', 'new_association', 'new_code_pms', 'new_nom_pms', 'new_code_parce', 'new_variette', 'new_qsa', 'new_img_fact', 'new_dds', 'new_sfce', 'new_objectif', 'new_sc', 'new_ea', 'new_action'];

  private dataSource = new MatTableDataSource<any>(DATA_CULTURE);

  constructor(private router: Router, 
              private loadService: LoadDataService,
              private modalCtrl: ModalController,
              private file: File) { 
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

    for(var i=0;i<30;i++) {
      var obj = {
        id: "id" + i.toString(),
        name: "name" + i.toString(),
        email: "email" + i.toString()
      };
      this.arr.push(obj);
    }
  }

  // export excelle
  createExcel() {
    var ws = XLSX.utils.json_to_sheet(this.arr);
    var wb = {
      Sheets: {'data': ws}, 
      SheetNames: ['data']
    };
    var buffer = XLSX.write(
      wb, 
      {
        bookType: 'xlsx', 
        type: 'array'
      }
    );
    this.saveToPhone(buffer);
  }
  saveToPhone(buffer) {
    var fileType= 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    var fileExtension = ".xlsx";
    var fileName = Date.now().toString();
    var data:Blob = new Blob([buffer], {type: fileType});
    this.file.writeFile(this.file.externalRootDirectory, fileName+fileExtension,data,{replace: true})
          .then(() => {
            alert("excel file saved in phone");
          });
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
    modal.onDidDismiss().then((data_modal) => {
      console.log("*** Modal Suivi dismissed ****");
      console.log(data_modal);
      if (data_modal.data != undefined) {
        let res = data_modal.data;
        this.new_culte = res.new_cult;
        this.isNewCultureClicked = !this.isNewCultureClicked;
      }
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
