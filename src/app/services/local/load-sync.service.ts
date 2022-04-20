import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';
import { DB_NAME } from 'src/app/utils/global-variables';
import { DatabaseService } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class LoadSyncService {
  private db: SQLiteDBConnection = new SQLiteDBConnection(DB_NAME, CapacitorSQLite);

  constructor(private dbService: DatabaseService) {}

  async loadSyncCulturePms(data: any) {
    
    if (this.dbService.dbReady.value) {
      const statement = `SELECT ASS.nom as nom_ass, CL.code_culture, CL.id_parce, CL.id_var, CL.id_saison, CL.annee_du, CL.ddp, CL.qsa, CL.img_fact, CL.dds, CL.sfce, CL.objectif, CL.sc, CL.ea_id_variette, CL.ea_autres, CL.dt_creation, CL.dt_modification, CL.statuts, CL.Etat 
      FROM cultures_pms CL
      INNER JOIN assoc_parce AS_PRC ON AS_PRC.code_parce = CL.id_parce
      INNER JOIN association ASS ON ASS.code_ass = AS_PRC.id_assoc
      WHERE ASS.id_tech = "${data.id_tech}" AND ASS.id_prjt  = "${data.id_projet}" AND CL.Etat IN ("ToSync", "ToUpdate");`;
      return await this.db.query(statement);
    }
  }

  async loadSyncSuivi(data: any) {
    if (this.dbService.dbReady.value) {
      const statement = `SELECT ASS.nom AS nom_ass, SPMS.id, SPMS.id_culture, SPMS.ddp, SPMS.stc, SPMS.ec, SPMS.pb, SPMS.ex, SPMS.img_cult, SPMS.name, SPMS.controle, SPMS.etat 
                        FROM suivi_pms SPMS
                        INNER JOIN cultures_pms CPMS ON CPMS.code_culture = SPMS.id_culture
                        INNER JOIN assoc_parce ASSP ON ASSP.code_parce = CPMS.id_parce
                        INNER JOIN association ASS ON ASS.code_ass = ASSP.id_assoc
                        WHERE ASS.id_tech = ${data.id_tech} AND ASS.id_prjt = "${data.id_projet}" AND SPMS.etat IN ("ToSync", "ToUpdate")`;
      return await this.db.query(statement);
    }
  }
}
