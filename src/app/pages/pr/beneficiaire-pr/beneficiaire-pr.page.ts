import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UpdateBenef, UpdateBenefActivPr } from 'src/app/interfaces/interface-insertDb';
import { LocalFile, Loc_activ_projet, Loc_cep_PR, Loc_collaborateur, Loc_Commune, Loc_district, Loc_Fokontany, Loc_PR, Loc_projet, Loc_region } from 'src/app/interfaces/interfaces-local';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalPrPage } from '../../modals/modal-pr/modal-pr.page';

import * as _moment from 'moment';
import { ACTIVE, SYNC } from 'src/app/utils/global-variables';
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

  displayedColumnsPR: string[] = ['img_pr', 'code_pr', 'code_achat', 'nom', 'sexe', 'surnom', 'cin', 'commune', 'fokontany', 'action'];
  displayedAddColumnsPR: string[] = ['new_img_pr', 'new_code_pr', 'new_code_achat', 'new_nom', 'new_sexe', 'new_surnom', 'new_cin', 'new_commune', 'new_fokontany', 'new_action'];
  displayedColumnsParce: string[] = ['code_parce', 'bloc', 'ref_gps', 'lat', 'log', 'superficie', 'commune', 'fokontany'];

  // data source Mep
  dataSourcePR = new MatTableDataSource<Loc_PR>();
  dataSourceParce = new MatTableDataSource<Loc_cep_PR>();

  data_collaborateur: Loc_collaborateur[] = [];

  isTablePRExpanded = false;
  isAddPr: boolean = false;

  isUpdate = false;
  indeRowEdit: number;
  isRowEdit = false;

  constructor(
      private router: Router,
      private loadService: LoadDataService,
      private modalCtrl: ModalController,
      private crudService: CrudDbService
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
    this.loadCollabo();
    this.loadPRBloc();
    let data_  = {
      code_projet: this.projet.code_proj,
      code_equipe: this.user[this.user.length - 1].id_equipe
    }
    this.loadService.loadAnimationVe(data_).then(res => {
      console.log("::::::Data animation Visite Echange:::", res);
    });
  }

  ionViewDidEnter() {
    console.log(":::::LifeCycle Suivi function:::: ionViewDidEnter:::");
  }

  onFinish() {
    this.isUpdate = false;
    this.isAddPr = false;
    this.isRowEdit = false;
    this.indeRowEdit = null;
  }

  onUpdate() {
    this.isUpdate = true;
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

  // Save Edit
  onClickSaveEdit(data: Loc_PR) {
    console.log("data::::", data);
    console.log("Data to Update:::::::", this.update_benef);
    // Request To update
    
    this.isRowEdit = false;
    this.indeRowEdit = null;
  }
  onClickCancelEdit() {
    this.isRowEdit = false;
    this.indeRowEdit = null;
  }

  // loadCollaborateur
  loadCollabo() {
    this.loadService.loadCollaborateurs().subscribe(data => {
      this.data_collaborateur = data;
    });
  }

  // load Parcelle
  loadPRBloc() {
    let data = {
      code_projet: this.projet.code_proj,
      id_tech: this.user[this.user.length - 1].id_equipe
    }
    this.loadService.loadPRParceBloc(data).then(res => {
      console.log("Response Parcele PR::", res.values);
      this.data_parce = res.values;
      console.log("Parcelle PR::::", this.data_parce);
    });
    this.loadService.loadPRBloc(data).then(res => {
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

  onSaveAddPr() {
    console.log(this.update_benef);
    let collaborateur: Loc_collaborateur = null;
    let code_benef: string = 'B' + '-' + this.user[this.user.length - 1].id_equipe + '-' + moment().format('YYYYMMDD-HHmmss');
    let img_cin: any = {
      img_1: this.update_benef.img_cin_1.data,
      img_2: this.update_benef.img_cin_2.data
    };
    
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
      img_cin:  this.update_benef.img_cin_1 != null?this.update_benef.img_cin_1.data: null,
      contact: this.update_benef.contact,
      id_fkt: this.update_benef.fokontany != null?this.update_benef.fokontany.code_fkt:null,
      id_commune: this.update_benef.commune != null?this.update_benef.commune.code_com: null,
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
    this.crudService.AddBenef(data_to_add).then(res => {
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
      });

    });
    this.isAddPr = false;
  }
  onCancelAddPr() {
    this.isAddPr = false;
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

  async onPresentModal(data: any) {
    let data_: any;
    if (data.src === 'add') {
      data_ = {
        isBenefPr: true,
        isAdd: true
      }
    } else if (data.src === 'edit') {
      data_ = { 
        isBenefPr: true,
        isEdit: true,
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

  onClick() {
    this.router.navigate(['homes']);
  }

}
