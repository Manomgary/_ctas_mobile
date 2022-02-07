import { Injectable } from '@angular/core';

// Imports 
import { SqliteService } from '../sqlite.service'; 
import { DatabaseService } from '../database.service';
import { DB_NAME } from 'src/app/utils/global-variables';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Utilisateurs } from 'src/app/utils/interface-bd';

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
  private projets = new BehaviorSubject([]);

  constructor(private dbService: DatabaseService) {
    this.dbService.dbReady.subscribe(async isReady => {
      console.log("===== Contructeur laod service ====");
    });
  }

  async loadUsers(data: any) {
    console.log(this.dbService.dbReady.value);
    
    if (this.dbService.dbReady.value) {
      let user: Utilisateurs[]  = [];
      const statement = `SELECT * From utilisateurs WHERE num_perso = "${ data.userName }" AND mot_passe = "${data.passWord}";`;

      await this.db.query(statement).then(res => {
        console.log(":::RESPONSE QUERY UTILISATEURS ::::");
        console.log(res);
        if (res.values.length >0) {
          res.values.forEach((element: Utilisateurs) => {
            user.push({
              code_util: element.code_util, 
              id_proj: element.id_proj,
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
          console.log("Users not existing");
          this.users.next(res.values);
        }
      }); 

    } else {
      console.log("Db is not ready");
    }
  }

  async loadSingleProject() {
    if (this.dbService.dbReady.value) {
      let projet: any[] = [];
      const statement = `SELECT * FROM projet;`;

      await this.db.query(statement).then(res => {
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
        } else console.log("Aucun enregistrement pour le table projet");
      });
    }
  }

  async loadAllProjet() {
    if (this.dbService.dbReady.value) {
      let projet: any[] = [];
      const statement = `SELECT * FROM projet;`;

      await this.db.query(statement).then(res => {
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
        } else console.log("Aucun enregistrement pour le table projet");
      });
    }
  }

  async loadActiveProjet(id_projet: string) {
    if (this.dbService.dbReady.value) {
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
  }



  loadRegion(): Observable<any[]> {
    this.dbService.dbReady.subscribe(async (isReady) => {
      if (isReady) {
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
          } else console.log("Aucune region!!!");
        }); 
      }
    });
    return this.region.asObservable();
  }

  loadDistrict(id_region): Observable<any[]> {
    this.dbService.dbReady.subscribe(async (isReady) => {
      if (isReady) {
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
          } else console.log("Aucune District!!!");
        }); 
      }
    });
    return this.district.asObservable();
  }

  loadCommune(id_dist): Observable<any[]> {
    this.dbService.dbReady.subscribe(async (isReady) => {
      if (isReady) {
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
          } else console.log("Aucune commune Disponible!!!");
        }); 
      }
    });
    return this.commune.asObservable();
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
