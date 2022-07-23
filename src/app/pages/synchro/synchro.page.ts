import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { Db_Culture_pms, UpdateAnimeSpecu } from 'src/app/interfaces/interface-insertDb';
import { Sync_activ_pms, Sync_activ_pr, Sync_anime_specu, Sync_anime_ve, Sync_benef_activ_pms, Sync_benef_activ_pr, Sync_cep_pr, Sync_culture_pms, Sync_info_benef, Sync_MepPR, Sync_mep_bl, Sync_parceSaison_pms, Sync_parce_pms, Sync_suivi_bl, Sync_Suivi_MepPr, Sync_suivi_pms } from 'src/app/interfaces/interface-sync';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
import { LoadSyncService } from 'src/app/services/local/load-sync.service';
import { SyncService } from 'src/app/services/sync.service';
import { ACTIVE, ISSYNC, ISUPDATE, SYNC } from 'src/app/utils/global-variables';
import { Utilisateurs } from 'src/app/utils/interface-bd';

@Component({
  selector: 'app-synchro',
  templateUrl: './synchro.page.html',
  styleUrls: ['./synchro.page.scss'],
})
export class SynchroPage implements OnInit {
  private isRouterActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private projet: any = {};
  private users: Utilisateurs[] = [];
  private data_culture: Sync_culture_pms[]= [];
  private data_suivi: Sync_suivi_pms[] = []
  private isCheckData: boolean = false;

  private data_mep_bloc: Sync_mep_bl[] = [];
  private data_suivi_bloc: Sync_suivi_bl[] = [];
  private data_benef_activ_pr: Sync_benef_activ_pr[] = [];
  private data_benef_activ_pms: Sync_benef_activ_pms[] = [];
  private data_info_benf_pr: Sync_info_benef[] = [];
  private data_info_benf_pms: Sync_info_benef[] = [];
  private data_benef_pr: Sync_activ_pr[] = [];
  private data_benef_pms: Sync_activ_pms[] = [];
  private data_anime_ve: Sync_anime_ve[] = [];
  private data_anime_specu: Sync_anime_specu[] = [];

  private data_cep_pr: Sync_cep_pr[] = [];

  private data_parce_pms: Sync_parce_pms[] = [];
  private data_parceSaison_pms: Sync_parceSaison_pms[] = [];

  private data_mep_pr: Sync_MepPR[] = [];
  private data_suivi_pr: Sync_Suivi_MepPr[] = [];

  constructor(private router: Router,
              private LoadTosync: LoadSyncService,
              private syncService: SyncService,
              private crudDb: CrudDbService) {

    if (this.router.getCurrentNavigation().extras.state) {
      const routeState = this.router.getCurrentNavigation().extras.state;
      this.projet = JSON.parse(routeState.projet);
      this.users =  JSON.parse(routeState.users);
      this.isRouterActive.next(true);
    }
    this.isRouterActive.subscribe(isActive => {
      if (isActive) {
        this.loadCulture();
        this.loadSuiviPms();
        this.loadMepBloc();
        this.loadSvBloc();
        this.loadBenefeActivePr();
        this.loadAnimationVe();
        this.loadSyncMepPR();
        this.loadSuiviMepPR();
        this.loadSyncPms();
        this.loadSyncParcePms();
        this.loadSyncCepPr();
      }
    });
  }

  ngOnInit() {}

  /*************************
   * Sync CULTURE PMS
   *************************/
  onSyncCulture() {
    console.log(this.data_culture);
    const data_To_sync = {
      add_culture: this.data_culture
    }
    this.syncService.syncCulture(data_To_sync).subscribe(res => {
      console.log(res)
      if (res.status = 200) {
        // updated data_culure
        let updated_culture: Db_Culture_pms;
        this.data_culture.forEach((elem, i) => {
          updated_culture = {    
            code_culture: elem.code_culture, 
            id_parce: elem.id_parce, 
            id_var: elem.id_var,
            id_saison: elem.id_saison,
            id_annee: elem.id_annee,
            ddp: elem.ddp,
            dt_creation: elem.dt_creation,
            dt_modification: moment().format("YYYY-MM-DD"),
            qsa : elem.qsa,
            img_fact: elem.img_fact,
            dds: elem.dds,
            sfce: elem.sfce,
            sc: elem.sc,
            ea_id_variette: elem.ea_id_variette,
            ea_autres: elem.ea_autres,
            statuts: elem.statuts,
            Etat: elem.Etat === SYNC? ISSYNC: ISUPDATE
          }
          this.crudDb.UpdatedCulture(updated_culture).then(res => {
            if ((this.data_culture.length - 1) === i) {
              console.log("mise à jour success!!");
              this.loadCulture();
            }
          })
        });
      }
    },
    error => {
      console.log("error http::: ", error);
    });
  }

