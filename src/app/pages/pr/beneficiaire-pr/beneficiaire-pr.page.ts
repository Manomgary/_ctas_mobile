import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { UpdateBenef, UpdateBenefActivPr, UpdateParcePr } from 'src/app/interfaces/interface-insertDb';
import { LocalFile, Loc_activ_projet, Loc_cep_PR, Loc_collaborateur, Loc_Commune, Loc_district, Loc_export_excel, Loc_Fokontany, Loc_PR, Loc_projet, Loc_region } from 'src/app/interfaces/interfaces-local';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalPrPage } from '../../modals/modal-pr/modal-pr.page';

import { ACTIVE, SYNC, UPDATE } from 'src/app/utils/global-variables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import * as _moment from 'moment';
const moment = _moment;

interface Update_pr {
  img_pr: LocalFile,
  nom: string,
  prenom: string,
  surnom: string,
  sexe: string,
  dt_naissance: string,
  dt_naissance_vers: string,
  cin: number,
  img_cin_1: LocalFile,
  img_cin_2: LocalFile,
  dt_delivrance: string,
  lieu_delivrance: string,
  code_achat: string,
  contact: string,
  region: Loc_region,
  district: Loc_district,
  commune: Loc_Commune,
  fokontany: Loc_Fokontany,
  village: string
}

interface BlocEquipe {
  code_bloc: string, 
  nom: string, 
  ancronyme: string, 
  id_prjt: string, 
  id_tech: string, 
  status: string
}

