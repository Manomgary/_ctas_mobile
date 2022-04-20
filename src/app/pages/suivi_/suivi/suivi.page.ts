import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalPage } from '../../modal/modal.page';

import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file/ngx';
import { Benef_activ_pms, Local_Parcelle, Loc_all_suivi_mep, Loc_association, Loc_culture_Pms, Loc_Espece, Loc_saison, Loc_suivi_mep, Loc_variette } from 'src/app/interfaces/interfaces-local';
import { Db_Culture_pms, Db_suivi_pms } from 'src/app/interfaces/interface-insertDb';

// DATE IMPORT 
import * as _moment from 'moment';
import { Moment } from 'moment';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Add the new import Image
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { IMAGE_DIR } from 'src/app/utils/global-variables';

const moment = _moment;

interface newCulture {
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
// Interface Export Mep 
interface Mep_export {
  Saison: string,
  Annee_du: string,
  Association: string,
  Code_pms: string,
  Nom: string,
  Prenom: string,
  Code_parce: string,
  Sfce_reel: number,
  Ddp: string,
  variette: string,
  qsa: number,
  Dds: string,
  sfce_emblavee: number,
  Objectif: number,
  Sc: string,
  ea :string
}

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.page.html',
  styleUrls: ['./suivi.page.scss'],
})
export class SuiviPage implements OnInit {
  suiviForm: FormGroup;

  // image
  images: LocalFile[] = [];

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
  private filterDataAssoc: any[] = [];
  private filterDataBenef: any[] = [];
  private pmsToFilter: Benef_activ_pms[] = [];
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
  private fileLastImage: LocalFile = {
    name: null,
    path: null,
    data: null
  };

  arr:any[] = [];

  // table culture
  private displayedColumns: string[] = ['saison', 'association', 'code_pms', 'nom_pms', 'code_parce', 'variette', 'qsa', 'img_fact', 'dds', 'sfce', 'objectif', 'sc', 'ea'];
  private displayedColumnsNew: string[] = ['new_saison', 'new_association', 'new_code_pms', 'new_nom_pms', 'new_code_parce', 'new_variette', 'new_qsa', 'new_img_fact', 'new_dds', 'new_sfce', 'new_objectif', 'new_sc', 'new_ea', 'new_action'];
  private displayedColumnsSuivi: string[] = ['ddp', 'stc', 'ec', 'pb', 'ex', 'img_cult', 'controle', 'action'];
  private displayedNewColumnsSuivi: string[] = ['new_ddp', 'new_stc', 'new_ec', 'new_pb', 'new_ex', 'new_img_cult', 'new_controle', 'new_action'];
  private displayedColmnSv: string[] = ['saison', 'annee', 'association', 'code_pms', 'nom_pms', 'code_parce', 'variette', 'qsa', 'dds', 'ddp', 'stc', 'ec', 'img_cult', 'pb', 'ex', 'ctrl']

  private dataSource = new MatTableDataSource<Loc_culture_Pms>();
  private dataSourceSingleSuivi = new MatTableDataSource<any>();
  private dataSourceSuivi = new MatTableDataSource<Loc_all_suivi_mep>();
  private data_suivi_mep: Loc_suivi_mep[] = [];
  private data_all_suivi_mep: Loc_all_suivi_mep[] = [];
  private mepToExport: Mep_export[] = [];

  constructor(private plt: Platform,
              private router: Router, 
              private loadData: LoadDataService,
              private crudDb: CrudDbService,
              private modalCtrl: ModalController,
              private file: File,
              private loadingCtrl: LoadingController,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController) { 
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
        this.dataSource.data = this.data_culture;
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
    //this.loadFiles();
    this.dataSource.data = this.data_culture;
  }

