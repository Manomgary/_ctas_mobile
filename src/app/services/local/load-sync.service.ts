import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';
import { DB_NAME, EC, SYNC, UPDATE } from 'src/app/utils/global-variables';
import { DatabaseService } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class LoadSyncService {
  private db: SQLiteDBConnection = new SQLiteDBConnection(DB_NAME, CapacitorSQLite);

  constructor(private dbService: DatabaseService) {}

    /*******************************
     * Sync Volet Reseau paysan 
     ************************************/
  async loadSyncBenefActivPms(data: any) {
    const state = `SELECT BNF.code_benef, BNF.img_benef, BNF.nom, BNF.prenom, BNF.sexe, BNF.dt_nais, BNF.dt_nais_vers, BNF.surnom, BNF.cin, BNF.dt_delivrance, BNF.lieu_delivrance, BNF.img_cin, BNF.contact, BNF.id_fkt, BNF.id_commune, BNF.village, BNF.dt_Insert, BNF.etat AS etat_benf, BNF.statut AS statut_benef, BPMS.code_benef_pms, BPMS.code_achat, id_proj, BPMS.id_benef, BPMS.id_activ, BPMS.id_association, BPMS.id_collaborateur, BPMS.status AS status_pms, BPMS.etat AS etat_pms
              FROM benef_activ_pms BPMS
              INNER JOIN beneficiaire BNF ON BNF.code_benef = BPMS.id_benef AND BNF.statut = "active"
              INNER JOIN association ASS ON ASS.code_ass = BPMS.id_association AND ASS.id_prjt = "${data.id_projet}" AND ASS.id_tech = ${data.id_tech} AND  ASS.status = "active"
              INNER JOIN projet PRJ ON PRJ.code_proj = ASS.id_prjt AND PRJ.statuts = "activer"
              INNER JOIN equipe EQ ON EQ.code_equipe = ASS.id_tech AND EQ.statuts = "active"
              INNER JOIN projet_equipe PE ON PE.id_projet = PRJ.code_proj AND EQ.code_equipe = PE.id_equipe AND PE.status_pe = "active"
              WHERE BPMS.etat IN("${SYNC}", "${UPDATE}") AND BPMS.status = "active" AND BPMS.id_proj = "${data.id_projet}";`;
    return await this.db.query(state);
  }
  async loadSyncParcePms(data: any) {
    const state = `SELECT DISTINCT ASS_PRC.code_parce, ASS_PRC.id_assoc, ASS_PRC.id_benef, ASS_PRC.ref_gps, ASS_PRC.lat, ASS_PRC.log, ASS_PRC.superficie, ASS_PRC.id_fkt, ASS_PRC.id_commune, ASS_PRC.village, ASS_PRC.anne_adheran, ASS_PRC.indication, ASS_PRC.etat, ASS_PRC.status
                  FROM assoc_parce ASS_PRC
                  INNER JOIN association ASS ON ASS.code_ass = ASS_PRC.id_assoc AND ASS.id_tech = ${data.id_tech} AND ASS.status = "active"
                  INNER JOIN beneficiaire BNF ON BNF.code_benef = ASS_PRC.id_benef AND BNF.statut = "active"
                  INNER JOIN benef_activ_pms BPMS_ASS ON BPMS_ASS.id_association = ASS.code_ass AND BPMS_ASS.id_benef = BNF.code_benef AND BPMS_ASS.id_proj = "${data.id_projet}" AND BPMS_ASS.status = "active"
                  INNER JOIN assoc_parce_saison PRC_SS ON PRC_SS.id_parce = ASS_PRC.code_parce
                  INNER JOIN benef_activ_pms BPMS ON BPMS.code_benef_pms = PRC_SS.id_pms AND BPMS.status = "active"
                  INNER JOIN association ASS_SS ON ASS_SS.code_ass = BPMS.id_association AND ASS_SS.id_prjt = "${data.id_projet}" AND ASS_SS.id_tech = ${data.id_tech} AND ASS_SS.status = "active"
                  INNER JOIN beneficiaire BNF_SS ON BNF_SS.code_benef = BPMS.id_benef AND BNF_SS.statut = "active"
                  INNER JOIN projet_equipe PE ON PE.id_projet = "${data.id_projet}" AND PE.id_equipe = ${data.id_tech} AND PE.status_pe = "active"
                  WHERE ASS_PRC.etat IN("${SYNC}", "${UPDATE}") AND ASS_PRC.status = "active"`;
    return await this.db.query(state);
  }
  async loadSyncParceSaisonPms(data: any) {
    const state = `SELECT SS_PRC.code, SS_PRC.id_annee, SS_PRC.id_saison, SS_PRC.id_pms, SS_PRC.id_parce, SS_PRC.ref_gps, SS_PRC.lat, SS_PRC.log, SS_PRC.id_var, SS_PRC.objectif, SS_PRC.etat, SS_PRC.commentaire
                FROM assoc_parce_saison SS_PRC
                INNER JOIN benef_activ_pms BPMS ON BPMS.code_benef_pms = SS_PRC.id_pms AND BPMS.status = "active"
                INNER JOIN beneficiaire BNF ON BNF.code_benef = BPMS.id_benef AND BNF.statut = "active"
                INNER JOIN association ASS ON ASS.code_ass = BPMS.id_association AND ASS.id_prjt = BPMS.id_proj AND ASS.id_tech = ${data.id_tech} AND ASS.status = "active"
                INNER JOIN projet PRJ ON PRJ.code_proj = BPMS.id_proj AND PRJ.statuts = "activer"
                INNER JOIN equipe EQ ON EQ.code_equipe = ${data.id_tech} AND EQ.statuts = "active"
                INNER JOIN projet_equipe PE ON PE.id_projet = BPMS.id_proj AND EQ.code_equipe = PE.id_equipe AND PE.status_pe = "active"
                INNER JOIN assoc_parce ASS_PRC ON ASS_PRC.code_parce = SS_PRC.id_parce AND ASS_PRC.status = "active"
                INNER JOIN beneficiaire BNF_PRC ON BNF_PRC.code_benef = ASS_PRC.id_benef AND BNF_PRC.statut = "active"
                INNER JOIN association ASS_ ON ASS_.code_ass = ASS_PRC.id_assoc AND ASS_.id_prjt = "${data.id_projet}" AND ASS_.id_tech = ${data.id_tech} AND ASS_.status = "active"
                WHERE SS_PRC.etat IN("${SYNC}", "${UPDATE}") AND PRJ.code_proj = "${data.id_projet}" AND SS_PRC.id_parce IS NOT NULL
                UNION
                SELECT SS_PRC.code, SS_PRC.id_annee, SS_PRC.id_saison, SS_PRC.id_pms, SS_PRC.id_parce, SS_PRC.ref_gps, SS_PRC.lat, SS_PRC.log, SS_PRC.id_var, SS_PRC.objectif, SS_PRC.etat, SS_PRC.commentaire
                FROM assoc_parce_saison SS_PRC
                INNER JOIN benef_activ_pms BPMS ON BPMS.code_benef_pms = SS_PRC.id_pms AND BPMS.status = "active"
                INNER JOIN association ASS ON ASS.code_ass = BPMS.id_association AND ASS.id_prjt = "${data.id_projet}" AND ASS.id_tech = ${data.id_tech} AND ASS.status = "active"
                INNER JOIN equipe EQ ON EQ.code_equipe = ${data.id_tech} AND EQ.statuts = "active"
                INNER JOIN projet_equipe PE ON PE.id_projet = BPMS.id_proj AND EQ.code_equipe = PE.id_equipe AND PE.status_pe = "active"
                WHERE SS_PRC.etat IN("${SYNC}", "${UPDATE}") AND ASS.id_prjt = "${data.id_projet}" AND SS_PRC.id_parce IS NULL`;
    return await this.db.query(state);
  }

  async loadSyncCulturePms(data: any) {
    
    if (this.dbService.dbReady.value) {
      const statement = `SELECT ASS.nom as nom_ass, CL.code_culture, CL.id_parce, CL.id_var, CL.id_saison, CL.id_annee, CL.ddp, CL.qsa, CL.img_fact, CL.dds, CL.sfce, CL.sc, CL.ea_id_variette, CL.ea_autres, CL.dt_creation, CL.dt_modification, CL.statuts, CL.Etat 
                        FROM cultures_pms CL
                        INNER JOIN assoc_parce AS_PRC ON AS_PRC.code_parce = CL.id_parce AND AS_PRC.status = "active"
                        INNER JOIN association ASS ON ASS.code_ass = AS_PRC.id_assoc  AND ASS.id_prjt = "${data.id_projet}" AND ASS.id_tech = ${data.id_tech} AND ASS.status = "active"
                        INNER JOIN beneficiaire BNF ON BNF.code_benef = AS_PRC.id_benef AND BNF.statut = "active"
                        INNER JOIN benef_activ_pms BPMS ON BPMS.id_association = ASS.code_ass AND BNF.code_benef = BPMS.id_benef AND BPMS.id_proj = "${data.id_projet}" AND BPMS.status = "active"
                        WHERE ASS.id_tech = ${data.id_tech} AND ASS.id_prjt  = "${data.id_projet}" AND CL.Etat IN ("${SYNC}", "${UPDATE}");`;
      return await this.db.query(statement);
    }
  }

  async loadSyncSuivi(data: any) {
    if (this.dbService.dbReady.value) {//  AND CPMS.statuts IN("${EC}")
      const statement = `SELECT ASS.nom AS nom_ass, SPMS.id, SPMS.id_culture, SPMS.ddp, SPMS.stc, SPMS.ec, SPMS.pb, SPMS.ex, SPMS.img_cult, SPMS.name, SPMS.controle, SPMS.declaration, SPMS.etat 
                        FROM suivi_pms SPMS
                        INNER JOIN cultures_pms CPMS ON CPMS.code_culture = SPMS.id_culture
                        INNER JOIN assoc_parce AS_PRC ON AS_PRC.code_parce = CPMS.id_parce AND AS_PRC.status = "active"
                        INNER JOIN beneficiaire BNF ON BNF.code_benef = AS_PRC.id_benef AND BNF.statut = "active"
                        INNER JOIN association ASS ON ASS.code_ass = AS_PRC.id_assoc AND ASS.id_prjt = "${data.id_projet}" AND ASS.id_tech = ${data.id_tech} AND ASS.status = "active"
                        INNER JOIN benef_activ_pms BPMS ON BPMS.id_association = ASS.code_ass AND BNF.code_benef = BPMS.id_benef AND BPMS.id_proj = "${data.id_projet}" AND BPMS.status = "active"
                        WHERE ASS.id_tech = ${data.id_tech} AND ASS.id_prjt = "${data.id_projet}" AND SPMS.etat IN ("${SYNC}", "${UPDATE}")`;
      return await this.db.query(statement);
    }
  }
  /*********************************
   * LOAD SYNC SERVICE
   **********************************/
  async loadSyncMepBl(data: any) {
    if (this.dbService.dbReady.value) {
      const state = `SELECT CBL.code_culture, CBL.id_parce, CBL.id_espece, CBL.id_var, CBL.id_saison, CBL.id_annee, CBL.ddp, CBL.qso, CBL.dt_distribution, CBL.dds, CBL.sfce, CBL.nbre_ligne, CBL.long_ligne, CBL.usage, CBL.sc, CBL.ea_autres, CBL.ea_id_variette, CBL.dt_creation, CBL.dt_modification, CBL.status, CBL.etat, CBL.id_equipe, CBL.type 
                    FROM culture_bl CBL
                    INNER JOIN bloc_parce BPRC ON BPRC.code_parce = CBL.id_parce
                    INNER JOIN bloc BL ON BL.code_bloc = BPRC.id_bloc
                    INNER JOIN annee_agricole AN_ ON AN_.code = CBL.id_annee
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
  // LoadSync beneficiaire
  async loadSyncBenefBloc(data: any) {
    const state = `SELECT BABL.code_benef_bl, BABL.code_benef_bl_temp, BABL.id_proj, BABL.id_activ, BABL.id_benef, BABL.id_bloc, BABL.code_achat, BABL.id_collaborateur, BABL.etat AS etat_bbl, BABL.status AS status_bbl, BNF.code_benef, BNF.img_benef, BNF.nom, BNF.prenom, BNF.sexe, BNF.dt_nais, BNF.dt_nais_vers, BNF.surnom, BNF.cin, BNF.dt_delivrance, BNF.lieu_delivrance, BNF.img_cin, BNF.contact, BNF.id_fkt, BNF.id_commune, BNF.village, BNF.dt_Insert, BNF.etat AS etat_bnf, BNF.statut AS status_bnf
                  FROM benef_activ_bl BABL
                  INNER JOIN beneficiaire BNF ON BNF.code_benef = BABL.id_benef AND BNF.statut = "active"
                  INNER JOIN bloc BL ON BL.code_bloc = BABL.id_bloc AND BL.id_prjt = "${data.id_projet}" AND BL.id_tech = ${data.id_tech} AND BL.status = "active"
                  WHERE BABL.etat IN("${SYNC}", "${UPDATE}") AND BABL.status = "active"`;
    return await this.db.query(state);
  }
  async loadSyncParceBl(data: any) {
    const state = `SELECT BL_PRC.code_parce, BL_PRC.code_parce_temp, BL_PRC.id_bloc, BL_PRC.id_benef, BL_PRC.ref_gps, BL_PRC.lat, BL_PRC.log, BL_PRC.superficie, BL_PRC.id_fkt, BL_PRC.id_commune, BL_PRC.village, BL_PRC.anne_adheran, BL_PRC.indication, BL_PRC.etat, BL_PRC.status
                  FROM bloc_parce BL_PRC
                  INNER JOIN beneficiaire BNF ON BNF.code_benef = BL_PRC.id_benef AND BNF.statut = "active"
                  INNER JOIN bloc BL ON BL.code_bloc = BL_PRC.id_bloc AND BL.id_prjt = "${data.id_projet}" AND BL.id_tech = ${data.id_tech} AND BL.status = "active"
                  INNER JOIN benef_activ_bl BBL ON BBL.id_bloc = BL.code_bloc AND BBL.id_benef = BNF.code_benef AND BL.id_prjt = "${data.id_projet}" AND BBL.status = "active"
                  WHERE BL_PRC.etat IN("${SYNC}", "${UPDATE}") AND BL_PRC.status = "active"`;
    return await this.db.query(state);
  }
  /**
   * LOAD SYNC BENEF  PR
   */
  async loadSyncBenefActivPR(data: any) {
    const state = `SELECT BNF.code_benef, BNF.img_benef, BNF.nom, BNF.prenom, BNF.sexe, BNF.dt_nais, BNF.dt_nais_vers, BNF.surnom, BNF.cin, BNF.dt_delivrance, BNF.lieu_delivrance, BNF.img_cin, BNF.contact, BNF.id_fkt, BNF.id_commune, BNF.village, BNF.dt_Insert, BNF.etat AS etat_benf, BNF.statut AS statut_benef, 
                BAPR.code_pr, BAPR.id_proj, BAPR.id_activ, BAPR.id_benef, BAPR.id_bloc, BAPR.code_achat, BAPR.id_collaborateur, BAPR.id_tech, BAPR.etat AS etat_pr, BAPR.status AS status_pr
                FROM beneficiaire BNF
                INNER JOIN benef_activ_pr BAPR ON BAPR.id_benef = BNF.code_benef AND BAPR.id_tech = ${data.id_tech} AND BAPR.id_proj = "${data.id_projet}" AND BAPR.status = "active" AND BAPR.etat IN("${SYNC}", "${UPDATE}")
                INNER JOIN projet_equipe PE ON PE.id_projet = "${data.id_projet}" AND PE.id_equipe = ${data.id_tech} AND PE.status_pe = "active"
                WHERE BNF.statut = "active" AND BNF.etat IN("${SYNC}", "${UPDATE}");`;
    return await this.db.query(state);
  }
  //
  async loadSyncCepPR(data: any) {
    const state = `SELECT CEP.code_parce, CEP.id_bloc, CEP.id_benef, CEP.ref_gps, CEP.lat, CEP.log, CEP.superficie, CEP.id_commune, CEP.id_fkt, CEP.village, CEP.anne_adheran, CEP.dt_creation, CEP.etat, CEP.status 
                  FROM cep_parce CEP
                  INNER JOIN beneficiaire BNF ON BNF.code_benef = CEP.id_benef AND BNF.statut = "active"
                  INNER JOIN benef_activ_pr BAPR ON BAPR.id_benef = BNF.code_benef AND BAPR.id_proj = "${data.id_projet}" AND BAPR.id_tech = ${data.id_tech} AND BAPR.status = "active"
                  WHERE CEP.etat IN("${SYNC}", "${UPDATE}") AND CEP.status = "active"`;
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
  async loadSyncMepPR(data: any) {
    const state = `SELECT MEP.code_culture, MEP.id_parce, MEP.id_espece, MEP.id_var, MEP.id_saison, MEP.id_annee, MEP.ddp, MEP.qso, MEP.dt_distribution, MEP.dds, MEP.sfce, MEP.nbre_ligne, MEP.long_ligne, MEP.usage, MEP.sc, MEP.ea_autres, MEP.ea_id_variette, MEP.dt_creation, MEP.dt_modification, MEP.status, MEP.etat, MEP.id_equipe, MEP.type 
                  FROM culture_pr MEP
                  INNER JOIN cep_parce CEP ON CEP.code_parce = MEP.id_parce AND CEP.status = "active"
                  INNER JOIN beneficiaire BNF ON BNF.code_benef = CEP.id_benef AND BNF.statut = "active"
                  INNER JOIN benef_activ_pr BAPR ON BAPR.id_proj = "${data.id_projet}" AND BAPR.id_tech = ${data.id_tech} AND BAPR.id_benef = BNF.code_benef AND BAPR.status = "active"
                  INNER JOIN projet_equipe PE ON PE.id_projet = "${data.id_projet}" AND PE.id_equipe = ${data.id_tech} AND PE.status_pe = "active"
                  INNER JOIN annee_agricole AN_ ON AN_.code = MEP.id_annee
                  WHERE MEP.etat IN("${SYNC}", "${UPDATE}") AND MEP.status = "active"`;
    return await this.db.query(state);
  }
  async loadSyncSuiviMepPR(data: any) {
    const state = `SELECT SV.code_sv, SV.id_culture, SV.ddp, SV.stc, SV.ql, SV.qr, SV.long_ligne, SV.nbre_ligne, SV.nbre_pied, SV.hauteur, SV.ec, SV.img_cult, SV.dt_capture, SV.ex, SV.dt_creation, SV.dt_modification, SV.etat
                FROM suivi_pr SV
                INNER JOIN culture_pr MEP ON MEP.code_culture = SV.id_culture AND MEP.status = "active"
                INNER JOIN cep_parce CEP ON CEP.code_parce = MEP.id_parce AND CEP.status = "active"
                INNER JOIN beneficiaire BNF ON BNF.code_benef = CEP.id_benef AND BNF.statut = "active"
                INNER JOIN benef_activ_pr BAPR ON BAPR.id_proj = "${data.id_projet}" AND BAPR.id_tech = ${data.id_tech} AND BNF.code_benef = BAPR.id_benef AND BAPR.status = "active"
                INNER JOIN projet_equipe PE ON PE.id_projet = "${data.id_projet}" AND PE.id_equipe = ${data.id_tech} AND PE.status_pe = "active"
                WHERE SV.etat IN("${SYNC}", "${UPDATE}")`;
    return await this.db.query(state);
  }
}
