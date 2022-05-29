import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { Db_Culture_pms } from 'src/app/interfaces/interface-insertDb';
import { Sync_culture_pms, Sync_mep_bl, Sync_suivi_bl, Sync_suivi_pms } from 'src/app/interfaces/interface-sync';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
import { LoadSyncService } from 'src/app/services/local/load-sync.service';
import { SyncService } from 'src/app/services/sync.service';
import { ISSYNC, ISUPDATE, SYNC } from 'src/app/utils/global-variables';
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
        this.loadSvBloc()
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
            annee_du: elem.annee_du,
            ddp: elem.ddp,
            dt_creation: elem.dt_creation,
            dt_modification: moment().format("YYYY-MM-DD"),
            qsa : elem.qsa,
            img_fact: elem.img_fact,
            dds: elem.dds,
            sfce: elem.sfce,
            objectif: elem.objectif,
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
      console.log(res.values);
      if (res.values.length > 0) {
        res.values.forEach((elem: Sync_culture_pms) => {
          this.data_culture.push({
              code_culture: elem.code_culture,
              id_parce: elem.id_parce,
              id_var: elem.id_var,
              id_saison: elem.id_saison,
              annee_du: elem.annee_du,
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
      console.log(res);
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
}
