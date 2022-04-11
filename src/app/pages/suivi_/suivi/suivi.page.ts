import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalPage } from '../../modal/modal.page';

import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file/ngx';
import { Benef_activ_pms, Local_Parcelle, Loc_association, Loc_culture_Pms, Loc_Espece, Loc_saison, Loc_variette } from 'src/app/interfaces/interfaces-local';
import { Db_Culture_pms, Db_suivi_pms } from 'src/app/interfaces/interface-insertDb';

// DATE IMPORT 
import * as _moment from 'moment';
import { Moment } from 'moment';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

const moment = _moment;

export interface newCulture {
  order_assoc: number,
  code_saison: string,
  saison: string,
  code_ass: string,
  saison_descr: string,
  association: string,
  code_pms: string,
  pms: string,
  parcelle: string,
  espece: string,
  code_variette: string,
  variette: string,
  sc: string,
  ea_id_variette: string,
  ea: string,
  annee_du: string,
  dateSemis: Moment,
  sfce: number,
  Objectif: number,
  qsa: number,
  ddp: Moment
}

@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.page.html',
  styleUrls: ['./suivi.page.scss'],
})
export class SuiviPage implements OnInit, AfterViewInit {
  suiviForm: FormGroup;

  private isRouterActive: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private region: any;
  private district: any;
  private commune: any;
  private projet: any;
  private user: Utilisateurs[];
  private isUpdated: boolean = false;
  private isEditableCulte: boolean = false;
  private indexRowEdit: number;
  private indexRowSuivi: number;
  private isNewCultureClicked: boolean = false;
  private new_culte: newCulture = {
    code_saison: '',
    saison: '',
    association: '',
    code_pms: '',
    pms: '',
    parcelle: '',
    espece: '',
    code_variette: '',
    variette: '',
    sc: '',
    ea_id_variette: '',
    ea: '',
    annee_du: '',
    dateSemis: undefined,
    sfce: 0,
    Objectif: 0,
    qsa: 0,
    ddp: undefined,
    code_ass: '',
    saison_descr: '',
    order_assoc: 0
  };
  /**Filtre */
  private selectedAssoc: any;
  private selectedBeneficiare: any;
  private selectedParcelle: any;
  private filterDataAssoc: any[];
  private filterDataBenef: any[];
  private filterDataParce: any [];

  /** get Initiale Data */
  private data_association: Loc_association[] = [];
  private data_pms: Benef_activ_pms[] = [];
  private data_saison: Loc_saison[]  = [];
  private data_parcelle_pms: Local_Parcelle[] = [];
  private data_espece: Loc_Espece[] = [];
  private data_var: Loc_variette[] = [];
  private data_culture: Loc_culture_Pms[] = [];

  private dt_modif: Moment;

  private codeCulture: string;
  private idSuivi: number;

  private isSuiviClicked: boolean = false;
  private isClickedElemCultToSuivi: boolean = false;
  private isNewItemsSuivi: boolean = false;
  private isEditableSuivi: boolean = false;
  private data_stc: any[] = [
    {value: 'LEV', intitule: 'Levée'},
    {value: 'FEU', intitule: 'Feuilles'},
    {value: 'RAM', intitule: 'Ramification'},
    {value: 'MON', intitule: 'Montaison'},
    {value: 'TAL', intitule: 'Tallage'},
    {value: 'FLO', intitule: 'Florison'},
    {value: 'DM', intitule: 'Début Matiration'},
    {value: 'MAT', intitule: 'Maturation'},
    {value: 'REC', intitule: 'Récolté'},
    {value: 'PREC', intitule: 'Post Récolte'},
    {value: 'ECHEC', intitule: 'Echec'}
  ];
  private data_ec: any[] = [
    {value: 'TMV', intitule: 'Mauvais état'},
    {value: 'MM', intitule: 'Moyen'},
    {value: 'BON', intitule: 'Bon état'},
    {value: 'TBE', intitule: 'Trés bon état'},
    {value: 'ECHEC', intitule: 'Echec'},
  ];
  private code_cult_selected: string;

  arr:any[] = [];

  // table culture
  private displayedColumns: string[] = ['saison', 'association', 'code_pms', 'nom_pms', 'code_parce', 'variette', 'qsa', 'img_fact', 'dds', 'sfce', 'objectif', 'sc', 'ea'];
  private displayedColumnsNew: string[] = ['new_saison', 'new_association', 'new_code_pms', 'new_nom_pms', 'new_code_parce', 'new_variette', 'new_qsa', 'new_img_fact', 'new_dds', 'new_sfce', 'new_objectif', 'new_sc', 'new_ea', 'new_action'];
  private displayedColumnsSuivi: string[] = ['ddp', 'stc', 'ec', 'pb', 'ex', 'img_cult', 'controle', 'action'];
  private displayedNewColumnsSuivi: string[] = ['new_ddp', 'new_stc', 'new_ec', 'new_pb', 'new_ex', 'new_img_cult', 'new_controle', 'new_action'];

