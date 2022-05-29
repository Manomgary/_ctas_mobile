import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import * as moment from 'moment';
import { Local_benef_activ_bl, Local_bloc_parce, Loc_Bloc, Loc_categEspece, Loc_Espece, Loc_mep_bloc, Loc_saison, Loc_variette } from 'src/app/interfaces/interfaces-local';

@Component({
  selector: 'app-modal-bloc',
  templateUrl: './modal-bloc.page.html',
  styleUrls: ['./modal-bloc.page.scss'],
})
export class ModalBlocPage implements OnInit, AfterViewInit {
  //Reactive form group
  sg_paForm: FormGroup;
  paForm: FormGroup;
  mvForm: FormGroup;

  // Suivi bloc
  private isSuivi: boolean = false;
  private isAddMepSg: boolean = false;
  private isAddMepPa: boolean = false;
  private isAddMepMv: boolean = false;
  // Edit
  private isEditMepSg: boolean = false;
  private isEditMepPa: boolean = false;
  private isEditMepMv: boolean = false;
  // get data_Edit
  private data_Mep_edit: Loc_mep_bloc;
  //private data_MepPa_edit: Loc_mep_bloc;
  //private data_MepMv_edit: Loc_mep_bloc;
  // select data semences en grains


  annee_du: string[] = ['2021', '2022'];
  data_saison: Loc_saison[]  = [];//
  data_bloc: Loc_Bloc[] = []; //
  data_benef: Local_benef_activ_bl[] = []; //
  data_benef_filtre: Local_benef_activ_bl[] = [];
  data_parcelle: Local_bloc_parce[] = [];//
  data_parcelle_filter: Local_bloc_parce[] = [];
  data_sc: any[] = ['C.Pure', 'C.Associe'];
  data_categ: Loc_categEspece[] = [];//
  data_var: Loc_variette[] = [];//
  data_espece: Loc_Espece[] = []; //
  data_espece_ea: Loc_Espece[] = [];
  data_espece_filter_ea: Loc_Espece[] = [];
  data_variette_filter: Loc_variette[] = [];
  data_variette_filter_ea: Loc_variette[] = [];
  
