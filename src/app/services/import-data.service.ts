import { AfterViewChecked, AfterViewInit, Injectable, OnDestroy, OnInit } from '@angular/core';

//Imports
import { SqliteService } from './sqlite.service';
import { DB_NAME } from '../utils/global-variables';
import { DatabaseService } from './database.service';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { ApiService } from './api.service';
import { Activite, bloc_Parcelle, Catego_espece, Collaborateur, Collaborateur_activ, Commune, Culture_pms, District, Equipe, Espece, Fonkotany, Parcelle, Parcelle_Association, Parcelle_bl, 
        Participe_proj_activ, Projet, ProjetEquipe, Region, Saison, Suivi_pms, Utilisateurs, Variette, Volet } from '../utils/interface-bd';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportDataService implements OnInit, OnDestroy {
  private dbName: string = DB_NAME;
  private db: SQLiteDBConnection = new SQLiteDBConnection(this.dbName, CapacitorSQLite);
  code_proj: string;

  private isImported: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isEquipeLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isProjImported: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isBlocImported: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isAssociationImported: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isUsersLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isVoletLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isActiviteLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isCollabLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isRegionLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isDistrictLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isComLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isFktLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isParcelleLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  //private isCategoEspeceLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  //private isEspeceLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);


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
  
  async loadData(users: any[]) {
    let id_pr = {
      id_projet: ''
    }
    let id_equipe = {
      code_equipe: null
    }

    let data_fkt: Fonkotany[];

    console.log(users);

    users.forEach(async (elem_user: Utilisateurs, i) => {
      //id_pr.id_projet = elem.id_proj;
      id_equipe.code_equipe = elem_user.id_equipe;

      if (i == (users.length - 1)) {
        console.log("==Fin du boucle UTILISATEURS==");
        let data_equipe: Equipe[];
        // Insert Projet
        this.api.getEquipe(id_equipe).subscribe((res: Equipe[]) => {  
          console.log("************************Import Data Service::: EQUIPE....");
          console.log(res);
          data_equipe = res;
          data_equipe.forEach((elem, i) => {
    
            const insert = `INSERT OR IGNORE INTO equipe(code_equipe, img, matricule, nom, prenom, sexe, dt_nais, cin, dt_delivrance, lieu_delivrance, img_cin, email, num_perso, num_float, id_fonct, intitule_fct, statuts) 
                            VALUES (${elem.code_equipe}, "${elem.img}", "${elem.matricule}", "${elem.nom}","${elem.prenom}","${elem.sexe}", strftime('%Y-%m-%d','${elem.dt_nais}'), ${elem.cin}, strftime('%Y-%m-%d','${elem.dt_delivrance}'), "${elem.lieu_delivrance}", "${elem.img_cin}", "${elem.email}", "${elem.num_perso}", "${elem.num_float}", ${elem.id_fonct}, "${elem.intitule_fct}", "${elem.statuts}");`;
            
            console.log(elem);
            this.insertData(insert);
    
            if (i == (data_equipe.length - 1)) {
              console.log("==Fin du boucle Equipe==");
              const insert_user = `INSERT INTO utilisateurs(code_util, id_equipe, img, nom, prenom, sexe, dt_nais, num_perso, id_fonct, fonction, type, role, nom_users, mot_passe, situation_compte, statuts_equipe, statuts_compte) 
                              VALUES (${elem_user.code_util}, ${elem_user.id_equipe},"${elem_user.img}","${elem_user.nom}", "${elem_user.prenom}", "${elem_user.sexe}", "${elem_user.dt_nais}", "${elem_user.num_perso}", ${elem_user.id_fonct},  "${elem_user.fonction}", "${elem_user.type}", "${elem_user.role}", "${elem_user.nom_users}", "${elem_user.mot_passe}", "${elem_user.situation_compte}", "${elem_user.statuts_equipe}", "${elem_user.statuts_compte}");`;
              this.insertData(insert_user);
              this.select("utilisateurs", users);
              this.select("equipe", data_equipe);
            }
          });
        });
        /**if (elem_user.fonction === "technicien") {
          console.log("***** Connection By technicien ******");
          
        } else {
          console.log("***** Connection By Autres Users ******");
        }*/

        this.isUsersLoaded.next(true);
      }
    });

    await this.isUsersLoaded.subscribe(isLoaded => {
      console.log(isLoaded + ' ......Import Encours..............');
      if (isLoaded) {
        this.loadRegion();
        this.loadVolet();
        this.loadSaison();
        this.loadCategEspece();
      } else console.log('-----------Users not imported--------');
    });

    await this.isVoletLoaded.subscribe(isLoaded => {
      if (isLoaded) {
        this.loadActivite();
      } else console.log('-----------Volet not imported--------');
    });

    await this.isActiviteLoaded.subscribe(isLoaded => {
      if (isLoaded) {
        // Import colaborateur
        this.loadCollaborateur();
      } else console.log('-----------isActivite not imported--------');
    });

    await this.isRegionLoaded.subscribe(isLoaded => {
      if (isLoaded) {
        this.loadDistrict();
      } else console.log('-----------isRegion not imported--------');
    });
    
    await this.isDistrictLoaded.subscribe(isLoaded => {
      if (isLoaded) {
        this.loadCommune();
      } else console.log('-----------isDistrict not imported--------');
    });

    await this.isComLoaded.subscribe(isLoaded => {
      if (isLoaded) {
            // Import Fonkotany
        this.api.getFkt().subscribe((res: Fonkotany[]) => {
          console.log("Import Data Service::: District....");
          data_fkt = res;
          
          data_fkt.forEach((elem, i) => {
            const insert = `INSERT INTO zone_fonkotany(code_fkt, nom_fkt, id_com)
                            VALUES ("${elem.code_fkt}","${elem.nom_fkt}", "${elem.id_com}");`;
            console.log(elem);
            this.insertData(insert);

            if (i === (data_fkt.length - 1)) {
              console.log("==Fin du boucle==");
              this.select("zone_fonkotany", data_fkt);
              this.isFktLoaded.next(true);
            }

          });
        });
      } else console.log('-----------isCommune not imported--------');
    });
    if (this.isUsersLoaded.value && this.isVoletLoaded.value && this.isActiviteLoaded.value && this.isRegionLoaded.value && this.isDistrictLoaded.value 
        && this.isComLoaded.value && this.isFktLoaded.value && this.isCollabLoaded.value) {
          console.log(".....Data All Imported....");
          this.isImported.next(true);
        } else console.log(".....Pertes de données:::: Tous les données ne sont pas importer....");
    
    return this.isImported.asObservable();

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

  // get State Initiale Import
  getStateImp() {
    return this.isImported.asObservable();
  }

  /*************
   * Imported Zone
   *************/ 
  loadRegion() {
    let data_region: Region[];
    // Import Region
    this.api.getRegion().subscribe((res: Region[]) => {
      console.log("Import Data Service::: Region....");
      data_region = res;

      data_region.forEach((elem, i) => {
        const insert = `INSERT INTO zone_region(code_reg, nom_reg)
                        VALUES ("${elem.code_reg}", "${elem.nom_reg}");`;
        console.log(elem);
        this.insertData(insert);

        if (i == (data_region.length - 1)) {
          console.log("==Fin du boucle zone_region==");
          this.select("zone_region", data_region);
          this.isRegionLoaded.next(true);
        }
      });
    });
  }

  loadDistrict() {
    let data_district: District[];
    // Import District
    this.api.getDistrict().subscribe((res: District[]) => {
      console.log("Import Data Service::: District....");
      data_district = res;
      
      data_district.forEach((elem, i) => {
        const insert = `INSERT INTO zone_district(code_dist, nom_dist, id_reg)
                        VALUES ("${elem.code_dist}","${elem.nom_dist}", "${elem.id_reg}");`;
        console.log(elem);
        this.insertData(insert);

        if (i == (data_district.length - 1)) {
          console.log("==Fin du boucle District==");
          this.select("zone_district", data_district);
          this.isDistrictLoaded.next(true);
        }

      });
    });
  }

  loadCommune() {
    let data_commune: Commune[];
    // Import Commune
    this.api.getCom().subscribe((res: Commune[]) => {
      console.log("Import Data Service::: District....");
      data_commune = res;
      
      data_commune.forEach((elem, i) => {
        const insert = `INSERT INTO zone_commune(code_com, nom_com, id_dist)
                        VALUES ("${elem.code_com}","${elem.nom_com}", "${elem.id_dist}");`;
        console.log(elem);
        this.insertData(insert);

        if (i == (data_commune.length - 1)) {
          console.log("==Fin du boucle zone_commune==");
          this.select("zone_commune", data_commune);
          this.isComLoaded.next(true);
        }

      });
    });
  }

  /*****************
   * 
   * Imported VOLET, PROJET, ACTIVITE, SAISON
   * 
   ****************/
  loadSaison() {
    let data_saison: Saison[] = [];
    this.api.getSaison().subscribe((res: Saison[]) => {
      console.log(res);
      data_saison = res;
      if (data_saison.length > 0) {
        data_saison.forEach((elem_sais, i) => {
          const insert  = `INSERT INTO saison(code_saison, intitule, description) 
                          VALUES ("${elem_sais.code_saison}","${elem_sais.intitule}","${elem_sais.description}");`;
          this.insertData(insert);
          if ((data_saison.length -1) === i) {
            console.log("==Fin du boucle Saison==");
            this.select("saison", data_saison);
          }
        });
      }
    });
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
          this.isVoletLoaded.next(true);
        }
      });
    });
  }

  loadCategEspece() {
    // Import Categorie Espece
    let data_categEspece: Catego_espece[] = [];
    this.api.getCategEspece().subscribe((res: Catego_espece[] ) => {
      console.log(res);
      data_categEspece = res;
      if (data_categEspece.length > 0) {
        data_categEspece.forEach((elem, i) => {
          const insert = `INSERT INTO categorie_espece(code_cat, libelle) 
                          VALUES (${elem.code_cat},"${elem.libelle}");`;
          this.insertData(insert);  
          if (i === (data_categEspece.length - 1)) {
            console.log("****Fin du boucle CategEspce****");
            this.select("categorie_espece", data_categEspece);
            this.loadEspece();
          }
        });
      }
    });
  }

  loadEspece() {
    // Import Espece
    let data_espece: Espece[] = [];
    this.api.getEspece().subscribe((res: Espece[] ) => {
      console.log(res);
      data_espece = res;
      if (data_espece.length > 0) {
        data_espece.forEach((elem, i) => {
          const insert = `INSERT INTO espece(code_espece, nom_espece, id_categ) 
                          VALUES ("${elem.code_espece}","${elem.nom_espece}", ${elem.id_categ});`;
          this.insertData(insert);  
          if (i === (data_espece.length - 1)) {
            console.log("****Fin du boucle Espce****");
            this.select("espece", data_espece);
            this.loadVariette();
          }
        });
      }
    });
  }

  loadVariette() {
    // Import Espece
    let data_variette: Variette[] = [];
    this.api.getVariette().subscribe((res: Variette[] ) => {
      console.log(res);
      data_variette = res;
      if (data_variette.length > 0) {
        data_variette.forEach((elem, i) => {
          const insert = `INSERT INTO variette(code_var, nom_var, id_espece) 
                          VALUES ("${elem.code_var}","${elem.nom_var}", "${elem.id_espece}");`;
          this.insertData(insert);  
          if (i === (data_variette.length - 1)) {
            console.log("****Fin du boucle variette****");
            this.select("variette", data_variette);
          }
        });
      }
    });
  }

  loadProjet(id_pr_equipe) {
    const id_projet = {
      id_projet: id_pr_equipe.id_projet
    }
    this.isImported.subscribe(isImport => {
      if (isImport) {
        let data_projet: Projet[];
        // Insert Projet
        this.api.getListProjet(id_projet).subscribe((res: Projet[]) => {  
          console.log("************************Import Data Service::: PROJET....");
          console.log(res);
          data_projet = res;
          data_projet.forEach((elem, i) => {
            const insert = `INSERT INTO projet(numero, code_proj, nom, description, logo, statuts) 
                            VALUES (${elem.numero}, "${elem.code_proj}","${elem.nom}","${elem.description}",'${elem.logo}',"${elem.statuts}");`;
            console.log(elem);
            this.insertData(insert);

            if (i == (data_projet.length - 1)) {
              console.log("==Fin du boucle projet==");
              this.isProjImported.next(true);
              this.select("projet", data_projet);

              this.isActiviteLoaded.subscribe(isLoaded => {
                if (isLoaded) {
                  this.loadEquipe(id_projet);
                  this.loadActivProjet(id_pr_equipe);
                }
              });
              //this.loadProjetEquipe(id_projet);
              //this.loadBloc(id_pr_equipe);
              //this.loadAssociation(id_pr_equipe);
            }
          });
        });
      }
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
          this.isActiviteLoaded.next(true);
        }
      });
    });
  }

  loadActivProjet(data_equipe_pr: any) {
    // Import Activité projet
    let data_activite_projet: any[];

    const id_projet = {
      id_projet: data_equipe_pr.id_projet
    }

    this.api.getListActiveProjet(id_projet).subscribe((res: any[]) => {
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
            console.log("============ RP ACTIVITE +++++ " + data_equipe_pr.id_projet);
            let data_rp = {
              id_projet: data_equipe_pr.id_projet,
              code_act: elem.id_activ
            }
            this.loadAssociation(data_equipe_pr, data_rp);
            //this.loadBenefRp(data_rp);
          } else if (intitule.toUpperCase() === 'BLOC') {
            console.log("============ ACTIVITE BLOC +++++ " + data_equipe_pr.id_projet);
            let data_bl_benef = {
              id_projet: data_equipe_pr.id_projet,
              code_act: elem.id_activ
            }
            this.loadBloc(data_equipe_pr, data_bl_benef);
            //this.loadBenefBloc(data_bl_benef);
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
      } else console.log("Aucune association disponible pour le projet ", data_equipe_pr.id_projet);
    });
  }
  loadCollaborateur() {
    let data_coll: Collaborateur[];

    this.api.getCol().subscribe((data: Collaborateur[]) => {
      console.log("Import Data Service::: Collaborateur....");
      data_coll = data;

      data_coll.forEach((elem, i) => {
        const insert = `INSERT INTO collaborateur(code_col, nom, description) 
                        VALUES ("${elem.code_col}", "${elem.nom}", "${elem.description}");`;
        console.log(elem);
        this.insertData(insert);

        if (i === (data_coll.length - 1)) {
          console.log("==Fin du boucle Collaborateur==");
          this.select("collaborateur", data_coll);
          this.isCollabLoaded.next(true);
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
                              VALUES (${item.code}, "${item.code_col}", ${item.code_act});`;
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

  /**
   * 
   * Imported BLOC
   * 
   */
  loadBloc(id_pr_equipe: any, data_bl_benef: any) {
    let data_bloc: any[];
    let code_bloc: any[] = [];
    this.isProjImported.subscribe(isReady => {
      if (isReady) {
        this.api.getBloc(id_pr_equipe).subscribe((data: Collaborateur[]) => {
          console.log("Import Data Service::: BLOC....");
          data_bloc = data;
    
          if (data_bloc.length > 0) {
            data_bloc.forEach((elem, i) => {
              const insert = `INSERT OR IGNORE INTO bloc(code_bloc, nom, id_prjt, id_tech, status) 
                              VALUES ("${elem.code_bloc}", "${elem.nom_bloc}", "${elem.code_proj}", "${elem.id_tech}", "${elem.status}");`;
              code_bloc.push({
                id_bloc: elem.code_bloc,
                id_projet: data_bl_benef.id_projet,
                code_act: data_bl_benef.code_act
              });
              console.log(elem);
              this.insertData(insert);
      
              if ((data_bloc.length - 1) == i) {
                console.log("==Fin du boucle BLOC==");      
                let data = {
                  bloc: code_bloc,
                }
                /**let code_bl = {
                  id_bloc: code_bloc
                }*/
                this.loadBenefBloc(data);

                this.isBlocImported.next(true);
                this.select("bloc", data_bloc);
              }
            });
          } else console.log("Aucune bloc trouvé pour ", id_pr_equipe.id_projet);
    
        });
      } else console.log("-------- Projet Is not Imported---------")
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

              const insert = `INSERT OR IGNORE INTO bloc_zone(code, id_fkt, id_bloc, id_km) 
                              VALUES (${item.code}, "${item.id_fkt}", "${item.code_bloc}", "${item.id_km}");`;
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

  /**
   * 
   * imported Association
   * 
   */
  loadAssociation(id_pr_equipe: any, data_pms: any) {
    let data_association: any[];
    // Inserer association par équipe et par projet
    this.api.getAssociation(id_pr_equipe).subscribe((res: any[]) => {  
      console.log("************************Import Data Service::: ASSOCIATION....");
      console.log(res);
      data_association = res;
      if (data_association.length > 0) {
        data_association.forEach((elem, i) => {
          const insert = `INSERT OR IGNORE INTO association(numero, code_ass, nom, id_prjt, id_tech, id_fkt, status) 
                          VALUES (${elem.numero}, "${elem.code_ass}","${elem.nom_ass}","${elem.code_proj}", ${elem.id_tech}, "${elem.code_fkt}","${elem.status}");`;
          console.log(elem);
          this.insertData(insert);
          /**
           * INSERER BENEFICIAIRE PMS
           * SELECT code_culture, id_parce, id_var, id_saison, annee_du, ddp, qsa, img_fact, dds, sfce, objectif, sc, ea_id_variette, ea_autres, dt_creation, dt_modification, statuts, Etat 
           * FROM cultures_pms CPMS.
           * WHERE 1
           * 
           */
          let data_benef_pms = {
            id_projet: data_pms.id_projet,
            code_act: data_pms.code_act,
            code_ass: elem.code_ass
          }
          this.loadBenefRp(data_benef_pms);
          if (i == (data_association.length - 1)) {
            console.log("==Fin du boucle association==");
            this.select("association", data_association);
            this.isAssociationImported.next(true);
          }
        });
      } else console.log("Aucune association disponible pour le projet ", id_pr_equipe.id_projet);
    });
  }

  /***********************
   * 
   * Imported BENEFICIAIRE
   * 
   **********************/
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
                          VALUES ("${elem.code_benef}", "${elem.img_benef}","${elem.nom}", "${elem.prenom}", "${elem.sexe}", "${elem.dt_nais}","${elem.surnom}", ${elem.cin}, "${elem.dt_delivrance}", "${elem.lieu_delivrance}", "${elem.img_cin}", "${elem.contact}", "${elem.id_fkt}", "${elem.dt_Insert}", "${elem.statut}");`;
          console.log(elem);
          this.insertData(insert);
          if (i == (data_benef.length - 1)) {
            console.log("==Fin du boucle beneficiaire PMS==");
            this.select("beneficiaire", data_benef);

            data_benef.forEach((item, index) => {
              const insert_pms = `INSERT OR IGNORE INTO benef_activ_pms(code_benef_pms, id_proj, id_activ, id_benef, id_association, id_collaborateur , status) 
                                  VALUES ("${item.code_benef_pms}", "${item.id_proj}", ${item.id_activ}, "${item.id_benef}", "${item.id_association}", "${item.id_collaborateur}","${item.status_pms}");`;
              this.insertData(insert_pms);  
              
              if (index == (data_benef.length - 1)) {
                console.log("==Fin du boucle definitive BENEFICIAIRE ACTIVITE PMS==");
                this.select("benef_activ_pms", data_benef);
                // Inserer parcelle beneficiaire par association
                //this.loadParcelleBenef(data);
                this.loadParcAssoc(data);
              }
            })

          }
        });
      } else console.log("Aucune beneficiaire PMS disponible pour le projet ", data.id_projet);
    });
  }
  loadBenefBloc(data: any) {
    let data_benef: any[] = [];
    // Insert Projet
    this.api.getBenefBloc(data).subscribe((res: any[]) => {  
      console.log("************************Load Data BENEFICIAIRE BLOC....");
      console.log(res);
      if (res.length > 0) {
        res.forEach((element: any[], i) => {
          console.log(element);
          data_benef = element;
          if (data_benef.length > 0) {
            data_benef.forEach((elem, i) => {
              const insert = `INSERT OR IGNORE INTO beneficiaire(code_benef, img_benef, nom, prenom, sexe, dt_nais, surnom, cin, dt_delivrance, lieu_delivrance, img_cin, contact, id_fkt, dt_Insert, statut) 
                              VALUES ("${elem.code_benef}", "${elem.img_benef}","${elem.nom}", "${elem.prenom}", "${elem.sexe}", "${elem.dt_nais}","${elem.surnom}", ${elem.cin}, "${elem.dt_delivrance}", "${elem.lieu_delivrance}", "${elem.img_cin}", "${elem.contact}", "${elem.id_fkt}", "${elem.dt_Insert}", "${elem.status_benef}");`;
              console.log(elem);
              this.insertData(insert);
              if (i == (data_benef.length - 1)) {
                console.log("==Fin du boucle beneficiaire BLOC==");
                this.select("beneficiaire", data_benef);
    
                data_benef.forEach((item, index) => {
                  const insert_bl = `INSERT OR IGNORE INTO benef_activ_bl(code_benef_bl, id_proj, id_activ, id_benef, id_bloc, id_collaborateur, status) 
                                      VALUES ("${item.code_benef_bl}", "${item.id_proj}", ${item.id_activ}, "${item.id_benef}", "${item.id_bloc}", "${item.id_collaborateur}","${item.status_benef_bloc}");`;
                  this.insertData(insert_bl);  
                  
                  if (index == (data_benef.length - 1)) {
                    console.log("==Fin du boucle definitive BENEFICIAIRE ACTIVITE BLOC==");
                    this.select("benef_activ_bl", data_benef);
                  }
                });
              }
            });
          } else console.log("Aucune beneficiaire bloc disponible pour le projet ", data.id_projet);
          // load Bloc Zone
          if (i == (res.length - 1)) {
            console.log("==Fin du boucle Data BENEFICIAIRE BLOC==");
            this.loadBlocZone(data);
            this.loadParcelleBenefBloc(data);
          }
        });
      }
    });
  }

  loadParcelleBenef(data: any) {
    let data_benef_parce: Parcelle[];
    // Inserer association par équipe et par projet
    this.api.getBenefParcelle(data).subscribe((res: any[]) => {  
      console.log("************************Import Data Service::: ASSOCIATION....");
      console.log(res);
      data_benef_parce = res;
      if (data_benef_parce.length > 0) {
        data_benef_parce.forEach((elem, i) => {
          const insert = `INSERT OR IGNORE INTO parcelle(code_parce, id_benef, ref_gps , lat, log, superficie, id_fkt, status) 
                            VALUES ("${elem.code_parce}","${elem.id_benef}","${elem.ref_gps}", ${elem.lat}, ${elem.log}, ${elem.superficie}, "${elem.id_fkt}", "${elem.status}");`;
          console.log(elem);
          this.insertData(insert);
          if (i == (data_benef_parce.length - 1)) {
            console.log("==Fin du boucle parcelle==");
            this.select("parcelle", data_benef_parce);
            // Inserer Parcelle Asociation 
            this.loadParcAssoc(data);
          }
        });
      } else console.log("***Aucune Parcelle disponible pour les béneficiaire de l'association de ::", data.code_ass);
    });
  }
  // Load parcelle Association
  loadParcAssoc(data: any) {
    let data_assoc_parce: Parcelle_Association[] = [];
    // Inserer association par équipe et par projet
    this.api.getAssociationParcelle(data).subscribe((res: Parcelle_Association[]) => {  
      console.log("************************Import Data Service::: ASSOCIATION....");
      console.log(res);
      data_assoc_parce = res;
      if (data_assoc_parce.length > 0) {
        data_assoc_parce.forEach((elem, i) => {
          const insert = `INSERT OR IGNORE INTO assoc_parce(code_parce, id_assoc, id_benef, ref_gps, lat, log, superficie, id_fkt, anne_adheran, status) 
                            VALUES ("${elem.code_parce}","${elem.id_assoc}", "${elem.id_benef}", "${elem.ref_gps}", ${elem.lat}, ${elem.log}, ${elem.superficie}, "${elem.id_fkt}", ${elem.anne_adheran}, "${elem.status}");`;
          console.log(elem);
          this.insertData(insert);
          if (i == (data_assoc_parce.length - 1)) {
            console.log("==Fin du boucle assoc_parce==");
            this.select("assoc_parce", data_assoc_parce);
            this.loadCultureAssoc(data);
          }
        });
      } else console.log("***Aucune assoc_parce disponible pour l'association de ::", data.code_ass);
    });
  }
  // loadCulture Association
  loadCultureAssoc(data: any) {
    let data_culture: Culture_pms[] = [];
    let code_culture: any[] = [];

    this.api.getCulture_pms(data).subscribe((res: Culture_pms[]) => {
      console.log("************************Import Data Service::: CULTURE PMS....");
      console.log(res);
      data_culture = res;
      if (data_culture.length > 0) {
        data_culture.forEach((elem, i) => {
          const insert = `INSERT OR IGNORE INTO cultures_pms(code_culture, id_parce, id_var, id_saison, annee_du, ddp, qsa, img_fact, dds, sfce, objectif, sc, ea_id_variette, ea_autres, dt_creation, dt_modification, statuts, Etat)
                          VALUES ("${elem.code_culture}", "${elem.id_parce}", "${elem.id_var}", "${elem.id_saison}", "${elem.annee_du}", "${elem.ddp}", ${elem.qsa}, "${elem.img_fact}", "${elem.dds}", ${elem.sfce}, ${elem.objectif}, "${elem.sc}", "${elem.ea_id_variette}", "${elem.ea_autres}", "${elem.dt_creation}", "${elem.dt_modification}", "${elem.statuts}", "${elem.Etat}");`;
          this.insertData(insert);
          code_culture.push({
            code_culture: elem.code_culture
          });
          if ((data_culture.length - 1) === i) {
            console.log("==Fin du boucle culture pms==");
            this.select("cultures_pms", data_culture);
            this.loadSuiviPms(code_culture);
          }
        });
      }
    });
  }
  loadSuiviPms(data : any[]) {
    let data_suivi: Suivi_pms[] = [];
    const data_clt = {
      data_culture: data
    }
    this.api.getSuiPms(data_clt).subscribe((res: any[]) => {
      console.log(res);
      if (res.length > 0) {
        res.forEach((item_suivi: Suivi_pms[], i) => {
          data_suivi = item_suivi;
          console.log("elem_suivi_pms:::::", item_suivi);
          item_suivi.forEach(elem_suivi => {
            const insert = `INSERT INTO suivi_pms(id, id_culture, ddp, stc, ec, pb, ex, img_cult, name, path, controle, etat)
                            VALUES ("${elem_suivi.id}", "${elem_suivi.id_culture}", "${elem_suivi.ddp}", "${elem_suivi.stc}", "${elem_suivi.ec}", "${elem_suivi.pb}", "${elem_suivi.ex}", "${elem_suivi.img_cult}", "${elem_suivi.name}", '', "${elem_suivi.controle}", "${elem_suivi.etat}");`;
            this.insertData(insert).then(res => {
              console.log("res inser elem_suivi_pms:::::", res);
              console.log(elem_suivi);
            });
          });
          if ((res.length - 1) == i) {
            console.log("==Fin du boucle suivi pms==");
            //this.select("suivi_pms", data_suivi);
          }
        });
      }
    });
  }
  async loadParcelleBenefBloc(data: any) {
    console.log(data);
    let code_bl: any[] = [];
    code_bl = data.bloc;
    console.log("********Parcelle Beneficiare Code bloc********");
    console.log(code_bl);
    if (code_bl.length> 0) {
      // Loaded Parcelle Bloc
      code_bl.forEach((elem_bl, ind) => {
        const id_bloc = {
          id_bloc: elem_bl.id_bloc
        }
        // Load Bloc Parcelle
        this.loadParceBloc(id_bloc);
      });
    }
  }

  /**async loadParcelleBenefBloc(data: any) {
    console.log(data);
    let code_bl: any[] = [];
    code_bl = data.bloc;
    console.log("********Parcelle Beneficiare Code bloc********");
    console.log(code_bl);
    if (code_bl.length> 0) {
      code_bl.forEach((elem_bl, index) => {
        console.log("********element Code bloc********");
        console.log(elem_bl);
        // Insertion Parcelle beneficiaire bloc
        const code_bloc = {
          id_bloc: elem_bl.id_bloc
        }
        let data_benef_parce: Parcelle_bl[] = [];

        this.api.getBenefParcelleBloc(code_bloc).subscribe((res: Parcelle_bl[]) => {
          console.log(res);
          data_benef_parce = res;
          if (data_benef_parce.length > 0) {
            data_benef_parce.forEach((elem_parce, i) => {
              const insert = `INSERT OR IGNORE INTO parcelle(code_parce, id_benef, ref_gps , lat, log, superficie, id_fkt, status) 
                              VALUES ("${elem_parce.code_parce}","${elem_parce.id_benef}","${elem_parce.ref_gps}", ${elem_parce.lat}, ${elem_parce.log}, ${elem_parce.superficie}, "${elem_parce.id_fkt}", "${elem_parce.status}");`;
              this.insertData(insert);
    
              if (i == (data_benef_parce.length - 1)) {
                console.log("==Fin du boucle parcelle==");
                this.select("parcelle", data_benef_parce);
              }
            });
          }
        });
        if (index === (code_bl.length - 1)) {
            console.log("*******Fin du boucle Parcelle benf bloc*********");
            this.isParcelleLoaded.next(true);
        }
      });
      // Loaded Parcelle Bloc
      await this.isParcelleLoaded.subscribe(isLoaded => {
        if (isLoaded) {
          code_bl.forEach((elem_sbl, ind) => {
            const id_bloc = {
              id_bloc: elem_sbl.id_bloc
            }
            // Load Bloc Parcelle
            this.loadParceBloc(id_bloc);
            if (ind == (code_bl.length - 1)) {
              this.isParcelleLoaded.next(false);
            }
          });
        } else console.log("======Parcelle Bloc Not loaded=====");
      });
    }
  }*/

  loadParceBloc(data: any) {
    let data_bloc_parce: bloc_Parcelle[] = [];

    this.api.getBlocParcelle(data).subscribe(res_bloc => {
      console.log(res_bloc);
      data_bloc_parce = res_bloc;
      if (data_bloc_parce.length > 0) {
        data_bloc_parce.forEach((elem_blparc, i) => {
          const insert = `INSERT OR IGNORE INTO bloc_parce(code_parce, id_bloc, id_benef, ref_gps, lat, log, superficie, id_fkt, anne_adheran, status) 
                          VALUES ("${elem_blparc.code_parce}","${elem_blparc.id_bloc}", "${elem_blparc.id_benef}", "${elem_blparc.ref_gps}", ${elem_blparc.lat}, ${elem_blparc.log}, ${elem_blparc.superficie}, "${elem_blparc.id_fkt}", ${elem_blparc.anne_adheran}, "${elem_blparc.status}");`;
          this.insertData(insert);
          if (i == (data_bloc_parce.length - 1)) {
            console.log("==Fin du boucle assoc_parce==");
            this.select("bloc_parce", data_bloc_parce);
          }
        });
      }
    });
  }

  /**
   * IMPORTED EQUIPE
   */
  loadEquipe(data) {
    let data_equipe: Equipe[];
    let data_equipe_pr: ProjetEquipe[];
    // Insert Projet

    this.api.getProjetEquipe(data).subscribe((res: ProjetEquipe[]) => {  
      console.log("***********Import Data Service::: PROJET EQUIPE********");
      console.log(res);
      data_equipe_pr = res;
      if (data_equipe_pr.length > 0) {
        data_equipe_pr.forEach((elem, i) => {
          console.log(elem);
          let id_equipe = {
            code_equipe: elem.id_equipe
          }
          /**
           * Inserer Equipe table
           */
          this.api.getEquipe(id_equipe).subscribe((res: Equipe[]) => {  
            console.log("************************Import Data Service::: EQUIPE....");
            console.log(res);
            data_equipe = res;
            data_equipe.forEach((elem_equipe, i) => {
      
              const insert_eq = `INSERT OR IGNORE INTO equipe(code_equipe, img, matricule, nom, prenom, sexe, dt_nais, cin, dt_delivrance, lieu_delivrance, img_cin, email, num_perso, num_float, id_fonct, intitule_fct, statuts) 
                                  VALUES (${elem_equipe.code_equipe},"${elem_equipe.img}", "${elem_equipe.matricule}", "${elem_equipe.nom}","${elem_equipe.prenom}","${elem_equipe.sexe}", strftime('%Y-%m-%d','${elem_equipe.dt_nais}'), ${elem_equipe.cin}, strftime('%Y-%m-%d','${elem_equipe.dt_delivrance}'), "${elem_equipe.lieu_delivrance}", "${elem_equipe.img_cin}", "${elem_equipe.email}", "${elem_equipe.num_perso}", "${elem_equipe.num_float}", ${elem_equipe.id_fonct}, "${elem_equipe.intitule_fct}", "${elem_equipe.statuts}");`;
              
              console.log(elem_equipe);
              this.insertData(insert_eq);
      
              if (i == (data_equipe.length - 1)) {
                console.log("==Fin du boucle Equipe==");
                const insert = `INSERT OR IGNORE INTO projet_equipe(code, id_projet, id_equipe, id_volet, status_pe) 
                                VALUES (${elem.code},"${elem.id_projet}",${elem.id_equipe}, ${elem.id_volet},"${elem.status_pe}");`;
      
                console.log(elem);
                this.insertData(insert);
                this.select("equipe", data_equipe);
                //this.isEquipeLoaded.next(true);
              }
            });
          });

          /**
           * Inserte Table ProjetEquipe
           */

          if (i == (data_equipe_pr.length - 1)) {
            console.log("==Fin du boucle Equipe==");
            this.select("projet_equipe", data_equipe_pr);
            //this.isEquipeLoaded.next(true);
          }
        });
      }
    });
    //return this.isEquipeLoaded.asObservable();
  }

    /**
   * IMPORTED PROJET EQUIPE BY TECHINICIEN
   */
  loadProjetEquipe(data) {
    if (this.isProjImported.value) {
      let data_equipe_pr: ProjetEquipe[];
      // Insert Projet
      this.api.getProjetEquipe(data).subscribe((res: ProjetEquipe[]) => {  
        console.log("************************Import Data Service::: PROJET EQUIPE....");
        console.log(res);
        data_equipe_pr = res;
        if (data_equipe_pr.length > 0) {
          data_equipe_pr.forEach((elem, i) => {
            console.log(elem);
            const insert = `INSERT OR IGNORE INTO projet_equipe(code, id_projet, id_equipe, id_volet, status_pe) 
                            VALUES (${elem.code},"${elem.id_projet}",${elem.id_equipe}, ${elem.id_volet},"${elem.status_pe}");`;

            console.log(elem);
            this.insertData(insert);

            if (i == (data_equipe_pr.length - 1)) {
              console.log("==Fin du boucle PROJET EQUIPE==");
              this.select("projet_equipe", data_equipe_pr);
              //this.isEquipeLoaded.next(true);
            }
          });
        }
      });
    }
    //return this.isEquipeLoaded.asObservable();
  }
}