  // filtre
  applyFilterSelect(value, source: string) {
    console.log("function applyFiltre::: ",value);
    let filterMep: Loc_culture_Pms[] = [];
    if (source === 'association') {
      const filterVal = value.code_assoc;
      this.dataSource.filter = filterVal.trim();
      filterMep = this.data_culture.filter(item => {
        return item.code_ass === filterVal.trim();
      });
      this.filterDataBenef = this.pmsToFilter.filter(item => {
        return item.id_association === filterVal;
      });
      this.loadExportMep(filterMep);
    } else if (source === 'pms') {
      if (value != undefined) {
        const filterVal = value.code_benef_pms;
        this.dataSource.filter = filterVal.trim();
        filterMep = this.data_culture.filter(item => {
          return item.code_benef_pms === filterVal.trim();
        });
        this.loadExportMep(filterMep);
      } else {
        console.log("Selectionner Aucun!!", value);
        const filterVal = this.selectedAssoc.code_assoc;
        this.dataSource.filter = filterVal.trim();
        filterMep = this.data_culture.filter(item => {
          return item.code_ass === filterVal.trim();
        });
        this.loadExportMep(filterMep);
      }
    } else if (source === 'assoc_suivi') {
      // filter suivi
      const filterVal = value.code_assoc;
      this.dataSourceSuivi.filter = filterVal.trim();
      this.filterDataBenef = this.pmsToFilter.filter(item => {
        return item.id_association === filterVal;
      });
    } else if (source === 'pms_suivi') {
      // filter suivi
      if (value != undefined) {
        const filterVal = value.code_benef_pms;
        this.dataSourceSuivi.filter = filterVal.trim();
      } else {
        const filterVal = this.selectedAssoc.code_assoc;
        this.dataSourceSuivi.filter = filterVal.trim();
      }
    }
  }
  applyFilterTout(source: string) {
    if (source === 'association') {
      this.dataSource.filter  = '';
      this.dataSource.data = this.data_culture;
      this.filterDataBenef = [];
      this.loadExportMep(this.data_culture);
    } else if(source === 'assoc_suivi') {
      this.dataSourceSuivi.filter = '';
      this.dataSourceSuivi.data = this.data_all_suivi_mep;
      this.filterDataBenef = [];
    }
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
                this.filterDataAssoc.push({
                  code_assoc: elem_ass.code_ass,
                  nom_assoc : elem_ass.nom_ass
                  });
                this.loadData.loadBeneficiairePms(elem_ass.code_ass).then(res_pms => {
                  console.log("+++++ Response Beneficiaire PMS++++++++");
                  console.log(res_pms);
                  res_pms.values.forEach((elem_pms: Benef_activ_pms) => {
                    this.data_pms.push(elem_pms);
                    this.pmsToFilter.push(elem_pms);
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
                // load All suivi mep Association
                this.loadData.loadAllSuiviCulture(elem_ass.code_ass).then(res_suivi => {
                  console.log("Response load All Suivi::: ",res_suivi.values);
                  if (res_suivi.values.length > 0) {
                    res_suivi.values.forEach((elem, i) => {
                      this.data_all_suivi_mep.push(elem);
                    });
                  }
                });
                this.loadCulture(elem_ass.code_ass);
              });
            }
            this.dataSource.data = this.data_culture;
            this.dataSourceSuivi.data = this.data_all_suivi_mep;
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
        res_cult.values.forEach((elem_cult, i) => {
          this.data_culture.push(elem_cult);
          if ((res_cult.values.length - 1) === i) {
            this.loadExportMep(this.data_culture);
          }
        });
      }
      console.log(this.data_culture);
    });
  }
  // load Export Mep
  loadExportMep(mep_pms: Loc_culture_Pms[]) {
    console.log("Data Mep to Export ::", mep_pms)
    this.mepToExport = [];
    mep_pms.forEach(item => {
      this.mepToExport.push({
        Saison: item.saison,
        Annee_du: item.annee_du,
        Association: item.association,
        Code_pms: item.code_benef_pms,
        Nom: item.nom,
        Prenom: item.prenom,
        Code_parce: item.id_parce,
        Sfce_reel: item.superficie,
        Ddp: item.ddp,
        variette: item.nom_var,
        qsa: item.qsa,
        Dds: item.dds,
        sfce_emblavee: item.sfce,
        Objectif: item.objectif,
        Sc: item.sc,
        ea :item.ea
      });
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
    console.log(this.arr);
    var ws = XLSX.utils.json_to_sheet(this.mepToExport);
    var ws2 = XLSX.utils.json_to_sheet(this.data_all_suivi_mep);
    /**var wb = {
      Sheets: {
        'data_sheet': ws
      },
      SheetNames: ['MEP', 'suivi']
    };*/
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MEP");
    XLSX.utils.book_append_sheet(wb, ws2, "Suivi");

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
    const data = {
      intitule : "add_suivi",
    }
    this.presentModal(data);
  }
  onCancelSauvegarde() {
    this.initDataTable();
  }
  onSauvegarde() {
    
  }
  onClickModifElement(index, row) {
    console.log('index ' + index);
    console.log('row ', row);
    this.code_cult_selected = row.code_culture;
    const data = {
      intitule : "edit_suivi",
      data: row
    }
    this.presentModal(data);
    this.isEditableCulte = true;
    this.indexRowEdit = index;
  }
  onClickSuiviElementMep(i: number, elem: any) {
    console.log(i);
    console.log(elem);
    this.code_cult_selected = elem.code_culture;
    this.loadSuiviMep(this.code_cult_selected)
    this.isClickedElemCultToSuivi = true;
  }
  openDialog(row) {
    console.log(row);
  }

  /*******************
   * Edit action
   *******************/
   onClickEditDoneAction(table, row) {
    if (table === 'culture') {
      console.log(row);
      console.log("Edit culture *** ,", this.new_culte);
      const  editCulte: Db_Culture_pms = {
        code_culture:  this.code_cult_selected,
        id_parce: this.new_culte.parcelle,
        id_var: this.new_culte.code_variette,
        id_saison: this.new_culte.code_saison,
        annee_du: this.new_culte.annee_du,
        ddp: this.new_culte.ddp.format("YYYY-MM-DD"),
        dt_creation: row.dt_creation,
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
        Etat: row.Etat === "ToSync" ? 'ToSync':'ToUpdate',
      }
      this.crudDb.UpdatedCulture(editCulte).then(res => {
        console.log(res.changes);
      });
      this.isEditableCulte = false;
    }
   }
   onClickEditCancelAction(table) {
    if (table === 'culture') {
      this.isEditableCulte = false;
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
    this.isNewCultureClicked = false;
    this.codeCulture = null;
  }
  onClickCancelAction() {
    this.isNewCultureClicked = false;
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
  async onCancelAddSuivi() {
    if (this.fileLastImage != undefined && this.fileLastImage.data !== null) {
      this.deleteImage(this.fileLastImage);
      this.fileLastImage = {
        data: null,
        name: null,
        path: null
      }
    }
    this.isNewItemsSuivi = false;
    //this.displayedColumnsSuivi.pop();
  }
  onSaveAddSuivi() {
    console.log("***Add Suivi*********");
    console.log("Image length ***::::: " , this.images.length);
    let val = this.suiviForm.value;
    let ddp:Moment = val.ddp;
    let order: number = 1;
    let data_: Db_suivi_pms = {
      id: '',
      code_culture: this.code_cult_selected,
      ddp: ddp.format("YYYY-MM-DD"),
      stc: val.stc,
      ec: val.ec.value,
      pb: val.pb,
      ex: val.ex,
      img_cult: this.fileLastImage.data,
      name: this.fileLastImage.name,
      path: this.fileLastImage.path,
      controle: val.controle,
      etat: "ToSync"
    }
    console.log(val);
    console.log(data_);
    if (this.data_suivi_mep.length > 0) {
      this.data_suivi_mep.forEach((elem, i) => {
        if ((this.data_suivi_mep.length - 1)  === i) {
          console.log("Derniere elem data_sui mep::", elem);
          let arr_code_mep = elem.id.trim().split("_");
          order  = parseInt(arr_code_mep[arr_code_mep.length - 1]) + 1;
          console.log("Order value ", order);
          data_.id = this.code_cult_selected + "_" + order.toString();
        }
      });
    } else {
      console.log("code_culture selectionner", this.code_cult_selected);
      data_.id = this.code_cult_selected + "_" + order.toString();
    }
    this.crudDb.AddNewSuivi(data_).then(async res => {
      console.log(res.changes);
      this.loadSuiviMep(this.code_cult_selected);
    });
    if  (this.fileLastImage != undefined && this.fileLastImage.data !== null) {
      this.deleteImage(this.fileLastImage);
      this.fileLastImage = {
        data: null,
        name: null,
        path: null
      }
    }
    this.isNewItemsSuivi = false;
    this.suiviForm.reset();
  }

  onSaveEditSuivi(elem) {
    console.log("Row Save Edit ", elem);
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
      img_cult: this.fileLastImage.data === 'null' || this.fileLastImage.data === null? elem.img_cult:this.fileLastImage.data,
      name: this.fileLastImage.name === 'null' || this.fileLastImage.name === null? elem.name:this.fileLastImage.name,
      path: '',
      controle: val.controle,
      etat: elem.etat === "ToSync"? "ToSync": "ToUpdate"
    }
    console.log(this.suiviForm.value);
    console.log(data_);
    this.crudDb.UpdatedSuivi(data_).then(res => {
      console.log(res.changes);
    });
    if  (this.fileLastImage != undefined && this.fileLastImage.data !== null) {
      this.deleteImage(this.fileLastImage);
      this.fileLastImage = {
        data: null,
        name: null,
        path: null
      }
    }
    this.suiviForm.reset();
    console.log()
  }
  onCancelEditSuivi() {
    if (this.fileLastImage != undefined && this.fileLastImage.data !== null) {
      this.deleteImage(this.fileLastImage);
      this.fileLastImage = {
        data: null,
        name: null,
        path: null
      }
    }
    this.isEditableSuivi = false;
    this.suiviForm.reset();
  }

  // load suivi Mise en place culture
  loadSuiviMep(code_cult: string) {
    this.data_suivi_mep = []; // suivi mise en place culture
    this.loadData.loadSuiviCulture(code_cult).then(res_suivi => {
      console.log(res_suivi);
      if (res_suivi.values.length > 0) {
        res_suivi.values.forEach(elem_suivi => {
          this.data_suivi_mep.push(elem_suivi);
        });
      }
      this.dataSourceSingleSuivi.data = this.data_suivi_mep;
    });
  }
  compareObjectsEc(ec1: any, ec2: any) {
    console.log(ec1);
    console.log(ec2);
    return ec1 && ec2? ec1.value === ec2.value : ec2 === ec2;
  }

  // Modal Data
  async presentModal(data_: any) {
    console.log(data_)
    let modal: any;
    if (data_.intitule == 'add_suivi') {
      modal = await this.modalCtrl.create({
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
      })
    } else {
      modal = await this.modalCtrl.create({
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
          variette: this.data_var,
          data_edit: data_.data
        }
      })
    }
    // dismissed
    modal.onDidDismiss().then((data_modal) => {
      console.log("*** Modal Suivi dismissed ****");
      console.log(data_modal);
      if (data_modal.data != undefined) {
        let res = data_modal.data;
        this.new_culte = res.new_cult;
        if (data_.intitule == 'add_suivi') {
          console.log("**Add suivi dismissed");
          this.isNewCultureClicked = true;
        } else {
          console.log("**Edit suivi dismissed");
        }
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
      this.initFiltre();
    } else if (index == 1) {
      this.initFiltre();
      console.log("selected index 1*******");   
    } 
  }

  initFiltre() {
    // init mep
    this.dataSource.filter = '';
    this.dataSource.data = this.data_culture;
    // init suivi
    this.dataSourceSuivi.filter = '';
    this.dataSourceSuivi.data = this.data_all_suivi_mep;
    this.selectedAssoc = null;
    this.selectedBeneficiare = null;
    this.loadExportMep(this.data_culture);
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
      this.data_suivi_mep = [];
    }
  }


  // image 
  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 50,//90
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      saveToGallery: false,
    });

    if (image) {
      this.saveImage(image);
    }
  }

  async saveImage(photo: Photo) {
    const base64 = await this.readAsBase64(photo);
    console.log(base64);

    const fileName = new Date().getTime()  + 'jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path:  `${IMAGE_DIR}/${fileName}`,
      data: base64
    }).then(res_sucess => {
      console.log("File system write File sucess::: ",res_sucess)
    },  async (err) => {
      // Folder does not yet exists!
      console.log("error write File::: Folder does not yet exists! :::", err);
    }).then(res => 
      {
        console.log("writed file=========");
        // Reload the file list
        // Improve by only loading for the new image and unshifting array!
        this.loadFiles(photo);
    });
    console.log('saved:', savedFile);
  }

  // https://ionicframework.com/docs/angular/your-first-app/3-saving-photos
  private async readAsBase64(photo: Photo) {
    console.log("***************************");
    console.log(photo);
    if (this.plt.is('hybrid')) {
        console.log("-------------HYBRIDE TESTE--------------");
        const file = await Filesystem.readFile({
            path: photo.path
        });

        return file.data;
    }
    else {
        // Fetch the photo, read as a blob, then convert to base64 format
        console.log("------------web Path---------");
        const response = await fetch(photo.webPath);
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

  async loadFiles(photo: Photo) {
    this.images = [];
 
    Filesystem.readdir({
      path: IMAGE_DIR,
      directory: Directory.Data,
    }).then(result => {
      console.log('HERE:  ', result);
      if (result.files.length > 0) {
        this.loadFileData(result.files);
      } else console.log("resultat load file est nulle, ", result.files);
      this.deleteLocalImage(photo);
    },
      async (err) => {
        // Folder does not yet exists!
        console.log("Folder doen't existe:: ", IMAGE_DIR);
      }
    ).then(_ => {
      //loading.dismiss();
    });
  }

    // Get the actual base64 data of an image
  // base on the name of the file
  async loadFileData(fileNames: string[]) {
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;
 
      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });
 
      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      });
    }
    this.fileLastImage = this.images[this.images.length - 1];
  }
  async deleteLocalImage(photo: Photo) {
      // Delete local image
      await Filesystem.deleteFile({
        path: photo.path
      });
  }

  async deleteImage(file: LocalFile) {
    console.log("Delete Image file:::: ",file);
    await Filesystem.deleteFile({
        directory: Directory.Data,
        path: file.path
    });
    this.presentToast('File removed.');
  }

  // Little helper
  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
    });
    toast.present();
  }
}
