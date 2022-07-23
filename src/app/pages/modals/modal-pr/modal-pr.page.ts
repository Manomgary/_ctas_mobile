import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { AnimationSpecu, AnimationVe, Loc_categEspece, Loc_Commune, Loc_district, Loc_Espece, Loc_Fokontany, Loc_PR, Loc_region, Loc_variette } from 'src/app/interfaces/interfaces-local';
import { CaptureImageService } from 'src/app/services/capture-image.service';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { SEXE } from 'src/app/utils/global-variables';

import * as _moment from 'moment';
const moment = _moment;

interface LocalFile {
  name: string;
  date: string;
  data: string;
}

@Component({
  selector: 'app-modal-pr',
  templateUrl: './modal-pr.page.html',
  styleUrls: ['./modal-pr.page.scss'],
})
export class ModalPrPage implements OnInit {
  beneficiaireForm: FormGroup;
  animeVeForm: FormGroup;

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
  element_animeVe: AnimationVe;
  data_pr: Loc_PR[] = [];
  
  specu_animeVe: any[] = [];
  isAddSpecu: boolean = false;
  data_espece: Loc_Espece[] = [];
  data_espece_filter: Loc_Espece[] = [];
  data_var: Loc_variette[] = [];
  data_variette_filter: Loc_variette[] = [];
  data_categ: Loc_categEspece[] = [];

  selected_categorie: Loc_categEspece = null;
  selected_espece: Loc_Espece = null;
  selected_variette: Loc_variette  = null;
  data_speculation: any[] = [];
  data_specu_delete: AnimationSpecu[] = [];
  data_anime_specu_update: AnimationSpecu[] = [];
  quantite: number;

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

    if  (this.isAddAnimeVe || this.isEditAnimeVe) {
      this.loadFormAnimeVe();
    }
    //  
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

  onSelectRegion() {
    // filter district
    let reg: any;
    if (this.isAddBenef || this.isEditBenef) {
      reg = this.beneficiaireForm.value;
    } else if (this.isAddAnimeVe || this.isEditAnimeVe) {
      reg = this.animeVeForm.value;
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
    }
  }
  // Se lect Espece
  onSeletCateg() {
    this.data_espece_filter = this.data_espece.filter(item => {return item.id_categ === this.selected_categorie.code_cat});
    this.selected_espece = null;
    this.selected_variette = null;
  }
  onSelectEspece() {
    this.data_variette_filter = this.data_var.filter(item => {return item.id_espece === this.selected_espece.code_espece});
    this.selected_variette = null;
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
        specu_delete: null
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
        specu_delete: null
      });
    }
  }
  // Image
  async takeImage(src: string) {
    this.captureImg.getImage().then(res => {
      console.log(":::Res Image:::", res);
      if (src === 'img-pr') {
        this.fileImage_pr = res;
      } else if (src === 'img-cin1') {
        this.fileImage_cin1 = res;
      } else if (src === 'img-cin2') {
        this.fileImage_cin2 = res;
      } else if (src === 'img-piece') {
        this.img_piece.push(res);
      }
    });
  }

  onCancelSpecu() {
    this.isAddSpecu = false;
  }
  onSaveSpecu() {
    this.isAddSpecu = false;
    let val = this.animeVeForm.value;
    let ind_specu =  this.data_speculation.length;
    this.data_speculation.push({
      categorie: this.selected_categorie,
      espece:  this.selected_espece,
      variette: this.selected_variette,
      quantite: val.quantite_specu
    });
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
      this.data_anime_specu_update.forEach(item => {
        if (item.code_specu ===  elem.code_specu) {
          console.log("::::Specu to delete::", item)
          this.data_specu_delete.push(item);
        }
      });
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
      dismiss = this.animeVeForm.value;
      console.log(dismiss);
    }
    this.modalCtrl.dismiss(dismiss);
  }
}
