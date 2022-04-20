import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { Db_Culture_pms } from 'src/app/interfaces/interface-insertDb';
import { Sync_culture_pms, Sync_suivi_pms } from 'src/app/interfaces/interface-sync';
import { CrudDbService } from 'src/app/services/local/crud-db.service';
import { LoadSyncService } from 'src/app/services/local/load-sync.service';
import { SyncService } from 'src/app/services/sync.service';
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
            Etat: elem.Etat === "ToSync"? "isSync": "isUpdate"
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
              img_fact: elem.img_fact === 'null' ? null : elem.img_fact,
              dds: elem.dds,
              sfce: elem.sfce,
              objectif: elem.objectif,
              sc: elem.sc,
              ea_id_variette: elem.ea_id_variette === 'null' ? null: elem.ea_id_variette,
              ea_autres: elem.ea_autres === 'null' ? null : elem.ea_autres,
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
            etat: "isSync",
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
        console.log(this.data_suivi)
      }
    });
  }
}
