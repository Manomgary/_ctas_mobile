import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { Benef_activ_pms, Local_benef_activ_bl, Local_bloc_parce, Loc_all_suivi_bloc, Loc_AnimationSpecu, Loc_AnimationVe, Loc_AnneeAgricole, Loc_association, Loc_Bloc, Loc_categEspece, Loc_cep_PR, Loc_Collabo_Activite, Loc_Commune, Loc_district, Loc_Espece, Loc_Fokontany, Loc_MepPR, Loc_mep_bloc, Loc_Parce_saison, Loc_PR, Loc_region, Loc_saison, Loc_Suivi_MepPR, Loc_variette } from 'src/app/interfaces/interfaces-local';
import { CaptureImageService } from 'src/app/services/capture-image.service';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { EC_CULTURAL, SC, SEXE, STC, SYNC, UPDATE, VALIDE } from 'src/app/utils/global-variables';

import * as _moment from 'moment';
const moment = _moment;

interface LocalFile {
  name: string;
  date: string;
  data: string;
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
  selector: 'app-modal-pr',
  templateUrl: './modal-pr.page.html',
  styleUrls: ['./modal-pr.page.scss'],
})
export class ModalPrPage implements OnInit {
  beneficiaireForm: FormGroup;
  animeVeForm: FormGroup;
  mepForm: FormGroup;
  suiviMepForm: FormGroup;
  cepForm: FormGroup;
  parcePms: FormGroup;
  

  data_sexe: any[] = SEXE;
  // zone 
  data_region: Loc_region[] = [];
  data_district: Loc_district[] = [];
  data_commune: Loc_Commune[] = [];
  data_fokontany: Loc_Fokontany[] = [];
  data_district_filter: Loc_district[] = [];
  data_commune_filter: Loc_Commune[] = [];
  data_fokontany_filter: Loc_Fokontany[] = [];
  //
  isAutresFkt: boolean = false;

  isBenefPr: boolean = false;
  isBenefPms: boolean = false;
  isBenefBloc: boolean = false;

  // image
  fileImage_cin1: LocalFile = {
    name: null,
    date: null,
    data: null
  };
  fileImage_cin2: LocalFile = {
    name: null,
    date: null,
    data: null
  };
  fileImage_pr: LocalFile = {
    name: null,
    date: null,
    data: null
  };
  img_piece: LocalFile[] = [];

  isAddBenef = false;
  isEditBenef = false;
  element_benef: Loc_PR;
  element_pms: Benef_activ_pms = <Benef_activ_pms>{};

  isAddAnimeVe: boolean = false;
  isEditAnimeVe: boolean = false;
  element_animeVe: Loc_AnimationVe;
  data_pr: Loc_PR[] = [];
  
  specu_animeVe: any[] = [];
  isAddSpecu: boolean = false;
  data_espece: Loc_Espece[] = [];
  data_espece_filter: Loc_Espece[] = [];
  data_espece_filter_ea: Loc_Espece[] = [];
  data_var: Loc_variette[] = [];
  data_variette_filter: Loc_variette[] = [];
  data_variette_filter_ea: Loc_variette[] = [];
  data_categ: Loc_categEspece[] = [];
  data_categ_ea: Loc_categEspece[] = [];

  selected_categorie: Loc_categEspece = null;
  selected_espece: Loc_Espece = null;
  selected_variette: Loc_variette  = null;
  data_speculation: any[] = [];
  data_speculation_add: any[] = [];
  data_specu_delete: Loc_AnimationSpecu[] = [];
  data_anime_specu_update: Loc_AnimationSpecu[] = [];
  quantite: number;

  // Suivi PR
  isMepPr: boolean = false;
  isSuiviMepPr: boolean = false;
  // Add MEP PR
  isAddMepSG: boolean = false;
  isAddMepPa: boolean = false;
  isAddMepMv: boolean = false;
  // Edit
  isEditMepSG: boolean = false;
  isEditMepPa: boolean = false;
  isEditMepMv: boolean = false;
  // Add Suivi MEP PR 
  isAddMepSvSG: boolean = false;
  isAddMepSvPa: boolean = false;
  isAddMepSvMv: boolean = false;
  // Add Suivi MEP PR 
  isEditMepSvSG: boolean = false;
  isEditMepSvPa: boolean = false;
  isEditMepSvMv: boolean = false;

  data_Mep_Pr_edit: Loc_MepPR;
  data_Mep_suivi_PR: Loc_Suivi_MepPR;

  data_saison: Loc_saison[]  = [];
  data_cep: Loc_cep_PR[] = [];
  data_cep_filter: Loc_cep_PR[] = [];
  data_sc: any[] = SC;
  espece_unite: string = null;
  isAssocie: boolean = false;
  isCultureBande: boolean = false;
  isSelectedAutreCulte: boolean = false;
  annee_du: string[] = ['2021', '2022'];

  data_stc: any[] = STC;
  data_ec: any[] = EC_CULTURAL;

  data_bloc: BlocEquipe[] = [];

  isCepPr: boolean = false;
  isAddCepPr: boolean = false;
  isEditCepPr: boolean = false;

  element_cep: Loc_cep_PR;

  isSuiviMepBloc: boolean = false;
  data_Mep_bloc_edit: Loc_mep_bloc;
  data_Mep_suivi_Bloc: Loc_all_suivi_bloc;

  data_association: Loc_association[] = [];
  data_collaborateur: Loc_Collabo_Activite[] = [];

  isParcePms: boolean = false;
  isAddParcePms: boolean = false;
  isEditParcePms: boolean = false;
  elem_parce_pms: Loc_Parce_saison;

  data_annee_agricole: Loc_AnneeAgricole[] = [];
  parce_pms: Loc_Parce_saison[] = [];

  isNewParcePms: boolean = false;
  isExistParcePms: boolean = false;

  data_bloc_benef: Loc_Bloc[] = [];
  elem_benef_bl: Local_benef_activ_bl;

