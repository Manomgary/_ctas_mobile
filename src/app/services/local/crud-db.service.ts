import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { AddMepBloc, Db_Culture_pms, Db_suivi_pms, UpdateSuiviBloc } from 'src/app/interfaces/interface-insertDb';
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
                    VALUES ("${data.code_culture}", "${data.id_parce}", "${data.id_var}", "${data.id_saison}", "${data.annee_du}", "${data.ddp}", "${data.dt_creation}", "${data.dt_modification}", ${data.qsa}, ${data.img_fact != null? `'${data.img_fact}'`:null}, 
                    "${data.dds}", ${data.sfce}, ${data.objectif}, "${data.sc}", ${data.ea_id_variette != null? `"${data.ea_id_variette}"`:null}, ${data.ea_autres != null? `"${data.ea_autres}"`:null}, "${data.statuts}", "${data.Etat}");`;
      return await this.db.execute(state);
    }
  }
  async UpdatedCulture(data: Db_Culture_pms) {
    if (this.db_ready.dbReady.value) {
      const state = `UPDATE cultures_pms SET id_parce = "${data.id_parce}", id_var = "${data.id_var}", 
                    id_saison = "${data.id_saison}", annee_du = "${data.annee_du}", ddp = "${data.ddp}", 
                    dt_creation = "${data.dt_creation}", dt_modification = "${data.dt_modification}", 
                    qsa = ${data.qsa}, img_fact = ${data.img_fact != null? `'${data.img_fact}'`:null}, dds = "${data.dds}", 
                    sfce = ${data.sfce}, objectif = ${data.objectif}, sc = "${data.sc}", 
                    ea_id_variette = ${data.ea_id_variette != null? `"${data.ea_id_variette}"`:null}, ea_autres = ${data.ea_autres != null? `"${data.ea_autres}"`:null}, 
                    statuts = "${data.statuts}", Etat = "${data.Etat}"
                    WHERE code_culture = "${data.code_culture}";`;
      return await this.db.execute(state);
    }
  }
  async AddNewSuivi(data: Db_suivi_pms) {
    if (this.db_ready.dbReady.value) {
      const state = `INSERT INTO suivi_pms(id, id_culture, ddp, stc, ec, ex, pb, img_cult, name, path, controle, etat)
                    VALUES ("${data.id}", "${data.code_culture}", "${data.ddp}", "${data.stc}", "${data.ec}", ${data.ex != null? `"${data.ex}"`:null}, ${data.pb != null?`"${data.pb}"`:null}, 
                    ${data.img_cult != null?`"${data.img_cult}"`:null}, ${data.name != null?`"${data.name}"`:null}, "${data.path}", ${data.controle != null?`"${data.controle}"`:null}, "${data.etat}");`;
      return await this.db.execute(state);
    }
  }
  async UpdatedSuivi(data: any) {
    if (this.db_ready.dbReady.value) {
      const state = `UPDATE suivi_pms SET ddp = "${data.ddp}", stc = "${data.stc}", 
                    ec = "${data.ec}", ex = ${data.ex != null? `"${data.ex}"`:null}, 
                    img_cult = ${data.img_cult != null?`"${data.img_cult}"`:null}, 
                    pb = ${data.pb != null?`"${data.pb}"`:null}, controle = ${data.controle != null?`"${data.controle}"`:null}, 
                    etat = "${data.etat}"
                    WHERE id_culture = "${data.code_culture}" AND id = "${data.id}";`;
      return await this.db.execute(state);
    }
  }
  /**
  * CRUD BLOC
  */
 async AddMepBl(data: AddMepBloc) {
   if (this.db_ready.dbReady.value) {
      const state = `INSERT INTO culture_bl(code_culture, id_parce, id_espece, id_var, id_saison, annee_du, ddp, qso, dds, sfce, sc, ea_autres, ea_id_variette, dt_creation, dt_modification, status, etat, id_equipe, type) 
                    VALUES ("${data.code_culture}","${data.id_parce}", ${data.id_espece != null? `"${data.id_espece}"` : null}, ${data.id_var != null? `"${data.id_var}"`:null },"${data.id_saison}","${data.annee_du}","${data.ddp}",${data.qso},"${data.dds}",${data.sfce},${data.sc != null? `"${data.sc}"`:null},${data.ea_autres != null? `"${data.ea_autres}"`: null}, ${data.ea_id_variette != null? `"${data.ea_id_variette}"`: null},"${data.dt_creation}","${data.dt_modification}","${data.status}","${data.etat}",${data.id_equipe}, "${data.type}");`;
      return await this.db.execute(state);
   }
 }
 async UpdateMepBl(data:any /**data: AddMepBloc*/) {
   if (this.db_ready.dbReady.value) {
    let state = ``;
    if (data.isSyncUpdate != undefined && data.isSyncUpdate) {
      // Sync service
      state = `UPDATE culture_bl SET  etat="${data.etat}" WHERE code_culture="${data.code_culture}"`;
    } else {
      state = `UPDATE culture_bl SET id_parce="${data.id_parce}", id_espece= ${data.id_espece != null? `"${data.id_espece}"` : null}, id_var= ${data.id_var != null? `"${data.id_var}"`:null },id_saison="${data.id_saison}",annee_du="${data.annee_du}",
              ddp="${data.ddp}", qso=${data.qso}, dds="${data.dds}", sfce=${data.sfce}, sc=${data.sc != null? `"${data.sc}"`:null}, ea_autres=${data.ea_autres != null? `"${data.ea_autres}"`: null}, ea_id_variette=${data.ea_id_variette != null? `"${data.ea_id_variette}"`: null}, 
              dt_modification="${data.dt_modification}", status="${data.status}", etat="${data.etat}", id_equipe=${data.id_equipe}, type="${data.type}" WHERE code_culture="${data.code_culture}"`;
    }
    return await this.db.execute(state);
   }
 }
 /**
  * Suivi bloc
  */
  async AddSuiviBl(data: UpdateSuiviBloc) {
    if (this.db_ready.dbReady.value) {
      const state = `INSERT INTO suivi_bl(code_sv, id_culture, ddp, stc, ql, qr, long_ligne, nbre_ligne, nbre_pied, img_cult, ex, etat) 
                    VALUES ("${ data.code_sv }", "${ data.id_culture }", "${data.ddp}", ${ data.stc != null? `"${data.stc}"`:null }, ${data.ql}, ${data.qr}, ${data.long_ligne}, ${data.nbre_ligne}, ${data.nbre_pied}, ${ data.img_cult != null? `"${data.img_cult}"`:null }, ${data.ex}, "${ data.etat }")`;
      return await this.db.execute(state);
    }
  }
  async UpdateSuiviBl(_data: any) {

    if (this.db_ready.dbReady.value) {
      let state = ``;

      if (_data.isSyncUpdate != undefined && _data.isSyncUpdate) {
        state = `UPDATE suivi_bl SET etat="${ _data.etat }" WHERE code_sv="${ _data.code_suivi }"`;
      } else {
        let data: UpdateSuiviBloc = _data.updated;
        state = `UPDATE suivi_bl SET id_culture="${ data.id_culture }", ddp="${data.ddp}", stc=${ data.stc != null? `"${data.stc}"`:null }, ql=${data.ql}, qr=${data.qr}, long_ligne=${data.long_ligne}, nbre_ligne=${data.nbre_ligne},
                nbre_pied=${data.nbre_pied}, img_cult=${ data.img_cult != null? `"${data.img_cult}"`:null }, ex=${data.ex}, etat="${ data.etat }" WHERE code_sv="${ data.code_sv }"`;
      }

      return await this.db.execute(state);
    }

  }
}