@Component({
  selector: 'app-beneficiaire-pr',
  templateUrl: './beneficiaire-pr.page.html',
  styleUrls: ['./beneficiaire-pr.page.scss'],
  animations: [ //utiliser pour @detailExpand (table expendable)
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class BeneficiairePrPage implements OnInit {

  cepForm: FormGroup;

  private update_benef: Update_pr = {
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
    contact: null,
    region: null,
    district: null,
    commune: null,
    fokontany: null,
    village: null,
    lieu_delivrance: null,
    code_achat: null
  };

  private projet: Loc_projet;
  private user: Utilisateurs[];
  private activite: Loc_activ_projet;

  private data_pr: Loc_PR[] = [];
  private data_parce: Loc_cep_PR[] = [];

  displayedColumnsPR: string[] = ['img_pr', 'code_pr', 'code_achat', 'nom', 'surnom', 'sexe', 'dt_nais', 'cin', 'commune', 'fokontany', 'action'];
  displayedAddColumnsPR: string[] = ['new_img_pr', 'new_code_pr', 'new_code_achat', 'new_nom', 'new_surnom', 'new_sexe', 'new_dt_nais', 'new_cin', 'new_commune', 'new_fokontany', 'new_action'];
  displayedColumnsParce: string[] = ['code_parce', 'bloc', 'ref_gps', 'lat', 'log', 'superficie', 'region', 'district', 'commune', 'fokontany'];
  displayedColumnsAddParce = ['new_code_parce', 'new_bloc', 'new_ref_gps', 'new_lat', 'new_log', 'new_superficie', 'new_region', 'new_district', 'new_commune', 'new_fokontany', 'new_action'];

  // data source Mep
  dataSourcePR = new MatTableDataSource<Loc_PR>();
  dataSourceParce = new MatTableDataSource<Loc_cep_PR>();

  data_collaborateur: Loc_collaborateur[] = [];

  isTablePRExpanded = false;
  isAddPr: boolean = false;
  isAddCep: boolean = false;

  isUpdate = false;
  indeRowEdit: number;
  indeRowEditCep: number;
  isRowEdit = false;
  isRowEditCep = false;

  data_region: Loc_region[] = [];
  data_district: Loc_district[] = [];
  data_commune: Loc_Commune[] = [];
  data_fokontany: Loc_Fokontany[] = [];
  data_district_filter: Loc_district[] = [];
  data_commune_filter: Loc_Commune[] = [];
  data_fokontany_filter: Loc_Fokontany[] = [];

  data_bloc: BlocEquipe[] = [];

  isAutresFkt: boolean = false;

  constructor(
      private router: Router,
      private loadService: LoadDataService,
      private modalCtrl: ModalController,
      private crudService: CrudDbService,
      private formBuilder: FormBuilder,
      private loadingCtrl: LoadingController,
      private exportExcel: ExportExcelService
    ) {
      const routeState = this.router.getCurrentNavigation().extras.state;
      console.log("Route state::::", routeState);
        if (routeState) {
          let projet: Loc_projet;
          projet = JSON.parse(routeState.projet);
          this.user = JSON.parse(routeState.user);
          this.activite = routeState.activite;
          this.projet = projet;
          console.log(":::Projet:::", this.projet);
          console.log(":::USers::::", this.user);
          console.log(":::Activiter::::", this.activite);
        }
     }

  ngOnInit() {
    this.cepForm = this.formBuilder.group({
      bloc: null,
      ref_gps: null,
      latitude: null,
      longitude: null,
      superficie: [null, Validators.required],
      region: [null, Validators.required],
      district: [null, Validators.required],
      commune: [null, Validators.required],
      fokontany: null,
      village: null
    });
    setTimeout(async () => {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.loadCollabo();
      this.loadPRBloc();
      this.loadZone();
      this.loadingCtrl.dismiss();
    }, 2000);
  }

  ionViewDidEnter() {
    console.log(":::::LifeCycle Suivi function:::: ionViewDidEnter:::");
  }

  onFinish() {
    
    setTimeout(async () => {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.isUpdate = false;
      this.isAddPr = false;
      this.isAddCep = false;
      if (this.isRowEdit) {
        this.isRowEdit = false;
        this.indeRowEdit = null;
      }
      if (this.isRowEditCep) {
        this.indeRowEditCep = null;
        this.isRowEditCep = false;
        this.indeRowEdit = null;
      }
      this.cepForm.reset();
      this.initUpdatedBenef();
      // remov last element 
      this.displayedColumnsParce.pop();
        this.loadingCtrl.dismiss();
    }, 1000);
  }

  onExport() {
    let data_To_Export: Loc_export_excel[] = [
    {
      data: this.data_pr,
      name_feuille: 'PR',
      name_file: 'PR' + '_' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme
    },
    {
      data: this.data_parce,
      name_feuille: 'CEP',
      name_file: 'PR' + '_' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme
    }
  ]
    this.exportExcel.onExport(data_To_Export);
  }

  onUpdate() {
    this.isUpdate = true;
    //Unshift(value) -> Add an elemen to the beginning of an array
    // push element array in specific position
    //this.displayedColumnsParce.splice(6, 0, 'region', 'district');
    this.displayedColumnsParce.push('action');
    //this.displayedColumnsParce = ['code_parce', 'bloc', 'ref_gps', 'lat', 'log', 'superficie', 'region', 'district', 'commune', 'fokontany', 'action'];
  }

  onEdit(data_: any) {
    console.log(":::Data edit:::", data_);
    this.indeRowEdit = data_.index_;
    let _data_: any = {
      src: 'edit', 
      element: data_.data
    };
    this.onPresentModal(_data_);
  }

  onAddCep(data: any) {
    //let data_ = {data: row, index_: i}
    console.log(data);
    this.isAddCep = true;
    this.indeRowEdit = data.index_;
    this.dataSourcePR.data.forEach((row, ind) => {
      if (ind === data.index_) {
        row.isExpanded = true;
      }
    });
  }

  // Edit Cep
  onEditCep(data: any) {
    //let data_ = {data: row, index: inde};
    console.log(":::Data Edit cep::", data);
    let element_cep: Loc_cep_PR = data.data;
    let fkt: Loc_Fokontany = null;
    let commune: Loc_Commune = null;
    let district: Loc_district = null;
    let region: Loc_region = null;
    let bloc_equipe: BlocEquipe = null;

    this.indeRowEditCep = data.index_cep;
    this.indeRowEdit = data.index_benef;
    this.isRowEditCep = true;

    // filtre
    this.data_district_filter = this.data_district.filter(item => {return item.id_reg === element_cep.code_region});
    this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === element_cep.code_district});
    this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com === element_cep.code_commune});

    this.data_fokontany_filter.forEach(item => {
      if (item.code_fkt === element_cep.id_fkt) {
        fkt = item;
      }
    });
    this.data_commune_filter.forEach(item => {
      if (item.code_com === element_cep.code_commune) {
        commune = item;
      }
    });
    this.data_district_filter.forEach(item => {
      if (item.code_dist === element_cep.code_district) {
        district = item;
      }
    });
    this.data_region.forEach(item => {
      console.log(":::::id_reg:::", item.code_reg, "::::code_reg:::", element_cep.code_region);
      if (item.code_reg === element_cep.code_region) {
        region = item
      }
    });

    this.data_bloc.forEach(elem => {
      if (elem.code_bloc === element_cep.id_bloc) {
        bloc_equipe = elem
      }
    });
    
    if (element_cep.village != null) {
      this.isAutresFkt = true;
    }
    
    this.cepForm.patchValue({
      bloc: bloc_equipe,
      ref_gps: element_cep.ref_gps,
      latitude: element_cep.lat,
      longitude: element_cep.log,
      superficie: element_cep.superficie,
      region: region,
      district: district,
      commune: commune,
      fokontany: fkt,
      village: element_cep.village
    });
  }

  // Save Edit
  onSaveEdit(elem: any) {
    console.log("data::::", elem);
    console.log("Data to Update:::::::", this.update_benef);
    let data: Loc_PR = elem.data;
    // Request To update
    let img_cin: string[] = [];
    if (this.update_benef.img_cin_1.data != null) {
      img_cin.push(this.update_benef.img_cin_1.data);
    } 

    if (this.update_benef.img_cin_2.data != null) {
      img_cin.push(this.update_benef.img_cin_2.data);
    }

    console.log("===img cin length===>", img_cin.length);
    console.log("===img cin ARRAY STRING===>", img_cin.toString());

    
    let data_to_update: UpdateBenef = {
      code_benef: data.id_benef,
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
      dt_Insert: moment().format("YYYY-MM-DD"),
      etat: data.etat === SYNC?SYNC:UPDATE,
      statut: ACTIVE
    };
    
    this.crudService.UpdateBenef(data_to_update).then(res => {
      let update_pr: UpdateBenefActivPr = {
        code_pr: data.code_pr,
        id_proj: this.projet.code_proj,
        id_activ: this.activite.id_activ,
        id_benef: data.id_benef,
        id_bloc: null,
        code_achat: this.update_benef.code_achat,
        id_collaborateur: data.id_collaborateur,
        id_tech: data.id_tech,
        etat: data.etat === SYNC?SYNC:UPDATE,
        status: ACTIVE
      }
      console.log(":::::Benef PR ToAdd Data:::", update_pr);
      this.crudService.UpdatePrBenef(update_pr).then(res => {
        this.loadPRBloc();
        this.initUpdatedBenef();
      });
    });
    this.isRowEdit = false;
    this.indeRowEdit = null;
  }
  onCancelEdit() {
    this.isRowEdit = false;
    this.indeRowEdit = null;
    this.initUpdatedBenef();
  }

  onSaveAddPr() {
    console.log(this.update_benef);
    let collaborateur: Loc_collaborateur = null;
    let code_benef: string = 'B' + '-' + this.user[this.user.length - 1].id_equipe + '-' + moment().format('YYYYMMDD-HHmmss');
    let img_cin: string[] = [];
    if (this.update_benef.img_cin_1.data != null) {
      img_cin.push(this.update_benef.img_cin_1.data);
    } 
    
    if (this.update_benef.img_cin_2.data != null) {
      img_cin.push(this.update_benef.img_cin_2.data);
    }

    console.log("===img cin length===>", img_cin.length);
    console.log("===img cin ARRAY STRING===>", img_cin.toString());

    
    let data_to_add: UpdateBenef = {
      code_benef: code_benef,
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
      dt_Insert: moment().format("YYYY-MM-DD"),
      etat: SYNC,
      statut: ACTIVE
    };

    this.data_collaborateur.forEach(elem => {
      if (elem.nom.trim().toUpperCase() === 'PR') {
        collaborateur = elem;
      }
    });

    console.log(":::::Benef ToAdd Data:::", data_to_add);
    this.crudService.AddBenef_(data_to_add).then(res => {
      let code_pr: string = collaborateur.ancronyme + '-' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme + '-' + moment().format('YYYYMMDD-HHmmss');
      let add_pr: UpdateBenefActivPr = {
        code_pr: code_pr,
        id_proj: this.projet.code_proj,
        id_activ: this.activite.id_activ,
        id_benef: code_benef,
        id_bloc: null,
        code_achat: this.update_benef.code_achat,
        id_collaborateur: collaborateur != null?collaborateur.code_col:null,
        id_tech: this.user[this.user.length - 1].id_equipe,
        etat: SYNC,
        status: ACTIVE
      }
      console.log(":::::Benef PR ToAdd Data:::", add_pr);
      this.crudService.AddPrBenef(add_pr).then(res => {
        this.loadPRBloc();
        this.initUpdatedBenef();
      });

    });
    this.isAddPr = false;
  }
  onCancelAddPr() {
    this.isAddPr = false;
    this.initUpdatedBenef();
  }
  // Add Cep
  onSaveAddCep(row) {
    this.isAddCep = false;
    this.indeRowEdit = null;

    let element: Loc_PR = row;
    console.log("value:::", this.cepForm.value);
    let value: any = this.cepForm.value;
    let code_parce: string = 'CEP' + '-' + this.user[this.user.length - 1].id_equipe + this.projet.ancronyme + '-' + moment().format('YYYYMMDD-HHmmss');
    let add_pr: UpdateParcePr = {
      code_parce: code_parce,
      id_bloc: value.bloc != null?value.bloc.code_bloc:null,
      id_benef: element.id_benef,
      ref_gps: value.ref_gps,
      lat: value.latitude,
      log: value.longitude,
      superficie: value.superficie,
      id_commune: value.commune != null?value.commune.code_com:null,
      id_fkt: value.fokontany != null?value.fokontany.code_fkt:null,
      village: value.village,
      anne_adheran: null,
      dt_creation: moment().format('YYYY-MM-DD'),
      etat: SYNC,
      status: ACTIVE
    }
    console.log("Champ Ecole To Add:::", add_pr);
    this.crudService.AddParcellePr(add_pr).then(res => {
      console.log(res);
      this.loadPRBloc();
      this.cepForm.reset();
    });
  }
  onCancelAddCep() {
    this.isAddCep = false;
    this.indeRowEdit = null;
    this.cepForm.reset();
  }

  // Edit Cep
  onSaveEditCep(element: Loc_cep_PR) {
    console.log("::::Edit data::::", this.cepForm.value);
    this.indeRowEditCep = null;
    this.isRowEditCep = false;
    let value: any = this.cepForm.value;
    let update_cep: UpdateParcePr = {
      code_parce: element.code_parce,
      id_bloc: value.bloc != null?value.bloc.code_bloc:null,
      id_benef: element.id_benef,
      ref_gps: value.ref_gps,
      lat: value.latitude,
      log: value.longitude,
      superficie: value.superficie,
      id_commune: value.commune != null?value.commune.code_com:null,
      id_fkt: value.fokontany != null?value.fokontany.code_fkt:null,
      village: value.village,
      anne_adheran: null,
      dt_creation: moment().format('YYYY-MM-DD'),
      etat: element.etat === SYNC?SYNC:UPDATE,
      status: ACTIVE
    }
    console.log("Champ Ecole To Update:::", update_cep);
    this.crudService.UpdateParcellePr(update_cep).then(res => {
      console.log(res);
      this.loadPRBloc();
      this.cepForm.reset();
    });
  }
  onCancelEditCep() {
    this.indeRowEditCep = null;
    this.isRowEditCep = false;
    this.indeRowEdit = null;
    this.cepForm.reset();
  }

  // on select aucun bloc
  onNoneBloc(){
    this.cepForm.patchValue({
      bloc: null
    });
  }

  // loadCollaborateur
  loadCollabo() {
    this.loadService.loadCollaborateurs().subscribe(data => {
      this.data_collaborateur = data;
    });
  }
  

  // load Parcelle
  async loadPRBloc() {
    let data = {
      code_projet: this.projet.code_proj,
      id_tech: this.user[this.user.length - 1].id_equipe
    }
    // load Bloc Equipe
    await  this.loadService.loadBlocEquipe(data).then(res => {
      this.data_bloc = [];
      if (res.values.length > 0) {
        res.values.forEach(item => {
          this.data_bloc.push(item);
        });
      }
    });

    await  this.loadService.loadPRParceBloc(data).then(res => {
      console.log("Response Parcele PR::", res.values);
      this.data_parce = res.values;
      console.log("Parcelle PR::::", this.data_parce);
    });
    await  this.loadService.loadPRBloc(data).then(res => {
      console.log("Response PR::", res.values);
      this.data_pr = res.values;

      if (this.data_pr.length > 0) {
        this.data_pr.forEach((item, i) => {
          if (this.data_parce.length > 0) {
            item.cep_pr = this.data_parce.filter(elem_parce => {return elem_parce.code_pr === item.code_pr});
          } else item.cep_pr = [];
        });
      }
      this.dataSourcePR.data = this.data_pr;
      console.log("PR::::", this.dataSourcePR.data);
    });
  }

  // loadZone
  loadZone() {
    this.loadService.loadRegion().subscribe(res => {
      if (res.length > 0) {
        res.forEach(item => {
          this.data_region.push(item);
        });
      }
    });
    this.loadService.loadAllDistrict().then(res => {
      let dist: Loc_district[] = res.values;
      if (dist.length > 0) {
        dist.forEach(item => {
          this.data_district.push(item);
        });
      }
    });
    this.loadService.loadCommune({}).then(res => {
      let commune: Loc_Commune[] = res.values;
      if (commune.length > 0) {
        commune.forEach(item => {
          this.data_commune.push(item);
        });
      }
    });
    this.loadService.loadFokontany({}).then(res => {
      let fkt: Loc_Fokontany[] = res.values;
      if (fkt.length > 0) {
        fkt.forEach(elem => {
          this.data_fokontany.push(elem);
        });
      }
    });
  }

  onSelectRegion() {
    // filter district
    let reg = this.cepForm.value;
    this.data_district_filter = this.data_district.filter(item => {return item.id_reg === reg.region.code_reg});
    // initialized
    this.cepForm.patchValue({
      district: null,
      commune: null,
      fokontany: null
    });
    this.data_commune_filter = [];
    this.data_fokontany_filter = [];
  }
  onSelectDistrict() {
    // filter commune
    let dist = this.cepForm.value;
    this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === dist.district.code_dist});
    // initialized
    this.cepForm.patchValue({
      commune: null,
      fokontany: null
    });
    this.data_fokontany_filter = [];
  }
  onSelectCommune() {
    // filter fokontany
    let com = this.cepForm.value;
    this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com === com.commune.code_com});
    console
    // initialized
    this.cepForm.patchValue({
      fokontany: null
    });
  }
  onSelectFokontany(data: string) {
    // Autres
    if (data === 'fokontany') {
      this.isAutresFkt = false;
      this.cepForm.patchValue({
        village: null
      });
    } else if (data === 'autres') {
      this.isAutresFkt = true;
      this.cepForm.patchValue({
        fokontany: null
      });
    }
  }
  onSelectAutres() {
    // Autres
    this.cepForm.patchValue({
      fokontany: null
    });
  }

  async onPresentModal(data: any) {
    let data_: any;
    if (data.src === 'add') {
      data_ = {
        isBenefPr: true,
        isAdd: true,
        zone: {
          region: this.data_region,
          district: this.data_district,
          commune: this.data_commune,
          fokontany: this.data_fokontany
        }
      }
    } else if (data.src === 'edit') {
      data_ = { 
        isBenefPr: true,
        isEdit: true,
        zone: {
          region: this.data_region,
          district: this.data_district,
          commune: this.data_commune,
          fokontany: this.data_fokontany
        },
        element: data.element
      }
    }
    let modal = await this.modalCtrl.create({
      component: ModalPrPage,
      cssClass: 'modal-custum-pr',
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
          this.isAddPr = true;
        } else if (data.src === 'edit') {
          this.isRowEdit = true;
        }
      }
    });
    await modal.present();
  }

  onRefresh() {
    console.log("::::Date now::::::", moment().format('YYYYMMDD') + '-' + moment().format('HHmmss'));
    console.log("::::Date now Time::::::", moment().format('YYYYMMDD-HHmmss'));
    /**this.loadService.loadAllTable('participe_proj_volet').then(res => {
      console.log(":::::Projet Volety:::::", res);
    });
    this.loadService.loadAllTable('animation_ve').then(res => {
      console.log(":::::Animation Ve:::::", res);
    });
    this.loadService.loadAllTable('animation_ve_specu').then(res => {
      console.log(":::::Animation Speculation:::::", res);
    });
    this.loadService.loadAllTable('projet').then(res => {
      console.log(":::::Projet:::::", res);
    });
    this.loadService.loadAllTable('equipe').then(res => {
      console.log(":::::Equipe:::::", res);
    });
    this.loadService.loadAllTable('participe_proj_volet').then(res => {
      console.log(":::::participe_proj_volet:::::", res);
    });
    this.loadService.loadAllTable('projet_equipe').then(res => {
      console.log(":::::projet_equipe:::::", res);
    });
    this.loadService.loadAllTable('projet_equipe_volet').then(res => {
      console.log(":::::Projet Equipe Volet:::::", res);
    });*/
  }

  initUpdatedBenef() {
    this.update_benef = {
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
      contact: null,
      region: null,
      district: null,
      commune: null,
      fokontany: null,
      village: null,
      lieu_delivrance: null,
      code_achat: null
    }
  }

  onToggleTableRows() {
    this.isTablePRExpanded = !this.isTablePRExpanded;
    this.dataSourcePR.data.forEach(row => {
      if (row.cep_pr.length > 0) {
        row.isExpanded = this.isTablePRExpanded;
      } else {
        if (row.isExpanded) {
          row.isExpanded = false;
        }
      }
    });
  }

  onClick() {
    this.router.navigate(['homes']);
  }

}
