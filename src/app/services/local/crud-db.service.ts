import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { AddMepBloc, Db_Culture_pms, Db_suivi_pms, UpdateAnimationVe, UpdateAnimeSpecu, UpdateBenef, UpdateBenefActivPr, UpdatedBenefActivPms, UpdatedBenefBloc, UpdateMepPR, UpdateParceBloc, UpdateParcellePms, UpdateParcePr, UpdateParceSaisonPms, UpdateSuiviBloc, UpdateSuiviMepPR } from 'src/app/interfaces/interface-insertDb';
import { Loc_AnimationSpecu } from 'src/app/interfaces/interfaces-local';
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
      const state = `INSERT INTO cultures_pms(code_culture, id_parce, id_var, id_saison, id_annee, ddp, dt_creation, dt_modification, qsa, img_fact, 
                      dds, sfce, sc, ea_id_variette, ea_autres, statuts, Etat) 
                    VALUES ("${data.code_culture}", "${data.id_parce}", "${data.id_var}", "${data.id_saison}", ${data.id_annee}, "${data.ddp}", "${data.dt_creation}", "${data.dt_modification}", ${data.qsa}, ${data.img_fact != null? `'${data.img_fact}'`:null}, 
                    "${data.dds}", ${data.sfce}, "${data.sc}", ${data.ea_id_variette != null? `"${data.ea_id_variette}"`:null}, ${data.ea_autres != null? `"${data.ea_autres}"`:null}, "${data.statuts}", "${data.Etat}");`;
      return await this.db.execute(state);
    }
  }
  async UpdatedCulture(data: Db_Culture_pms) {
    if (this.db_ready.dbReady.value) {
      const state = `UPDATE cultures_pms SET id_parce = "${data.id_parce}", id_var = "${data.id_var}", 
                    id_saison = "${data.id_saison}", id_annee = ${data.id_annee}, ddp = "${data.ddp}", 
                    dt_creation = "${data.dt_creation}", dt_modification = "${data.dt_modification}", 
                    qsa = ${data.qsa}, img_fact = ${data.img_fact != null? `'${data.img_fact}'`:null}, dds = "${data.dds}", 
                    sfce = ${data.sfce}, sc = "${data.sc}", 
                    ea_id_variette = ${data.ea_id_variette != null? `"${data.ea_id_variette}"`:null}, ea_autres = ${data.ea_autres != null? `"${data.ea_autres}"`:null}, 
                    statuts = "${data.statuts}", Etat = "${data.Etat}"
                    WHERE code_culture = "${data.code_culture}";`;
      return await this.db.execute(state);
    }
  }
  async AddNewSuivi(data: Db_suivi_pms) {
    if (this.db_ready.dbReady.value) {
      const state = `INSERT INTO suivi_pms(id, id_culture, ddp, stc, ec, ex, pb, img_cult, name, path, controle, declaration, etat)
                    VALUES ("${data.id}", "${data.code_culture}", "${data.ddp}", "${data.stc}", "${data.ec}", ${data.ex}, ${data.pb != null?`"${data.pb}"`:null}, 
                    ${data.img_cult != null?`"${data.img_cult}"`:null}, ${data.name != null?`"${data.name}"`:null}, "${data.path}", ${data.controle != null?`"${data.controle}"`:null}, ${data.declaration != null?`"${data.declaration}"`:null}, "${data.etat}");`;
      return await this.db.execute(state);
    }
  }
  async UpdatedSuivi(data: any) {
    if (this.db_ready.dbReady.value) {
      const state = `UPDATE suivi_pms SET ddp = "${data.ddp}", stc = "${data.stc}", 
                    ec = "${data.ec}", ex = ${data.ex}, 
                    img_cult = ${data.img_cult != null?`"${data.img_cult}"`:null}, 
                    pb = ${data.pb != null?`"${data.pb}"`:null}, controle = ${data.controle != null?`"${data.controle}"`:null}, 
                    declaration = ${data.declaration != null?`"${data.declaration}"`:null}, etat = "${data.etat}"
                    WHERE id_culture = "${data.code_culture}" AND id = "${data.id}";`;
      return await this.db.execute(state);
    }
  }
  /**
  * CRUD BLOC
  */
 async AddMepBl(data: AddMepBloc) {
   if (this.db_ready.dbReady.value) {
      const state = `INSERT INTO culture_bl(code_culture, id_parce, id_espece, id_var, id_saison, id_annee, ddp, qso, dt_distribution, dds, sfce, nbre_ligne, long_ligne, usage, sc, ea_autres, ea_id_variette, dt_creation, dt_modification, status, etat, id_equipe, type) 
                    VALUES ("${data.code_culture}","${data.id_parce}", ${data.id_espece != null? `"${data.id_espece}"` : null}, ${data.id_var != null? `"${data.id_var}"`:null }, ${data.id_saison != null?`"${data.id_saison}"`:null}, ${data.id_annee},"${data.ddp}",${data.qso}, ${data.dt_distribution != null?`"${data.dt_distribution}"`:null}, "${data.dds}", ${data.sfce},  ${data.nbre_ligne},  ${data.long_ligne}, ${data.usage != null?`"${data.usage}"`:null}, ${data.sc != null? `"${data.sc}"`:null},${data.ea_autres != null? `"${data.ea_autres}"`: null}, ${data.ea_id_variette != null? `"${data.ea_id_variette}"`: null},"${data.dt_creation}","${data.dt_modification}","${data.status}","${data.etat}",${data.id_equipe}, "${data.type}");`;
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
      state = `UPDATE culture_bl SET id_parce="${data.id_parce}", id_espece= ${data.id_espece != null? `"${data.id_espece}"` : null}, id_var= ${data.id_var != null? `"${data.id_var}"`:null },id_saison=${data.id_saison != null?`"${data.id_saison}"`:null},id_annee= ${data.id_annee},
              ddp="${data.ddp}", qso=${data.qso}, dt_distribution = ${data.dt_distribution != null?`"${data.dt_distribution}"`:null}, dds="${data.dds}", sfce=${data.sfce}, nbre_ligne = ${data.nbre_ligne}, long_ligne = ${data.long_ligne}, usage = ${data.usage != null?`"${data.usage}"`:null}, sc=${data.sc != null? `"${data.sc}"`:null}, ea_autres=${data.ea_autres != null? `"${data.ea_autres}"`: null}, ea_id_variette=${data.ea_id_variette != null? `"${data.ea_id_variette}"`: null}, 
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
      const state = `INSERT INTO suivi_bl(code_sv, id_culture, ddp, stc, ec, ql, qr, long_ligne, nbre_ligne, nbre_pied, hauteur, img_cult, dt_capture, ex, dt_creation, dt_modification, etat) 
                    VALUES ("${ data.code_sv }", "${ data.id_culture }", "${data.ddp}", ${ data.stc != null? `"${data.stc}"`:null }, ${ data.ec != null? `"${data.ec}"`:null }, ${data.ql}, ${data.qr}, ${data.long_ligne}, ${data.nbre_ligne}, ${data.nbre_pied}, ${data.hauteur}, ${ data.img_cult != null? `"${data.img_cult}"`:null }, ${ data.dt_capture != null? `"${data.dt_capture}"`:null }, ${data.ex}, "${ data.dt_creation }", "${ data.dt_modification }", "${ data.etat }")`;
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
        state = `UPDATE suivi_bl SET id_culture="${ data.id_culture }", ddp="${data.ddp}", stc=${ data.stc != null? `"${data.stc}"`:null }, ec = ${ data.ec != null? `"${data.ec}"`:null }, ql=${data.ql}, qr=${data.qr}, long_ligne=${data.long_ligne}, nbre_ligne=${data.nbre_ligne},
                nbre_pied=${data.nbre_pied}, hauteur = ${data.hauteur}, img_cult=${ data.img_cult != null? `"${data.img_cult}"`:null }, dt_capture = ${ data.dt_capture != null? `"${data.dt_capture}"`:null }, ex=${data.ex}, etat="${ data.etat }",
                dt_modification = "${ data.dt_modification }" WHERE code_sv="${ data.code_sv }"`;
      }

      return await this.db.execute(state);
    }
  }
  /******************************
   * PR Bloc
   ******************************/
  /**async AddBenef(data: UpdateBenef) {
    if (this.db_ready.dbReady.value) {
      const state = `INSERT INTO beneficiaire(code_benef, img_benef, nom, prenom, sexe, dt_nais, dt_nais_vers, surnom, cin, dt_delivrance, lieu_delivrance, img_cin, contact, id_fkt, id_commune, village, dt_Insert, etat, statut) 
                  VALUES ("${data.code_benef}", ${data.img_benef != null?`"${data.img_benef}"`:null}, "${data.nom}", ${data.prenom != null?`"${data.prenom}"`:null}, "${data.sexe}", ${data.dt_nais != null?`"${data.dt_nais}"`:null}, ${data.dt_nais_vers != null?`"${data.dt_nais_vers}"`:null}, ${data.surnom != null?`"${data.surnom}"`:null}, ${data.cin}, 
                  ${data.dt_delivrance != null?`"${data.dt_delivrance}"`:null}, ${data.lieu_delivrance != null?`"${data.lieu_delivrance}"`:null} , ${data.img_cin != null?`'${data.img_cin}'`:null}, ${data.contact != null?`"${data.contact}"`:null}, ${data.id_fkt != null?`"${data.id_fkt}"`:null}, ${data.id_commune != null?`"${data.id_commune}"`:null}, ${data.village != null?`"${data.village}"`:null}, "${data.dt_Insert}", "${data.etat}", "${data.statut}")`;
      return await this.db.execute(state);
    }
  }*/
  async AddBenef_(data: UpdateBenef) {
    if (this.db_ready.dbReady.value) {
      let data_ = [data.code_benef, data.img_benef, data.nom, data.prenom, data.sexe, data.dt_nais, data.dt_nais_vers, data.surnom, data.cin, data.dt_delivrance, data.lieu_delivrance, data.img_cin, data.contact, data.id_fkt, data.id_commune, data.village, data.dt_Insert, data.etat, data.statut];
      const state = `INSERT INTO beneficiaire(code_benef, img_benef, nom, prenom, sexe, dt_nais, dt_nais_vers, surnom, cin, dt_delivrance, lieu_delivrance, img_cin, contact, id_fkt, id_commune, village, dt_Insert, etat, statut) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)`;
      return await this.db.query(state, data_);
    }
  }
  async UpdateBenef(data: UpdateBenef) {
    if (this.db_ready.dbReady.value) {
      let data_ = [data.img_benef, data.nom, data.prenom, data.sexe, data.dt_nais, data.dt_nais_vers, data.surnom, data.cin, data.dt_delivrance, data.lieu_delivrance, data.img_cin, data.contact, data.id_fkt, data.id_commune, data.village, data.etat, data.statut];
      const state_ = `UPDATE beneficiaire SET img_benef= ?, nom= ?, prenom= ?, sexe= ?, dt_nais= ?, dt_nais_vers= ?, surnom= ?, cin= ?, dt_delivrance= ?, lieu_delivrance= ?, img_cin= ?, contact= ?, id_fkt= ?, id_commune= ?, village= ?, etat= ?, statut= ? WHERE code_benef="${data.code_benef}"`;
      return await this.db.query(state_, data_);
    }
  }
  async UpdateBenefSync(data: any) {
    if (this.db_ready.dbReady.value) {
      let data_ = [data.etat];
      const state_ = `UPDATE beneficiaire SET  etat= ? WHERE code_benef="${data.code_benef}"`;
      return await this.db.query(state_, data_);
    }
  }
  async AddPrBenef(data: UpdateBenefActivPr) {
    if (this.db_ready.dbReady.value) {
      const state = `INSERT INTO benef_activ_pr(code_pr, id_proj, id_activ, id_benef, id_bloc, code_achat, id_collaborateur, id_tech, etat, status) 
                    VALUES ("${data.code_pr}", "${data.id_proj}", ${data.id_activ}, "${data.id_benef}", ${data.id_bloc != null?`"${data.id_bloc}"`:null}, ${data.code_achat != null? `"${data.code_achat}"`:null},
                    "${data.id_collaborateur}", ${data.id_tech}, "${data.etat}", "${data.status}")`;
      return this.db.execute(state);
    }
  }
  async UpdatePrBenef(data: UpdateBenefActivPr) {
    if (this.db_ready.dbReady.value) {
      const state = `UPDATE benef_activ_pr SET code_achat=${data.code_achat != null? `"${data.code_achat}"`:null}, etat="${data.etat}",status="${data.status}" WHERE code_pr="${data.code_pr}"`;
      return this.db.execute(state);
    }
  }
  async UpdatePrBenefSync(data: any) {
    if (this.db_ready.dbReady.value) {
      const state = `UPDATE benef_activ_pr SET etat="${data.etat}" WHERE code_pr="${data.code_pr}"`;
      return this.db.execute(state);
    }
  }
  // Add parcelle
  async AddParcellePr(data: UpdateParcePr) {
    if (this.db_ready.dbReady.value) {
      let data_ = [data.code_parce, data.id_bloc, data.id_benef, data.ref_gps, data.lat, data.log, data.superficie, data.id_commune, data.id_fkt, data.village, data.anne_adheran, data.dt_creation, data.etat, data.status];
      const state_ = `INSERT INTO cep_parce(code_parce, id_bloc, id_benef, ref_gps, lat, log, superficie, id_commune, id_fkt, village, anne_adheran, dt_creation, etat, status) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      return await this.db.query(state_, data_);
    }
  }
  // Update parcelle
  async UpdateParcellePr(data: any) {
    if (this.db_ready.dbReady.value) {
      let data_: any;
      let state_: any;
      if (data.isUpdateCep) {
        let data_cep: UpdateParcePr = data.data_cep;
        data_ = [data_cep.id_bloc, data_cep.id_benef, data_cep.ref_gps, data_cep.lat, data_cep.log, data_cep.superficie, data_cep.id_commune, data_cep.id_fkt, data_cep.village, data_cep.anne_adheran, data_cep.dt_creation, data_cep.etat, data_cep.status];
        state_ = `UPDATE cep_parce SET id_bloc = ?, id_benef= ?, ref_gps=?, lat=?, log=?, superficie=?, id_commune=?, id_fkt=?, village=?, anne_adheran=?, dt_creation=?, etat=?, status=? WHERE code_parce = "${data_cep.code_parce}"`;
      }
      if (data.isUpdateCepSync) {
        let data_cep_sync: any = data.data_cep;
        data_ = [data_cep_sync.etat];
        state_ = `UPDATE cep_parce SET etat=? WHERE code_parce = "${data_cep_sync.code_parce}"`;
      }
      return await this.db.query(state_, data_);
    }
  }
  // Add animation
  async AddAnimationVe(data: UpdateAnimationVe) {
    if (this.db_ready.dbReady.value) {
      let data_ = [data.code, data.id_pr, data.id_fkt, data.id_commune, data.village, data.date_anim, data.nb_participant, data.nb_h, data.nb_f, data.nb_inf_25, data.type, data.img_piece, null, data.id_tech_recenseur, data.etat, data.status];
      const state_ = `INSERT INTO animation_ve(code, id_pr, id_fkt, id_commune, village, date_anim, nb_participant, nb_h, nb_f, nb_inf_25, type, img_piece, img_group_particip, id_tech_recenseur, etat, status) 
                      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      return await this.db.query(state_, data_);
    }
  }
  
  // Update animation
  async UpdateAnimationVe(data: UpdateAnimationVe) {
    if (this.db_ready.dbReady.value) {
      let data_ = [data.id_pr, data.id_fkt, data.id_commune, data.village, data.date_anim, data.nb_participant, data.nb_h, data.nb_f, data.nb_inf_25, data.type, data.img_piece, null, data.id_tech_recenseur, data.etat, data.status];
      const state_ = `UPDATE animation_ve SET id_pr = ?, id_fkt = ?, id_commune = ?, village = ?, date_anim = ?, nb_participant = ?, nb_h = ?, nb_f = ?, nb_inf_25 = ?, type = ?, img_piece = ?, img_group_particip = ?, id_tech_recenseur = ?, etat = ?, status = ? WHERE code = "${data.code}"`;
      return await this.db.query(state_, data_);
    }
  }
  // Update
  async UpdateAnimationVeSync(data: any) {
    if (this.db_ready.dbReady.value) {
      let data_ = [data.etat];
      const state_ = `UPDATE animation_ve SET etat = ? WHERE code = "${data.code}"`;
      return await this.db.query(state_, data_);
    }
  }
  // Add speculation
  async AddAnimationVe_specu(data: UpdateAnimeSpecu) {
    if (this.db_ready.dbReady.value) {
      let data_ = [data.id_anime_ve, data.id_var, data.id_espece, data.quantite, data.etat, data.status];
      const state_ = `INSERT INTO animation_ve_specu(id_anime_ve, id_var, id_espece, quantite, etat, status) 
                      VALUES(?, ?, ?, ?, ?, ?)`;
      return await this.db.query(state_, data_);
    }
  }
  // Update speculation
  async UpdateAnimationVe_specu(data: UpdateAnimeSpecu) {
    if (this.db_ready.dbReady.value) {
      let data_ = [data.id_anime_ve, data.id_var, data.id_espece, data.quantite, data.etat, data.status];
      const state_ = `UPDATE animation_ve_specu SET id_anime_ve = ?, id_var = ?, id_espece = ?, quantite = ?, etat = ?, status = ? WHERE code_specu = ${data.code_specu}`;
      return await this.db.query(state_, data_);
    }
  }
  // Delete speculation
  async DeleteAnimationVe_specu(data: Loc_AnimationSpecu) {
    if (this.db_ready.dbReady.value) {
      const state_ = `DELETE FROM animation_ve_specu WHERE code_specu = ${data.code_specu}`;
      return await this.db.execute(state_);
    }
  }
  // Add Mep PR
  async AddMepPR(data: UpdateMepPR) {
    if (this.db_ready.dbReady.value) {
      let data_ = [data.code_culture, data.id_parce, data.id_espece, data.id_var, data.id_saison, data.id_annee, data.ddp, data.qso, data.dt_distribution, data.dds, data.sfce, data.nbre_ligne, data.long_ligne, data.sc, data.ea_autres, data.ea_id_variette, data.dt_creation, data.dt_modification, data.status, data.etat, data.id_equipe, data.type];
      const state_ = `INSERT INTO culture_pr(code_culture, id_parce, id_espece, id_var, id_saison, id_annee, ddp, qso, dt_distribution, dds, sfce, nbre_ligne, long_ligne, sc, ea_autres, ea_id_variette, dt_creation, dt_modification, status, etat, id_equipe, type)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      return await this.db.query(state_, data_);
    }
  }
  // Add Mep PR
  async UpdatedMepPR(data: any) {
    if (this.db_ready.dbReady.value) {
      let data_: any;
      let state_: any;
      if (data.isUpdateMepSuivi) {
        let data_mep: UpdateMepPR = data.data_mep;
        data_ = [data_mep.id_parce, data_mep.id_espece, data_mep.id_var, data_mep.id_saison, data_mep.id_annee, data_mep.ddp, data_mep.qso, data_mep.dt_distribution, data_mep.dds, data_mep.sfce, data_mep.nbre_ligne, data_mep.long_ligne, data_mep.sc, data_mep.ea_autres, data_mep.ea_id_variette, data_mep.dt_modification, data_mep.status, data_mep.etat];
        state_ = `UPDATE culture_pr SET id_parce= ?, id_espece= ?, id_var= ?, id_saison= ?, id_annee= ?, ddp= ?, qso= ?, dt_distribution= ?, 
                dds= ?, sfce= ?, nbre_ligne= ?, long_ligne= ?, sc= ?, ea_autres= ?, ea_id_variette= ?, dt_modification= ?, status= ?, etat= ? WHERE code_culture= "${data_mep.code_culture}"`;
      }
      if (data.isUpdateMepSuiviSync) {
        data_ = [data.status, data.etat];
        state_ = `UPDATE culture_pr SET status= ?, etat= ? WHERE code_culture= "${data.code_culture}"`;
      }
      return await this.db.query(state_, data_);
    }
  }
  // Add suivi Mep PR
  async AddSuiviMepPR(data: UpdateSuiviMepPR) { 
    if (this.db_ready.dbReady.value) {
      let data_ = [data.code_sv, data.id_culture, data.ddp, data.stc, data.ql, data.qr, data.long_ligne, data.nbre_ligne, data.nbre_pied, data.hauteur, data.ec, data.img_cult, data.dt_capture, data.ex, data.dt_creation, data.dt_modification, data.etat];
      let state_ = `INSERT INTO suivi_pr(code_sv, id_culture, ddp, stc, ql, qr, long_ligne, nbre_ligne, nbre_pied, hauteur, ec, img_cult, dt_capture, ex, dt_creation, dt_modification, etat) 
                  VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      return await this.db.query(state_, data_);
    }
  }
  async UpdateSuiviMepPR(data: any) {
    if (this.db_ready.dbReady.value) {
      let data_: any;
      let state_: any;
      if (data.isUpdateSuivi) {
        let data_suivi: UpdateSuiviMepPR = data.data_suivi;
        data_ = [data_suivi.ddp, data_suivi.stc, data_suivi.ql, data_suivi.qr, data_suivi.long_ligne, data_suivi.nbre_ligne, data_suivi.nbre_pied, data_suivi.hauteur, data_suivi.ec, data_suivi.img_cult, data_suivi.dt_capture, data_suivi.ex, data_suivi.dt_modification, data_suivi.etat];
        state_ = `UPDATE suivi_pr SET ddp= ?, stc= ?, ql= ?, qr= ?, long_ligne= ?, nbre_ligne= ?, nbre_pied= ?, hauteur= ?, ec= ?, img_cult= ?, dt_capture= ?, ex= ?, dt_modification= ?, etat= ? 
                  WHERE code_sv= "${data_suivi.code_sv}"`;
      }
      if (data.isUpdateSuiviSync) {
        let data_suivi: any = data.data_suivi;
        data_ = [data_suivi.etat];
        state_ = `UPDATE suivi_pr SET etat= ? WHERE code_sv= "${data_suivi.code_sv}"`;
      }
      return await this.db.query(state_, data_);
    }
  }
    /******************
   * Updated Pms
   ******************/
  async AddBenefBl(data: UpdatedBenefBloc) {
    if (this.db_ready.dbReady.value) {
      let data_to_add = [data.code_benef_bl, data.code_benef_bl_temp, data.code_achat, data.id_proj, data.id_benef, data.id_activ, data.id_bloc, data.id_collaborateur, data.etat, data.status];
      let state_ = `INSERT INTO benef_activ_bl(code_benef_bl, code_benef_bl_temp, code_achat, id_proj, id_benef, id_activ, id_bloc, id_collaborateur, etat, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      return await this.db.query(state_, data_to_add);
    }
  }
  async UpdateBenefBl(data: any) {
    if (this.db_ready.dbReady.value) {
      let data_update: any;
      let state_: any;
      if (data.isUpdateBenefBloc) {
        let data_benef: UpdatedBenefBloc = data.data_benef_bl;
        data_update = [data_benef.code_achat, data_benef.id_proj, data_benef.id_activ, data_benef.id_benef, data_benef.id_bloc, data_benef.id_collaborateur, data_benef.etat, data_benef.status];
        state_ = `UPDATE benef_activ_bl SET code_achat= ?, id_proj= ?, id_activ= ?, id_benef= ?, id_bloc= ?, id_collaborateur= ?, etat= ?, status= ?  WHERE code_benef_bl = "${data_benef.code_benef_bl}"`;
      }
      if (data.isUpdateBenefBlocSync) {
        let data_benef: any = data.data_benef_bl;
        data_update = [data_benef.etat, data_benef.status];
        state_ = `UPDATE benef_activ_bl SET etat= ?, status= ?  WHERE code_benef_bl = "${data_benef.code_benef_bl}"`;
      }
      return await this.db.query(state_, data_update);
    }
  }
  async AddParceBloc(data: UpdateParceBloc) {
    if (this.db_ready.dbReady.value) {
      let data_to_add = [data.code_parce, data.code_parce_temp, data.id_bloc, data.id_benef, data.ref_gps, data.lat, data.log, data.superficie, data.id_fkt, data.id_commune, data.village, data.anne_adheran, data.indication, data.etat, data.status];
      let state_ = `INSERT INTO bloc_parce(code_parce, code_parce_temp, id_bloc, id_benef, ref_gps, lat, log, superficie, id_fkt, id_commune, village, anne_adheran, indication, etat, status) 
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,? ,?)`;
      return await this.db.query(state_, data_to_add);
    }
  }
  async UpdateParceBl(data: any) {
    if (this.db_ready.dbReady.value) {
      let data_update: any;
      let state_: any;
      if (data.isUpdateParceBl) {
        let data_parce: UpdateParceBloc = data.data_parce_bl;
        data_update = [data_parce.code_parce_temp, data_parce.id_bloc, data_parce.id_benef, data_parce.ref_gps, data_parce.lat, data_parce.log, data_parce.superficie, data_parce.id_fkt, data_parce.id_commune, data_parce.village, data_parce.anne_adheran, data_parce.indication, data_parce.etat, data_parce.status];
        state_ = `UPDATE bloc_parce SET code_parce_temp = ?, id_bloc = ?, id_benef = ?, ref_gps = ?, lat = ?, log = ?, superficie = ?, id_fkt = ?, id_commune = ?, village = ?, anne_adheran = ?, indication = ?, etat = ?, status = ? WHERE code_parce = "${data_parce.code_parce}"`;
      }
      if (data.isUpdateParceBlSync) {
        let data_parce: any = data.data_parce_bl;
        data_update = [data_parce.etat, data_parce.status];
        state_ = `UPDATE bloc_parce SET etat = ?, status = ? WHERE code_parce = "${data_parce.code_parce}"`;
      }
      return await this.db.query(state_, data_update);
    }
  }
  /******************
   * Updated Pms
   ******************/
  async AddPms(data: UpdatedBenefActivPms) {
    if (this.db_ready.dbReady.value) {
      let data_to_add = [data.code_benef_pms, data.code_achat, data.id_proj, data.id_benef, data.id_activ, data.id_association, data.id_collaborateur, data.etat, data.status];
      let state_ = `INSERT INTO benef_activ_pms(code_benef_pms, code_achat, id_proj, id_benef, id_activ, id_association, id_collaborateur, etat, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      return await this.db.query(state_, data_to_add);
    }
  }
  async UpdatePms(data: any) {
    if (this.db_ready.dbReady.value) {
      let data_update: any;
      let state_: any;
      if (data.isUpdatePms) {
        let data_pms: UpdatedBenefActivPms = data.data_pms;
        data_update = [data_pms.code_achat, data_pms.id_proj, data_pms.id_benef, data_pms.id_activ, data_pms.id_association, data_pms.id_collaborateur, data_pms.etat, data_pms.status];
        state_ = `UPDATE benef_activ_pms SET code_achat=?, id_proj=?, id_benef=?, id_activ=?, id_association=?, id_collaborateur=?, etat =?, status=? WHERE code_benef_pms = "${data_pms.code_benef_pms}"`;
      }
      if (data.isUpdatePmsSync) {
        let data_pms_sync: any = data.data_pms;
        data_update = [data_pms_sync.etat, data_pms_sync.status];
        state_ = `UPDATE benef_activ_pms SET etat =?, status=? WHERE code_benef_pms = "${data_pms_sync.code_benef_pms}"`;
      }
      return await this.db.query(state_, data_update);
    }
  }
  /*************************
   * Parcelle Pms
   *************************/
  async AddParcellePms(data: UpdateParcellePms) {
    if (this.db_ready.dbReady.value) {
      let data_parce = [data.code_parce, data.code_parce_temp, data.id_assoc, data.id_benef, data.ref_gps, data.lat, data.log, data.superficie, data.id_fkt, data.id_commune, data.village, data.anne_adheran, data.indication, data.etat, data.status];
      let state_ = `INSERT INTO assoc_parce(code_parce, code_parce_temp, id_assoc, id_benef, ref_gps, lat, log, superficie, id_fkt, id_commune, village, anne_adheran, indication, etat, status) 
                  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
      return await this.db.query(state_, data_parce);
    }
  }
  async UpdateParcellePms(data: any) {
    if (this.db_ready.dbReady.value) {
      let data_parce: any;
      let state_: any;
      if (data.isUpdateParcePms) {
        let data_parce_pms: UpdateParcellePms = data.data_parce;
        data_parce = [data_parce_pms.id_assoc, data_parce_pms.id_benef, data_parce_pms.ref_gps, data_parce_pms.lat, data_parce_pms.log, data_parce_pms.superficie, data_parce_pms.id_fkt, data_parce_pms.id_commune, data_parce_pms.village, data_parce_pms.anne_adheran, data_parce_pms.indication, data_parce_pms.etat, data_parce_pms.status];
        state_ = `UPDATE assoc_parce SET id_assoc= ?, id_benef= ?, ref_gps= ?, lat= ?, log= ?, superficie= ?, id_fkt= ?, id_commune= ?, village= ?, anne_adheran= ?, indication= ?, etat= ?, status= ? 
                  WHERE code_parce= "${data_parce_pms.code_parce}"`;
      }
      if (data.isUpdateParcePmsSync) {
        let data_parce_update: any = data.data_parce;
        data_parce = [data_parce_update.etat, data_parce_update.status];
        state_ = `UPDATE assoc_parce SET etat= ?, status= ? WHERE code_parce= "${data_parce_update.code_parce}"`;
      }
      return await this.db.query(state_, data_parce);
    }
  }
  async AddParcelleSaisonPms(data: UpdateParceSaisonPms) {
    if (this.db_ready.dbReady.value) {
      let data_parce_saison = [data.code, data.id_annee, data.id_saison, data.id_pms, data.id_parce, data.id_var, data.objectif, data.etat, data.commentaire];
      let state_ = `INSERT INTO assoc_parce_saison(code, id_annee, id_saison, id_pms, id_parce, id_var, objectif, etat, commentaire) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) `;
      return await this.db.query(state_, data_parce_saison);
    }
  }
  async UpdateParcelleSaisonPms(data: any) {
    if (this.db_ready.dbReady.value) {
      let data_parce_saison: any;
      let state_: any;
      if (data.isUpdateParceSaison) {
        let data_update: UpdateParceSaisonPms = data.data_parce_saison
        data_parce_saison = [data_update.id_annee, data_update.id_saison, data_update.id_pms, data_update.id_parce, data_update.ref_gps, data_update.lat, data_update.log, data_update.id_var, data_update.objectif, data_update.etat, data_update.commentaire];
        state_ = `UPDATE assoc_parce_saison SET id_annee = ?, id_saison = ?, id_pms = ?, id_parce = ?, ref_gps = ?, lat = ?, log = ?, id_var = ?, objectif = ?, etat = ?, commentaire = ?  WHERE code = "${data_update.code}"`;
      }
      if (data.isUpdateParceSaisonSync) {
        let data_update: any = data.data_parce_saison
        data_parce_saison = [data_update.etat];
        state_ = `UPDATE assoc_parce_saison SET etat = ? WHERE code = "${data_update.code}"`;
      }
      return await this.db.query(state_, data_parce_saison);
    }
  }
}
