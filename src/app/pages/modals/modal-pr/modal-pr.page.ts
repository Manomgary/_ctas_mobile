import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { Loc_AnimationSpecu, Loc_AnimationVe, Loc_categEspece, Loc_cep_PR, Loc_Commune, Loc_district, Loc_Espece, Loc_Fokontany, Loc_MepPR, Loc_PR, Loc_region, Loc_saison, Loc_Suivi_MepPR, Loc_variette } from 'src/app/interfaces/interfaces-local';
import { CaptureImageService } from 'src/app/services/capture-image.service';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { EC_CULTURAL, SC, SEXE, STC } from 'src/app/utils/global-variables';

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

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private loadData: LoadDataService,
    private captureImg: CaptureImageService,
    private plt: Platform
  ) {
    if (this.navParams.get('isBenefPr')) {
      console.log(":::::::::Modal From PR element:::::::", this.navParams.get('element'));

      let zone = this.navParams.get('zone');
      this.data_region = zone.region;
      this.data_district = zone.district;
      this.data_commune = zone.commune;
      this.data_fokontany = zone.fokontany;

      if (this.navParams.get('isEdit')) {
        this.isEditBenef = this.navParams.get('isEdit');
        this.element_benef = this.navParams.get('element');
      
        this.data_district_filter = this.data_district.filter(item => {return item.id_reg === this.element_benef.code_region});
        this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === this.element_benef.code_dist});
        this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com ===this.element_benef.code_commune});
      } else if (this.navParams.get('isAdd')) {
        this.isAddBenef = this.navParams.get('isAdd');
      }
    }

    // get Parcelle PR
    if (this.navParams.get('isCepPr')) {
      this.isCepPr = this.navParams.get('isCepPr');
      this.element_benef = this.navParams.get('elem_pr');
      
      let zone = this.navParams.get('zone');
      this.data_region = zone.region;
      this.data_district = zone.district;
      this.data_commune = zone.commune;
      this.data_fokontany = zone.fokontany;
      this.data_bloc = this.navParams.get('bloc');

      if (this.navParams.get('isAddCep')) {
        this.isAddCepPr = this.navParams.get('isAddCep');
      } else if (this.navParams.get('isEditCep')) {
        this.isEditCepPr = this.navParams.get('isEditCep');
        this.element_cep = this.navParams.get('elem_cep');

        this.data_district_filter = this.data_district.filter(item => {return item.id_reg === this.element_benef.code_region});
        this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === this.element_benef.code_dist});
        this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com ===this.element_benef.code_commune});
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
     * suivi Mep PR
     *******************/
    if (this.navParams.get('isSuiviSvPR')) {
      // Add 
      this.isSuiviMepPr = this.navParams.get('isSuiviSvPR');
      this.data_Mep_Pr_edit = this.navParams.get('data_mep');
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
        this.data_Mep_suivi_PR = this.navParams.get('data_elem_suivi');
      } else if (this.navParams.get('isEditSvPa')) {
        this.isEditMepSvPa = this.navParams.get('isEditSvPa');
        this.data_Mep_suivi_PR = this.navParams.get('data_elem_suivi');
      } else if (this.navParams.get('isEditSvMv')) {
        this.isEditMepSvMv = this.navParams.get('isEditSvMv'); 
        this.data_Mep_suivi_PR = this.navParams.get('data_elem_suivi');
      }
      console.log(":::Elem Mep Suivi PR::::", this.data_Mep_suivi_PR);
    }
  }

  ngOnInit() {
    if (this.isAddBenef) {
      this.beneficiaireForm = this.formBuilder.group({
        nom: [null, Validators.required],
        prenom: null,
        surnom: null,
        sexe: [null, Validators.required],
        isDtVers: false,
        //dt_naissance: [{value: null, disabled: true}],
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
    }
    if (this.isEditBenef) {
      let fkt: Loc_Fokontany = null;
      let commune: Loc_Commune = null;
      let district: Loc_district = null;
      let region: Loc_region = null;

      this.data_region.forEach(item => {
        console.log(":::::id_reg:::", item.code_reg, "::::code_reg:::", this.element_benef.code_region);
        if (item.code_reg === this.element_benef.code_region) {
          region = item
        }
      });

      console.log("::::::::::::D:", this.data_district, "::", this.data_district.length);
      console.log("::::::::::::C:", this.data_commune, "::", this.data_commune.length);
      console.log("::::::::::::F:", this.data_fokontany, "::", this.data_fokontany.length);
      console.log("::::::::::::Dist::::", this.data_district_filter);
      console.log("::::::::::::Commune::::", this.data_commune_filter);
      console.log("::::::::::::Fokontany::::", this.data_fokontany_filter);

      this.data_fokontany_filter.forEach(item => {
        if (item.code_fkt === this.element_benef.id_fkt) {
          fkt = item;
        }
      });
      this.data_commune_filter.forEach(item => {
        if (item.code_com === this.element_benef.code_commune) {
          commune = item;
        }
      });
      this.data_district_filter.forEach(item => {
        if (item.code_dist === this.element_benef.code_dist) {
          district = item;
        }
      });
      
      if (this.element_benef.village != null) {
        this.isAutresFkt = true;
      }
      if (this.element_benef.img_benef != null) {
        this.fileImage_pr.data = this.element_benef.img_benef;
      }
      if (this.element_benef.img_cin != null) {
        let parse_img_cin = JSON.parse(this.element_benef.img_cin);
        let img_cins = parse_img_cin.split('-');
        console.log(":::img_cin JSON Parse::::", parse_img_cin);
        console.log(":::img_cin Length::::", img_cins.length);
        console.log(":::img_cin Length 1::::", img_cins[0]);
        img_cins.forEach((item, inde) =>  {
          if (inde == 0) {
            this.fileImage_cin1.data = item;
          } else if (inde == 1) {
            this.fileImage_cin2.data = item;
          }
        });
      }
      this.beneficiaireForm = this.formBuilder.group({
        nom: [this.element_benef.nom, Validators.required],
        prenom: this.element_benef.prenom,
        surnom: this.element_benef.surnom,
        sexe: [this.element_benef.sexe, Validators.required],
        isDtVers: this.element_benef.dt_nais_vers != null?true:false,
        dt_naissance: this.element_benef.dt_nais != null? moment(this.element_benef.dt_nais, "YYYY-MM-DD"):null,
        dt_naissance_vers: this.element_benef.dt_nais_vers,
        cin: this.element_benef.cin,
        dt_delivrance: this.element_benef.dt_delivrance != null?moment(this.element_benef.dt_delivrance, "YYYY-MM-DD"):null,
        lieu_delivrance: this.element_benef.lieu_delivrance,
        code_achat: this.element_benef.code_achat,
        contact: [this.element_benef.contact, Validators.maxLength(10)],
        region: region,
        district: district,
        commune: commune,
        fokontany: fkt,
        village: this.element_benef.village
      });
    }

    if (this.isAddAnimeVe || this.isEditAnimeVe) {
      this.loadFormAnimeVe();
    }
    if (this.isMepPr) {
      this.initFormMepPr();
    }
    if (this.isSuiviMepPr) {
      this.initFormSuiviMepPr();
    }
    //  
    if (this.isCepPr) {
      this.initFormCepPr();
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
    } else if (this.isCepPr) {
      reg = this.cepForm.value;
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
    } else if (this.isCepPr) {
      this.cepForm.patchValue({
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
    } else if (this.isCepPr) {
      dist =  this.cepForm.value;
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
    } else if (this.isCepPr) {
      this.cepForm.patchValue({
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
    } else if (this.isCepPr) {
      com = this.cepForm.value;
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
    } else if (this.isCepPr) {
      this.cepForm.patchValue({
        fokontany: null
      });
    }
  }
  onSelectFokontany(data: string) {
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
      } else if (this.isCepPr) {
        this.cepForm.patchValue({
          village: null
        });
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
      } else if (this.isCepPr) {
        this.cepForm.patchValue({
          fokontany: null
        });
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

      this.mepForm = this.formBuilder.group({
        annee: [this.data_Mep_Pr_edit.annee_du, Validators.required],
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
    }
  }
  initFormCepPr() {
    if (this.isAddCepPr) {
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
    } else if (this.isEditCepPr) {
      console.log(":::Data Edit cep::", this.element_cep);
      let fkt: Loc_Fokontany = null;
      let commune: Loc_Commune = null;
      let district: Loc_district = null;
      let region: Loc_region = null;
      let bloc_equipe: BlocEquipe = null;

        // filtre
      this.data_district_filter = this.data_district.filter(item => {return item.id_reg === this.element_cep.code_region});
      this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === this.element_cep.code_district});
      this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com === this.element_cep.code_commune});

      this.data_fokontany_filter.forEach(item => {
        if (item.code_fkt === this.element_cep.id_fkt) {
          fkt = item;
        }
      });
      this.data_commune_filter.forEach(item => {
        if (item.code_com === this.element_cep.code_commune) {
          commune = item;
        }
      });
      this.data_district_filter.forEach(item => {
        if (item.code_dist === this.element_cep.code_district) {
          district = item;
        }
      });
      this.data_region.forEach(item => {
        console.log(":::::id_reg:::", item.code_reg, "::::code_reg:::", this.element_cep.code_region);
        if (item.code_reg === this.element_cep.code_region) {
          region = item
        }
      });

      this.data_bloc.forEach(elem => {
        if (elem.code_bloc === this.element_cep.id_bloc) {
          bloc_equipe = elem
        }
      });
      
      if (this.element_cep.village != null) {
        this.isAutresFkt = true;
      }
      
      this.cepForm = this.formBuilder.group({
        bloc: bloc_equipe,
        ref_gps: this.element_cep.ref_gps,
        latitude: this.element_cep.lat,
        longitude: this.element_cep.log,
        superficie: this.element_cep.superficie,
        region: region,
        district: district,
        commune: commune,
        fokontany: fkt,
        village: this.element_cep.village
      });
    }
  }
  // Image
  async takeImage(src: string) {
    this.captureImg.getImage().then(res => {
      console.log(":::Res Image:::", res);
      if (src === 'img-pr') {
        this.fileImage_pr = res;
        if (this.isSuiviMepPr) {
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
    let dismiss = this.cepForm.value;
    this.modalCtrl.dismiss(dismiss);
  }
}
