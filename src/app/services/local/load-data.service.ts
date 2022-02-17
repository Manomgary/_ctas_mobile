import { Injectable } from '@angular/core';

// Imports 
import { SqliteService } from '../sqlite.service'; 
import { DatabaseService } from '../database.service';
import { DB_NAME } from 'src/app/utils/global-variables';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Equipe, ProjetEquipe, Utilisateurs } from 'src/app/utils/interface-bd';
import { Association } from 'src/app/interfaces/interfaces-local';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private dbName: string = DB_NAME;
  private db: SQLiteDBConnection = new SQLiteDBConnection(this.dbName, CapacitorSQLite);

  private users = new BehaviorSubject([]);
  private active_projet = new BehaviorSubject([]);
  private region = new BehaviorSubject([]);
  private district = new BehaviorSubject([]);
  private commune = new BehaviorSubject([]);
  private fokontany = new BehaviorSubject([]);
  private projet = new BehaviorSubject([]);
  private projets = new BehaviorSubject([]);
  private collaborateur = new BehaviorSubject([]);
  private collabActive = new BehaviorSubject([]);
  private association = new BehaviorSubject([]);
  private bloc = new BehaviorSubject([]);
  private equipe = new BehaviorSubject([]);
  private projetEquipe = new BehaviorSubject([]);
  private beneficiaire = new BehaviorSubject([]);
  private beneficiaire_pms = new BehaviorSubject([]);
  private beneficiaire_bloc = new BehaviorSubject([]);

  constructor(private dbService: DatabaseService) {
    this.dbService.dbReady.subscribe(async isReady => {
      console.log("===== Contructeur laod service ====");
    });
  }

  async loadUsers(data: any) {
    
    if (this.dbService.dbReady.value) {
      let user: Utilisateurs[]  = [];
      const statement1 = `SELECT code_equipe, nom, prenom, sexe, dt_nais, num_perso,id_fonct, statuts 
                          FROM equipe 
                          WHERE statuts = "en fonction" AND num_perso = "${data.userName}";`;

      await this.db.query(statement1).then(async res => {
        console.log(":::RESPONSE QUERY UTILISATEURS ::::");
        console.log(res);
        if (res.values.length >0) {
          const req = `SELECT E.code_equipe, E.nom, E.prenom, E.sexe, E.dt_nais, E.num_perso, U.code_util, U.id_equipe, U.img, U.id_fonct, 
                      U.fonction, U.type, U.role, U.nom_users, U.mot_passe, U.situation_compte, U.statuts_equipe, U.statuts_compte
                      FROM equipe E
                      INNER JOIN utilisateurs U ON U.id_equipe = E.code_equipe
                      WHERE E.statuts = "en fonction" AND E.num_perso = "${data.userName}" AND U.mot_passe = "${data.passWord}"`;
          await this.db.query(req).then(res_req => {
            console.log(res_req);
            if (res_req.values.length > 0) {
              res_req.values.forEach((element: Utilisateurs) => {
                user.push({
                  code_util: element.code_util,
                  id_equipe: element.id_equipe,
                  img: element.img, 
                  nom: element.nom, 
                  prenom: element.prenom, 
                  sexe: element.sexe,
                  dt_nais: element.dt_nais,
                  num_perso: element.num_perso,
                  id_fonct: element.id_fonct,
                  fonction: element.fonction,
                  type: element.type, 
                  role: element.role, 
                  nom_users: element.nom_users,
                  mot_passe: element.mot_passe, 
                  situation_compte: element.situation_compte, 
                  statuts_equipe: element.statuts_equipe,
                  statuts_compte: element.statuts_compte
                });
              });
              this.users.next(user);
              this.dbReady.next(true);
            } else {
              console.log("--Mot de passe incorrecte--");
              this.users.next([]);
            }
          });
        } else {
          console.log("--UserName n'existe pas--");
          this.users.next([]);
        }
      }); 

    } else {
      console.log("Db is not ready");
    }
  }

  loadAllProjet(data: any): Observable<any[]> {
    this.dbService.dbReady.subscribe(async isReady => {
      if (isReady) {
        let projet: any[] = [];
        let statement = `SELECT code_proj, nom, description, logo, statuts FROM projet;`;
        let req = ''

        if (!(Object.keys(data).length === 0)) {
          console.log("Object non vide!");
          req = statement + ` WHERE code_proj = "${ data.id_pr }" ORDER BY code_proj`;
        } else {
          console.log("Object vide");
          req = statement + ` ORDER BY code_proj`;
        }
  
        await this.db.query(req).then(res => {
          if (res.values.length) {
            res.values.forEach(elem => {
              projet.push({
                code_proj: elem.code_proj, 
                nom: elem.nom, 
                description: elem.description,
                logo: elem.logo,  
                statuts: elem.statuts
              });
            });
            this.projets.next(projet);
          } else console.log("Aucun enregistrement pour le table projet");
        });
      }
    });
    return this.projets.asObservable();
  }

  loadActiveProjet(id_projet: string): Observable<any[]> {

    this.dbService.dbReady.subscribe(async isReady => {
      if (isReady) {
        let act_pr: any[]  = [];
        console.log(this.dbService.dbReady.value);
        const statement = `SELECT  AP.code, AP.id_proj, P.nom, AP.id_activ, A.code_act, A.intitule, A.description,  AP.statuts 
                            FROM  participe_proj_activ AP 
                            INNER JOIN activite A ON A.code_act = AP.id_activ
                            INNER JOIN projet P ON P.code_proj = AP.id_proj
                            WHERE AP.id_proj = "${ id_projet }";`;
        await this.db.query(statement).then(res => {
          console.log(":::RESPONSE QUERY Activite Projet ::::");
          if (res.values.length >0) {
            console.log(res.values);
            res.values.forEach((element: any) => {
              act_pr.push({
                code: element.code,
                id_proj: element.id_proj,
                nom: element.nom,
                id_activ: element.id_activ,
                intitule: element.intitule,
                description: element.description,
                statuts: element.statuts
              });
            });
            this.active_projet.next(act_pr);
            this.dbReady.next(true);
            console.log(this.active_projet);
          } else console.log("Aucune activiter projet!!!");
        }); 
      }
    });

    return this.active_projet.asObservable();
  }

  loadRegion(): Observable<any[]> {
    this.dbService.dbReady.subscribe(async (isReady) => {
      if (isReady) {
        this.region.next([]);
        let reg: any[]  = [];
        console.log(this.dbService.dbReady.value);
        const statement = `SELECT * FROM zone_region;`;
        await this.db.query(statement).then(res => {
          console.log(":::RESPONSE QUERY Region ::::");
          if (res.values.length >0) {
            console.log(res.values);
            res.values.forEach((element: any) => {
              reg.push({
                code_reg: element.code_reg,
                nom_reg: element.nom_reg
              });
            });
            this.region.next(reg);
            console.log(this.region);
          } else {
            console.log("Aucune region!!!");
            this.region.next([]);
          }
        }); 
      }
    });
    return this.region.asObservable();
  }

  loadDistrict(id_region): Observable<any[]> {
    this.dbService.dbReady.subscribe(async (isReady) => {
      if (isReady) {
        this.district.next([]);
        let dist: any[]  = [];
        console.log(this.dbService.dbReady.value);
        const statement = `SELECT  code_dist, nom_dist, id_reg 
                            FROM zone_district
                            WHERE id_reg = ${id_region} ;`;
        await this.db.query(statement).then(res => {
          console.log(":::RESPONSE QUERY DISTRICT ::::");
          if (res.values.length >0) {
            console.log(res.values);
            res.values.forEach((element: any) => {
              dist.push({
                code_dist: element.code_dist, 
                nom_dist: element.nom_dist, 
                id_reg: element.id_reg
              });
            });
            this.district.next(dist);
            console.log(this.district);
          } else {
            console.log("Aucune District!!!");
            this.district.next([]);
          }
        }); 
      }
    });
    return this.district.asObservable();
  }

  loadCommune(id_dist): Observable<any[]> {
    this.dbService.dbReady.subscribe(async (isReady) => {
      if (isReady) {
        this.commune.next([]);
        let com: any[]  = [];
        console.log(this.dbService.dbReady.value);
        const statement = `SELECT R.nom_reg, C.id_dist, D.nom_dist,  C.code_com, C.nom_com
                            FROM zone_commune C 
                            INNER JOIN zone_district D ON D.code_dist = C.id_dist
                            INNER JOIN zone_region R ON R.code_reg = D.id_reg
                            WHERE C.id_dist = ${id_dist};`;
        await this.db.query(statement).then(res => {
          console.log(":::RESPONSE QUERY COMMUNE ::::");
          if (res.values.length >0) {
            console.log(res.values);
            res.values.forEach((element: any) => {
              com.push({
                nom_reg: element.nom_reg,
                id_dist: element.id_dist, 
                nom_dist: element.nom_dist,  
                code_com: element.code_com, 
                nom_com: element.nom_com
              });
            });
            this.commune.next(com);
            console.log(this.commune);
          } else {
            console.log("Aucune commune Disponible!!!");
            this.commune.next([]);
          }
        }); 
      }
    });
    return this.commune.asObservable();
  }

  async loadFokontany(id_commune) {
    const statement = `SELECT D.id_reg, R.nom_reg, C.id_dist, D.nom_dist, F.id_com, C.nom_com, F.code_fkt, F.nom_fkt 
    FROM zone_fonkotany F 
    INNER JOIN zone_commune C ON C.code_com = F.id_com 
    INNER JOIN zone_district D ON D.code_dist = C.id_dist
    INNER JOIN zone_region R ON R.code_reg = D.id_reg 
    WHERE C.code_com = ${ id_commune  } ORDER BY R.nom_reg, D.nom_dist, C.nom_com, F.nom_fkt;`;
    return await this.db.query(statement);
  }

  /**loadFokontany(id_commune): Observable<any[]> {
    this.dbService.dbReady.subscribe(async (isReady) => {
      if (isReady) {
        this.fokontany.next([]);
        let fkt: any[]  = [];
        console.log(this.dbService.dbReady.value);
        const statement = `SELECT D.id_reg, R.nom_reg, C.id_dist, D.nom_dist, F.id_com, C.nom_com, F.code_fkt, F.nom_fkt 
                          FROM zone_fonkotany F 
                          INNER JOIN zone_commune C ON C.code_com = F.id_com 
                          INNER JOIN zone_district D ON D.code_dist = C.id_dist
                          INNER JOIN zone_region R ON R.code_reg = D.id_reg 
                          WHERE C.code_com = ${ id_commune  } ORDER BY R.nom_reg, D.nom_dist, C.nom_com, F.nom_fkt;`;
        await this.db.query(statement).then(res => {
          console.log(":::RESPONSE QUERY FOKONTANY ::::");
          if (res.values.length >0) {
            console.log(res.values);
            res.values.forEach((element: any) => {
              fkt.push({
                nom_reg: element.nom_reg,
                id_dist: element.id_dist, 
                nom_dist: element.nom_dist,  
                id_com: element.id_com, 
                nom_com: element.nom_com,
                code_fkt: element.code_fkt,
                nom_fkt: element.nom_fkt
              });
            });
            this.fokontany.next(fkt);
            console.log(this.fokontany);
          } else {
            console.log("Aucune Fokontany Disponible!!!");
            this.fokontany.next([]);
          }
        }); 
      }
    });
    return this.fokontany.asObservable();
  }*/

  loadCollaborateurs(): Observable<any[]> {
    this.dbService.dbReady.subscribe(async isReady => {
      if (isReady) {
        let collab: any[] = [];
        const statement = `SELECT * FROM collaborateur;`;
  
        await this.db.query(statement).then(res => {
          if (res.values.length) {
            res.values.forEach(elem => {
              collab.push({
                code_col: elem.code_col, 
                nom: elem.nom, 
                description: elem.description
              });
            });
            this.collaborateur.next(collab);
          } else console.log("Aucun enregistrement pour le table collaborateur");
        });
      }
    });
    return this.collaborateur.asObservable();
  }

  async loadAssociation(data: any) {
    let req: string = ``;
    let statement1 = `SELECT ASS.id_prjt, P.code_proj, P.nom as nom_pr, ASS.id_fkt, FKT.nom_fkt, ASS.code_ass, ASS.nom as nom_ass,  ASS.id_tech, ASS.id_pms, B.nom || ' ' || B.prenom AS nom_benf, B.sexe, B.cin, B.surnom, ASS.status
                        FROM association ASS
                        INNER JOIN projet P ON P.code_proj = ASS.id_prjt
                        INNER JOIN zone_fonkotany FKT ON FKT.code_fkt = ASS.id_fkt
                        INNER JOIN benef_activ_pms BPMS ON BPMS.code_benef_pms = ASS.id_pms
                        INNER JOIN beneficiaire B ON B.code_benef = BPMS.id_benef`;
    let statement2 = `SELECT ASS.id_prjt, P.code_proj, P.nom as nom_pr, ASS.id_fkt, FKT.nom_fkt, ASS.code_ass, ASS.nom as nom_ass,  ASS.id_tech, ASS.id_pms, NULL, NULL, NULL, NULL, ASS.status
                      FROM association ASS
                      INNER JOIN projet P ON P.code_proj = ASS.id_prjt
                      INNER JOIN zone_fonkotany FKT ON FKT.code_fkt = ASS.id_fkt`;                            
    if (!(Object.keys(data).length === 0)) {
      let stat1 = statement1 + ` WHERE ASS.id_fkt = ${data.id_fkt} AND ASS.id_prjt = "${data.code_pr}"`;
      let stat2 = statement2 + ` WHERE ASS.id_fkt = ${data.id_fkt} AND ASS.id_prjt = "${data.code_pr}" 
                                  AND ASS.code_ass NOT IN (SELECT ASS.code_ass
                                                            FROM association ASS
                                                            INNER JOIN projet P ON P.code_proj = ASS.id_prjt
                                                            INNER JOIN zone_fonkotany FKT ON FKT.code_fkt = ASS.id_fkt
                                                            INNER JOIN benef_activ_pms BPMS ON BPMS.code_benef_pms = ASS.id_pms
                                                            INNER JOIN beneficiaire B ON B.code_benef = BPMS.id_benef);`;
      req = stat1 + ` UNION ` + stat2;
    } else req = statement1 + ` UNION ` + statement2 + ` WHERE ASS.code_ass NOT IN (SELECT ASS.code_ass
      FROM association ASS
      INNER JOIN projet P ON P.code_proj = ASS.id_prjt
      INNER JOIN zone_fonkotany FKT ON FKT.code_fkt = ASS.id_fkt
      INNER JOIN benef_activ_pms BPMS ON BPMS.code_benef_pms = ASS.id_pms
      INNER JOIN beneficiaire B ON B.code_benef = BPMS.id_benef);`;
    return  await this.db.query(req);
  }
  /**loadAssociation(data: any): Observable<any[]> {
    this.dbService.dbReady.subscribe(async isReady => {
      if (isReady) {
        let assoc: Association[] = [];
        let req: string = ``;
        let statement1 = `SELECT ASS.id_prjt, P.code_proj, P.nom as nom_pr, ASS.id_fkt, FKT.nom_fkt, ASS.code_ass, ASS.nom as nom_ass,  ASS.id_tech, ASS.id_pms, B.nom || ' ' || B.prenom AS nom_benf, B.sexe, B.cin, B.surnom, ASS.status
                            FROM association ASS
                            INNER JOIN projet P ON P.code_proj = ASS.id_prjt
                            INNER JOIN zone_fonkotany FKT ON FKT.code_fkt = ASS.id_fkt
                            INNER JOIN benef_activ_pms BPMS ON BPMS.code_benef_pms = ASS.id_pms
                            INNER JOIN beneficiaire B ON B.code_benef = BPMS.id_benef`;
        let statement2 = `SELECT ASS.id_prjt, P.code_proj, P.nom as nom_pr, ASS.id_fkt, FKT.nom_fkt, ASS.code_ass, ASS.nom as nom_ass,  ASS.id_tech, ASS.id_pms, NULL, NULL, NULL, NULL, ASS.status
                          FROM association ASS
                          INNER JOIN projet P ON P.code_proj = ASS.id_prjt
                          INNER JOIN zone_fonkotany FKT ON FKT.code_fkt = ASS.id_fkt`;                            
        if (!(Object.keys(data).length === 0)) {
          let stat1 = statement1 + ` WHERE ASS.id_fkt = ${data.id_fkt} AND ASS.id_prjt = "${data.code_pr}"`;
          let stat2 = statement2 + ` WHERE ASS.id_fkt = ${data.id_fkt} AND ASS.id_prjt = "${data.code_pr}" 
                                      AND ASS.code_ass NOT IN (SELECT ASS.code_ass
                                                                FROM association ASS
                                                                INNER JOIN projet P ON P.code_proj = ASS.id_prjt
                                                                INNER JOIN zone_fonkotany FKT ON FKT.code_fkt = ASS.id_fkt
                                                                INNER JOIN benef_activ_pms BPMS ON BPMS.code_benef_pms = ASS.id_pms
                                                                INNER JOIN beneficiaire B ON B.code_benef = BPMS.id_benef);`;
          req = stat1 + ` UNION ` + stat2;
        } else req = statement1 + ` UNION ` + statement2 + ` WHERE ASS.code_ass NOT IN (SELECT ASS.code_ass
          FROM association ASS
          INNER JOIN projet P ON P.code_proj = ASS.id_prjt
          INNER JOIN zone_fonkotany FKT ON FKT.code_fkt = ASS.id_fkt
          INNER JOIN benef_activ_pms BPMS ON BPMS.code_benef_pms = ASS.id_pms
          INNER JOIN beneficiaire B ON B.code_benef = BPMS.id_benef);`;
  
        await this.db.query(req).then(res => {
          if (res.values.length) {
            assoc = [];
            res.values.forEach(elem => {
              assoc.push({
                id_prjt: elem.id_prjt,
                code_proj: elem.code_proj, 
                nom_pr: elem.nom_pr, 
                id_fkt: elem.id_fkt, 
                nom_fkt: elem.nom_fkt,
                code_ass: elem.code_ass, 
                nom_ass: elem.nom_ass, 
                id_tech: elem.id_tech, 
                id_pms: elem.id_pms, 
                nom_benf: elem.nom_benf, 
                sexe:  elem.sexe,
                cin: elem.cin,
                surnom: elem.surnom,
                status: elem.status
              });
            });
            this.association.next(assoc);
          } else {
            console.log("Aucun enregistrement pour la table association");
            this.association.next([]);
          }
        });
      }
    });
    return this.association.asObservable();
  }*/

  loadBloc(): Observable<any[]> {
    this.dbService.dbReady.subscribe(async isReady => {
      if (isReady) {
        let bloc: any[] = [];
        const statement = `SELECT Bl.code_bloc, P.code_proj, P.nom as nom_pr, Bl.nom as nom_bl, Bl.id_prjt, Bl.status
                            FROM bloc Bl
                            INNER JOIN projet P ON P.code_proj = Bl.id_prjt;`;
  
        await this.db.query(statement).then(res => {
          if (res.values.length) {
            res.values.forEach(elem => {
              bloc.push({
                code_bloc: elem.code_bloc, 
                code_proj: elem.code_proj, 
                nom_pr: elem.nom_pr, 
                nom_bl: elem.nom_bl, 
                id_prjt: elem.id_prjt,
                status: elem.status
              });
            });
            this.bloc.next(bloc);
          } else console.log("Aucun enregistrement pour la table bloc");
        });
      }
    });
    return this.bloc.asObservable();
  }

  loadEquipe(): Observable<any[]> {
    this.dbService.dbReady.subscribe(async isReady => {
      if (isReady) {
        let equipe_: Equipe[] = [];
        const statement = `SELECT * FROM equipe;`;
  
        await this.db.query(statement).then(res => {
          if (res.values.length) {
            res.values.forEach(elem => {
              equipe_.push({
                code_equipe: elem.code_equipe, 
                img: elem.img, 
                nom: elem.nom, 
                prenom: elem.prenom, 
                sexe: elem.sexe, 
                dt_nais: elem.dt_nais, 
                cin: elem.cin, 
                dt_delivrance: elem.dt_delivrance, 
                lieu_delivrance: elem.lieu_delivrance, 
                img_cin: elem.img_cin, 
                email: elem.email, 
                num_perso: elem.num_perso, 
                num_float: elem.num_float, 
                id_fonct: elem.id_fonct,
                intitule_fct: elem.intitule_fct,
                statuts: elem.statuts
              });
            });
            this.equipe.next(equipe_);
          } else console.log("Aucun enregistrement pour la table bloc");
        });
      }
    });
    return this.equipe.asObservable();
  }

  loadProjetEquipe(): Observable<any[]> {
    this.dbService.dbReady.subscribe(async isReady => {
      if (isReady) {
        let pr_equipe: ProjetEquipe[] = [];
        const statement = `SELECT * FROM projet_equipe;`;
  
        await this.db.query(statement).then(res => {
          if (res.values.length) {
            res.values.forEach(elem => {
              pr_equipe.push({
                code: elem.code,
                id_projet: elem.id_projet,
                id_equipe: elem.id_equipe,
                id_volet: elem.id_volet,
                status_pe: elem.status_pe
              });
            });
            this.projetEquipe.next(pr_equipe);
          } else console.log("Aucun enregistrement pour la table ProjetEquipe");
        });
      }
    });
    return this.projetEquipe.asObservable();
  }

  loadCollabActivite(): Observable<any[]> {
    this.dbService.dbReady.subscribe(async isReady => {
      if (isReady) {
        let collAct: any[] = [];
        const statement = `SELECT CA.code, CA.id_col, C.nom as nom_col, CA.id_activ, A.intitule
                            FROM collaborateur_activ CA
                            INNER JOIN collaborateur C ON C.code_col = CA.id_col
                            INNER JOIN activite A ON A.code_act = CA.id_activ
                            ORDER BY A.code_act;`;
  
        await this.db.query(statement).then(res => {
          if (res.values.length) {
            res.values.forEach(elem => {
              collAct.push({ 
                code: elem.code, 
                id_col: elem.id_col, 
                nom_col: elem.nom_col, 
                id_activ: elem.id_activ, 
                intitule: elem.intitule
              });
            });
            this.collabActive.next(collAct);
          } else console.log("Aucun enregistrement pour la table collaborateur_activ");
        });
      }
    });
    return this.collabActive.asObservable();
  }

  loadBeneficiaire(): Observable<any[]> {
    this.dbService.dbReady.subscribe(async isReady => {
      if (isReady) {
        let beneficiaire: any[] = [];
        const statement = `SELECT B.code_benef, B.img_benef, B.nom as nom_benef, B.prenom, B.sexe, B.dt_nais, B.surnom, B.cin, B.dt_delivrance, B.lieu_delivrance,
                            B.img_cin, B.contact, B.id_fkt, B.statut
                            FROM beneficiaire B;`;
  
        await this.db.query(statement).then(res => {
          if (res.values.length) {
            res.values.forEach(elem => {
              beneficiaire.push({ 
                code_benef: elem.code_benef, 
                img_benef: elem.img_benef, 
                nom_benef: elem.nom_benef, 
                prenom: elem.prenom, 
                sexe: elem.sexe,
                dt_nais: elem.dt_nais, 
                surnom: elem.surnom, 
                cin: elem.cin, 
                dt_delivrance: elem.dt_delivrance, 
                lieu_delivrance: elem.lieu_delivrance,
                img_cin: elem.img_cin,
                contact: elem.contact,
                id_fkt: elem.id_fkt,
                statut: elem.statut
              });
            });
            this.beneficiaire.next(beneficiaire);
          } else console.log("Aucun enregistrement pour la table beneficiaire");
        });
      }
    });
    return this.beneficiaire.asObservable();
  }

  loadBeneficiairePms(): Observable<any[]> {
    this.dbService.dbReady.subscribe(async isReady => {
      if (isReady) {
        let beneficiaire: any[] = [];
        const statement = `SELECT BPMS.code_benef_pms, BPMS.id_proj, P.nom as nom_pr,  BPMS.id_activ, A.intitule,  BPMS.id_benef, BPMS.id_association, ASS.nom as nom_ass,
                            B.code_benef, B.img_benef, B.nom as nom_benef, B.prenom, B.sexe, B.dt_nais, B.surnom, B.cin, B.dt_delivrance, B.lieu_delivrance,
                            B.img_cin, B.contact, B.id_fkt, FKT.nom_fkt, BPMS.id_collaborateur, C.nom as nom_collab, B.statut
                            FROM benef_activ_pms BPMS 
                            INNER JOIN projet P ON P.code_proj = BPMS.id_proj
                            INNER JOIN activite A ON A.code_act = BPMS.id_activ
                            INNER JOIN beneficiaire B ON B.code_benef = BPMS.id_benef
                            INNER JOIN association ASS ON ASS.code_ass = BPMS.id_association
                            INNER JOIN collaborateur C ON C.code_col = BPMS.id_collaborateur
                            INNER JOIN zone_fonkotany FKT ON FKT.code_fkt = B.id_fkt
                            ORDER BY P.nom, ASS.nom, BPMS.code_benef_pms, B.nom;`;
  
        await this.db.query(statement).then(res => {
          if (res.values.length) {
            res.values.forEach(elem => {
              beneficiaire.push({ 
                code_benef_pms: elem.code_benef_pms, 
                id_proj: elem.id_proj, 
                nom_pr: elem.nom_pr,
                id_activ: elem.id_activ,
                intitule: elem.intitule,
                id_benef: elem.id_benef,
                id_association: elem.id_association,
                nom_ass: elem.nom_ass,
                code_benef: elem.code_benef,
                img_benef: elem.img_benef,
                nom_benef: elem.nom_benef,
                prenom: elem.prenom,
                sexe: elem.sexe,
                dt_nais: elem.dt_nais,
                surnom: elem.surnom,
                cin: elem.cin,
                dt_delivrance: elem.dt_delivrance,
                lieu_delivrance: elem.lieu_delivrance,
                img_cin: elem.img_cin,
                contact: elem.contact,
                id_fkt: elem.id_fkt,
                nom_fkt: elem.nom_fkt,
                statut: elem.statut,
                nom_collab: elem.nom_collab,
                id_collaborateur: elem.id_collaborateur
              });
            });
            this.beneficiaire_pms.next(beneficiaire);
          } else console.log("Aucun enregistrement pour la table beneficiaire");
        });
      }
    });
    return this.beneficiaire.asObservable();
  }

  loadBeneficiaireBloc(): Observable<any[]> {
    this.dbService.dbReady.subscribe(async isReady => {
      if (isReady) {
        let beneficiaire: any[] = [];
        const statement = `SELECT BBL.code_benef_bl, BBL.id_proj, P.nom as nom_pr,  BBL.id_activ, A.intitule,  BBL.id_benef, BBL.id_bloc, BL.nom as nom_bl,
                            B.code_benef, B.img_benef, B.nom as nom_benef, B.prenom, B.sexe, B.dt_nais, B.surnom, B.cin, B.dt_delivrance, B.lieu_delivrance,
                            B.img_cin, B.contact, B.id_fkt, FKT.nom_fkt, BBL.id_collaborateur, C.nom as nom_collab, B.statut
                            FROM benef_activ_bl BBL 
                            INNER JOIN projet P ON P.code_proj = BBL.id_proj
                            INNER JOIN activite A ON A.code_act = BBL.id_activ
                            INNER JOIN beneficiaire B ON B.code_benef = BBL.id_benef
                            INNER JOIN bloc BL ON BL.code_bloc = BBL.id_bloc
                            INNER JOIN collaborateur C ON C.code_col = BBL.id_collaborateur
                            INNER JOIN zone_fonkotany FKT ON FKT.code_fkt = B.id_fkt
                            ORDER BY P.nom, BL.nom, BBL.code_benef_bl, B.nom;`;
  
        await this.db.query(statement).then(res => {
          if (res.values.length) {
            res.values.forEach(elem => {
              beneficiaire.push({ 
                code_benef_bl: elem.code_benef_bl, 
                id_proj: elem.id_proj, 
                nom_pr: elem.nom_pr,
                id_activ: elem.id_activ,
                intitule: elem.intitule,
                id_benef: elem.id_benef,
                id_bloc: elem.id_bloc,
                nom_bl: elem.nom_bl,
                code_benef: elem.code_benef,
                img_benef: elem.img_benef,
                nom_benef: elem.nom_benef,
                prenom: elem.prenom,
                sexe: elem.sexe,
                dt_nais: elem.dt_nais,
                surnom: elem.surnom,
                cin: elem.cin,
                dt_delivrance: elem.dt_delivrance,
                lieu_delivrance: elem.lieu_delivrance,
                img_cin: elem.img_cin,
                contact: elem.contact,
                id_fkt: elem.id_fkt,
                nom_fkt: elem.nom_fkt,
                statut: elem.statut,
                nom_collab: elem.nom_collab,
                id_collaborateur: elem.id_collaborateur
              });
            });
            this.beneficiaire_bloc.next(beneficiaire);
          } else console.log("Aucun enregistrement pour la table beneficiaire");
        });
      }
    });
    return this.beneficiaire_bloc.asObservable();
  }

  getStateQuer() {
    return this.dbReady.asObservable();
  }

  getActivitePr(): Observable<any[]> {
    return this.active_projet.asObservable();
  }

  getUsers(): Observable<Utilisateurs[]> {
    return this.users.asObservable();
  }
}
