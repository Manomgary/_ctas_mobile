import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Db_Culture_pms, Db_suivi_pms } from 'src/app/interfaces/interface-insertDb';
import { DB_NAME } from 'src/app/utils/global-variables';
import { DatabaseService } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class CrudDbService {
  private dbName: string = DB_NAME;
  private db: SQLiteDBConnection = new SQLiteDBConnection(this.dbName, CapacitorSQLite);

  constructor(private db_ready: DatabaseService) { }

  /**
   * 
   * CULTURE PMS OPERATION
   * 
   */
  async AddNewCulture(data: Db_Culture_pms) {
    if (this.db_ready.dbReady.value) {
      const state = `INSERT INTO cultures_pms(code_culture, id_parce, id_var, id_saison, annee_du, ddp, dt_creation, dt_modification, qsa, img_fact, 
                      dds, sfce, objectif, sc, ea_id_variette, ea_autres, statuts, Etat) 
                    VALUES ("${data.code_culture}", "${data.id_parce}", "${data.id_var}", "${data.id_saison}", "${data.annee_du}", "${data.ddp}", "${data.dt_creation}", "${data.dt_modification}", ${data.qsa}, '${data.img_fact}', 
                    "${data.dds}", ${data.sfce}, ${data.objectif}, "${data.sc}", '${data.ea_id_variette}', "${data.ea_autres}", "${data.statuts}", "${data.Etat}");`;
      return await this.db.execute(state);
    }
  }
  async AddNewSuivi(data: Db_suivi_pms) {
    if (this.db_ready.dbReady.value) {
      const state = `INSERT INTO suivi_pms(id_culture, ddp, stc, ec, ex, img_cult, controle)
                    VALUES ("${data.code_culture}", "${data.ddp}", "${data.stc}", "${data.ec}", "${data.ex}", "${data.img_cult}", "${data.controle}");`;
      return await this.db.execute(state);
    }
  }
  async UpdatedSuivi(data: any) {
    if (this.db_ready.dbReady.value) {
      const state = `UPDATE suivi_pms
                    SET ddp = "${data.ddp}", stc = "${data.stc}", ec = "${data.ec}", ex = "${data.ex}", img_cult = "${data.img_cult}", controle = "${data.controle}"
                    WHERE id_culture = "${data.code_culture}" AND id = ${data.id};`;
      return await this.db.execute(state);
    }
  }
}
