import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { UpdateAnimationVe, UpdateAnimeSpecu } from 'src/app/interfaces/interface-insertDb';
import { AnimationSpecu, AnimationVe, LocalFile, Loc_categEspece, Loc_Commune, Loc_district, Loc_Espece, Loc_Fokontany, Loc_PR, Loc_projet, Loc_region, Loc_variette } from 'src/app/interfaces/interfaces-local';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { ACTIVE, ANIMATION, SYNC, UPDATE } from 'src/app/utils/global-variables';
import { Utilisateurs } from 'src/app/utils/interface-bd';
import { ModalPrPage } from '../../modals/modal-pr/modal-pr.page';

import * as _moment from 'moment';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
const moment = _moment;

interface AnimetionVe {
  pr: Loc_PR,
  dt_anime: string,
  nb_participant: number,
  nb_femme: number,
  nb_homme: number,
  nb_inf_25: number,
  speculation: any[],
  img_piece: LocalFile[],
  region: Loc_region,
  district: Loc_district,
  commune: Loc_Commune,
  fokontany: Loc_Fokontany,
  village: string,
  quantite_specu: number,
  specu_delete:  AnimationSpecu[]
}

@Component({
  selector: 'app-animation-ve',
  templateUrl: './animation-ve.page.html',
  styleUrls: ['./animation-ve.page.scss'],
  animations: [ //utiliser pour @detailExpand (table expendable)
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class AnimationVePage implements OnInit {
  private projet: Loc_projet;
  private user: Utilisateurs[];
  private activite: string;

  private data_animation_ve: AnimationVe[] = [];
  private data_anime_specu: AnimationSpecu[] = [];

  // displayed columns
  displayedColumnsAnimeVe: string[] = ['code_pr', 'nom', 'code_anime', 'date_anime', 'commune', 'fokontany', 'nb_participant', 'nb_f', 'nb_h', 'nb-25', 'nb_specu', 'quantite', 'img_pièce', 'action'];
  displayedColumnsAddAnimeVe: string[] = ['new_code_pr', 'new_nom', 'new_code_anime', 'new_date_anime', 'new_commune', 'new_fokontany', 'new_nb_participant', 'new_nb_f', 'new_nb_h', 'new_nb-25', 'new_nb_specu', 'new_quantite', 'new_img_pièce', 'new_action'];
  displayedColumnsSpecu: string[] = ['speculation', 'quantite'];

  // data source Mep
  dataSourceAnimationVe = new MatTableDataSource<AnimationVe>();

  isTableAnimationExpanded = false;
  isUpdate: boolean = false;

  data_region: Loc_region[] = [];
  data_district: Loc_district[] = [];
  data_commune: Loc_Commune[] = [];
  data_fokontany: Loc_Fokontany[] = [];
  update_animeve: AnimetionVe;
  isAddAnimation: boolean = false;
  isRowEditAnimation: boolean = false;
  indexRowEdit: number;
  data_pr: Loc_PR[] = [];

  data_espece: Loc_Espece[] = [];
  data_var: Loc_variette[] = [];
  data_categ: Loc_categEspece[] = [];


  constructor(
    private router: Router,
    private loadData: LoadDataService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private crudData: CrudDbService
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
          this.loadAnimation();
        }
    }

  ngOnInit() {
    this.loadZone();
    this.loadPRBloc();
    this.loadSpeculation();
  }

  onFinish() {
    this.isUpdate = false;
    if (this.isRowEditAnimation) {
      this.isRowEditAnimation = false;
      this.indexRowEdit = null;
    }
    if (this.isAddAnimation) {
      this.isAddAnimation = false;
    }
    setTimeout(async () => {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.loadAnimation();
      this.loadingCtrl.dismiss();
    }, 1000);
  }
  onUpdate() {
    this.isUpdate = true;
  }
  onEditElement(data: any) {
    this.indexRowEdit = data.index;
    this.onPresentModal(data);
  }

  onClick() {
    console.log("console beneficiaire::::");
    this.router.navigate(['homes']);
  }

  onAdd() {
    let data = {
      src: 'add'
    };
    this.onPresentModal(data);
  }

  // Save add Animation
  onCancelAnime() {
    this.isAddAnimation = false;
  }
  onSaveAnime() {
    this.isAddAnimation = false;
    console.log(":::Update Animation Ve:::", this.update_animeve);
    let img_piece: string[] = [];
    if (this.update_animeve.img_piece != null) {
      this.update_animeve.img_piece.forEach(item => {
        img_piece.push(item.data);
      });
    }
    let code_anime: string = this.user[this.user.length - 1].id_equipe + this.projet.ancronyme  + '-' + 'ANIM' + '-' + moment().format('YYYYMMDD-HHmmss');
    let addAnimation : UpdateAnimationVe = {
      code: code_anime,
      id_pr: this.update_animeve.pr.code_pr,
      id_fkt: this.update_animeve.fokontany != null?this.update_animeve.fokontany.code_fkt:null,
      id_commune: this.update_animeve.village != null?this.update_animeve.commune.code_com:null ,
      village: this.update_animeve.village,
      date_anim: this.update_animeve.dt_anime,
      nb_participant: this.update_animeve.nb_participant,
      nb_h: this.update_animeve.nb_homme,
      nb_f: this.update_animeve.nb_femme,
      nb_inf_25: this.update_animeve.nb_inf_25,
      type: ANIMATION,
      img_piece: img_piece.length > 0?JSON.stringify(img_piece.join("-")):null,
      img_group_particip: null,
      id_tech_recenseur: this.user[this.user.length - 1].id_equipe,
      etat: SYNC,
      status: ACTIVE
    }
    console.log("Data to Add:::", addAnimation);
    this.crudData.AddAnimationVe(addAnimation).then(res => {
      console.log("Animation Add Ve::", this.update_animeve.speculation);
      if (this.update_animeve.speculation != null) {
        this.update_animeve.speculation.forEach(item => {
          let add_specu: UpdateAnimeSpecu = {
            code_specu: 0,
            id_anime_ve: code_anime,
            id_var: item.variette != null ? item.variette.code_var : null,
            id_espece: item.variette != null ? null : item.espece.code_espece,
            quantite: item.quantite,
            etat: SYNC,
            status: ACTIVE
          }
          console.log("data Specu to Add:::", add_specu);
          this.crudData.AddAnimationVe_specu(add_specu).then(res => {
            console.log("Added speculation::::");
          });
        });
      }
      setTimeout(() => {
        this.loadAnimation();
      },  500);
    });
  }

  // on Edit anime
  onCancelEdit() {
    this.isRowEditAnimation = false;
    this.indexRowEdit = null;
  }
  onSaveEdit(element: AnimationVe) {
    console.log("::Element Edit:::", element);
    console.log("::Element To Update Edit:::", this.update_animeve);
    let img_piece: string[] = [];
    if (this.update_animeve.img_piece != null) {
      this.update_animeve.img_piece.forEach(item => {
        img_piece.push(item.data);
      });
    }
    let updateAnimation : UpdateAnimationVe = {
      code: element.code_anime,
      id_pr: this.update_animeve.pr.code_pr,
      id_fkt: this.update_animeve.fokontany != null?this.update_animeve.fokontany.code_fkt:null,
      id_commune: this.update_animeve.village != null?this.update_animeve.commune.code_com:null ,
      village: this.update_animeve.village,
      date_anim: this.update_animeve.dt_anime,
      nb_participant: this.update_animeve.nb_participant,
      nb_h: this.update_animeve.nb_homme,
      nb_f: this.update_animeve.nb_femme,
      nb_inf_25: this.update_animeve.nb_inf_25,
      type: ANIMATION,
      img_piece: img_piece.length > 0?JSON.stringify(img_piece.join("-")):null,
      img_group_particip: null,
      id_tech_recenseur: this.user[this.user.length - 1].id_equipe,
      etat: element.etat === SYNC?SYNC:UPDATE,
      status: ACTIVE
    }
    this.crudData.UpdateAnimationVe(updateAnimation).then(res => {
      console.log(":::Animation Updated:::Specu Delete::::", this.update_animeve.specu_delete);
      if (this.update_animeve.specu_delete != null) {
        if (this.update_animeve.specu_delete.length > 0) {
          this.update_animeve.specu_delete.forEach((elem_del, ind) => {
            this.crudData.DeleteAnimationVe_specu(elem_del).then(res => {
              if ((this.update_animeve.specu_delete.length - 1) === ind) {
                console.log("::::Delete Success:::");
              }
            });
          });
        }
      }
      this.loadAnimation();
    });
    this.isRowEditAnimation = false;
    this.indexRowEdit = null;
  }

  loadAnimation() {
    let data = {
      code_projet: this.projet.code_proj,
      code_equipe: this.user[this.user.length - 1].id_equipe
    }
    this.data_anime_specu = [];
    this.data_animation_ve = [];
    this.loadData.loadAnimeSpecu(data).then(res => {
      console.log(":::::Load Animation Specu::::", res);
      if (res.values.length > 0) {
        res.values.forEach(elem => { 
          this.data_anime_specu.push(elem);
        });
      }
    });
    this.loadData.loadAnimationVe(data).then(res => {
      console.log(":::::Load Animation Ve:::", res);
      //this.data_animation_ve = res.values;
      if (res.values.length > 0) {
        res.values.forEach(elem => {
          this.data_animation_ve.push(elem);
        });
        if (this.data_animation_ve.length > 0) {
          this.data_animation_ve.forEach(item => {
            item.specu_animation = this.data_anime_specu.filter(item_specu => {return item_specu.id_anime_ve === item.code_anime});
          });
        }
        this.dataSourceAnimationVe.data = this.data_animation_ve;
        console.log(":::::Load Animation Ve With elem:::", this.data_animation_ve);
      }
    });
  }

  toggleTableRows() {
    this.isTableAnimationExpanded = !this.isTableAnimationExpanded;
    this.dataSourceAnimationVe.data.forEach(row => {
      if (row.specu_animation.length > 0) {
        row.isExpanded = this.isTableAnimationExpanded;
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
        isAnimationVe: true,
        isAddAnimeVe: true,
        zone: {
          region: this.data_region,
          district: this.data_district,
          commune: this.data_commune,
          fokontany: this.data_fokontany
        },
        pr: this.data_pr,
        categorie:  this.data_categ,
        espece: this.data_espece,
        variette: this.data_var
      }
    } else if (data.src === 'edit') {
      //let data_ = {src: 'add', data: element, index: i};
      data_ = { 
        isAnimationVe: true,
        isEditAnimeVe: true,
        zone: {
          region: this.data_region,
          district: this.data_district,
          commune: this.data_commune,
          fokontany: this.data_fokontany
        },
        pr: this.data_pr,
        element: data.data,
        categorie:  this.data_categ,
        espece: this.data_espece,
        variette: this.data_var
      }
    }
    let modal = await this.modalCtrl.create({
      component: ModalPrPage,
      cssClass: 'modal-custum-animationve',
      backdropDismiss: true,
      componentProps: data_
    });
    modal.onDidDismiss().then(data_modal => {
      console.log("Modal Dismissed!!", data_modal.data);
      if (data_modal.data != undefined) {
        console.log("Modal Data with data", data_modal.data);
        this.update_animeve = data_modal.data;
        this.update_animeve.dt_anime = data_modal.data.dt_anime != null? data_modal.data.dt_anime.format("YYYY-MM-DD"): data_modal.data.dt_anime;
        
        if (data.src === 'add') {
          this.isAddAnimation = true;
        } else if (data.src === 'edit') {
          this.isRowEditAnimation = true;
        }
      }
    });
    await modal.present();
  }

  // load Zone
  // loadZone
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

  // load Speculation
  loadSpeculation() {
    // load Categorie Espece
    this.loadData.loadCategEspece().then(res_categorie => {
      console.log(res_categorie);
      if (res_categorie.values.length > 0) {
        res_categorie.values.forEach(elem => {
          this.data_categ.push(elem);
        });
      }
    });
    // load Espece
    this.loadData.loadEspece().then(res_Espec => {
      console.log(res_Espec);
      if (res_Espec.values.length > 0) {
        res_Espec.values.forEach(elem_esp => {
          this.data_espece.push(elem_esp);
        });
      }
    });
    // load variette
    this.loadData.loadVariette().then(res_var => {
      console.log(res_var);
      if (res_var.values.length > 0) {
        res_var.values.forEach(elem_var => {
          this.data_var.push(elem_var);
        });
      }
    });
  }

  // load Parcelle
  loadPRBloc() {
    let data = {
      code_projet: this.projet.code_proj,
      id_tech: this.user[this.user.length - 1].id_equipe
    }
    
    this.loadData.loadPRBloc(data).then(res => {
      console.log("Response PR::", res.values);
      this.data_pr = res.values;
    });
  }

}