  isParceBl: boolean = false;
  elem_parce_bl: Local_bloc_parce;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private loadData: LoadDataService,
    private captureImg: CaptureImageService
  ) {
    if (this.navParams.get('isBenefPr') || this.navParams.get('isPms') || this.navParams.get('isBenefBloc')) {
      console.log(":::::::::Modal From PR element:::::::", this.navParams.get('element'));
      if (this.navParams.get('isBenefPr')) {
        this.isBenefPr = this.navParams.get('isBenefPr');
      } else if (this.navParams.get('isPms')) {
        this.isBenefPms = this.navParams.get('isPms');
        this.data_association = this.navParams.get('association');
        this.data_collaborateur = this.navParams.get('collaborateur');
      } else if (this.navParams.get('isBenefBloc')) {
        this.isBenefBloc = this.navParams.get('isBenefBloc');
        this.data_collaborateur = this.navParams.get('collaborateur');
        this.data_bloc_benef = this.navParams.get('bloc');
      }

      let zone = this.navParams.get('zone');
      this.data_region = zone.region;
      this.data_district = zone.district;
      this.data_commune = zone.commune;
      this.data_fokontany = zone.fokontany;

      if (this.navParams.get('isEdit')) {
        this.isEditBenef = this.navParams.get('isEdit');
        if (this.isBenefPr) {
          this.element_benef = this.navParams.get('element');
          this.data_district_filter = this.data_district.filter(item => {return item.id_reg === this.element_benef.code_region});
          this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === this.element_benef.code_dist});
          this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com ===this.element_benef.code_commune});
        } else if (this.isBenefPms) {
          this.element_pms = this.navParams.get('element');
          this.data_district_filter = this.data_district.filter(item => {return item.id_reg === this.element_pms.code_region});
          this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === this.element_pms.code_district});
          this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com ===this.element_pms.code_commune});
        } else if(this.isBenefBloc) {
          this.elem_benef_bl = this.navParams.get('element');
          this.data_district_filter = this.data_district.filter(item => {return item.id_reg === this.elem_benef_bl.code_reg});
          this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === this.elem_benef_bl.code_dist});
          this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com ===this.elem_benef_bl.code_commune});
        }
      } else if (this.navParams.get('isAdd')) {
        this.isAddBenef = this.navParams.get('isAdd');
      }
    }

    // get Parcelle PR
    if (this.navParams.get('isCepPr') || this.navParams.get('isParceBl')) {
      if (this.navParams.get('isCepPr')) {
        this.isCepPr = this.navParams.get('isCepPr');
        this.element_benef = this.navParams.get('elem_pr');
        this.data_bloc = this.navParams.get('bloc');
      } else if (this.navParams.get('isParceBl')) {
        this.isParceBl = this.navParams.get('isParceBl');
        this.elem_benef_bl = this.navParams.get('elem_benef');
        this.data_bloc_benef = this.navParams.get('bloc');
      }
      
      let zone = this.navParams.get('zone');
      this.data_region = zone.region;
      this.data_district = zone.district;
      this.data_commune = zone.commune;
      this.data_fokontany = zone.fokontany;

      if (this.navParams.get('isAddCep')) {
        this.isAddCepPr = this.navParams.get('isAddCep');
      } else if (this.navParams.get('isEditCep')) {
        this.isEditCepPr = this.navParams.get('isEditCep');
        if (this.isCepPr) {
          this.element_cep = this.navParams.get('elem_cep');

          this.data_district_filter = this.data_district.filter(item => {return item.id_reg === this.element_cep.code_region});
          this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === this.element_cep.code_district});
          this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com ===this.element_cep.code_commune});
        } else if (this.isParceBl) {
          this.elem_parce_bl = this.navParams.get('elem_parce');
          
          this.data_district_filter = this.data_district.filter(item => {return item.id_reg === this.elem_parce_bl.code_reg});
          this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === this.elem_parce_bl.code_dist});
          this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com ===this.elem_parce_bl.code_commune});
        }
      }
    }

    // get Parcelle Pms
    if (this.navParams.get('isParcePms')) {
      this.isParcePms = this.navParams.get('isParcePms');
      this.element_pms = this.navParams.get('elem_pms');
      let data_init = this.navParams.get('data_initial');

      let zone = this.navParams.get('zone');
      this.data_region = zone.region;
      this.data_district = zone.district;
      this.data_commune = zone.commune;
      this.data_fokontany = zone.fokontany;

      this.data_annee_agricole = data_init.annee_ag;
      this.data_saison = data_init.saison;
      this.data_espece = data_init.espece;
      this.data_var = data_init.variette;
      this.data_categ = data_init.categorie;
      this.data_espece_filter = this.data_espece.filter(item => {return item.id_categ === 1});
      this.parce_pms = this.element_pms.parcelle.filter(item_parce => {return item_parce.id_parce != null});

      if (this.navParams.get('isAdd')) {
        this.isAddParcePms = this.navParams.get('isAdd');
      } else if (this.navParams.get('isEdit')) {
        this.isEditParcePms = this.navParams.get('isEdit');
        this.elem_parce_pms = this.navParams.get('elem_parce');

        this.data_district_filter = this.data_district.filter(item => {return item.id_reg === this.elem_parce_pms.code_reg});
        this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === this.elem_parce_pms.code_dist});
        this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com ===this.elem_parce_pms.code_commune});
      }

    }

    if (this.navParams.get('isAnimationVe')) {
      let zone = this.navParams.get('zone');
      this.data_region = zone.region;
      this.data_district = zone.district;
      this.data_commune = zone.commune;
      this.data_fokontany = zone.fokontany;
      this.data_pr = this.navParams.get('pr');

      // Speculation
      this.data_categ = this.navParams.get('categorie');
      this.data_espece = this.navParams.get('espece');
      this.data_var = this.navParams.get('variette');

      if (this.navParams.get('isAddAnimeVe')) {
        this.isAddAnimeVe = this.navParams.get('isAddAnimeVe');
      } else if (this.navParams.get('isEditAnimeVe')) {
        this. isEditAnimeVe = this.navParams.get('isEditAnimeVe');
        this.element_animeVe = this.navParams.get('element');

        this.data_district_filter = this.data_district.filter(item => {return item.id_reg === this.element_animeVe.code_reg});
        this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === this.element_animeVe.code_dist});
        this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com ===this.element_animeVe.code_commune});
      }
    }

    // Get Suivi PR
    if (this.navParams.get('isSuiviPR')) {
      this.isMepPr = this.navParams.get('isSuiviPR');
      let data_initial = this.navParams.get('data_init');
      console.log("::::Data initiale::::", data_initial);
      this.data_saison = data_initial.saison;
      this.data_espece = data_initial.espece;
      this.data_var = data_initial.variette;
      this.data_categ = data_initial.categorie;
      this.data_pr = data_initial.pr;
      this.data_cep = data_initial.parcelle;
      this.data_annee_agricole = data_initial.annee_agricole;
      this.data_categ_ea = this.data_categ.filter(item => {return item.code_cat === 1});
      // Add
      if (this.navParams.get('isAddMepSg')) {
        this.isAddMepSG = this.navParams.get('isAddMepSg');
        this.data_espece_filter = this.data_espece.filter(item => {return item.id_categ === 1});
      } else if (this.navParams.get('isAddMepPa')) {
        this.isAddMepPa = this.navParams.get('isAddMepPa');
        this.data_espece_filter = this.data_espece.filter(item => {return item.id_categ === 2});
      } else if (this.navParams.get('isAddMepMv')) {
        this.isAddMepMv = this.navParams.get('isAddMepMv');
        this.data_espece_filter = this.data_espece.filter(item => {return item.id_categ === 3});
      }
      // Edit
      if (this.navParams.get('isEditMepSg')) {
        this.isEditMepSG = this.navParams.get('isEditMepSg');
        this.data_Mep_Pr_edit = this.navParams.get('element');
        this.data_espece_filter = this.data_espece.filter(item => {return item.id_categ === 1});
        console.log(":::Data EDIT SG:::", this.data_Mep_Pr_edit);
      } else if (this.navParams.get('isEditMepPa')) {
        this.isEditMepPa = this.navParams.get('isEditMepPa');
        this.data_Mep_Pr_edit = this.navParams.get('element');
        this.data_espece_filter = this.data_espece.filter(item => {return item.id_categ === 2});
        console.log(":::Data EDIT PA:::", this.data_Mep_Pr_edit);
      } else if (this.navParams.get('isEditMepMv')) {
        this.isEditMepMv = this.navParams.get('isEditMepMv');
        this.data_Mep_Pr_edit = this.navParams.get('element');
        this.data_espece_filter = this.data_espece.filter(item => {return item.id_categ === 3});
        console.log(":::Data EDIT MV:::", this.data_Mep_Pr_edit);
      }
    }
    /****************
     * suivi Mep PR // Bloc
     *******************/
    if (this.navParams.get('isSuiviSvPR') || this.navParams.get('isSuiviMepBloc')) {
      // Add 
      if (this.navParams.get('isSuiviSvPR')) {
        this.isSuiviMepPr = this.navParams.get('isSuiviSvPR');
        this.data_Mep_Pr_edit = this.navParams.get('data_mep');
      } else if (this.navParams.get('isSuiviMepBloc')) {
        this.isSuiviMepBloc = this.navParams.get('isSuiviMepBloc');
        this.data_Mep_bloc_edit = this.navParams.get('data_mep');
      }
      console.log(":::Elem Mep PR::::", this.data_Mep_Pr_edit);
      if (this.navParams.get('isAddSvSg')) {
        this.isAddMepSvSG = this.navParams.get('isAddSvSg');
      } else if (this.navParams.get('isAddSvPa')) {
        this.isAddMepSvPa = this.navParams.get('isAddSvPa');
      } else if (this.navParams.get('isAddSvMv')) {
        this.isAddMepSvMv = this.navParams.get('isAddSvMv');
      }
      // Edit
      if (this.navParams.get('isEditSvSg')) {
        this.isEditMepSvSG = this.navParams.get('isEditSvSg');
        if (this.isSuiviMepPr) {
          this.data_Mep_suivi_PR = this.navParams.get('data_elem_suivi');
        } else if (this.isSuiviMepBloc) {
          this.data_Mep_suivi_Bloc = this.navParams.get('data_elem_suivi');
        }

      } else if (this.navParams.get('isEditSvPa')) {
        this.isEditMepSvPa = this.navParams.get('isEditSvPa');
        if (this.isSuiviMepPr) {
          this.data_Mep_suivi_PR = this.navParams.get('data_elem_suivi');
        } else if (this.isSuiviMepBloc) {
          this.data_Mep_suivi_Bloc = this.navParams.get('data_elem_suivi');
        }

      } else if (this.navParams.get('isEditSvMv')) {
        this.isEditMepSvMv = this.navParams.get('isEditSvMv'); 
        if (this.isSuiviMepPr) {
          this.data_Mep_suivi_PR = this.navParams.get('data_elem_suivi');
        } else if (this.isSuiviMepBloc) {
          this.data_Mep_suivi_Bloc = this.navParams.get('data_elem_suivi');
        }
      }
      console.log(":::Elem Mep Suivi PR::::", this.data_Mep_suivi_PR);
    }
  }

  ngOnInit() {
    if (this.isBenefPms || this.isBenefPr || this.isBenefBloc) {
      this.initFormInfosBenef();
    }

    if (this.isAddAnimeVe || this.isEditAnimeVe) {
      this.loadFormAnimeVe();
    }
    if (this.isMepPr) {
      this.initFormMepPr();
    }
    if (this.isSuiviMepPr || this.isSuiviMepBloc) {
      this.initFormSuiviMepPr();
    }
    //  
    if (this.isCepPr || this.isParceBl) {
      this.initFormCepPr();
    }

    //
    if (this.isParcePms) {
      this.initFormParcePms();
    }
  }

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
  /*************************
   * Select formulaire
   ***************************/
  onSelectPR() {
    // filtrer CEP
    let val = this.mepForm.value;
    this.data_cep_filter = this.data_cep.filter(item => {return item.code_pr === val.beneficiaire.code_pr});
    this.mepForm.patchValue({
      parcelle: null
    });
  }
  onSelectCep() {
    // Select champs ecole
    console.log(":::Select champs ecole::::");
  }

  onSelectRegion() {
    // filter district
    let reg: any;
    if (this.isAddBenef || this.isEditBenef) {
      reg = this.beneficiaireForm.value;
    } else if (this.isAddAnimeVe || this.isEditAnimeVe) {
      reg = this.animeVeForm.value;
    } else if (this.isCepPr || this.isParceBl) {
      reg = this.cepForm.value;
    } else if (this.isParcePms) {
      reg = this.parcePms.value;
    }
    this.data_district_filter = this.data_district.filter(item => {return item.id_reg === reg.region.code_reg});
    // initialized
    if (this.isAddBenef || this.isEditBenef) {
      this.beneficiaireForm.patchValue({
        district: null,
        commune: null,
        fokontany: null
      });
    } else if (this.isAddAnimeVe || this.isEditAnimeVe) {
      this.animeVeForm.patchValue({
        district: null,
        commune: null,
        fokontany: null
      });
    } else if (this.isCepPr || this.isParceBl) {
      this.cepForm.patchValue({
        district: null,
        commune: null,
        fokontany: null
      });
    } else if (this.isParcePms) {
      this.parcePms.patchValue({
        district: null,
        commune: null,
        fokontany: null
      });
    }
    this.data_commune_filter = [];
    this.data_fokontany_filter = [];
  }
  onSelectDistrict() {
    // filter commune
    let dist: any;
    if (this.isAddBenef || this.isEditBenef) {
      dist = this.beneficiaireForm.value;
    } else if (this.isAddAnimeVe || this.isEditAnimeVe) {
      dist = this.animeVeForm.value;
    } else if (this.isCepPr || this.isParceBl) {
      dist =  this.cepForm.value;
    } else if (this.isParcePms) {
      dist = this.parcePms.value;
    }
    this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === dist.district.code_dist});
    // initialized
    if (this.isAddBenef || this.isEditBenef) {
      this.beneficiaireForm.patchValue({
        commune: null,
        fokontany: null
      });
    } else if (this.isAddAnimeVe || this.isEditAnimeVe) {
      this.animeVeForm.patchValue({
        commune: null,
        fokontany: null
      });
    } else if (this.isCepPr || this.isParceBl) {
      this.cepForm.patchValue({
        commune: null,
        fokontany: null
      });
    } else if (this.isParcePms) {
      this.parcePms.patchValue({
        commune: null,
        fokontany: null
      });
    }
    this.data_fokontany_filter = [];
  }
  onSelectCommune() {
    // filter fokontany
    let com: any;
    if (this.isAddBenef || this.isEditBenef) {
      com = this.beneficiaireForm.value;
    } else if (this.isAddAnimeVe || this.isEditAnimeVe) {
      com = this.animeVeForm.value;
    } else if (this.isCepPr || this.isParceBl) {
      com = this.cepForm.value;
    } else if (this.isParcePms) {
      com = this.parcePms.value;
    }
    this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com === com.commune.code_com});
    // initialized
    if (this.isAddBenef || this.isEditBenef) {
      this.beneficiaireForm.patchValue({
        fokontany: null
      });
    } else if (this.isAddAnimeVe || this.isEditAnimeVe) {
      this.animeVeForm.patchValue({
        fokontany: null
      });
    } else if (this.isCepPr || this.isParceBl) {
      this.cepForm.patchValue({
        fokontany: null
      });
    } else if (this.isParcePms) {
      this.parcePms.patchValue({
        fokontany: null
      });
    }
  }
  onSelectFokontany(data: string) {
    let controls_f: string[] = ['fokontany'];
    let controls_v: string[] = ['village'];

    // Autres
    if (data === 'fokontany') {
      this.isAutresFkt = false;
      if (this.isAddBenef || this.isEditBenef) {
        this.beneficiaireForm.patchValue({
          village: null
        });
      } else if (this.isAddAnimeVe || this.isEditAnimeVe) {
        this.animeVeForm.patchValue({
          village: null
        });
      } else if (this.isCepPr || this.isParceBl) {
        this.cepForm.patchValue({
          village: null
        });
      } else if (this.isParcePms) {
        this.parcePms.patchValue({
          village: null
        });
        this.removeValidators(controls_v);
      }
    } else if (data === 'autres') {
      this.isAutresFkt = true;
      if (this.isAddBenef || this.isEditBenef) {
        this.beneficiaireForm.patchValue({
          fokontany: null
        });
      } else if (this.isAddAnimeVe || this.isEditAnimeVe) {
        this.animeVeForm.patchValue({
          fokontany: null
        });
      } else if (this.isCepPr || this.isParceBl) {
        this.cepForm.patchValue({
          fokontany: null
        });
      } else if (this.isParcePms) {
        this.parcePms.patchValue({
          fokontany: null
        });
        this.removeValidators(controls_f);
      }
    }
  }
  onSelectAutres() {
    // Autres
    if (this.isAddBenef || this.isEditBenef) {
      this.beneficiaireForm.patchValue({
        fokontany: null
      });
    } else if (this.isAddAnimeVe || this.isEditAnimeVe) {
      this.animeVeForm.patchValue({
        fokontany: null
      });
    } else if (this.isCepPr) {
      this.cepForm.patchValue({
        fokontany: null
      });
    }
  }
  // Se lect Espece
  onSeletCateg(data: any) {
    if (this.isAddAnimeVe || this.isEditAnimeVe) {
      this.data_espece_filter = this.data_espece.filter(item => {return item.id_categ === this.selected_categorie.code_cat});
      this.selected_espece = null;
      this.selected_variette = null;
    }
    if (this.isMepPr) {
      if (data === 'autre') {
        this.isSelectedAutreCulte = true;
        this.mepForm.patchValue({
          categorie_ea: null,
          espece_ea: null,
          variette_ea: null
        });
      } else if (data === 'categorie') {
        this.mepForm.patchValue({
          espece_ea: null,
          variette_ea: null,
          autreCultureEa: null
        });
        this.isSelectedAutreCulte = false;
        // filtre Espece ea
        let val_categ: Loc_categEspece = this.mepForm.value.categorie_ea;
        this.data_espece_filter_ea = this.data_espece.filter(item => {return item.id_categ === val_categ.code_cat});
      }
    }
  }
  onSelectEspece(data: any) {
    if (this.isAddAnimeVe || this.isEditAnimeVe) {
      this.data_variette_filter = this.data_var.filter(item => {return item.id_espece === this.selected_espece.code_espece});
      this.selected_variette = null;
    } 
    if (this.isMepPr) {
      if (data === 'espece') {
        let val_espece: Loc_Espece = this.mepForm.value.espece;
        this.espece_unite = val_espece.unite;
        this.data_variette_filter = this.data_var.filter(item => {return item.id_espece === val_espece.code_espece});
        this.mepForm.patchValue({
          variette: null
        });
      } else if(data === 'espece_ea') {
        let val_espece_ea: Loc_Espece = this.mepForm.value.espece_ea;
        this.data_variette_filter_ea = this.data_var.filter(item => {return item.id_espece === val_espece_ea.code_espece});
        this.mepForm.patchValue({
          variette_ea: null
        });
      }
    }
    ///
    if (this.isParcePms) {
      let val_espece: Loc_Espece = this.parcePms.value.espece;
      this.data_variette_filter = this.data_var.filter(item => {return item.id_espece === val_espece.code_espece});
        this.parcePms.patchValue({
          variette: null
        });
    }
  }
  onSeletSc(data: any) {
    if (data === 'sc') {
      if (this.mepForm.value.sc.value === 'C.associé') {
        this.isAssocie = true;
        this.mepForm.patchValue({
          categorie_ea: null,
          espece_ea: null,
          variette_ea: null,
          autreCultureEa: null
        });
        this.data_espece_filter_ea = [];
        this.data_variette_filter_ea = [];
        this.isCultureBande = false;
      } else {
        this.isAssocie = false;
        this.mepForm.patchValue({
          categorie_ea: null,
          espece_ea: null,
          variette_ea: null,
          autreCultureEa: null
        });
        this.data_espece_filter_ea = [];
        this.data_variette_filter_ea = [];
        // Culture bande
        if (this.mepForm.value.sc.value === 'C.bande') {
          this.isCultureBande = true;
        } else this.isCultureBande = false;
      }
    } else if (data === 'none') {
      this.mepForm.patchValue({
        sc: null
      });
    }
  }
  onSelectNone(data: any) {
    if (data === 'stc') {
      this.suiviMepForm.patchValue({
        stc: null
      });
    }
    if (data === 'ec') {
      this.suiviMepForm.patchValue({
        ec: null
      });
    }
    if (data === 'bloc-cep') {
      this.cepForm.patchValue({
        bloc: null
      });
    }
   }
  

  onAddSpecu() {
     this.isAddSpecu = true;
  }

  // load Form Controle animation ve
  loadFormAnimeVe() {
    if (this.isAddAnimeVe) {
      this.animeVeForm = this.formBuilder.group({
        pr: [null, Validators.required],
        dt_anime: [null, Validators.required],
        nb_participant: [null, Validators.required],
        nb_femme: [null, Validators.required],
        nb_homme: [null, Validators.required],
        nb_inf_25: [null, Validators.required],
        speculation: null,
        img_piece: null,
        region: [null, Validators.required],
        district: [null, Validators.required],
        commune: [null, Validators.required],
        fokontany: null,
        village: null,
        quantite_specu: null,
        specu_delete: null,
        specu_add_edit: null
      });
    }
    if (this.isEditAnimeVe) {
      let fkt: Loc_Fokontany = null;
      let commune: Loc_Commune = null;
      let district: Loc_district = null;
      let region: Loc_region = null;
      let pr: Loc_PR;

      this.data_region.forEach(item => {
        if (item.code_reg === this.element_animeVe.code_reg) {
          region = item
        }
      });

      this.data_fokontany_filter.forEach(item => {
        if (item.code_fkt === this.element_animeVe.id_fkt) {
          fkt = item;
        }
      });
      this.data_commune_filter.forEach(item => {
        if (item.code_com === this.element_animeVe.code_commune) {
          commune = item;
        }
      });
      this.data_district_filter.forEach(item => {
        if (item.code_dist === this.element_animeVe.code_dist) {
          district = item;
        }
      });
      
      if (this.element_animeVe.village != null) {
        this.isAutresFkt = true;
      }

      if (this.element_animeVe.img_piece != null) {
        let parse_img_piece: string = JSON.parse(this.element_animeVe.img_piece);
        let img_piece_ = parse_img_piece.split('-');
        img_piece_.forEach(item => {
          this.img_piece.push({
            data: item,
            date: moment().format('YYYY-MM-DD'),
            name: ''
          });
        });
      }
      this.data_pr.forEach(item => {
        if (item.code_pr === this.element_animeVe.code_pr) {
          pr = item
        }
      });
      this.data_anime_specu_update = this.element_animeVe.specu_animation;
      console.log(":::Data anime Specu:::", this.data_anime_specu_update);
      if (this.data_anime_specu_update.length > 0) {
        this.data_anime_specu_update.forEach(item => {
          let categorie: Loc_categEspece;
          let espece: Loc_Espece = {
            code_espece: null,
            nom_espece: null,
            id_categ: null,
            libelle: null,
            saisonnier: null,
            unite: null
          };
          let variette: Loc_variette = {
            code_var: null,
            nom_var: null,
            id_espece: null,
            nom_espece: null
          };
          this.data_categ.forEach(elem_categ => {
            if (elem_categ.code_cat) {
              // Refaire
            }
          });
          this.data_espece.forEach(elem_espece => {
            if (elem_espece.code_espece === item.id_espece) {
              espece = elem_espece;
            }
          });
          this.data_var.forEach(elem_var => {
            if (elem_var.code_var === item.id_var) {
              variette = elem_var;
            }
          });
          // push specu
          this.data_speculation.push({
            code_specu: item.code_specu,
            categorie: null,
            espece:  espece,
            variette: variette,
            quantite: item.quantite
          });
        });
      }

      this.animeVeForm = this.formBuilder.group({
        pr: [pr, Validators.required],
        dt_anime: [this.element_animeVe.date_anim != null?moment(this.element_animeVe.date_anim, "YYYY-MM-DD"):null, Validators.required],
        nb_participant: [this.element_animeVe.nb_participant, Validators.required],
        nb_femme: [this.element_animeVe.nb_f, Validators.required],
        nb_homme: [this.element_animeVe.nb_h, Validators.required],
        nb_inf_25: [this.element_animeVe.nb_inf_25, Validators.required],
        speculation: this.element_animeVe.specu_animation,
        img_piece: this.img_piece,
        region: [region, Validators.required],
        district: [district, Validators.required],
        commune: [commune, Validators.required],
        fokontany: fkt,
        village: this.element_animeVe.village,
        quantite_specu: null,// local input
        specu_delete: null,
        specu_add_edit: null
      });
    }
  }

  // Initial FormGroup Pare Pms
  initFormParcePms() {
    if (this.isAddParcePms) {
      this.parcePms = this.formBuilder.group({
        annee: [null, Validators.required],
        saison: [null, Validators.required],
        parcelle: null,
        isNewparce: null,
        espece: [null, Validators.required],
        variette: [null, Validators.required],
        objectif: [null, Validators.required],
        ref_gps: null,
        latitude: null,
        longitude: null,
        superficie: null,
        region: null,
        district: null,
        commune: null,
        fokontany: null,
        village: null
      });
    } else if (this.isEditParcePms) {
      let annee: Loc_AnneeAgricole = null;
      let saison: Loc_saison = null;
      let parce: Loc_Parce_saison = null;
      let espece_: Loc_Espece = null;
      let var_: Loc_variette = null;

      let fkt: Loc_Fokontany = null;
      let commune: Loc_Commune = null;
      let district: Loc_district = null;
      let region: Loc_region = null;

      this.data_annee_agricole.forEach(elem_annee => {
        if (elem_annee.code === this.elem_parce_pms.id_annee) {
          annee = elem_annee;
        }
      });
      this.data_saison.forEach(elem_saison => {
        if (elem_saison.code_saison === this.elem_parce_pms.id_saison) {
          saison = elem_saison;
        }
      });
      this.parce_pms.forEach(item_parce => {
        if (item_parce.id_parce === this.elem_parce_pms.code_parce) {
          parce = item_parce;
        }
      });
      this.data_espece_filter.forEach(elem_espece => {
        if (elem_espece.code_espece === this.elem_parce_pms.code_espece) {
          espece_ = elem_espece;
        }
      });
      this.data_variette_filter = this.data_var.filter(elem_var => {return elem_var.id_espece === this.elem_parce_pms.code_espece});
      this.data_variette_filter.forEach(elem_var => {
        if (elem_var.code_var === this.elem_parce_pms.id_var) {
          var_= elem_var;
        }
      });

      this.data_fokontany_filter.forEach(item => {
        if (item.code_fkt === this.elem_parce_pms.id_fkt) {
          fkt = item;
        }
      });
      this.data_commune_filter.forEach(item => {
        if (item.code_com === this.elem_parce_pms.code_commune) {
          commune = item;
        }
      });
      this.data_district_filter.forEach(item => {
        if (item.code_dist === this.elem_parce_pms.code_dist) {
          district = item;
        }
      });
      this.data_region.forEach(item => {
        if (item.code_reg === this.elem_parce_pms.code_reg) {
          region = item
        }
      });

      if (this.elem_parce_pms.id_parce != null) {
        if (this.elem_parce_pms.etat_parce === SYNC) {
          let controls: string[] = ['superficie', 'superficie', 'region', 'district', 'commune', 'village', 'fokontany'];
          //this.addValidators(controls);
          this.isNewParcePms = true;
        } else if (this.elem_parce_pms.etat_parce === UPDATE || this.elem_parce_pms.etat_parce === VALIDE) {
          this.isExistParcePms = true;
        }
      }

      this.parcePms = this.formBuilder.group({
        annee: [annee, Validators.required],
        saison: [saison, Validators.required],
        parcelle: parce,
        isNewparce: null,
        espece: [espece_, Validators.required],
        variette: [var_, Validators.required],
        objectif: [this.elem_parce_pms.objectif, Validators.required],
        ref_gps: this.isExistParcePms?this.elem_parce_pms.ref_gps_saison:this.elem_parce_pms.ref_gps,
        latitude: this.isExistParcePms?this.elem_parce_pms.lat_saison:this.elem_parce_pms.lat,
        longitude: this.isExistParcePms?this.elem_parce_pms.log_saison:this.elem_parce_pms.logitude,
        superficie: this.isNewParcePms?[this.elem_parce_pms.superficie, Validators.required]:this.elem_parce_pms.superficie,
        region: this.isNewParcePms?[region, Validators.required]:region,
        district: this.isNewParcePms?[district, Validators.required]:district,
        commune: this.isNewParcePms?[commune, Validators.required]:commune,
        fokontany: fkt,
        village: this.elem_parce_pms.village
      });
    }
  }

  // Initial Form SuiviPR
  initFormMepPr() {
    if (this.isAddMepSG || this.isAddMepMv || this.isAddMepPa) {
      this.mepForm = this.formBuilder.group({
        annee: [null, Validators.required],
        saison: this.isAddMepSG?[null, Validators.required]:null,
        beneficiaire: [null, Validators.required],
        parcelle: [null, Validators.required],
        ddp: [null, Validators.required],
        qso: [null, Validators.required],
        dt_distribution: null,
        dds: [null, Validators.required],
        sfce: null,
        nbre_ligne: this.isAddMepPa?[null, Validators.required]:null,
        long_ligne: null,
        sc: this.isAddMepSG? [null, Validators.required]: null,
        categorie_ea: null,
        espece: [null, Validators.required],
        espece_ea: null,
        variette: this.isAddMepSG? [null, Validators.required] : null,
        variette_ea: null,
        autreCultureEa: null
      });
    } else if (this.isEditMepSG || this.isEditMepMv || this.isEditMepPa) {
      let saison_: Loc_saison = null;
      let pr_: Loc_PR = null;
      let cep_: Loc_cep_PR = null;
      let espece_: Loc_Espece = null;
      let var_: Loc_variette = null;
      let sc_: any = null;
      let categ_ea: Loc_categEspece = null;
      let espece_ea: Loc_Espece = null;
      let var_ea: Loc_variette = null;
      let annee_agr: Loc_AnneeAgricole = null;

      this.data_pr.forEach(item => {
        if (item.code_pr === this.data_Mep_Pr_edit.code_pr) {
          pr_ = item
        }
      });
      this.data_saison.forEach(item => {
        console.log(":::::",item);
        if (item.code_saison === this.data_Mep_Pr_edit.id_saison) {
          saison_ = item;
          console.log("Saison:::",saison_);
        }
      });
      this.data_cep_filter = this.data_cep.filter(item => {return item.code_pr === this.data_Mep_Pr_edit.code_pr});
      this.data_cep_filter.forEach(elem_cep => {
        if (elem_cep.code_parce === this.data_Mep_Pr_edit.id_parce) {
          cep_ = elem_cep
        }
      });
      this.data_espece_filter.forEach(elem_espece => {
        if (this.isEditMepPa || this.isEditMepMv) {
          if (elem_espece.code_espece === this.data_Mep_Pr_edit.id_espece) {
            espece_ = elem_espece;
          }
        } else if (this.isEditMepSG) {
          if (elem_espece.code_espece === this.data_Mep_Pr_edit.code_espece_var_sg) {
            espece_ = elem_espece;
          }
        }
      });
      this.data_variette_filter = this.data_var.filter(elem_var => {return elem_var.id_espece === this.data_Mep_Pr_edit.code_espece_var_sg});
      this.data_variette_filter.forEach(elem_var => {
        if (this.data_Mep_Pr_edit.id_var != null) {
          if (elem_var.code_var === this.data_Mep_Pr_edit.id_var) {
            var_= elem_var;
          }
        }
      });
      if (this.data_Mep_Pr_edit.sc != null) {
        this.data_sc.forEach(elem_sc => {
          if (elem_sc.value.toLowerCase() === this.data_Mep_Pr_edit.sc.toLowerCase()) {
            sc_ = elem_sc;
          }
        });
        if (this.data_Mep_Pr_edit.sc.toLowerCase() === 'c.associé') {
          this.isAssocie = true;
          // si Existante Variette
          if (this.data_Mep_Pr_edit.ea_id_variette != null) {
            this.data_categ.forEach(elem_categ => {
              if (elem_categ.code_cat === 1) {
                categ_ea = elem_categ;
              }
            });
            this.data_espece_filter_ea = this.data_espece.filter(item_filtre => {return item_filtre.id_categ === 1});
            // Espece ea
            this.data_espece_filter_ea.forEach(elem_espece_filtre_ea => {
              if (elem_espece_filtre_ea.code_espece === this.data_Mep_Pr_edit.code_espece_ea) {
                espece_ea = elem_espece_filtre_ea;
              }
            });
            this.data_variette_filter_ea = this.data_var.filter(item_var_filtre => {return item_var_filtre.id_espece === this.data_Mep_Pr_edit.code_espece_ea});
            this.data_variette_filter_ea.forEach(elem_var => {
              if (elem_var.code_var === this.data_Mep_Pr_edit.ea_id_variette) {
                var_ea = elem_var;
              }
            });
          }
          // Autre cultures
          if (this.data_Mep_Pr_edit.ea_autres != null) {
            this.isSelectedAutreCulte = false;
          }
        } else {
          // Culture bande
          if (this.data_Mep_Pr_edit.sc.toLowerCase() === 'c.bande') {
            this.isCultureBande = true;
          } else this.isCultureBande = false;
        }
      }

      this.data_annee_agricole.forEach(elem_annee => {
        if (elem_annee.code === this.data_Mep_Pr_edit.id_annee) {
          annee_agr = elem_annee;
        }
      });

      this.mepForm = this.formBuilder.group({
        annee: [annee_agr, Validators.required],
        saison: this.isEditMepSG?[saison_, Validators.required]:saison_,
        beneficiaire: [pr_, Validators.required],
        parcelle: [cep_, Validators.required],
        ddp: [moment(this.data_Mep_Pr_edit.ddp, "YYYY-MM-DD"), Validators.required],
        qso: [this.data_Mep_Pr_edit.qso, Validators.required],
        dt_distribution: this.data_Mep_Pr_edit.dt_distribution != null?moment(this.data_Mep_Pr_edit.dt_distribution, "YYYY-MM-DD"):null,
        dds: [moment(this.data_Mep_Pr_edit.dds, "YYYY-MM-DD"), Validators.required],
        sfce: this.data_Mep_Pr_edit.sfce_emb,
        nbre_ligne: this.isEditMepPa?[this.data_Mep_Pr_edit.nbre_ligne, Validators.required]:this.data_Mep_Pr_edit.nbre_ligne,
        long_ligne: this.data_Mep_Pr_edit.long_ligne,
        sc: this.isEditMepSG? [sc_, Validators.required]: sc_,
        categorie_ea: categ_ea,
        espece: [espece_, Validators.required],
        espece_ea: espece_ea,
        variette: this.isEditMepSG? [var_, Validators.required] : var_,
        variette_ea: var_ea,
        autreCultureEa: this.data_Mep_Pr_edit.ea_autres
      });
    }
  }
  initFormSuiviMepPr() {
    if (this.isAddMepSvSG || this.isAddMepSvPa || this.isAddMepSvMv) {
      this.suiviMepForm = this.formBuilder.group({
        ddp: [null, Validators.required],
        stc: this.isAddMepSvSG?[null, Validators.required]:null,
        ec: null,
        ql: this.isAddMepSvPa?[null, Validators.required]:null,
        qr: null,
        hauteur: null,
        long_ligne: null,
        nbre_ligne: null,
        nbre_pied: null,
        estimation: null,
        img_culture: null
      });
    } else if (this.isEditMepSvSG || this.isEditMepSvPa || this.isEditMepSvMv) {
      let stc_: any = null;
      let ec_: any = null;
      if (this.isSuiviMepPr) {
        if (this.data_Mep_suivi_PR.img_cult != null) {
          this.fileImage_pr.data = this.data_Mep_suivi_PR.img_cult
        }
        if (this.data_Mep_suivi_PR.sc != null) {
          this.data_stc.forEach(item => {
            if (item.value === this.data_Mep_suivi_PR.stc) {
              stc_ = item;
            }
          });
        }
        if (this.data_Mep_suivi_PR.ec != null) {
          this.data_ec.forEach(item => {
            if (item.value === this.data_Mep_suivi_PR.ec) {
              ec_ = item;
            }
          });
        }
        this.suiviMepForm = this.formBuilder.group({
          ddp: [moment(this.data_Mep_suivi_PR.ddp, "YYYY-MM-DD"), Validators.required],
          stc: this.isEditMepSvSG?[stc_, Validators.required]:null,
          ec: ec_,
          ql: this.isEditMepSvPa?[this.data_Mep_suivi_PR.ql, Validators.required]:null,
          qr: this.data_Mep_suivi_PR.qr,
          hauteur: this.data_Mep_suivi_PR.hauteur,
          long_ligne: this.data_Mep_suivi_PR.long_ligne,
          nbre_ligne: this.data_Mep_suivi_PR.nbre_ligne,
          nbre_pied: this.data_Mep_suivi_PR.nbre_pied,
          estimation: this.data_Mep_suivi_PR.ex,
          img_culture: this.data_Mep_suivi_PR.img_cult
        });
      } else if (this.isSuiviMepBloc) {
        if (this.data_Mep_suivi_Bloc.img_cult != null) {
          this.fileImage_pr.data = this.data_Mep_suivi_Bloc.img_cult
        }
        if (this.data_Mep_suivi_Bloc.stc != null) {
          this.data_stc.forEach(item => {
            if (item.value === this.data_Mep_suivi_Bloc.stc) {
              stc_ = item;
            }
          });
        }
        if (this.data_Mep_suivi_Bloc.ec != null) {
          this.data_ec.forEach(item => {
            if (item.value === this.data_Mep_suivi_Bloc.ec) {
              ec_ = item;
            }
          });
        }
        this.suiviMepForm = this.formBuilder.group({
          ddp: [moment(this.data_Mep_suivi_Bloc.ddp, "YYYY-MM-DD"), Validators.required],
          stc: this.isEditMepSvSG?[stc_, Validators.required]:null,
          ec: ec_,
          ql: this.isEditMepSvPa?[this.data_Mep_suivi_Bloc.ql, Validators.required]:null,
          qr: this.data_Mep_suivi_Bloc.qr,
          hauteur: this.data_Mep_suivi_Bloc.hauteur,
          long_ligne: this.data_Mep_suivi_Bloc.long_ligne,
          nbre_ligne: this.data_Mep_suivi_Bloc.nbre_ligne,
          nbre_pied: this.data_Mep_suivi_Bloc.nbre_pied,
          estimation: this.data_Mep_suivi_Bloc.ex,
          img_culture: this.data_Mep_suivi_Bloc.img_cult
        });
      }
    }
  }
  initFormCepPr() {
    if (this.isAddCepPr) {
      let bloc_benef: Loc_Bloc = null
      if (this.isParceBl) {
        this.data_bloc_benef.forEach(elem_bloc => {
          if (elem_bloc.code_bloc === this.elem_benef_bl.id_bloc) {
            bloc_benef = elem_bloc;
          }
        });
      }
      this.cepForm = this.formBuilder.group({
        bloc: this.isParceBl?[bloc_benef, Validators.required]:null,
        ref_gps: null,
        latitude: null,
        longitude: null,
        superficie: [null, Validators.required],
        region: [null, Validators.required],
        district: [null, Validators.required],
        commune: [null, Validators.required],
        fokontany: null,
        village: null,
        indication: null
      });
    } else if (this.isEditCepPr) {
      console.log(":::Data Edit cep::", this.element_cep);
      let fkt: Loc_Fokontany = null;
      let commune: Loc_Commune = null;
      let district: Loc_district = null;
      let region: Loc_region = null;
      let bloc_equipe: BlocEquipe = null;
      let bloc_benef: Loc_Bloc = null;

      this.data_fokontany_filter.forEach(item => {
        if (this.isCepPr) {
          if (item.code_fkt === this.element_cep.id_fkt) {
            fkt = item;
          }
        } else if (this.isParceBl) {
          if (item.code_fkt === this.elem_parce_bl.id_fkt) {
            fkt = item;
          }
        }
      });
      this.data_commune_filter.forEach(item => {
        if (this.isCepPr) {
          if (item.code_com === this.element_cep.code_commune) {
            commune = item;
          }
        } else if (this.isParceBl) {
          if (item.code_com === this.elem_parce_bl.code_commune) {
            commune = item;
          }
        }
      });
      this.data_district_filter.forEach(item => {
        if (this.isCepPr) {
          if (item.code_dist === this.element_cep.code_district) {
            district = item;
          }
        } else if (this.isParceBl) {
          if (item.code_dist === this.elem_parce_bl.code_dist) {
            district = item;
          }
        }
      });
      this.data_region.forEach(item => {
        if (this.isCepPr) {
          if (item.code_reg === this.element_cep.code_region) {
            region = item
          }
        } else if (this.isParceBl) {
          if (item.code_reg === this.elem_parce_bl.code_reg) {
            region = item
          }
        }
      });

      this.data_bloc.forEach(elem => {
        if (this.isCepPr) {
          if (elem.code_bloc === this.element_cep.id_bloc) {
            bloc_equipe = elem
          }
        } 
      });
      this.data_bloc_benef.forEach(elem_bloc => {
        if (this.isParceBl) {
          if (elem_bloc.code_bloc === this.elem_parce_bl.id_bloc) {
            bloc_benef = elem_bloc
          }
        }
      });
      
      if (this.isCepPr) {
        if (this.element_cep.village != null) {
          this.isAutresFkt = true;
        }
      } else if (this.isParceBl) {
        if (this.elem_parce_bl.village != null) {
          this.isAutresFkt = true;
        }
      }
      
      this.cepForm = this.formBuilder.group({
        bloc: this.isCepPr?bloc_equipe:bloc_benef,
        ref_gps: this.isCepPr?this.element_cep.ref_gps:this.elem_parce_bl.ref_gps,
        latitude: this.isCepPr?this.element_cep.lat:this.elem_parce_bl.lat,
        longitude: this.isCepPr?this.element_cep.log:this.elem_parce_bl.log,
        superficie: this.isCepPr?[this.element_cep.superficie, Validators.required]:[this.elem_parce_bl.superficie, Validators.required],
        region: [region, Validators.required],
        district: [district, Validators.required],
        commune: [commune, Validators.required],
        fokontany: fkt,
        village: this.isCepPr?this.element_cep.village:this.elem_parce_bl.village,
        indication: this.isParceBl?this.elem_parce_bl.indication:null
      });
    }
  }
  initFormInfosBenef() {
    if (this.isAddBenef) {
      this.beneficiaireForm = this.formBuilder.group({
        bloc: this.isBenefBloc?[null, Validators.required]:null,
        association: this.isBenefPms?[null, Validators.required]:null,
        collaborateur: this.isBenefPms?[null, Validators.required]:null,
        nom: [null, Validators.required],
        prenom: null,
        surnom: null,
        sexe: [null, Validators.required],
        isDtVers: false,
        dt_naissance: null,
        dt_naissance_vers: null,
        cin: null,
        dt_delivrance: null,
        lieu_delivrance: null,
        code_achat: null,
        contact: [null, Validators.maxLength(10)],
        region: null,
        district: null,
        commune: null,
        fokontany: null,
        village: null
      });
      /**this.beneficiaireForm.get('dt_naissance').disable();
      this.beneficiaireForm.get('dt_delivrance').disable();*/
    }
    if (this.isEditBenef) {
      let fkt: Loc_Fokontany = null;
      let commune: Loc_Commune = null;
      let district: Loc_district = null;
      let region: Loc_region = null;
      let assoc: Loc_association = null;
      let collabo_: Loc_Collabo_Activite;
      let bloc: Loc_Bloc = null;

      this.data_region.forEach(item => {
        if (this.isBenefPms) {
          if (item.code_reg === this.element_pms.code_region) {
            region = item
          }
        } else if (this.isBenefPr) {
          if (item.code_reg === this.element_benef.code_region) {
            region = item
          }
        } else if (this.isBenefBloc) {
          if (item.code_reg === this.elem_benef_bl.code_reg) {
            region = item
          }
        }
      });

      this.data_fokontany_filter.forEach(item => {
        if (this.isBenefPms) {
          if (item.code_fkt === this.element_pms.id_fkt) {
            fkt = item;
          }
        } else if (this.isBenefPr) {
          if (item.code_fkt === this.element_benef.id_fkt) {
            fkt = item;
          }
        } else if (this.isBenefBloc) {
          if (item.code_fkt === this.elem_benef_bl.id_fkt) {
            fkt = item;
          }
        }
      });
      this.data_commune_filter.forEach(item => {
        if (this.isBenefPms) {
          if (item.code_com === this.element_pms.code_commune) {
            commune = item;
          }
        } else if (this.isBenefPr) {
          if (item.code_com === this.element_benef.code_commune) {
            commune = item;
          }
        } else if (this.isBenefBloc) {
          if (item.code_com === this.elem_benef_bl.code_commune) {
            commune = item;
          }
        }
      });
      this.data_district_filter.forEach(item => {
        if (this.isBenefPms) {
          if (item.code_dist === this.element_pms.code_district) {
            district = item;
          }
        } else if (this.isBenefPr) {
          if (item.code_dist === this.element_benef.code_dist) {
            district = item;
          }
        } else if (this.isBenefBloc) {
          if (item.code_dist === this.elem_benef_bl.code_dist) {
            district = item;
          }
        }
      });
      
      if (this.isBenefPr) {
        if (this.element_benef.village != null) {
          this.isAutresFkt = true;
        }
        if (this.element_benef.img_benef != null) {
          this.fileImage_pr.data = this.element_benef.img_benef;
        }
        if (this.element_benef.img_cin != null) {
          let parse_img_cin = JSON.parse(this.element_benef.img_cin);
          let img_cins = parse_img_cin.split('-');
          img_cins.forEach((item, inde) =>  {
            if (inde == 0) {
              this.fileImage_cin1.data = item;
            } else if (inde == 1) {
              this.fileImage_cin2.data = item;
            }
          });
        }
      } else if (this.isBenefPms) {
        this.data_association.forEach(item_assoc => {
          if (item_assoc.code_ass === this.element_pms.id_association) {
            assoc = item_assoc;
          }
        });
        this.data_collaborateur.forEach(item_collabo => {
          if (item_collabo.id_col === this.element_pms.id_collaborateur) {
            collabo_ = item_collabo;
          }
        });
        if (this.element_pms.village != null) {
          this.isAutresFkt = true;
        }
        if (this.element_pms.img_benef != null) {
          this.fileImage_pr.data = this.element_pms.img_benef;
        }
        if (this.element_pms.img_cin != null) {
          let parse_img_cin = JSON.parse(this.element_pms.img_cin);
          let img_cins = parse_img_cin.split('-');
          img_cins.forEach((item, inde) =>  {
            if (inde == 0) {
              this.fileImage_cin1.data = item;
            } else if (inde == 1) {
              this.fileImage_cin2.data = item;
            }
          });
        }
      }

      if (this.isBenefBloc) {
        this.data_bloc_benef.forEach(elem_bl => {
          if (elem_bl.code_bloc === this.elem_benef_bl.id_bloc) {
            bloc = elem_bl;
          }
        });
        this.data_collaborateur.forEach(item_collabo => {
          if (item_collabo.id_col === this.elem_benef_bl.id_collaborateur) {
            collabo_ = item_collabo;
          }
        });
        if (this.elem_benef_bl.village != null) {
          this.isAutresFkt = true;
        }
        if (this.elem_benef_bl.img_benef != null) {
          this.fileImage_pr.data = this.elem_benef_bl.img_benef;
        }
        if (this.elem_benef_bl.img_cin != null) {
          let parse_img_cin = JSON.parse(this.elem_benef_bl.img_cin);
          let img_cins = parse_img_cin.split('-');
          img_cins.forEach((item, inde) =>  {
            if (inde == 0) {
              this.fileImage_cin1.data = item;
            } else if (inde == 1) {
              this.fileImage_cin2.data = item;
            }
          });
        }
        this.beneficiaireForm = this.formBuilder.group({
          bloc: [bloc, Validators.required],
          association: null,
          collaborateur: [collabo_, Validators.required],
          nom: [this.elem_benef_bl.nom, Validators.required],
          prenom: this.elem_benef_bl.prenom,
          surnom: this.elem_benef_bl.surnom,
          sexe: [this.elem_benef_bl.sexe, Validators.required],
          isDtVers: this.elem_benef_bl.dt_nais_vers != null?true:false,
          dt_naissance: this.elem_benef_bl.dt_nais != null?moment(this.elem_benef_bl.dt_nais, "YYYY-MM-DD"):null,
          dt_naissance_vers: this.elem_benef_bl.dt_nais_vers,
          cin: this.elem_benef_bl.cin,
          dt_delivrance: this.elem_benef_bl.dt_delivrance != null?moment(this.elem_benef_bl.dt_delivrance, "YYYY-MM-DD"):null,
          lieu_delivrance: this.elem_benef_bl.lieu_delivrance,
          code_achat: this.elem_benef_bl.code_achat,
          contact: this.elem_benef_bl.contact,
          region: region,
          district: district,
          commune: commune,
          fokontany: fkt,
          village: this.elem_benef_bl.village
        });
      }
      if (this.isBenefPr || this.isBenefPms) {
        this.beneficiaireForm = this.formBuilder.group({
          association: this.isBenefPms?[assoc, Validators.required]:null,
          collaborateur: this.isBenefPms?[collabo_, Validators.required]:null,
          nom: this.isBenefPr?[this.element_benef.nom, Validators.required]:[this.element_pms.nom_benef, Validators.required],
          prenom: this.isBenefPr?this.element_benef.prenom:this.element_pms.prenom,
          surnom: this.isBenefPr?this.element_benef.surnom:this.element_pms.surnom,
          sexe: this.isBenefPr?[this.element_benef.sexe, Validators.required]:this.element_pms.sexe,
          isDtVers: this.isBenefPr?this.element_benef.dt_nais_vers != null?true:false:this.element_pms.dt_nais_vers != null?true:false,
          dt_naissance: this.isBenefPr?this.element_benef.dt_nais != null? moment(this.element_benef.dt_nais, "YYYY-MM-DD"):null:this.element_pms.dt_nais != null? moment(this.element_pms.dt_nais, "YYYY-MM-DD"):null,
          dt_naissance_vers: this.isBenefPr?this.element_benef.dt_nais_vers:this.element_pms.dt_nais_vers,
          cin: this.isBenefPr?this.element_benef.cin:this.element_pms.cin,
          dt_delivrance: this.isBenefPr?this.element_benef.dt_delivrance != null?moment(this.element_benef.dt_delivrance, "YYYY-MM-DD"):null:this.element_pms.dt_delivrance != null?moment(this.element_pms.dt_delivrance, "YYYY-MM-DD"):null,
          lieu_delivrance: this.isBenefPr?this.element_benef.lieu_delivrance:this.element_pms.lieu_delivrance,
          code_achat: this.isBenefPr?this.element_benef.code_achat:this.element_pms.code_achat,
          contact: this.isBenefPr?this.element_benef.contact:this.element_pms.contact,
          region: region,
          district: district,
          commune: commune,
          fokontany: fkt,
          village: this.isBenefPr?this.element_benef.village:this.element_pms.village
        });
      }
    }
  }
  // Image
  async takeImage(src: string) {
    this.captureImg.getImage().then(res => {
      console.log(":::Res Image:::", res);
      if (src === 'img-pr') {
        this.fileImage_pr = res;
        if (this.isSuiviMepPr || this.isSuiviMepBloc) {
          this.suiviMepForm.patchValue({
            img_culture: this.fileImage_pr.data
          });
        }
      } else if (src === 'img-cin1') {
        this.fileImage_cin1 = res;
      } else if (src === 'img-cin2') {
        this.fileImage_cin2 = res;
      } else if (src === 'img-piece') {
        this.img_piece.push(res);
      }
    });
  }

  // Delete
  onDeleteImg(data) {
    if (data === 'img-cult') {
      this.fileImage_pr = {
        data: null,
        date: null,
        name: null
      }
      this.suiviMepForm.patchValue({
        img_culture: null
      });
    }
  }

  onCancelSpecu() {
    this.isAddSpecu = false;
  }
  onSaveSpecu() {
    this.isAddSpecu = false;
    let val = this.animeVeForm.value;
    //let ind_specu =  this.data_speculation.length;
    this.data_speculation.push({
      categorie: this.selected_categorie,
      espece:  this.selected_espece,
      variette: this.selected_variette,
      quantite: val.quantite_specu
    });
    if (this.isEditAnimeVe) {
      this.data_speculation_add.push({
        categorie: this.selected_categorie,
        espece:  this.selected_espece,
        variette: this.selected_variette,
        quantite: val.quantite_specu
      });
    }
    console.log("Espece quantite::::", this.data_speculation);
    this.selected_categorie  = null;
    this.selected_espece = null;
    this.selected_variette = null;
    this.animeVeForm.patchValue({
      quantite_specu: null
    });
  }
  //
  onSelectParcePms(data: any) {
    let controls: string[] = ['superficie', 'superficie', 'region', 'district', 'commune', 'village', 'fokontany'];
    if (data === 'existe') {
      this.isNewParcePms = false;
      this.isExistParcePms = true;
      this.parcePms.patchValue({
        isNewparce: null,
        ref_gps: null,
        latitude: null,
        longitude: null,
        superficie: null,
        region: null,
        district: null,
        commune: null,
        fokontany: null,
        village: null
      });
      this.removeValidators(controls);
    } else if (data === 'definir' || data === 'nouveau') {
      this.parcePms.patchValue({
        parcelle: null,
        isNewparce: null,
        ref_gps: null,
        latitude: null,
        longitude: null,
        superficie: null,
        region: null,
        district: null,
        commune: null,
        fokontany: null,
        village: null
      });
      if (data === 'definir') {
        this.isNewParcePms = false;
        this.isExistParcePms = false;
        this.removeValidators(controls);
      } else if (data === 'nouveau') {
        this.isNewParcePms = true;
        this.isExistParcePms = false;
        this.parcePms.patchValue({
          isNewparce: true
        });
        this.addValidators(controls);
      }
    }
  }
  // Delete Speculation
  onDeleteSpecu(elem: any) {
    let ind_ = this.data_speculation.indexOf(elem);
    console.log("::::",ind_, elem);

    this.data_speculation.splice(ind_,1);

    if (this.isEditAnimeVe) {
      let ind_add = this.data_speculation_add.indexOf(elem);
      this.data_anime_specu_update.forEach(item => {
        if (item.code_specu ===  elem.code_specu) {
          this.data_specu_delete.push(item);
        }
      });
      this.data_speculation_add.splice(ind_add, 1);
    }
    console.log("Espece:::", this.data_speculation); 
  }
  // Delete image
  onDeleteImgPiece(img: any) {
    let ind_ = this.img_piece.indexOf(img);
    this.img_piece.splice(ind_, 1);
  }
  
  /**
   * Saved Form
   */
  onDismiss() {
    this.modalCtrl.dismiss();
  }
  onSave(src: any) {
    let dismiss: any;
    if (src === 'beneficiaire') {
      let val = this.beneficiaireForm.value;
      dismiss = {
        association: val.association,
        bloc: val.bloc,
        collaborateur: val.collaborateur,
        img_pr: this.fileImage_pr,
        nom: val.nom,
        prenom: val.prenom,
        surnom: val.surnom,
        sexe: val.sexe,
        dt_naissance: val.dt_naissance,
        dt_naissance_vers: val.dt_naissance_vers,
        lieu_delivrance: val.lieu_delivrance,
        code_achat: val.code_achat,
        cin: val.cin,
        img_cin_1: this.fileImage_cin1,
        img_cin_2: this.fileImage_cin2,
        dt_delivrance: val.dt_delivrance,
        contact: val.contact,
        region: val.region,
        district: val.district,
        commune: val.commune,
        fokontany: val.fokontany,
        village: val.village
      }
    } else if (src === 'animationVe') {
      if (this.img_piece.length > 0) {
        this.animeVeForm.patchValue({
          img_piece: this.img_piece
        });
      }
      if (this.data_speculation.length > 0) {
        this.animeVeForm.patchValue({
          speculation: this.data_speculation
        });
      }
      if (this.data_specu_delete.length > 0) {
        this.animeVeForm.patchValue({
          specu_delete: this.data_specu_delete
        });
      }
      if (this.isEditAnimeVe) {
        if(this.data_speculation_add.length > 0) {
          this.animeVeForm.patchValue({
            specu_add_edit: this.data_speculation_add
          });
        }
      }
      dismiss = this.animeVeForm.value;
      console.log(dismiss);
    }
    console.log("beneficiaire data dismiss:::", this.beneficiaireForm.value);
    this.modalCtrl.dismiss(dismiss);
  }
  onSaveMepPr() {
    let dismiss = this.mepForm.value;
    this.modalCtrl.dismiss(dismiss);
  }
  /**
  * Save Mep suivi PR
  */
  onSaveSuviPr() {
    let dismiss = this.suiviMepForm.value;
    console.log("::::Data dismissed:::", dismiss);
    this.modalCtrl.dismiss(dismiss);
  }

  onSaveCep() {
    let dismiss: any;
    if (this.isCepPr || this.isParceBl) {
      dismiss = this.cepForm.value;
    } else if (this.isParcePms) {
      dismiss = this.parcePms.value;
    }
    console.log(":::Data dismissed Modal:::", dismiss);
    this.modalCtrl.dismiss(dismiss);
  }

  onSaveBenefBloc() {
    let dismiss = {
      data: 'bonjour'
    }
    this.modalCtrl.dismiss(dismiss);
  }
  /**
   * 
   */
   addValidators(controls : string[]){
    controls.forEach(c => {
        if (this.isParcePms) {
          this.parcePms.get(c).setValidators(Validators.required);
          this.parcePms.get(c).updateValueAndValidity();
        }
    });
  }

  removeValidators(controls : string[]){
      controls.forEach(c => {
        this.parcePms.get(c).clearValidators();
        this.parcePms.get(c).updateValueAndValidity();
      });
  }

  /**disableForm(group: FormGroup) {
    for (const i in group.controls) {
       if(enable) {
         group.controls[i].enable();
       } else {
         group.controls[i].disable();
       }
    }
 }*/
}