  loadCulture() {
    let index = this.users.length - 1;
    let code_equipe = this.users[index].id_equipe;
    const data_ = {
      id_tech : code_equipe,
      id_projet: this.projet.code_proj
    }
    console.log(data_);
    this.data_culture = [];
    this.LoadTosync.loadSyncCulturePms(data_).then(res => {
      console.log("::::Culture:::", res.values);
      if (res.values.length > 0) {
        res.values.forEach((elem: Sync_culture_pms) => {
          this.data_culture.push({
              code_culture: elem.code_culture,
              id_parce: elem.id_parce,
              id_var: elem.id_var,
              id_saison: elem.id_saison,
              id_annee: elem.id_annee,
              ddp: elem.ddp,
              qsa: elem.qsa,
              img_fact: elem.img_fact,
              dds: elem.dds,
              sfce: elem.sfce,
              objectif: elem.objectif,
              sc: elem.sc,
              ea_id_variette: elem.ea_id_variette,
              ea_autres: elem.ea_autres,
              dt_creation: elem.dt_creation,
              dt_modification: elem.dt_modification,
              statuts: elem.statuts,
              Etat: elem.Etat
            });
        });
        console.log(this.data_culture);
        this.isCheckData = true;
      }
    });
  }

  /********************
   * Sync suivi pms
   ********************/
  onSyncSuivi() {
    console.log(this.data_suivi);
    const data_To_sync = {
      add_suivi: this.data_suivi
    }
    this.syncService.syncSuivi(data_To_sync).subscribe(res => {
      console.log(res);
      if (res.status = 200) {
        let updated_suivi: any;
        this.data_suivi.forEach((item, i) => {
          updated_suivi = {
            ddp: item.ddp,
            stc: item.stc,
            ec: item.ec,
            ex: item.ex,
            img_cult: item.img_cult,
            controle: item.controle,
            declaration: item.declaration,
            etat: ISSYNC,
            code_culture: item.id_culture,
            id: item.id
          }
          this.crudDb.UpdatedSuivi(updated_suivi).then(res_ => {
            if ((this.data_suivi.length - 1) === i) {
              console.log("mise à jour success!!");
              this.loadSuiviPms();
            }
          })
        });
      }
    })
  }

  loadSuiviPms() {
    let index = this.users.length - 1;
    let code_equipe = this.users[index].id_equipe;
    const data_ = {
      id_tech : code_equipe,
      id_projet: this.projet.code_proj
    }
    console.log(data_);
    this.data_suivi = [];
    this.LoadTosync.loadSyncSuivi(data_).then(res => {
      console.log(":::Suivi Pms::::", res);
      if (res.values.length > 0) {
        res.values.forEach((elem_suivi: Sync_suivi_pms, i) => {
          this.data_suivi.push({
            id: elem_suivi.id,
            id_culture: elem_suivi.id_culture,
            ddp: elem_suivi.ddp,
            stc: elem_suivi.stc,
            ec: elem_suivi.ec, 
            pb: elem_suivi.pb,
            ex: elem_suivi.ex,
            img_cult: elem_suivi.img_cult,
            name: elem_suivi.name,
            controle: elem_suivi.controle,
            declaration: elem_suivi.declaration,
            etat: elem_suivi.etat
          });
        });
        console.log(this.data_suivi);
      }
    });
  }
  /*************************
   * SYNC Mise en Place bloc
   **************************/
  onSyncMepBl() {
    const _data_ = {
      add_mepBl: this.data_mep_bloc
    }
    // requeste
    this.syncService.syncMepBloc(_data_).subscribe(res_sync => {
      if (res_sync.status = 200) {
        this.data_mep_bloc.forEach((elem, ind) => {
          let updated_mep = {
            code_culture: elem.code_culture,
            isSyncUpdate: true,
            etat: elem.etat === SYNC? ISSYNC: ISUPDATE
          }
          this.crudDb.UpdateMepBl(updated_mep).then(res => {
            if ((this.data_mep_bloc.length - 1) === ind) {
             this.loadMepBloc();
            }
          });
        });
      }
    }, err => {
      console.log(":::::ERREUR Sync Http MEP BLOC::::: ", err);
    });
  }