  isAssocie: boolean = false;
  isSelectedAutreCulte: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder
  ) {
    console.log(this.navParams.data);
    if (this.navParams.get('isSuivi')) {
      // Suivi bloc
      this.isSuivi = this.navParams.get('isSuivi');
      let src = this.navParams.get('source_');
      let data = this.navParams.get('data_');
      let categ_espece: Loc_categEspece[] = [];

      this.data_saison = data.saison;//
      this.data_bloc = data.bloc; //
      this.data_benef = data.beneficiaire; //
      this.data_parcelle = data.parcelle; //
      categ_espece = data.categorie;//
      this.data_var = data.variette;//
      this.data_espece_ea= data.espece; //

      console.log("Data Add suivi:::: ", data);

      if (this.navParams.get('isAddMep')) {
        switch(src) {
          case 'isAddMepSg':
            this.data_espece = this.data_espece_ea.filter(item => {return item.id_categ === 1});
            this.data_categ = categ_espece.filter(item => {return item.code_cat === 1});
            this.isAddMepSg = true;
            break;
          case 'isAddMepPa':
            this.data_espece = this.data_espece_ea.filter(item => {return item.id_categ === 2});
            this.isAddMepPa = true;
            break;
          case 'isAddMepMv':
            this.data_espece = this.data_espece_ea.filter(item => {return item.id_categ === 3});
            this.data_categ = categ_espece.filter(item => {return item.code_cat === 1});
            this.isAddMepMv = true;
            break;
          default:
            console.log("default Add Mep");
            break;
        }
      }
      
      if (this.navParams.get('isEditMepSg')) {
        // Edit Mep Semences en grains
        this.isEditMepSg = this.navParams.get('isEditMepSg');
        this.data_espece = this.data_espece_ea.filter(item => {return item.id_categ === 1});
        this.data_categ = categ_espece.filter(item => {return item.code_cat === 1});
        this.data_Mep_edit = data.data_row;
        console.log("Modal get Data::: ", this.data_Mep_edit);
      } else if (this.navParams.get('isEditMepPa')) {
        // Edit Mep Plants d'arbre
        this.isEditMepPa = this.navParams.get('isEditMepPa');
        this.data_espece = this.data_espece_ea.filter(item => {return item.id_categ === 2});
        this.data_Mep_edit = data.data_row;
        console.log("Modal get Data::: ", this.data_Mep_edit);
      } else if (this.navParams.get('isEditMepMv')) {
        // Edit Mep Materiels vegetaux
        this.isEditMepMv = this.navParams.get('isEditMepMv');
        this.data_Mep_edit = data.data_row;
        this.data_espece = this.data_espece_ea.filter(item => {return item.id_categ === 3});
        console.log("Modal get Data::: ", this.data_Mep_edit);
      }
    }
   }
   ngOnInit() {
    console.log(":::::OnInit::::::::");
    if (this.isAddMepSg || this.isAddMepMv || this.isAddMepPa) {
      this.sg_paForm = this.formBuilder.group({
        annee: [null, Validators.required],
        saison: [null, Validators.required],
        bloc: [null, Validators.required],
        beneficiaire: [null, Validators.required],
        parcelle: [null, Validators.required],
        ddp: [null, Validators.required],
        qso: [null, Validators.required],
        dds: [null, Validators.required],
        sfce: [null, Validators.required],
        sc: this.isAddMepSg? [null, Validators.required]: null,
        categorie_ea: null,
        espece: [null, Validators.required],
        espece_ea: null,
        variette: this.isAddMepSg? [null, Validators.required] : null,
        variette_ea: null,
        autreCultureEa: null
      });
    } else if (this.isEditMepSg || this.isEditMepMv || this.isEditMepPa) {
      let saison_: Loc_saison;
      let bloc_: Loc_Bloc;
      let benef_: Local_benef_activ_bl;
      let parce_: Local_bloc_parce;
      let espece_: Loc_Espece;
      let var_: Loc_variette;
      let categ_: Loc_categEspece = null;
      let espece_ea: Loc_Espece = null;
      let var_ea_: Loc_variette = null;

      this.data_benef_filtre = this.data_benef.filter(item => {return item.id_bloc === this.data_Mep_edit.code_bloc});
      this.data_parcelle_filter = this.data_parcelle.filter(item => {return item.code_benef_bl === this.data_Mep_edit.code_benef_bl});
      if (this.isEditMepSg || this.isEditMepMv) {
        // Edit Mep SG
        if (this.isEditMepSg) {
          this.data_variette_filter = this.data_var.filter(item => {return item.id_espece === this.data_Mep_edit.code_espece});
          this.data_variette_filter.filter(item => {
            if (item.code_var === this.data_Mep_edit.id_var) {
              var_ = item;
            }
          });
          this.data_espece.filter(item => {
            if (item.code_espece === this.data_Mep_edit.code_espece) {
              espece_ = item;
            }
          });
        }
        // Edit Mep Mv
        if (this.isEditMepMv) {
          this.data_espece.filter(item => {
            if (item.code_espece === this.data_Mep_edit.id_espece) {
              espece_ = item;
            }
          });
        }
        if (this.data_Mep_edit.sc === 'C.Associe') {
          this.isAssocie = true;
          // operation ea
          if (this.data_Mep_edit.ea_id_variette != null) {
            this.data_espece_filter_ea = this.data_espece_ea.filter(item => {return item.id_categ === 1});
            this.data_variette_filter_ea = this.data_var.filter(item => {return item.id_espece === this.data_Mep_edit.code_espece_ea});
            this.data_categ.filter(item => {
              if (item.code_cat === 1) {
                categ_ = item;
              }
            });
            this.data_espece_filter_ea.filter(item => {
              if (item.code_espece === this.data_Mep_edit.code_espece_ea) {
                espece_ea = item;
              }
            });
            this.data_variette_filter_ea.filter(item => {
              if (item.code_var === this.data_Mep_edit.ea_id_variette) {
                var_ea_ = item;
              }
            });
          } else {
            this.isSelectedAutreCulte = true;
          }
        }
      }  else if(this.isEditMepPa) {
        this.data_espece.filter(item => {
          if (item.code_espece === this.data_Mep_edit.id_espece) {
            espece_ = item;
          }
        });
      }

      this.data_saison.forEach(item => {
        console.log(":::::",item);
        if (item.code_saison == this.data_Mep_edit.id_saison) {
          saison_ = item;
          console.log("Saison:::",saison_);
        }
      });

      this.data_bloc.forEach(item => {
        if (item.code_bloc === this.data_Mep_edit.code_bloc) {
          console.log(item);
          bloc_ = item;
          console.log("Bloc:::",bloc_);
        }
      });

      this.data_benef_filtre.forEach(item => {
        if (item.code_benef_bl === this.data_Mep_edit.code_benef_bl) {
          benef_ = item;
          console.log("Saison:::",benef_);
        }
      });
      this.data_parcelle_filter.forEach(item => {
        if (item.code_parce === this.data_Mep_edit.id_parce) {
          parce_ = item;
          console.log(parce_);
        }
      });

      this.sg_paForm = this.formBuilder.group({
        annee: [this.data_Mep_edit.annee_du, Validators.required],
        saison: [saison_, Validators.required],
        bloc: [bloc_, Validators.required],
        beneficiaire: [benef_, Validators.required],
        parcelle: [parce_, Validators.required],
        ddp: [moment(this.data_Mep_edit.ddp, "YYYY-MM-DD"), Validators.required],
        qso: [this.data_Mep_edit.qso, Validators.required],
        dds: [moment(this.data_Mep_edit.dds, "YYYY-MM-DD"), Validators.required],
        sfce: [this.data_Mep_edit.sfce, Validators.required],
        sc: this.isEditMepSg? [this.data_Mep_edit.sc, Validators.required]: this.data_Mep_edit.sc,
        categorie_ea: this.isEditMepSg? categ_: categ_,
        espece: [espece_, Validators.required],
        espece_ea: espece_ea,
        variette: this.isEditMepSg? [var_, Validators.required] : null,
        variette_ea: var_ea_,
        autreCultureEa: this.data_Mep_edit.ea_autres
      });
    }
  }
  ngAfterViewInit() {
    console.log(":::::::OnAfterViewInit::::::", this.data_Mep_edit);
  }

  onDismiss(src: any) {
    if (src === 'mep-sg') {
      const dismiss = {
        messag: "je suis messagier du modal bloc, MEP SG",
        isAddMepSg: true
      }
      this.modalCtrl.dismiss(dismiss);
    } else if (src === 'mep-mv') {
      const dismiss = {
        messag: "je suis messagier du modal bloc, MEP MV",
        isAddMepMv: true
      }
      this.modalCtrl.dismiss(dismiss);
    } else if (src === 'mep-pa') {
      const dismiss = {
        messag: "je suis messagier du modal bloc, MEP PA",
        isAddMepPa: true
      }
      this.modalCtrl.dismiss(dismiss);
    }
  }

  // On  selected value mat-options
  onSelectBloc() {
    console.log("Select Bloc, Data beneficiaire:::::", this.data_benef);
    let val: Loc_Bloc = this.sg_paForm.value.bloc;
    
    this.data_benef_filtre = this.data_benef.filter(item => {return item.id_bloc === val.code_bloc});
    console.log("Data Beneficiare filter :::: ", this.data_benef_filtre);
  }
  onSelectBenef(src) {
    console.log("selected beneficiaire! Data parcelle:::: ", this.data_parcelle);

    if (src === 'tout') {
      let val: Loc_Bloc = this.sg_paForm.value.bloc;
      this.data_parcelle_filter = this.data_parcelle.filter(item => {return item.id_bloc === val.code_bloc});
      console.log("Data filter parcelle", this.data_parcelle_filter);

    } else if (src === 'filter') {
      let val: Local_benef_activ_bl = this.sg_paForm.value.beneficiaire;

      this.data_parcelle_filter = this.data_parcelle.filter(item => {return item.code_benef_bl === val.code_benef_bl});
      console.log("Data filter parcelle", this.data_parcelle_filter);
    }
  }
  onSeletSc() {
    if (this.sg_paForm.value.sc === 'C.Associe') {
      this.isAssocie = true;
      this.sg_paForm.patchValue({
        categorie_ea: null,
        espece_ea: null,
        variette_ea: null,
        autreCultureEa: null
      });
      this.data_espece_filter_ea = [];
      this.data_variette_filter_ea = [];
    } else {
      this.isAssocie = false;
      this.sg_paForm.patchValue({
        categorie_ea: null,
        espece_ea: null,
        variette_ea: null,
        autreCultureEa: null
      });
      this.data_espece_filter_ea = [];
      this.data_variette_filter_ea = [];
    }
  }
  onSeletCateg(data: any) {
    if (data === 'autre') {
      this.isSelectedAutreCulte = true;
      this.sg_paForm.patchValue({
        categorie_ea: null,
        espece_ea: null,
        variette_ea: null
      });
    } else if (data === 'categorie') {
      console.log("select categorie espece associé::: Data espece ", this.data_espece_ea);
      this.sg_paForm.patchValue({
        autreCultureEa: null
      });
      this.isSelectedAutreCulte = false;
      // filtre data_espece_ea
      let val_categ: Loc_categEspece = this.sg_paForm.value.categorie_ea;
      this.data_espece_filter_ea = this.data_espece_ea.filter(item => {return item.id_categ === val_categ.code_cat});
      console.log("Data espece:::: ", this.data_espece);
    }
  }
  onSelectEspece() {
    console.log("selected espece!!! Data Variette :::", this.data_var);
    // filtre variette espece
    if (this.isAddMepSg || this.isEditMepSg) {
      let val_espece: Loc_Espece = this.sg_paForm.value.espece;
      this.data_variette_filter = this.data_var.filter(item => {return item.id_espece === val_espece.code_espece});
      console.log("Data Variette Filter:::", this.data_variette_filter);
    }
  }
  onSelectEspeceEa() {
    // filtered variette espece associé
    let val_espece_ea: Loc_Espece = this.sg_paForm.value.espece_ea;
    this.data_variette_filter_ea = this.data_var.filter(item => {return item.id_espece === val_espece_ea.code_espece});
  }
  onFormSubmit() {
    let dismiss: any;
    if (this.isAddMepSg) {
      dismiss = {
        isAddMepSg: true,
        data_: null
      }
    } else if(this.isEditMepSg) {
      dismiss = {
        isEditMepSg: true,
        data_: null
      }
    } else if(this.isAddMepPa) {
      dismiss = {
        isAddMepPa: true,
        data_: null
      }
    } else if(this.isEditMepPa) {
      dismiss = {
        isEditMepPa: true,
        data_: null
      }
    } else if(this.isAddMepMv) {
      dismiss = {
        isAddMepMv: true,
        data_: null
      }
    } else if(this.isEditMepMv) {
      dismiss = {
        isEditMepMv: true,
        data_: null
      }
    }
    dismiss.data_ = this.sg_paForm.value;

    this.modalCtrl.dismiss(dismiss);
    console.log(this.sg_paForm.value);
  }

}