  private dataSource = new MatTableDataSource<Loc_culture_Pms>();
  private dataSourceSingleSuivi = new MatTableDataSource<any>();

  constructor(private router: Router, 
              private loadData: LoadDataService,
              private crudDb: CrudDbService,
              private modalCtrl: ModalController,
              private file: File,
              private loadingCtrl: LoadingController,
              private formBuilder: FormBuilder) { 
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
        this.loadFktAssociation();
        this.loadSaison();
        this.loadEspece();
        this.loadVariette();
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
    this.suiviForm = this.formBuilder.group({
      ddp: [null, Validators.required],
      stc: ['', Validators.required],
      ec: ['', Validators.required],
      pb: '',
      ex: '',
      controle: '',
    });
  }
  ngAfterViewInit() {
    //this.dataSource.data = [...this.dataSource.data];
  }

  async loadFktAssociation() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    const code_com = this.commune.code_com;
    let code_equipe: number;
    this.data_association = [];
    this.data_pms = [];

    this.loadData.loadFokontany(code_com).then((res_fkt) => {
      console.log(res_fkt);
      if (res_fkt.values.length > 0) {
        res_fkt.values.forEach((elem_fkt, index) => {

          code_equipe = this.user[0].id_equipe;
          const data = {
            id_fkt: elem_fkt.code_fkt,
            code_pr: this.projet.code_proj,
            code_equipe: code_equipe
          }

          this.loadData.loadAssociation(data).then(res_ass => {
            console.log(res_ass);
            if(res_ass.values.length > 0) {
              res_ass.values.forEach((elem_ass: Loc_association) => {
                console.log("+++++ Element Association++++++++");
                const data_pms = {
                  code_ass: elem_ass.code_ass
                }
                console.log(elem_ass);
                this.data_association.push(elem_ass);
                //this.filterDataAssoc.push(elem_ass.nom_ass);
                this.loadData.loadBeneficiairePms(elem_ass.code_ass).then(res_pms => {
                  console.log("+++++ Response Beneficiaire PMS++++++++");
                  console.log(res_pms);
                  res_pms.values.forEach((elem_pms: Benef_activ_pms) => {
                    this.data_pms.push(elem_pms);
                  });
                });
                this.loadData.loadParcelle(data_pms).then(res_parce => {
                  console.log(res_parce);
                  if (res_parce.values.length > 0) {
                    res_parce.values.forEach(elem_pms => {
                      this.data_parcelle_pms.push(elem_pms);
                    });
                  }
                });
                this.loadCulture(elem_ass.code_ass);
              });
            }
            this.dataSource.data = this.data_culture;
            console.log(this.dataSource.data);
          });

          // Fin du boucle
          if ((res_fkt.values.length - 1) === index) {
            this.dataSource.data = this.dataSource.data;
            this.selectMatTab(0);
            this.loadingCtrl.dismiss();
          }
        });
      }
    });
  }
  // refresh datasource table culture
  refreshTbCulture() {
    this.data_culture = [];
    this.data_association.forEach((elem_ass, i) => {
      this.loadCulture(elem_ass.code_ass);
      if ((this.data_association.length - 1) === i) {
        this.dataSource.data = this.data_culture;
      }
    });
    this.dataSource.data = this.data_culture;;
    console.log("refresh**********");
    console.log(this.data_culture);
    console.log(this.dataSource.data);
  }

  // load Culture Pms
  loadCulture(code_ass: string) {
    const id_ass = {
      code_ass: code_ass
    }
    this.loadData.loadCulturesPms(id_ass).then(res_cult => {
      console.log(res_cult);
      if (res_cult.values.length > 0) {
        res_cult.values.forEach(elem_cult => {
          this.data_culture.push(elem_cult);
        });
      }
      console.log(this.data_culture);
    });
  }

  // load Saison
  loadSaison() {
    this.loadData.loadSaison().then(res_saison => {
      console.log(res_saison);
      if (res_saison.values.length > 0) {
        res_saison.values.forEach(elem_s => {
          this.data_saison.push(elem_s);
        });
      }
    });
  }

  // load Espece
  loadEspece() {
    this.loadData.loadEspece().then(res_Espec => {
      console.log(res_Espec);
      if (res_Espec.values.length > 0) {
        res_Espec.values.forEach(elem_esp => {
          this.data_espece.push(elem_esp);
        });
      }
    });
  }

  // load variette
  loadVariette() {
    this.loadData.loadVariette().then(res_var => {
      console.log(res_var);
      if (res_var.values.length > 0) {
        res_var.values.forEach(elem_var => {
          this.data_var.push(elem_var);
        });
      }
    });
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
    let nom_pr: string = this.projet.nom;
    let nom_ass: string = this.new_culte.association;
    let data_culture_assoc: Loc_culture_Pms[] = [];
    let latestIdCulture: string;
    let code_pr: string = '';
    let code_association: string = '';
    let code_saison: string = '';
    let order: number = 1;

    const id_ass = {
      code_ass: this.new_culte.code_ass
    }
    this.loadData.loadCulturesPms(id_ass).then(res_cult => {
      console.log(res_cult);
      if (res_cult.values.length > 0) {
        res_cult.values.forEach(elem_cult => {
          data_culture_assoc.push(elem_cult);
        });
      }
      console.log(data_culture_assoc);

      // get latestId Culture association
      if (data_culture_assoc.length > 0) {
        console.log("latest Id***************");
        data_culture_assoc.forEach((elem, i) => {
          if ((data_culture_assoc.length - 1) === i) {
            console.log(elem)
            latestIdCulture = elem.code_culture;
          }
        });
        // extract latestId
        let arr_latestIdCult = latestIdCulture.trim().split("_");
        arr_latestIdCult.forEach((elem, i) => {
          if ((arr_latestIdCult.length - 1) === i) {
            console.log(elem)
            order = parseInt(elem) + 1;
            console.log(order);
          }
        });
      }
      
      // generer code saison
      let arr_saison = this.new_culte.saison_descr.trim().split(" ");
      let saison: string = '';
      arr_saison.forEach((elem, i) => {
        console.log(elem);
        saison += elem.charAt(0).toUpperCase();
        if ((arr_saison.length - 1) === i) {
          saison += this.new_culte.annee_du.charAt(2) + this.new_culte.annee_du.charAt(3);
          code_saison = saison;
          console.log(code_saison);
        }
      });

      // generer code Projet
      let arr_nom = nom_pr.trim().split(" ");
      arr_nom.forEach((elem, i) => {
        let len = arr_nom.length;
        switch (len) {
          case 1:
            code_pr = elem.charAt(0) + elem.charAt(1) + elem.charAt(2);
            break;
          case 2:
            if (i === 0) {
              code_pr = elem.charAt(0) + elem.charAt(1);
            }  
            if (i === (arr_nom.length - 1)) {
              code_pr += elem.charAt(0);
            }
            break;
          default: 
            if (i === 0) {
              code_pr = elem.charAt(0) + elem.charAt(1);
            } else if (i === 1) {
              code_pr += elem.charAt(0);
            } else if (i === (arr_nom.length - 1)) {
              code_pr += elem.charAt(0);
            }
        }
        console.log(code_pr);
      });
  
      // generer code Association
      let arr_ass = nom_ass.trim().split(" ");
      arr_ass.forEach((elem, i) => {
        if (arr_ass.length === 1) {
          code_association = elem.charAt(0) + elem.charAt(1) + elem.charAt(2)
        } else {
          if (i === 0) {
            code_association = elem.charAt(0) + elem.charAt(1);
          } else if (i === 1) {
            code_association += elem.charAt(0);
          }
        }
        console.log(code_association);
      });
      this.codeCulture = code_pr + '_' + saison + '_' + this.new_culte.order_assoc + code_association + '_' + order.toString();

      // Insert new Culture
      const  dataNewCulteToInsert: Db_Culture_pms = {
        code_culture:  this.codeCulture,
        id_parce: this.new_culte.parcelle,
        id_var: this.new_culte.code_variette,
        id_saison: this.new_culte.code_saison,
        annee_du: this.new_culte.annee_du,
        ddp: this.new_culte.ddp.format("YYYY-MM-DD"),
        dt_creation: moment().format("YYYY-MM-DD"),
        dt_modification: moment().format("YYYY-MM-DD"),
        qsa: this.new_culte.qsa,
        img_fact: null,
        dds: this.new_culte.dateSemis.format("YYYY-MM-DD"),
        sfce: this.new_culte.sfce,
        objectif: this.new_culte.Objectif,
        sc: this.new_culte.sc,
        ea_id_variette: this.new_culte.ea_id_variette,
        ea_autres: this.new_culte.ea_id_variette !== null ? null : this.new_culte.ea,
        statuts: 'EC',
        Etat: 'ToSync',
      }
      console.log(dataNewCulteToInsert);
      this.crudDb.AddNewCulture(dataNewCulteToInsert).then(res => {
        console.log(res.changes.lastId);
        const id_cult = {
          code_cult: dataNewCulteToInsert.code_culture
        }
        this.loadData.loadCulturesPms(id_cult).then(res_cult => {
          console.log(res_cult);
          if (res_cult.values.length > 0) {
            res_cult.values.forEach(elem_cult => {
              this.data_culture = [elem_cult, ...this.data_culture]; // push item first position
            });
          }
          this.dataSource.data = this.data_culture;
          console.log(this.data_culture);
        });
      });
    }); 
    this.isNewCultureClicked = !this.isNewCultureClicked;
  }
  onClickCancelAction() {
    this.isNewCultureClicked = !this.isNewCultureClicked;
  }
  /**
   * ***********************
   * On clicked Suivi
   * ********************/
  onClickSuivi() {
    this.isSuiviClicked = true;
    this.displayedColumns.push('action');
  }
  onAddTbSuivi() {
    //this.displayedColumnsSuivi.push('action');
    this.isNewItemsSuivi = true;
  }
  onEditElemSuivi(index: number, elem: any) {
    console.log(elem);
    console.log(index);
    this.idSuivi = elem.id;
    this.suiviForm.patchValue({
      ddp: moment(elem.ddp, "YYYY-MM-DD"),
      stc: elem.stc,
      ec: this.data_ec.find(ec => ec.value === elem.ec),
      pb: elem.pb,
      ex: elem.ex,
      controle: elem.controle
    });
    this.indexRowSuivi = index;
    this.isEditableSuivi = true;
  }
  onCancelAddSuivi() {
    this.isNewItemsSuivi = false;
    //this.displayedColumnsSuivi.pop();
  }
  onSaveAddSuivi() {
    console.log("***Add Suivi*********");
    let val = this.suiviForm.value;
    let ddp:Moment = val.ddp;
    let data_: Db_suivi_pms = {
      code_culture: this.code_cult_selected,
      ddp: ddp.format("YYYY-MM-DD"),
      stc: val.stc,
      ec: val.ec.value,
      ex: val.ex,
      img_cult: '',
      controle: val.controle
    }
    console.log(val);
    console.log(data_);
    this.crudDb.AddNewSuivi(data_).then(res => {
      console.log(res.changes);
    });
    this.isNewItemsSuivi = false;
    this.suiviForm.reset();
  }

  onSaveEditSuivi() {
    this.isEditableSuivi = false;
    let val = this.suiviForm.value;
    let ddp:Moment = val.ddp;
    let data_: any = {
      id: this.idSuivi,
      code_culture: this.code_cult_selected,
      ddp: ddp.format("YYYY-MM-DD"),
      stc: val.stc,
      ec: val.ec.value,
      ex: val.ex,
      img_cult: '',
      controle: val.controle
    }
    console.log(this.suiviForm.value);
    console.log(data_);
    this.crudDb.UpdatedSuivi(data_).then(res => {
      console.log(res.changes);
    });
    this.suiviForm.reset();
    console.log()
  }
  onCancelEditSuivi() {
    this.isEditableSuivi = false;
    this.suiviForm.reset();
  }

  onClickSuiviElementCulte(i: number, elem: any) {
    console.log(i);
    console.log(elem);
    let data_suivi: any[] = [];
    this.code_cult_selected = elem.code_culture;
    this.loadData.loadSuiviCulture(this.code_cult_selected).then(res_suivi => {
      console.log(res_suivi);
      if (res_suivi.values.length > 0) {
        res_suivi.values.forEach(elem_suivi => {
          data_suivi.push(elem_suivi);
        });
      }
      this.dataSourceSingleSuivi.data = data_suivi;
    });
    this.isClickedElemCultToSuivi = true;
  }
  compareObjectsEc(ec1: any, ec2: any) {
    console.log(ec1);
    console.log(ec2);
    return ec1 && ec2? ec1.value === ec2.value : ec2 === ec2;
  }

  // Modal Data
  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      cssClass: 'my-custom-modal-suivi',
      backdropDismiss: false,
      componentProps: {
        isSuiviRp: true,
        association: this.data_association,
        saison: this.data_saison,
        pms: this.data_pms,
        parcelle: this.data_parcelle_pms,
        espece: this.data_espece,
        variette: this.data_var
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

  // Event selected mattable groupe
  selectMatTab(index: number) {
    console.log("index Mat-Tab Selected : " + index);
    this.initDataTable();
    this.suiviForm.reset();
    if (index == 0) {
      this.dataSource.filter = '';
      this.dataSource.data = this.data_culture;
    } else if (index == 1) {
      console.log("selected index 1*******");   
    } 
  }

  initDataTable() {
    if (this.isUpdated) {
      this.displayedColumns.pop();//remove the last element
      this.isEditableCulte = false;
      this.isNewCultureClicked = false;
      this.indexRowEdit = null;
      this.isUpdated = false;
    }
    if (this.isSuiviClicked) {
      this.isSuiviClicked = false;
      this.isClickedElemCultToSuivi = false;
      this.isNewItemsSuivi = false;
      this.isEditableSuivi = false;
      this.displayedColumns.pop();
      //this.displayedColumnsSuivi.pop();
      this.indexRowSuivi = null;
    }
  }

}