  loadMepBloc() {
    const data_ = {
      id_tech : this.users[this.users.length - 1].id_equipe,
      id_projet: this.projet.code_proj
    }
    this.data_mep_bloc = [];
    this.LoadTosync.loadSyncMepBl(data_).then(res_ => {
      if (res_.values.length > 0) {
        res_.values.forEach(elem => {
          this.data_mep_bloc.push(elem);
        });
      }
      console.log("Response Mep data bloc::::", this.data_mep_bloc);
    });
  }

  // Sync Suivi MEP  bloc
  onSyncSuiviBl() {
    const data_  = {
      add_suiviBl: this.data_suivi_bloc
    }
    // load sync
    this.syncService.syncSuiviBloc(data_).subscribe(res_sync => {
      if (res_sync.status = 200) {
        this.data_suivi_bloc.forEach((elem, i) => {
          // update data
          let updated_mep = {
            code_suivi: elem.code_sv,
            isSyncUpdate: true,
            etat: elem.etat === SYNC? ISSYNC: ISUPDATE
          }
          this.crudDb.UpdateSuiviBl(updated_mep).then(res_ => {
            // fin du boucle
            if ((this.data_suivi_bloc.length - 1) === i) {
              this.loadSvBloc();
            }
          });
        });
      }
    });
  }
  loadSvBloc() {
    const data_ = {
      id_tech : this.users[this.users.length - 1].id_equipe,
      id_projet: this.projet.code_proj
    }
    this.LoadTosync.loadSyncSvBl(data_).then(res_ => {
      this.data_suivi_bloc = [];
      if (res_.values.length > 0) {
        res_.values.forEach(elem => {
          this.data_suivi_bloc.push(elem);
        });
      }
      console.log("Response suivi data bloc::::", this.data_suivi_bloc);
    });
  }
  /**
   * Sync Paysant relais
   */
  loadBenefeActivePr() {
    const data_ = {
      id_tech : this.users[this.users.length - 1].id_equipe,
      id_projet: this.projet.code_proj
    };
    this.data_benef_activ_pr = [];
    this.data_info_benf_pr = [];
    this.data_benef_pr = [];
    this.LoadTosync.loadSyncBenefActivPR(data_).then(res_ => {
      this.data_benef_activ_pr = res_.values;
      if (this.data_benef_activ_pr.length > 0) {
        this.data_benef_activ_pr.forEach(elem_pr => {
          this.data_info_benf_pr.push({
            code_benef: elem_pr.code_benef,
            img_benef: elem_pr.img_benef,
            nom: elem_pr.nom,
            prenom: elem_pr.prenom,
            sexe: elem_pr.sexe,
            dt_nais: elem_pr.dt_nais,
            dt_nais_vers: elem_pr.dt_nais_vers,
            surnom: elem_pr.surnom,
            cin: elem_pr.cin,
            dt_delivrance: elem_pr.dt_delivrance,
            lieu_delivrance: elem_pr.lieu_delivrance,
            img_cin: elem_pr.img_cin,
            contact: elem_pr.contact,
            id_fkt: elem_pr.id_fkt,
            id_commune: elem_pr.id_commune,
            village: elem_pr.village,
            dt_Insert: elem_pr.dt_Insert,
            etat: elem_pr.etat_benf,
            statut: elem_pr.statut_benef
          });
          this.data_benef_pr.push({
            code_pr: elem_pr.code_pr, 
            id_proj: elem_pr.id_proj, 
            id_activ: elem_pr.id_activ,
            id_benef: elem_pr.id_benef, 
            id_bloc: elem_pr.id_bloc, 
            code_achat: elem_pr.code_achat, 
            id_collaborateur: elem_pr.id_collaborateur, 
            id_tech: elem_pr.id_tech, 
            etat: elem_pr.etat_pr, 
            status: elem_pr.status_pr
          });
        });
      }
    });
  }
  onSyncBenefeActivePr() {
    console.log(":::Data PR:::", this.data_benef_activ_pr);
    let data_ = {
      update_info_benef: this.data_info_benf_pr,
      update_activ_pr: this.data_benef_pr
    }
    this.syncService.syncBenefPR(data_).subscribe(res => {
      console.log(":::Response sync:::", res);
      if (res.response == 1) {
        this.data_info_benf_pr.forEach((elem_info, ind_info) => {
          // update data
          let updated_etat_benef = {
            code_benef: elem_info.code_benef,
            etat: elem_info.etat === SYNC? ISSYNC: ISUPDATE
          }
          this.crudDb.UpdateBenefSync(updated_etat_benef).then(res => {
            console.log(":::Benef info Updated::::");
            if ((this.data_info_benf_pr.length - 1) === ind_info) {
              this.data_benef_pr.forEach((elem_pr, ind_pr) => {
                let update_etat_pr = {
                  code_pr: elem_pr.code_pr,
                  etat: elem_pr.etat === SYNC? ISSYNC: ISUPDATE
                }
                this.crudDb.UpdatePrBenefSync(update_etat_pr).then(res => {
                  console.log(":::::PR updated::::");
                  this.loadBenefeActivePr();
                });
              });
            }
          });
        })
      }
    });
  }
  /**
   * Load sync CEP
   */
  loadSyncCepPr() {
    const data_ = {
      id_tech : this.users[this.users.length - 1].id_equipe,
      id_projet: this.projet.code_proj
    };
    this.data_cep_pr = [];
    this.LoadTosync.loadSyncCepPR(data_).then(res_cep => {
      if (res_cep.values.length > 0) {
        this.data_cep_pr = res_cep.values;
      }
    });
  }
  onSyncParcePr() {
    const data_ = {
      update_cep_pr : this.data_cep_pr
    }
    this.syncService.syncCepPR(data_).subscribe(res => {
      if (res.response == 1) {
         if (this.data_cep_pr.length > 0) {
          this.data_cep_pr.forEach(elem_cep => {
            let data_update_cep = {
              isUpdateCepSync: true,
              data_cep: {
                code_parce: elem_cep.code_parce,
                etat: elem_cep.etat  == SYNC? ISSYNC: ISUPDATE
              }
            }
            this.crudDb.UpdateParcellePr(data_update_cep).then(res => {
              console.log(":::::Cep Updated:::");
              this.loadSyncCepPr();
            });
          });
         }
      }
    });
  }
  /********************
   * Animation Ve
   ***************/
  loadAnimationVe() {
    const data_ = {
      id_tech : this.users[this.users.length - 1].id_equipe,
      id_projet: this.projet.code_proj
    };
    this.data_anime_ve = [];
    this.data_anime_specu = [];
    this.LoadTosync.loadSyncAnimationVe(data_).then(res => {
      this.data_anime_ve = res.values;
      this.LoadTosync.loadSyncSpecuAnime(data_).then(res => {
        this.data_anime_specu = res.values;
      });
    });
  }
  onSyncAnimationVe() {
    const data_ = {
      updtate_anime_ve: this.data_anime_ve,
      update_anime_specu: this.data_anime_specu
    }
    this.syncService.syncAnimeVe(data_).subscribe(res => {
      console.log(":::Res sync Animation::::", res);
      if (res.response == 1) {
        this.data_anime_ve.forEach((elem_anime_ve, ind) => {
          let update_etat_anime = {
            code: elem_anime_ve.code,
            etat: elem_anime_ve.etat === SYNC? ISSYNC: ISUPDATE
          }
          this.crudDb.UpdateAnimationVeSync(update_etat_anime).then(res => {
            console.log(":::::Updated Sync Animation ve:::::");
          });
          if ((this.data_anime_ve.length - 1) === ind) {
            if (this.data_anime_specu.length > 0) {
              this.data_anime_specu.forEach(elem_specu => {
                let update_specu: UpdateAnimeSpecu = {
                  code_specu: elem_specu.code_specu,
                  id_anime_ve: elem_specu.id_anime_ve,
                  id_var: elem_specu.id_var,
                  id_espece: elem_specu.id_espece,
                  quantite: elem_specu.quantite,
                  etat: elem_specu.etat === SYNC?ISSYNC: ISUPDATE,
                  status: elem_specu.status
                }
                this.crudDb.UpdateAnimationVe_specu(update_specu).then(res => {
                  console.log(":::::Animation/VE Speculation is Updated:::::");
                });
              });
            } 
            this.loadAnimationVe();
          }
        });
      }
    });
    console.log("Animation Ve::::", this.data_anime_ve);
    console.log("Animaton Speculation::::", this.data_anime_specu);
  }
  /***************************
   * Sync suivi PR
   ****************************/
  loadSyncMepPR() {
    const data_ = {
      id_tech : this.users[this.users.length - 1].id_equipe,
      id_projet: this.projet.code_proj
    };
    this.data_mep_pr = [];
    this.LoadTosync.loadSyncMepPR(data_).then(res => {
      this.data_mep_pr = res.values;
    });
  }
  onSyncMepPR() {
    const data_ = {
      updtate_mep_pr: this.data_mep_pr
    }
    this.syncService.syncMepPR(data_).subscribe(res => {
      console.log("::::Response Sync MEP PR::::", res);
      if (res.response == 1) {
        this.data_mep_pr.forEach(elem_mep_pr => {
          let update_etat_mep_pr = {
            isUpdateMepSuiviSync: true,
            code_culture: elem_mep_pr.code_culture,
            etat: elem_mep_pr.etat === SYNC? ISSYNC: ISUPDATE,
            status: ACTIVE
          }
          this.crudDb.UpdatedMepPR(update_etat_mep_pr).then(res => {
            console.log(":::::Updated Sync MEP PR:::::");
            this.loadSyncMepPR();
          });
        });
      }
    });
  }
  loadSuiviMepPR() {
    const data_ = {
      id_tech : this.users[this.users.length - 1].id_equipe,
      id_projet: this.projet.code_proj
    };
    this.data_suivi_pr = [];
    this.LoadTosync.loadSyncSuiviMepPR(data_).then(res => {
      this.data_suivi_pr = res.values;
    });
  }
  onSyncSuiviPr() {
    const data_ = {
      update_suivi_pr: this.data_suivi_pr
    }
    this.syncService.syncSuiviMepPR(data_).subscribe(res_ => {
      console.log(":::::RESONSE SYNC SUIVI:::::", res_);
      if (res_.response == 1) {
        this.data_suivi_pr.forEach(elem_suivi_pr => {
          let update_etat_suivi_pr = {
            isUpdateSuiviSync: true,
            data_suivi: {
              code_sv: elem_suivi_pr.code_sv,
              etat: elem_suivi_pr.etat === SYNC? ISSYNC: ISUPDATE
            }
          }
          this.crudDb.UpdateSuiviMepPR(update_etat_suivi_pr).then(res => {
            console.log(":::::Updated Sync SUIVI MEP PR:::::");
            this.loadSuiviMepPR();
          });
        });
      }
    });
  }
  /**
   * Pms
   */
  loadSyncPms() {
    const data_ = {
      id_tech : this.users[this.users.length - 1].id_equipe,
      id_projet: this.projet.code_proj
    };
    this.data_benef_activ_pms = [];
    this.data_info_benf_pms = [];
    this.data_benef_pms = [];
    this.LoadTosync.loadSyncBenefActivPms(data_).then(res_ => {
      this.data_benef_activ_pms = res_.values;
      if (this.data_benef_activ_pms.length > 0) {
        this.data_benef_activ_pms.forEach(elem_pms => {
          this.data_info_benf_pms.push({
            code_benef: elem_pms.code_benef,
            img_benef: elem_pms.img_benef,
            nom: elem_pms.nom,
            prenom: elem_pms.prenom,
            sexe: elem_pms.sexe,
            dt_nais: elem_pms.dt_nais,
            dt_nais_vers: elem_pms.dt_nais_vers,
            surnom: elem_pms.surnom,
            cin: elem_pms.cin,
            dt_delivrance: elem_pms.dt_delivrance,
            lieu_delivrance: elem_pms.lieu_delivrance,
            img_cin: elem_pms.img_cin,
            contact: elem_pms.contact,
            id_fkt: elem_pms.id_fkt,
            id_commune: elem_pms.id_commune,
            village: elem_pms.village,
            dt_Insert: elem_pms.dt_Insert,
            etat: elem_pms.etat_benf,
            statut: elem_pms.statut_benef
          });
          this.data_benef_pms.push({
            code_benef_pms: elem_pms.code_benef_pms,
            code_achat: elem_pms.code_achat,
            id_proj: elem_pms.id_proj,
            id_benef: elem_pms.code_benef,
            id_association: elem_pms.id_association,
            id_collaborateur: elem_pms.id_collaborateur,
            id_activ: elem_pms.id_activ,
            etat: elem_pms.etat_pms,
            status: elem_pms.status_pms,
          });
        });
      }
    });
  }
  onSyncBenefeActivePms() {
    console.log(":::Data PMS:::", this.data_benef_activ_pms);
    let data_ = {
      update_info_benef: this.data_info_benf_pms,
      update_activ_pms: this.data_benef_pms
    }
    this.syncService.syncBenefPms(data_).subscribe(res => {
      console.log(":::Response sync:::", res);
      if (res.response == 1) {
        this.data_info_benf_pms.forEach((elem_info, ind_info) => {
          // update data
          let updated_etat_benef = {
            code_benef: elem_info.code_benef,
            etat: elem_info.etat === SYNC? ISSYNC: ISUPDATE
          }
          this.crudDb.UpdateBenefSync(updated_etat_benef).then(res => {
            console.log(":::Benef info Updated::::");
            if ((this.data_info_benf_pms.length - 1) === ind_info) {
              this.data_benef_pms.forEach((elem_pms, ind_pms) => {
                let update_etat_pms = {
                  isUpdatePmsSync: true,
                  data_pms: {
                    code_benef_pms: elem_pms.code_benef_pms,
                    etat: elem_pms.etat === SYNC? ISSYNC: ISUPDATE,
                    status: ACTIVE
                  }
                }
                this.crudDb.UpdatePms(update_etat_pms).then(res => {
                  console.log(":::::PMS updated::::", res);
                  this.loadSyncPms();
                });
              });
            }
          });
        })
      }
    });
  }
  /**
   * Parcelle Pms
   */
  loadSyncParcePms() {
    const data_ = {
      id_tech : this.users[this.users.length - 1].id_equipe,
      id_projet: this.projet.code_proj
    };
    this.data_parce_pms = [];
    this.data_parceSaison_pms = [];
    this.LoadTosync.loadSyncParcePms(data_).then(res_parce_pms => {
      if (res_parce_pms.values.length > 0) {
        this.data_parce_pms = res_parce_pms.values;
        console.log(":::Data Parce Pms to sync::::", this.data_parce_pms);
      }
    });
    this.LoadTosync.loadSyncParceSaisonPms(data_).then(res_parceSaison => {
      if (res_parceSaison.values.length > 0) {
        this.data_parceSaison_pms = res_parceSaison.values;
        console.log(":::Data Parce Saison Pms to sync::::", this.data_parceSaison_pms);
      }
    });
  }
  onSyncParcePms() {
    let data_ = {
      update_parce_pms: this.data_parce_pms,
      update_parceSaison_pms: this.data_parceSaison_pms
    }
    this.syncService.syncParcePms(data_).subscribe(res => {
      if (res.response == 1) {
        if (this.data_parce_pms.length > 0) {
          this.data_parce_pms.forEach(elem_parce =>  {
            let update_parce = {
              isUpdateParcePmsSync: true,
              data_parce: {
                code_parce: elem_parce.code_parce,
                etat: elem_parce.etat === SYNC?ISSYNC:ISUPDATE, 
                status: elem_parce.status
              }
            }
            this.crudDb.UpdateParcellePms(update_parce).then(res => {
              console.log(":::Parcelle Pms Updated:::");
            });
          });
        }
        if (this.data_parceSaison_pms.length > 0) {
          this.data_parceSaison_pms.forEach(elem_parceSaison => {
            let update_parce = {
              isUpdateParceSaisonSync: true,
              data_parce_saison: {
                code: elem_parceSaison.code,
                etat: elem_parceSaison.etat === SYNC?ISSYNC:ISUPDATE
              }
            }
            this.crudDb.UpdateParcelleSaisonPms(update_parce).then(res => {
              console.log("Parcelle Saison Updated!");
            });
          });
        }
      }
      this.loadSyncParcePms();
    });
  }
}
