import { AfterViewChecked, AfterViewInit, Injectable, OnDestroy, OnInit } from '@angular/core';

//Imports
import { SqliteService } from './sqlite.service';
import { DB_NAME } from '../utils/global-variables';
import { DatabaseService } from './database.service';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { ApiService } from './api.service';
import { Activite, Collaborateur, Collaborateur_activ, Commune, District, Fonkotany, Participe_proj_activ, Projet, Region, Utilisateurs, Volet } from '../utils/interface-bd';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportDataService implements OnInit, OnDestroy {
  private dbName: string = DB_NAME;
  private db: SQLiteDBConnection = new SQLiteDBConnection(this.dbName, CapacitorSQLite);
  code_proj: string;
  isImported: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(private _sqlite: SqliteService, private dbService: DatabaseService, private api: ApiService) { 
    console.log("******** CONSTRUCTOR IMPORT **********");
    this.isImported.next(true);
  }
  ngOnDestroy(){
    console.log("************** ng DESTROY *********");
  }


  async ngOnInit() {
    console.log("******** ONINIT IMPORT **********");
    if (this.dbService.dbReady.value) {
      console.log('****db is ready****::' + this.dbService.dbReady.value);
      if (!(await this._sqlite.isConnection(this.dbName)).result) {
        console.log("***connection fermé***");
      } else {
        console.log("***Connection ouvert***");
      }
    } else {
      console.log('**db is not ready**::' + this.dbService.dbReady.value);
    }
  }
  
  loadData(users: any) {
    let id_pr = {
      id_projet: ''
    }

    let data_region: Region[];
    let data_district: District[];
    let data_commune: Commune[];
    let data_fkt: Fonkotany[];

    console.log(users);

    users.forEach(async (elem: Utilisateurs, i) => {
      id_pr.id_projet = elem.id_proj;
      const insert = `INSERT INTO utilisateurs(code_util, id_proj, id_equipe, img, nom, prenom, sexe, dt_nais, num_perso, id_fonct, fonction, type, role, nom_users, mot_passe, situation_compte, statuts_equipe, statuts_compte) 
                    VALUES (${elem.code_util}, "${elem.id_proj}", ${elem.id_equipe},"${elem.img}","${elem.nom}", "${elem.prenom}", "${elem.sexe}", "${elem.dt_nais}", "${elem.num_perso}", ${elem.id_fonct},  "${elem.fonction}", "${elem.type}", "${elem.role}", "${elem.nom_users}", "${elem.mot_passe}", "${elem.situation_compte}", "${elem.statuts_equipe}", "${elem.statuts_compte}");`;
        this.insertData(insert);
        console.log(`:::Execute add Utilisateurs in db successs::: ` + users.length);

      if (i == (users.length - 1)) {
        console.log("==Fin du boucle UTILISATEURS==");
        this.select("utilisateurs", users);
      }
    });

    // Import volet
    this.loadVolet();

    // Import activiter
    this.loadActivite();

    // Import colaborateur
    this.loadCollaborateur();

    // Import Region
    this.api.getRegion().subscribe((res: Region[]) => {
      console.log("Import Data Service::: Region....");
      data_region = res;

      data_region.forEach((elem, i) => {
        const insert = `INSERT INTO zone_region(code_reg, nom_reg)
                        VALUES (${elem.code_reg},"${elem.nom_reg}");`;
        console.log(elem);
        this.insertData(insert);

        if (i == (data_region.length - 1)) {
          console.log("==Fin du boucle zone_region==");
          this.select("zone_region", data_region);
        }
      });
    });

    // Import District
    this.api.getDistrict().subscribe((res: District[]) => {
      console.log("Import Data Service::: District....");
      data_district = res;
      
      data_district.forEach((elem, i) => {
        const insert = `INSERT INTO zone_district(code_dist, nom_dist, id_reg)
                        VALUES (${elem.code_dist},"${elem.nom_dist}", ${elem.id_reg});`;
        console.log(elem);
        this.insertData(insert);

        if (i == (data_district.length - 1)) {
          console.log("==Fin du boucle District==");
          this.select("zone_district", data_district);
        }

      });
    });

    // Import Commune
    this.api.getCom().subscribe((res: Commune[]) => {
      console.log("Import Data Service::: District....");
      data_commune = res;
      
      data_commune.forEach((elem, i) => {
        const insert = `INSERT INTO zone_commune(code_com, nom_com, id_dist)
                        VALUES (${elem.code_com},"${elem.nom_com}", ${elem.id_dist});`;
        console.log(elem);
        this.insertData(insert);

        if (i == (data_commune.length - 1)) {
          console.log("==Fin du boucle zone_commune==");
          this.select("zone_commune", data_commune);
        }

      });
    });

    // Import Fonkotany
    this.api.getFkt().subscribe((res: Fonkotany[]) => {
      console.log("Import Data Service::: District....");
      data_fkt = res;
      
      data_fkt.forEach((elem, i) => {
        const insert = `INSERT INTO zone_fonkotany(code_fkt, nom_fkt, id_com)
                        VALUES (${elem.code_fkt},"${elem.nom_fkt}", ${elem.id_com});`;
        console.log(elem);
        this.insertData(insert);

        if (i === (data_fkt.length - 1)) {
          console.log("==Fin du boucle==");
          this.select("zone_fonkotany", data_fkt);
        }

      });
    });
    this.isImported.next(true);
  }
  async insertData(data: string) {
    await this.db.execute(data);
  }
  async select(tbName: string, data: any[]) {
    let req = "SELECT * FROM " + tbName + ";";
    let ret = await this.db.query(req);
    console.log(`:::SELECT ALL ` + tbName + " IN DB SUCESS::: " + ret.values.length + " ::: " + ret.values);
    /**if(ret.values.length !== data.length) {
      return Promise.reject(new Error("Query " + tbName + " failed"));
    }*/
  }
  getStateImp() {
    return this.isImported.asObservable();
  }
  loadVolet() {
    // Import Volet
    let data_volet: Volet[];
    this.api.getListVolet().subscribe((res: Volet[]) => {
      console.log(res);
      data_volet = res;
      data_volet.forEach((elem, i) => {
        const insert = `INSERT INTO volet(code_vol, nom, description) 
                        VALUES (${elem.code_vol},"${elem.nom}","${elem.description}");`;
        console.log(elem);
        this.insertData(insert);
        if (i === (data_volet.length - 1)) {
          console.log("==Fin du boucle volet==");
          this.select("volet", data_volet);
        }
      });
    });
  }
  loadProjet(id_pr) {
    let data_projet: Projet[];
    // Insert Projet
    this.api.getListProjet(id_pr).subscribe((res: Projet[]) => {  
      console.log("************************Import Data Service::: PROJET....");
      console.log(res);
      data_projet = res;
      data_projet.forEach((elem, i) => {
        const insert = `INSERT INTO projet(code_proj, nom, description, logo, statuts) 
                        VALUES ("${elem.code_proj}","${elem.nom}","${elem.description}","${elem.logo}","${elem.statuts}");`;
        console.log(elem);
        this.insertData(insert);
        if (i == (data_projet.length - 1)) {
          console.log("==Fin du boucle projet==");
          this.select("projet", data_projet);
        }
      });
    });
  }
  loadActivite() {
    // Import Activite
    let data_activite: Activite[];
    this.api.getListActivite().subscribe((res: Activite[]) => {
      console.log(res);
      data_activite = res;
      data_activite.forEach((elem, i) => {
        const insert = `INSERT INTO activite(code_act, intitule, description, id_volet) 
                    VALUES (${elem.code_act},"${elem.intitule}", "${elem.description}", ${elem.id_volet});`;
        console.log(elem);
        this.insertData(insert);

        if (i == (data_activite.length - 1)) {
          console.log("==Fin du boucle activite==");
          this.select("activite", data_activite);
        }
      });
    });
  }
  loadActivProjet(id_pr: any) {
      // Import Activité projet
      let data_activite_projet: any[];

      this.api.getListActiveProjet(id_pr).subscribe((res: any[]) => {
        console.log("Import Data Service::: ActiveProjet....");
        data_activite_projet = res;
        let id_activite: any[] = [];

        if (data_activite_projet.length > 0) {
          data_activite_projet.forEach((elem, i) => {
            const insert = `INSERT INTO participe_proj_activ(id_proj, id_activ, statuts) 
                            VALUES ("${elem.id_proj}", ${elem.id_activ}, "${elem.statuts}");`;
            console.log(elem, i);
            id_activite.push({
              code_act: elem.id_activ
            });
            this.insertData(insert);
            /*****************************************
             * INSERT BENFECIAIRE POUR CHAQUE ACTIVITE
             *****************************************/
            let intitule: string = elem.intitule;
            if (intitule.toUpperCase() === 'RP') {
              console.log("============ RP ACTIVITE +++++ " + id_pr.id_projet);
              let data_rp = {
                id_projet: id_pr.id_projet,
                code_act: elem.id_activ
              }
              this.loadBenefRp(data_rp);
            } else if (intitule.toUpperCase() === 'BLOC') {
              console.log("============ ACTIVITE BLOC +++++ " + id_pr.id_projet);
              let data_bl = {
                id_projet: id_pr.id_projet,
                code_act: elem.id_activ
              }
              this.loadBenefBloc(data_bl);
            }
  
    
            if (i === (data_activite_projet.length - 1)) {
              console.log("==Fin du boucle ACTIVITE PROJET==");
              console.log(id_activite)

              this.select("participe_proj_activ", data_activite_projet);
              let data = {
                activite: id_activite
              }
              this.loadCollActivite(data);
            }
          });
        } else console.log("Aucune association disponible pour le projet ", id_pr.id_projet);
      });
  }
  loadCollaborateur() {
    let data_coll: Collaborateur[];

    this.api.getCol().subscribe((data: Collaborateur[]) => {
      console.log("Import Data Service::: Collaborateur....");
      data_coll = data;

      data_coll.forEach((elem, i) => {
        const insert = `INSERT INTO collaborateur(code_col, nom, description) 
                        VALUES (${elem.code_col}, "${elem.nom}", "${elem.description}");`;
        console.log(elem);
        this.insertData(insert);

        if (i === (data_coll.length - 1)) {
          console.log("==Fin du boucle Collaborateur==");
          this.select("collaborateur", data_coll);
        }
      });
    });
  }
  loadCollActivite(data: any) {
    console.log("*************** Load COLLABORATEUR ACTIVITE*************");

    this.api.getColActive(data).subscribe((res: any[]) => {
      console.log(res);
      if (res.length > 0) {
        res.forEach((elem: any[], i) => {
          console.log(elem);
          if (elem.length > 0) {
            elem.forEach((item: any, i) => {
              console.log(item);

              const insert = `INSERT OR IGNORE INTO collaborateur_activ(code, id_col, id_activ) 
                              VALUES (${item.code}, ${item.code_col}, ${item.code_act});`;
              this.insertData(insert);
              
              if ((elem.length - 1) === i) {
                console.log("==Fin du boucle collaborateur_activ==");
                this.select("collaborateur_activ", elem);
              }

            });
          }
        });
      }
    });
  }
  loadBloc(id_pr: any) {
    let data_bloc: any[];
    let code_bloc: any[] = [];

    this.api.getBloc(id_pr).subscribe((data: Collaborateur[]) => {
      console.log("Import Data Service::: BLOC....");
      data_bloc = data;

      if (data_bloc.length > 0) {
        data_bloc.forEach((elem, i) => {
          const insert = `INSERT INTO bloc(code_bloc, nom, id_prjt, status) 
                          VALUES (${elem.code_bloc}, "${elem.nom_bloc}", "${elem.code_proj}", "${elem.status}");`;
          code_bloc.push({
            id_bloc: elem.code_bloc
          });
          console.log(elem);
          this.insertData(insert);
  
          if ((data_bloc.length - 1) == i) {
            console.log("==Fin du boucle BLOC==");
            this.select("bloc", data_bloc);
  
            let data = {
              bloc: code_bloc
            }
            this.loadBlocZone(data);
          }
        });
      } else console.log("Aucune bloc trouvé pour ", id_pr.id_projet);

    });
  }
  loadBlocZone(data: any) {
    console.log("*************** Load BLOC_ZONE*************");

    this.api.getBlocZone(data).subscribe(res => {
      console.log(res);
      if (res.length > 0) {
        res.forEach((elem: any[], i) => {
          console.log(elem);
          if (elem.length > 0) {
            elem.forEach((item: any, i) => {
              console.log(item);

              const insert = `INSERT INTO bloc_zone(code, id_commune, id_bloc) 
                              VALUES (${item.code}, ${item.code_com}, ${item.code_bloc});`;
              this.insertData(insert);
              
              if ((elem.length - 1) == i) {
                console.log("==Fin du boucle bloc_zone==");
                this.select("bloc_zone", elem);
              }

            });
          }
        });
      }
    });

  }
  loadAssociation(id_pr) {
    let data_association: any[];
    // Insert Projet
    this.api.getAssociation(id_pr).subscribe((res: any[]) => {  
      console.log("************************Import Data Service::: ASSOCIATION....");
      console.log(res);
      data_association = res;
      if (data_association.length > 0) {
        data_association.forEach((elem, i) => {
          const insert = `INSERT INTO association(code_ass, nom, id_prjt, id_tech, id_pms, id_fkt, status) 
                          VALUES (${elem.code_ass},"${elem.nom_ass}","${elem.code_proj}", ${elem.id_tech}, "${elem.id_pms}", ${elem.code_fkt},"${elem.status}");`;
          console.log(elem);
          this.insertData(insert);
          if (i == (data_association.length - 1)) {
            console.log("==Fin du boucle association==");
            this.select("association", data_association);
          }
        });
      } else console.log("Aucune association disponible pour le projet ", id_pr.id_projet);
    });
  }
  loadBenefRp(data: any) {
    let data_benef: any[];
    // Insert Projet
    this.api.getBenefRp(data).subscribe((res: any[]) => {  
      console.log("************************Load Data BENEFICIAIRE PMS....");
      console.log(res);
      data_benef = res;
      if (data_benef.length > 0) {
        data_benef.forEach((elem, i) => {
          const insert = `INSERT OR IGNORE INTO beneficiaire(code_benef, img_benef, nom, prenom, sexe, dt_nais, surnom, cin, dt_delivrance, lieu_delivrance, img_cin, contact, id_fkt, dt_Insert, statut) 
                          VALUES ("${elem.code_benef}", "${elem.img_benef}","${elem.nom}", "${elem.prenom}", "${elem.sexe}", "${elem.dt_nais}","${elem.surnom}", ${elem.cin}, "${elem.dt_delivrance}", "${elem.lieu_delivrance}", "${elem.img_cin}", "${elem.contact}", ${elem.id_fkt}, "${elem.dt_Insert}", "${elem.statut}");`;
          console.log(elem);
          this.insertData(insert);
          if (i == (data_benef.length - 1)) {
            console.log("==Fin du boucle beneficiaire PMS==");
            this.select("beneficiaire", data_benef);

            data_benef.forEach((item, index) => {
              const insert_pms = `INSERT INTO benef_activ_pms(code_benef_pms, id_proj, id_activ, id_benef, id_association, id_collaborateur , status) 
                                  VALUES ("${item.code_benef_pms}", "${item.id_proj}", ${item.id_activ}, "${item.id_benef}", ${item.id_association}, ${item.id_collaborateur},"${item.status_pms}");`;
              this.insertData(insert_pms);  
              
              if (index == (data_benef.length - 1)) {
                console.log("==Fin du boucle definitive BENEFICIAIRE ACTIVITE PMS==");
                this.select("benef_activ_pms", data_benef)
              }
            })

          }
        });
      } else console.log("Aucune beneficiaire PMS disponible pour le projet ", data.id_projet);
    });
  }
  loadBenefBloc(data: any) {
    let data_benef: any[];
    // Insert Projet
    this.api.getBenefBloc(data).subscribe((res: any[]) => {  
      console.log("************************Load Data BENEFICIAIRE BLOC....");
      console.log(res);
      data_benef = res;
      if (data_benef.length > 0) {
        data_benef.forEach((elem, i) => {
          const insert = `INSERT OR IGNORE INTO beneficiaire(code_benef, img_benef, nom, prenom, sexe, dt_nais, surnom, cin, dt_delivrance, lieu_delivrance, img_cin, contact, id_fkt, dt_Insert, statut) 
                          VALUES ("${elem.code_benef}", "${elem.img_benef}","${elem.nom}", "${elem.prenom}", "${elem.sexe}", "${elem.dt_nais}","${elem.surnom}", ${elem.cin}, "${elem.dt_delivrance}", "${elem.lieu_delivrance}", "${elem.img_cin}", "${elem.contact}", ${elem.id_fkt}, "${elem.dt_Insert}", "${elem.status_benef}");`;
          console.log(elem);
          this.insertData(insert);
          if (i == (data_benef.length - 1)) {
            console.log("==Fin du boucle beneficiaire BLOC==");
            this.select("beneficiaire", data_benef);

            data_benef.forEach((item, index) => {
              const insert_bl = `INSERT OR IGNORE INTO benef_activ_bl(code_benef_bl, id_proj, id_activ, id_benef, id_bloc, id_collaborateur, status) 
                                  VALUES ("${item.code_benef_bl}", "${item.id_proj}", ${item.id_activ}, "${item.id_benef}", ${item.id_bloc}, ${item.id_collaborateur},"${item.status_benef_bloc}");`;
              this.insertData(insert_bl);  
              
              if (index == (data_benef.length - 1)) {
                console.log("==Fin du boucle definitive BENEFICIAIRE ACTIVITE BLOC==");
                this.select("benef_activ_bl", data_benef)
              }
            })

          }
        });
      } else console.log("Aucune beneficiaire bloc disponible pour le projet ", data.id_projet);
    });
  }
}
