import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { Loc_Commune, Loc_district, Loc_Fokontany, Loc_region } from 'src/app/interfaces/interfaces-local';
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

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private loadData: LoadDataService,
    private captureImg: CaptureImageService,
    private plt: Platform
  ) {
    if (this.navParams.get('isBenefPr')) {
      console.log(":::::::::Modal From Benef PR Bloc:::::::");
      this.loadZone();
    }
  }

  ngOnInit() {
    this.beneficiaireForm = this.formBuilder.group({
      nom: [null, Validators.required],
      prenom: null,
      surnom: null,
      sexe: [null, Validators.required],
      dt_naissance: null,
      dt_naissance_vers: null,
      cin: null,
      dt_delivrance: null,
      lieu_delivrance: null,
      code_achat: null,
      contact: null,
      region: null,
      district: null,
      commune: null,
      fokontany: null,
      village: null
    });
  }

  loadZone() {
    this.loadData.loadRegion().subscribe(res => {
      if (res.length > 0) {
        this.data_region =  res;
      }
    });
    this.loadData.loadAllDistrict().then(res => {
      if (res.values.length > 0) {
        res.values.forEach(item => {
          this.data_district.push(item);
        });
      }
    });
    this.loadData.loadCommune({}).then(res => {
      if (res.values.length > 0) {
        res.values.forEach(item => {
          this.data_commune.push(item);
        });
      }
    });
    this.loadData.loadFokontany({}).then(res => {
      if (res.values.length > 0) {
        res.values.forEach(elem => {
          this.data_fokontany.push(elem);
        });
      }
    });
  }

  onSelectRegion() {
    // filter district
    let reg = this.beneficiaireForm.value;
    this.data_district_filter = this.data_district.filter(item => {return item.id_reg === reg.region.code_reg});
    // initialized
    this.beneficiaireForm.patchValue({
      district: null,
      commune: null,
      fokontany: null
    });
    this.data_commune_filter = [];
    this.data_fokontany_filter = [];
  }
  onSelectDistrict() {
    // filter commune
    let dist = this.beneficiaireForm.value;
    this.data_commune_filter = this.data_commune.filter(item => {return item.id_dist === dist.district.code_dist});
    // initialized
    this.beneficiaireForm.patchValue({
      commune: null,
      fokontany: null
    });
    this.data_fokontany_filter = [];
  }
  onSelectCommune() {
    // filter fokontany
    let com = this.beneficiaireForm.value;
    this.data_fokontany_filter = this.data_fokontany.filter(item => {return item.id_com === com.commune.code_com});
    console
    // initialized
    this.beneficiaireForm.patchValue({
      fokontany: null
    });
  }
  onSelectFokontany(data: string) {
    // Autres
    if (data === 'fokontany') {
      this.isAutresFkt = false;
      this.beneficiaireForm.patchValue({
        village: null
      });
    } else if (data === 'autres') {
      this.isAutresFkt = true;
      this.beneficiaireForm.patchValue({
        fokontany: null
      });
    }
  }
  onSelectAutres() {
    // Autres
    this.beneficiaireForm.patchValue({
      fokontany: null
    });
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
      }
    });
  }
  
  /**
   * Saved Form
   */
  onDismiss() {
    this.modalCtrl.dismiss();
  }
  onSave() {
    let val = this.beneficiaireForm.value;
    let dismiss = {
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
    this.modalCtrl.dismiss(dismiss);
  }
}
