import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';
import { DB_NAME, SYNC, UPDATE } from 'src/app/utils/global-variables';
import { DatabaseService } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class LoadSyncService {
  private db: SQLiteDBConnection = new SQLiteDBConnection(DB_NAME, CapacitorSQLite);

  constructor(private dbService: DatabaseService) {}

  async loadSyncCulturePms(data: any) {
    
    if (this.dbService.dbReady.value) {
      const statement = `SELECT ASS.nom as nom_ass, CL.code_culture, CL.id_parce, CL.id_var, CL.id_saison, CL.annee_du, CL.ddp, CL.qsa, CL.img_fact, CL.dds, CL.sfce, CL.sc, CL.ea_id_variette, CL.ea_autres, CL.dt_creation, CL.dt_modification, CL.statuts, CL.Etat 
      FROM cultures_pms CL
      INNER JOIN assoc_parce AS_PRC ON AS_PRC.code_parce = CL.id_parce
      INNER JOIN association ASS ON ASS.code_ass = AS_PRC.id_assoc
      WHERE ASS.id_tech = "${data.id_tech}" AND ASS.id_prjt  = "${data.id_projet}" AND CL.Etat IN ("ToSync", "ToUpdate");`;
      return await this.db.query(statement);
    }
  }

  async loadSyncSuivi(data: any) {
    if (this.dbService.dbReady.value) {
      const statement = `SELECT ASS.nom AS nom_ass, SPMS.id, SPMS.id_culture, SPMS.ddp, SPMS.stc, SPMS.ec, SPMS.pb, SPMS.ex, SPMS.img_cult, SPMS.name, SPMS.controle, SPMS.declaration, SPMS.etat 
                        FROM suivi_pms SPMS
                        INNER JOIN cultures_pms CPMS ON CPMS.code_culture = SPMS.id_culture
                        INNER JOIN assoc_parce ASSP ON ASSP.code_parce = CPMS.id_parce
                        INNER JOIN association ASS ON ASS.code_ass = ASSP.id_assoc
                        WHERE ASS.id_tech = ${data.id_tech} AND ASS.id_prjt = "${data.id_projet}" AND SPMS.etat IN ("ToSync", "ToUpdate")`;
      return await this.db.query(statement);
    }
  }
  /*********************************
   * LOAD SYNC SERVICE
   **********************************/
  async loadSyncMepBl(data: any) {
    if (this.dbService.dbReady.value) {
      const state = `SELECT CBL.code_culture, CBL.id_parce, CBL.id_espece, CBL.id_var, CBL.id_saison, CBL.annee_du, CBL.ddp, CBL.qso, CBL.dt_distribution, CBL.dds, CBL.sfce, CBL.nbre_ligne, CBL.long_ligne, CBL.usage, CBL.sc, CBL.ea_autres, CBL.ea_id_variette, CBL.dt_creation, CBL.dt_modification, CBL.status, CBL.etat, CBL.id_equipe, CBL.type 
                    FROM culture_bl CBL
                    INNER JOIN bloc_parce BPRC ON BPRC.code_parce = CBL.id_parce
                    INNER JOIN bloc BL ON BL.code_bloc = BPRC.id_bloc
                    WHERE BL.id_tech = ${data.id_tech} AND BL.id_prjt = "${data.id_projet}" AND CBL.etat IN("${SYNC}", "${UPDATE}")`;
      return await this.db.query(state);
    }
  }
  async loadSyncSvBl(data: any) {
    const state = `SELECT SBL.code_sv, SBL.id_culture, SBL.ddp, SBL.stc, SBL.ec, SBL.ql, SBL.qr, SBL.long_ligne, SBL.nbre_ligne, SBL.nbre_pied, SBL.hauteur, SBL.img_cult, SBL.dt_capture, SBL.ex, SBL.dt_creation, SBL.dt_modification, SBL.etat 
                  FROM suivi_bl SBL
                  INNER JOIN culture_bl CBL ON CBL.code_culture = SBL.id_culture
                  INNER JOIN bloc_parce BPRC ON BPRC.code_parce = CBL.id_parce
                  INNER JOIN bloc BL ON BL.code_bloc = BPRC.id_bloc
                  WHERE BL.id_tech = ${data.id_tech} AND BL.id_prjt = "${data.id_projet}" AND SBL.etat IN("${SYNC}", "${UPDATE}")`;
    return await this.db.query(state);
  }
  /**
   * LOAD SYNC BENEF  PR
   */
  async loadSyncBenefActivPR(data: any) {
    const state = `SELECT BNF.code_benef, BNF.img_benef, BNF.nom, BNF.prenom, BNF.sexe, BNF.dt_nais, BNF.dt_nais_vers, BNF.surnom, BNF.cin, BNF.dt_delivrance, BNF.lieu_delivrance, BNF.img_cin, BNF.contact, BNF.id_fkt, BNF.id_commune, BNF.village, BNF.dt_Insert, BNF.etat AS etat_benf, BNF.statut AS statut_benef, 
                  BAPR.code_pr, BAPR.id_proj, BAPR.id_activ, BAPR.id_benef, BAPR.id_bloc, BAPR.code_achat, BAPR.id_collaborateur, BAPR.id_tech, BAPR.etat AS etat_pr, BAPR.status AS status_pr
                  FROM beneficiaire BNF
                  INNER JOIN benef_activ_pr BAPR ON BAPR.id_benef = BNF.code_benef AND BAPR.status = "active" AND BAPR.etat IN("${SYNC}", "${UPDATE}")
                  WHERE BAPR.id_tech = ${data.id_tech} AND BAPR.id_proj = "${data.id_projet}" AND BNF.statut = "active" AND BNF.etat IN("${SYNC}", "${UPDATE}");`;
    return await this.db.query(state);
  }
  /**
   * Load Sync PR
   */
  async loadSyncAnimationVe(data: any) {
    const state = `SELECT ANIMVE.code, ANIMVE.id_pr, ANIMVE.id_fkt, ANIMVE.id_commune, ANIMVE.village, ANIMVE.date_anim, ANIMVE.nb_participant, ANIMVE.nb_h, ANIMVE.nb_f, ANIMVE.nb_inf_25, ANIMVE.type, ANIMVE.img_piece, ANIMVE.img_group_particip, ANIMVE.id_tech_recenseur, ANIMVE.etat, ANIMVE.status 
                  FROM animation_ve ANIMVE
                  INNER JOIN benef_activ_pr BAPR ON BAPR.code_pr = ANIMVE.id_pr AND ANIMVE.status = "active"
                  WHERE BAPR.id_tech = ${data.id_tech} AND BAPR.id_proj = "${data.id_projet}" AND ANIMVE.etat IN("${SYNC}", "${UPDATE}") AND ANIMVE.status = "active"`;
    return await this.db.query(state);
  }
  async loadSyncSpecuAnime(data: any) {
    const state = `SELECT SPECU.code_specu, SPECU.id_anime_ve, SPECU.id_var, SPECU.id_espece, SPECU.quantite, SPECU.etat, SPECU.status 
                  FROM animation_ve_specu SPECU
                  INNER JOIN animation_ve ANIME ON ANIME.code = SPECU.id_anime_ve AND SPECU.status = "active"
                  INNER JOIN benef_activ_pr BAPR ON BAPR.code_pr = ANIME.id_pr AND BAPR.status = "active"
                  WHERE BAPR.id_tech = ${data.id_tech} AND BAPR.id_proj = "${data.id_projet}" AND SPECU.etat IN("${SYNC}", "${UPDATE}") AND SPECU.status = "active"`;
    return await this.db.query(state);
  }
}
