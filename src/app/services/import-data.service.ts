import { AfterViewChecked, AfterViewInit, Injectable, OnDestroy, OnInit } from '@angular/core';

//Imports
import { SqliteService } from './sqlite.service';
import { DB_NAME } from '../utils/global-variables';
import { DatabaseService } from './database.service';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { ApiService } from './api.service';
import { Activite, Animation_ve, AnneeAgricole, AssociationParceSaison, Benef_Bloc, Benef_PR_Bloc, Benef_RP, Bloc, bloc_Parcelle, Catego_espece, Cep_pr, Collaborateur, Collaborateur_activ, Commune, Culture_pms, District, Equipe, Espece, Fonkotany, MepPR, Mep_bloc, Parcelle, Parcelle_Association, Parcelle_bl, 
        Participe_proj_activ, Participe_proj_volet, Projet, ProjetEquipe, ProjetEquipeVolet, Region, Saison, Specu_anime, suiviMepPR, Suivi_bloc, Suivi_pms, Utilisateurs, Variette, Volet } from '../utils/interface-bd';
import { BehaviorSubject } from 'rxjs';
import { Console } from 'console';

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
        this.loadAnneeAgricole();
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
  async insertDataSet(data: any) {
    return await this.db.query(data.state_, data.data_);
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

  loadAnneeAgricole() {
    let data_annee: AnneeAgricole[] = [];
    this.api.getAnneeAgricole().subscribe(res_annee => {
      data_annee = res_annee;
      if (data_annee.length > 0) {
        data_annee.forEach((elem_annee, ind_annee) => {
          let value = [elem_annee.code, elem_annee.annee_du, elem_annee.annee_au, elem_annee.statut];
          let state_add_mep = `INSERT INTO annee_agricole(code, annee_du, annee_au, statut) 
                              VALUES (?, ?, ?, ?)`;
          let req = {
            state_: state_add_mep, 
            data_: value
          }
          this.insertDataSet(req);
        });
      }
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
          const insert = `INSERT OR IGNORE INTO espece(code_espece, nom_espece, id_categ, saisonnier, unite) 
                          VALUES ("${elem.code_espece}","${elem.nom_espece}", ${elem.id_categ}, ${elem.saisonnier}, ${elem.unite != null? `"${elem.unite}"`:null});`;
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
          const insert = `INSERT OR IGNORE INTO variette(code_var, nom_var, id_espece) 
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
            const insert = `INSERT OR IGNORE INTO projet(numero, code_proj, nom, description, ancronyme, logo, statuts) 
                            VALUES (${elem.numero}, "${elem.code_proj}","${elem.nom}", ${elem.description != null?`"${elem.description}"`:null}, "${elem.ancronyme}", ${elem.logo != null? `'${elem.logo}'`:null},"${elem.statuts}");`;
            console.log(elem);
            this.insertData(insert);

            if (i == (data_projet.length - 1)) {
              console.log("==Fin du boucle projet==");
              this.isProjImported.next(true);
              this.select("projet", data_projet);

              this.isActiviteLoaded.subscribe(isLoaded => {
                if (isLoaded) {
                  this.loadProjetVolet(id_projet);
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

  // load  Projet  Volet
  loadProjetVolet(data: any) {
    let data_projet_volet: Participe_proj_volet[] = [];
    this.api.getProjetVolet(data).subscribe(res => {
      data_projet_volet = res;
      if (data_projet_volet.length > 0) {
        data_projet_volet.forEach((item, ind) => {
          const insert = `INSERT OR IGNORE INTO participe_proj_volet(code, id_projet, id_volet, id_chef, statuts) 
                        VALUES(${item.code}, "${item.id_projet}", ${item.id_volet}, ${item.id_chef}, "${item.statuts}")`;
          this.insertData(insert);
          if ((data_projet_volet.length - 1) === ind) {
            this.select('participe_proj_volet', data_projet_volet);
            /***************************
             * Load All Activité By volet
             ****************************/ 

          }
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
        const insert = `INSERT OR IGNORE INTO activite(code_act, intitule, description, id_volet) 
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
          const insert = `INSERT OR IGNORE INTO participe_proj_activ(id_proj, id_activ, statuts) 
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
          } else if (intitule.toUpperCase() === 'BLOC') {
            console.log("============ ACTIVITE BLOC +++++ " + data_equipe_pr.id_projet);
            let data_bl_benef = {
              id_projet: data_equipe_pr.id_projet,
              code_act: elem.id_activ
            }
            this.loadBloc(data_equipe_pr, data_bl_benef);
            //this.loadBenefBloc(data_bl_benef);
          } else if (intitule.toUpperCase() === 'PR') {
            console.log("============ ACTIVITE Paysant Relais +++++ " + data_equipe_pr.id_projet);
            let data_pr = {
              id_projet: data_equipe_pr.id_projet,
              code_activ: elem.id_activ,
              id_equipe: data_equipe_pr.id_equipe
            }
            this.loadBenefPRBloc(data_pr);
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
        const insert = `INSERT OR IGNORE INTO collaborateur(code_col, nom, description, ancronyme) 
                        VALUES("${elem.code_col}", "${elem.nom}", ${elem.description != null?`"${elem.description}"`:null}, ${elem.ancronyme != null?`"${elem.ancronyme}"`:null});`;
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
    let data_bloc: Bloc[];
    let code_bloc: any[] = [];
    this.isProjImported.subscribe(isReady => {
      if (isReady) {
        this.api.getBloc(id_pr_equipe).subscribe((data: Bloc[]) => {
          console.log("Import Data Service::: BLOC....");
          data_bloc = data;
    
          if (data_bloc.length > 0) {
            data_bloc.forEach((elem, i) => {
              const insert = `INSERT OR IGNORE INTO bloc(ordre, code_bloc, nom, ancronyme, id_prjt, id_tech, status) 
                              VALUES (${elem.ordre}, "${elem.code_bloc}", "${elem.nom_bloc}", "${elem.ancronyme}", "${elem.code_proj}", ${elem.id_tech}, "${elem.status}");`;
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
          const insert = `INSERT OR IGNORE INTO association(numero, code_ass, nom, ancronyme, id_prjt, id_tech, id_fkt, status) 
                          VALUES (${elem.numero}, "${elem.code_ass}","${elem.nom_ass}", "${elem.ancronyme}", "${elem.code_proj}", ${elem.id_tech}, "${elem.code_fkt}","${elem.status}");`;
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
    let data_benef: Benef_RP[];
    // Insert Projet
    this.api.getBenefRp(data).subscribe((res: Benef_RP[]) => {  
      console.log("************************Load Data BENEFICIAIRE PMS....");
      console.log(res);
      data_benef = res;
      if (data_benef.length > 0) {
        data_benef.forEach((elem, i) => {
          const insert = `INSERT OR IGNORE INTO beneficiaire(code_benef, img_benef, nom, prenom, sexe, dt_nais, dt_nais_vers, surnom, cin, dt_delivrance, lieu_delivrance, img_cin, contact, id_fkt, id_commune, village, dt_Insert, etat, statut) 
                          VALUES ("${elem.code_benef}", ${elem.img_benef != null? `"${elem.img_benef}"`: null},"${elem.nom}", ${elem.prenom != null? `"${elem.prenom}"`:null}, "${elem.sexe}", ${elem.dt_nais != null? `"${elem.dt_nais}"` : null}, ${elem.dt_nais_vers != null? `"${elem.dt_nais_vers}"` : null}, ${elem.surnom != null?`"${elem.surnom}"`:null}, ${elem.cin}, ${elem.dt_delivrance != null?`"${elem.dt_delivrance}"`:null}, 
                          "${elem.lieu_delivrance}", ${elem.img_cin != null?`"${elem.img_cin}"`:null}, "${elem.contact}", ${elem.id_fkt != null? `"${elem.id_fkt}"`:null}, ${elem.id_commune != null? `"${elem.id_commune}"`:null}, ${elem.village != null? `"${elem.village}"`:null}, "${elem.dt_Insert}", "${elem.etat_benef}", "${elem.status_benef}");`;
          console.log(elem);
          this.insertData(insert);
          if (i == (data_benef.length - 1)) {
            console.log("==Fin du boucle beneficiaire PMS==");
            this.select("beneficiaire", data_benef);

            data_benef.forEach((item, index) => {
              const insert_pms = `INSERT OR IGNORE INTO benef_activ_pms(code_benef_pms, code_achat, id_proj, id_activ, id_benef, id_association, id_collaborateur, etat, status) 
                                  VALUES ("${item.code_benef_pms}", ${item.code_achat != null?`"${item.code_achat}"`:null}, "${item.id_proj}", ${item.id_activ}, "${item.id_benef}", "${item.id_association}", "${item.id_collaborateur}", "${item.etat_pms}", "${item.status_pms}");`;
              this.insertData(insert_pms);  
              
              if (index == (data_benef.length - 1)) {
                console.log("==Fin du boucle definitive BENEFICIAIRE ACTIVITE PMS==");
                this.select("benef_activ_pms", data_benef);
                // Inserer parcelle beneficiaire par association
                this.loadParcAssoc(data);
              }
            })

          }
        });
      } else console.log("Aucune beneficiaire PMS disponible pour le projet ", data.id_projet);
    });
  }
  loadBenefBloc(data: any) {
    let data_benef: Benef_Bloc[] = [];
    // Insert Projet
    this.api.getBenefBloc(data).subscribe((res: any[]) => {  
      console.log("************************Load Data BENEFICIAIRE BLOC....");
      console.log(res);
      if (res.length > 0) {
        res.forEach((element: Benef_Bloc[], i) => {
          console.log(element);
          data_benef = element;
          if (data_benef.length > 0) {
            data_benef.forEach((elem, i) => {
              const insert = `INSERT OR IGNORE INTO beneficiaire(code_benef, img_benef, nom, prenom, sexe, dt_nais, dt_nais_vers, surnom, cin, dt_delivrance, lieu_delivrance, img_cin, contact, id_fkt, id_commune, village, dt_Insert, etat, statut) 
                      VALUES ("${elem.code_benef}", ${elem.img_benef != null? `"${elem.img_benef}"`: null},"${elem.nom}", ${elem.prenom != null? `"${elem.prenom}"`:null}, "${elem.sexe}", ${elem.dt_nais != null? `"${elem.dt_nais}"` : null}, ${elem.dt_nais_vers != null? `"${elem.dt_nais_vers}"` : null}, ${elem.surnom != null?`"${elem.surnom}"`:null}, ${elem.cin}, ${elem.dt_delivrance != null?`"${elem.dt_delivrance}"`:null}, 
                      "${elem.lieu_delivrance}", ${elem.img_cin != null?`"${elem.img_cin}"`:null}, "${elem.contact}", ${elem.id_fkt != null? `"${elem.id_fkt}"`:null}, ${elem.id_commune != null? `"${elem.id_commune}"`:null}, ${elem.village != null? `"${elem.village}"`:null}, "${elem.dt_Insert}", "${elem.etat_benef}", "${elem.status_benef}");`;
              console.log(elem);
              this.insertData(insert);
              if (i == (data_benef.length - 1)) {
                console.log("==Fin du boucle beneficiaire BLOC==");
                this.select("beneficiaire", data_benef);
    
                data_benef.forEach((item, index) => {
                  const insert_bl = `INSERT OR IGNORE INTO benef_activ_bl(code_benef_bl, id_proj, id_activ, id_benef, id_bloc, code_achat, id_collaborateur, etat, status) 
                                      VALUES ("${item.code_benef_bl}", "${item.id_proj}", ${item.id_activ}, "${item.id_benef}", "${item.id_bloc}", ${item.code_achat != null?`"${item.code_achat}"`:null}, "${item.id_collaborateur}", "${item.etat_benef_bloc}", "${item.status_benef_bloc}");`;
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

  loadBenefPRBloc(data: any) {
    this.api.getBenefPRBloc(data).subscribe((benef_pr: Benef_PR_Bloc[]) => {
      if (benef_pr.length > 0) {
        let code_pr: any[] = [];
        benef_pr.forEach((elem_info_bnf, ind) => {
          // Inserer l'information des beneficiaires
          const state_info_benef = `INSERT OR IGNORE INTO beneficiaire(code_benef, img_benef, nom, prenom, sexe, dt_nais, dt_nais_vers, surnom, cin, dt_delivrance, lieu_delivrance, img_cin, contact, id_fkt, id_commune, village, dt_Insert, etat, statut) 
                      VALUES ("${elem_info_bnf.code_benef}", ${elem_info_bnf.img_benef != null? `"${elem_info_bnf.img_benef}"`: null},"${elem_info_bnf.nom}", ${elem_info_bnf.prenom != null? `"${elem_info_bnf.prenom}"`:null}, "${elem_info_bnf.sexe}", ${elem_info_bnf.dt_nais != null? `"${elem_info_bnf.dt_nais}"` : null}, ${elem_info_bnf.dt_nais_vers != null? `"${elem_info_bnf.dt_nais_vers}"` : null}, ${elem_info_bnf.surnom != null?`"${elem_info_bnf.surnom}"`:null}, ${elem_info_bnf.cin}, ${elem_info_bnf.dt_delivrance != null?`"${elem_info_bnf.dt_delivrance}"`:null}, 
                      "${elem_info_bnf.lieu_delivrance}", ${elem_info_bnf.img_cin != null?`"${elem_info_bnf.img_cin}"`:null}, "${elem_info_bnf.contact}", ${elem_info_bnf.id_fkt != null? `"${elem_info_bnf.id_fkt}"`:null}, ${elem_info_bnf.id_commune != null? `"${elem_info_bnf.id_commune}"`:null}, ${elem_info_bnf.village != null? `"${elem_info_bnf.village}"`:null}, "${elem_info_bnf.dt_Insert}", "${elem_info_bnf.etat_benef}", "${elem_info_bnf.statut_benef}");`;

          this.insertData(state_info_benef);
          if ((benef_pr.length - 1) === ind) {
            // Fin du boucle    
            console.log("::::::::::::::::::::::::::::::::");
            console.log("::::Fin du boucle info Beneficiaire PR:::", benef_pr.length);
            console.log("::::::::::::::::::::::::::::::::");
            benef_pr.forEach((elem_bnf_pr, ind_benef_pr) => {
              // Inserer beneficiaire Payant Relais
              const state_activ_pr = `INSERT OR IGNORE INTO benef_activ_pr(code_pr, id_proj, id_activ, id_benef, id_bloc, code_achat, id_collaborateur, id_tech, etat, status)
                        VALUES("${elem_bnf_pr.code_pr}","${elem_bnf_pr.id_proj}", ${elem_bnf_pr.id_activ}, "${elem_bnf_pr.id_benef}", ${elem_bnf_pr.id_bloc != null?`"${elem_bnf_pr.id_bloc}"`:null}, ${elem_bnf_pr.code_achat != null?`"${elem_bnf_pr.code_achat}"`:null}, 
                        "${elem_bnf_pr.id_collaborateur}", ${elem_bnf_pr.id_tech}, "${elem_bnf_pr.etat_activ_pr}", "${elem_bnf_pr.status_activ_pr}");`;
              this.insertData(state_activ_pr);
              code_pr.push(elem_bnf_pr.code_pr);
              if ((benef_pr.length - 1) === ind_benef_pr)  {
                console.log("::::::::::::::::::::::::::::::::");
                console.log("::::!!Fin du boucle Beneficiaire PR!!:::", benef_pr.length);
                console.log("::::::::::::::::::::::::::::::::");
                let id_pr = {
                  code_pr: code_pr,
                  data_pr: data
                }
                this.loadAnimationVe(data);
                this.loadParcellePRBenef(id_pr);
                //this.loadMepPR(data);
                this.select("benef_activ_pr", benef_pr);
              }
            });
          }
        });
      }
    });
  }

  loadParcellePRBenef(data: any) {
    this.api.getParcePRBloc(data).subscribe((res: any[]) => {
      if (res.length > 0) {
        res.forEach((cep_benef: Cep_pr[], ind_res) => {
          cep_benef.forEach((elem_cep, ind_cep) => {
            const state_add_cep = `INSERT OR IGNORE INTO cep_parce(code_parce, id_bloc, id_benef, ref_gps, lat, log, superficie, id_commune, id_fkt, village, anne_adheran, etat, status)
                          VALUES("${elem_cep.code_parce}", ${elem_cep.id_bloc != null? `"${elem_cep.id_bloc}"`:null}, "${elem_cep.id_benef}", ${elem_cep.ref_gps != null?`"${elem_cep.ref_gps}"`:null}, ${elem_cep.lat}, ${elem_cep.log}, ${elem_cep.superficie}, 
                          ${elem_cep.id_commune != null? `"${elem_cep.id_commune}"`:null}, ${elem_cep.id_fkt != null? `"${elem_cep.id_fkt}"`:null}, ${elem_cep.village != null? `"${elem_cep.village}"`:null}, ${elem_cep.anne_adheran}, "${elem_cep.etat}", "${elem_cep.status}");`;
            this.insertData(state_add_cep);
            if ((cep_benef.length - 1 ) === ind_cep) {
              // Fin du boucle
              if ((res.length - 1) === ind_res) {
                //this.loadMepPR(data.data_pr);
              }
            }
          });
          if ((res.length - 1) === ind_res) {
            this.loadMepPR(data.data_pr);
          }
        });
      }
    });
  }
  // Mep PR
  loadMepPR(data: any) {
    this.api.getMepPR(data).subscribe((res: MepPR[]) => {
      let data_elem: any[] = [];
      if (res.length > 0) {
        res.forEach((elem_mep, ind_mep) => {
          data_elem.push({
            code_mep: elem_mep.code_culture
          });
          let value = [elem_mep.code_culture, elem_mep.id_parce, elem_mep.id_espece, elem_mep.id_var, elem_mep.id_saison, elem_mep.annee_du, elem_mep.ddp, elem_mep.qso, elem_mep.dt_distribution, elem_mep.dds, elem_mep.sfce, elem_mep.nbre_ligne, elem_mep.long_ligne, elem_mep.usage, elem_mep.sc, elem_mep.ea_autres, elem_mep.ea_id_variette, elem_mep.dt_creation, elem_mep.dt_modification, elem_mep.status, elem_mep.etat, elem_mep.id_equipe, elem_mep.type];
          let state_add_mep = `INSERT INTO culture_pr(code_culture, id_parce, id_espece, id_var, id_saison, annee_du, ddp, qso, dt_distribution, dds, sfce, nbre_ligne, long_ligne, usage, sc, ea_autres, ea_id_variette, dt_creation, dt_modification, status, etat, id_equipe, type) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          let req = {
            state_: state_add_mep, 
            data_: value
          }
          this.insertDataSet(req);
          if ((res.length - 1) === ind_mep) {
            // load suivi MEP PR
            let code_culture = {
              code_mep: data_elem
            }
            this.loadSuiviPR(code_culture);
          }
        });
      }
    });
  }
  // load Suivi MEP PR
  loadSuiviPR(data: any) {
    this.api.getSuiviMepPR(data).subscribe((res_suivi: any[]) => {
      if (res_suivi.length > 0) {
        res_suivi.forEach((suivi: suiviMepPR[], ind_suivi) => {
          suivi.forEach(elem_suivi => {
            let value = [elem_suivi.code_sv, elem_suivi.id_culture, elem_suivi.ddp, elem_suivi.stc, elem_suivi.ql, elem_suivi.qr, elem_suivi.long_ligne, elem_suivi.nbre_ligne, elem_suivi.nbre_pied, elem_suivi.hauteur, elem_suivi.ec, elem_suivi.img_cult, elem_suivi.dt_capture, elem_suivi.ex, elem_suivi.dt_creation, elem_suivi.dt_modification, elem_suivi.etat];
            let state_add_suivi = `INSERT INTO suivi_pr(code_sv, id_culture, ddp, stc, ql, qr, long_ligne, nbre_ligne, nbre_pied, hauteur, ec, img_cult, dt_capture, ex, dt_creation, dt_modification, etat) 
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            let req = {
              state_: state_add_suivi, 
              data_: value
            }
            this.insertDataSet(req);
          });
        });
      }
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
          const insert = `INSERT OR IGNORE INTO assoc_parce(code_parce, id_assoc, id_benef, ref_gps, lat, log, superficie, id_fkt, id_commune, village, anne_adheran, indication, etat, status) 
                            VALUES ("${elem.code_parce}","${elem.id_assoc}", "${elem.id_benef}", ${elem.ref_gps != null ? `"${elem.ref_gps}"`:null}, ${elem.lat}, ${elem.log}, ${elem.superficie}, ${elem.id_fkt != null?`"${elem.id_fkt}"`:null}, ${elem.id_commune != null ? `"${elem.id_commune}"`:null}, ${elem.village != null ? `"${elem.village}"`:null}, ${elem.anne_adheran}, ${elem.indication != null?`"${elem.indication}"`:null}, "${elem.etat}", "${elem.status}");`;
          console.log(elem);
          this.insertData(insert);
          if (i == (data_assoc_parce.length - 1)) {
            console.log("==Fin du boucle assoc_parce==");
            this.select("assoc_parce", data_assoc_parce);
            this.loadAssocitionParceSaison(data);
            //this.loadCultureAssoc(data);
          }
        });
      } else console.log("***Aucune assoc_parce disponible pour l'association de ::", data.code_ass);
    });
  }
  loadAssocitionParceSaison(data: any) {
    let data_parce_assocSaison: AssociationParceSaison[] = [];
    this.api.getParcelleSaisonPms(data).subscribe(res_parce_saison => {
      data_parce_assocSaison = res_parce_saison;
      if (data_parce_assocSaison.length > 0) {
        data_parce_assocSaison.forEach((elem_saison_parce, ind_saison) => {
          let value = [elem_saison_parce.code, elem_saison_parce.id_annee, elem_saison_parce.id_saison, elem_saison_parce.id_parce, elem_saison_parce.ref_gps, elem_saison_parce.lat, elem_saison_parce.log, elem_saison_parce.id_pms, elem_saison_parce.id_var, elem_saison_parce.objectif, elem_saison_parce.etat, elem_saison_parce.commentaire];
          let state_add_mep = `INSERT OR IGNORE INTO assoc_parce_saison(code, id_annee, id_saison, id_parce, ref_gps, lat, log, id_pms, id_var, objectif, etat, commentaire) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          let req = {
            state_: state_add_mep, 
            data_: value
          }
          this.insertDataSet(req);
          if ((data_parce_assocSaison.length - 1) === ind_saison) {
            this.loadCultureAssoc(data);
          }
        });
      } else this.loadCultureAssoc(data);
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
          const insert = `INSERT OR IGNORE INTO cultures_pms(code_culture, id_parce, id_var, id_saison, id_annee, ddp, qsa, img_fact, dds, sfce, sc, ea_id_variette, ea_autres, dt_creation, dt_modification, statuts, Etat)
                          VALUES ("${elem.code_culture}", "${elem.id_parce}", "${elem.id_var}", "${elem.id_saison}", ${elem.id_annee}, "${elem.ddp}", ${elem.qsa}, ${elem.img_fact != null? `"${elem.img_fact}"`: null}, "${elem.dds}", ${elem.sfce}, "${elem.sc}", ${elem.ea_id_variette != null? `"${elem.ea_id_variette}"`:null}, ${elem.ea_autres != null?`"${elem.ea_autres}"`: null}, "${elem.dt_creation}", "${elem.dt_modification}", "${elem.statuts}", "${elem.Etat}");`;
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
            const insert = `INSERT INTO suivi_pms(id, id_culture, ddp, stc, ec, pb, ex, img_cult, name, controle, declaration, etat)
                            VALUES ("${elem_suivi.id}", "${elem_suivi.id_culture}", "${elem_suivi.ddp}", "${elem_suivi.stc}", "${elem_suivi.ec}", 
                            ${elem_suivi.pb != null? `"${elem_suivi.pb}"`:null}, ${elem_suivi.ex}, ${elem_suivi.img_cult != null? `"${elem_suivi.img_cult}"`:null}, "${elem_suivi.name}", ${elem_suivi.controle != null? `"${elem_suivi.controle}"`:null}, ${elem_suivi.declaration != null? `"${elem_suivi.declaration}"`:null}, "${elem_suivi.etat}");`;
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
  loadParceBloc(data: any) {
    let data_bloc_parce: bloc_Parcelle[] = [];

    this.api.getBlocParcelle(data).subscribe(res_bloc => {
      console.log(res_bloc);
      data_bloc_parce = res_bloc;
      if (data_bloc_parce.length > 0) {
        data_bloc_parce.forEach((elem_blparc, i) => {
          const insert = `INSERT OR IGNORE INTO bloc_parce(code_parce, id_bloc, id_benef, ref_gps, lat, log, superficie, id_fkt, id_commune, village, anne_adheran, indication, etat, status) 
                          VALUES ("${elem_blparc.code_parce}","${elem_blparc.id_bloc}", "${elem_blparc.id_benef}", "${elem_blparc.ref_gps}", ${elem_blparc.lat}, ${elem_blparc.log}, ${elem_blparc.superficie}, 
                          ${elem_blparc.id_fkt != null?`"${elem_blparc.id_fkt}"`:null}, ${elem_blparc.id_commune != null?`"${elem_blparc.id_commune}"`:null}, ${elem_blparc.village != null?`"${elem_blparc.village}"`:null}, ${elem_blparc.anne_adheran}, ${elem_blparc.indication != null?`"${elem_blparc.indication}"`:null}, "${elem_blparc.etat}", "${elem_blparc.status}");`;
          this.insertData(insert);
          if (i == (data_bloc_parce.length - 1)) {
            console.log("==Fin du boucle assoc_parce==");
            this.select("bloc_parce", data_bloc_parce);

            // load Mep Bloc
            this.loadMepBloc(data);
          }
        });
      }
    });
  }

  loadMepBloc(data: any) {
    let _data_mep_bloc: Mep_bloc[] = [];

    this.api.getMepBloc(data).subscribe(res_mep => {
      console.log(":::Reponse MEP BLOC::::", res_mep);
      _data_mep_bloc = res_mep;
      if (_data_mep_bloc.length > 0) {
        _data_mep_bloc.forEach((elem_mep, i) => {
          const state = `INSERT OR IGNORE INTO culture_bl(code_culture, id_parce, id_espece, id_var, id_saison, annee_du, ddp, qso, dt_distribution, dds, sfce, nbre_ligne, long_ligne, usage, sc, ea_autres, ea_id_variette, dt_creation, dt_modification, status, etat, id_equipe, type) 
                          VALUES ("${elem_mep.code_culture}", "${elem_mep.id_parce}", ${elem_mep.id_espece != null?`"${elem_mep.id_espece}"`:null}, ${elem_mep.id_var != null?`"${elem_mep.id_var}"`:null}, "${elem_mep.id_saison}", "${elem_mep.annee_du}", "${elem_mep.ddp}", ${elem_mep.qso},  ${elem_mep.dt_distribution != null?`"${elem_mep.dt_distribution}"`:null},
                          ${elem_mep.dds != null?`"${elem_mep.dds}"`:null}, ${elem_mep.sfce}, ${elem_mep.nbre_ligne}, ${elem_mep.long_ligne}, ${elem_mep.usage != null?`"${elem_mep.usage}"`:null}, ${elem_mep.sc != null?`"${elem_mep.sc}"`:null}, ${elem_mep.ea_autres != null?`"${elem_mep.ea_autres}"`:null}, ${elem_mep.ea_id_variette != null?`"${elem_mep.ea_id_variette}"`:null}, 
                          "${elem_mep.dt_creation}", "${elem_mep.dt_modification}", "${elem_mep.status}", "${elem_mep.etat}", ${elem_mep.id_equipe}, "${elem_mep.type}");`;
          this.insertData(state);
          if ((_data_mep_bloc.length - 1) === i) {
            console.log("====Fin du boucle MEP Bloc====");
            // load Suivi Mep
            this.loadSuiviMepBloc(data);
          }
        });
      }
    });
  }
  loadSuiviMepBloc(data: any) {
    let data_suivi_bl: Suivi_bloc[] = [];

    this.api.getSuiviBloc(data).subscribe(res_sv => {
      data_suivi_bl = res_sv;
      if (data_suivi_bl.length > 0) {
        data_suivi_bl.forEach((elem_suivi, ind) => {
          const state = `INSERT OR IGNORE INTO suivi_bl(code_sv, id_culture, ddp, stc, ql, qr, long_ligne, nbre_ligne, nbre_pied, hauteur, ec, img_cult, ex, etat) 
                        VALUES ("${elem_suivi.code_sv}", "${elem_suivi.id_culture}", "${elem_suivi.ddp}", ${elem_suivi.stc != null?`"${elem_suivi.stc}"`:null}, ${elem_suivi.ql}, ${elem_suivi.qr}, 
                        ${elem_suivi.long_ligne}, ${elem_suivi.nbre_ligne}, ${elem_suivi.nbre_pied}, ${elem_suivi.hauteur}, ${elem_suivi.ec != null?`"${elem_suivi.ec}"`:null}, ${elem_suivi.img_cult != null?`"${elem_suivi.img_cult}"`:null}, ${elem_suivi.ex}, "${elem_suivi.etat}");`;
          this.insertData(state);
        });
      }
    });
  }

/**
 * Load data PR
 */
  loadAnimationVe(data: any) {
    let data_animation_pr: Animation_ve[] = [];
    let data_code_anime: any[] = [];
    this.api.getAnimation(data).subscribe(res => {
      console.log("::::::Response Animation VE PR:::::", res);
      data_animation_pr = res;
      if (data_animation_pr.length > 0) {
        data_animation_pr.forEach((item, ind) => {
          const state = `INSERT OR IGNORE INTO animation_ve(code, id_pr, id_fkt, id_commune, village, date_anim, nb_participant, nb_h, nb_f, nb_inf_25, type, img_piece, img_group_particip, id_tech_recenseur, etat, status) 
            VALUES("${item.code}", "${item.id_pr}", ${item.id_fkt !=null?`"${item.id_fkt}"`:null}, ${item.id_commune !=null?`"${item.id_commune}"`:null}, ${item.village !=null?`"${item.village}"`:null}, "${item.date_anim}", ${item.nb_participant}, ${item.nb_h}, ${item.nb_f}, ${item.nb_inf_25},
            "${item.type}", ${item.img_piece! != null?`"${item.img_piece}"`:null}, ${item.img_group_particip! != null?`"${item.img_group_particip}"`:null}, ${item.id_tech_recenseur}, "${item.etat}", "${item.status}");`;
          this.insertData(state);
          data_code_anime.push(item.code);
          if ((data_animation_pr.length - 1) === ind) {
            this.select('animation_ve',  data_animation_pr);
            /**
             * Import speculation Animatin VE
             */
            let data_id_anime = {
              code_animation: data_code_anime
            }
            this.loadSpecuAnime(data_id_anime);
          }
        });
      }
    });
  }
  loadSpecuAnime(data: any) {
    this.api.getSpecuAnime(data).subscribe((res: any[])  => {
      if (res.length > 0) {
        res.forEach((data_specu: Specu_anime[]) => {
          if (data_specu.length > 0) {
            data_specu.forEach(elem => {
              const state = `INSERT OR IGNORE INTO animation_ve_specu(code_specu, id_anime_ve, id_var, id_espece, quantite, etat, status) 
                          VALUES(${elem.code_specu}, "${elem.id_anime_ve}", ${elem.id_var != null ?`"${elem.id_var}"`: null}, ${elem.id_espece != null ?`"${elem.id_espece}"`: null}, ${elem.quantite}, "${elem.etat}", "${elem.status}");`;
              this.insertData(state);
            });
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
    let  data_code_equipe_pr: any[] = [];
    // Insert Projet

    this.api.getProjetEquipe(data).subscribe((res: ProjetEquipe[]) => {  
      console.log("***********Import Data Service::: PROJET EQUIPE********");
      console.log(res);
      data_equipe_pr = res;
      if (data_equipe_pr.length > 0) {
        data_equipe_pr.forEach((elem, ind) => {
          console.log(elem);
          let id_equipe = {
            code_equipe: elem.id_equipe
          }
          data_code_equipe_pr.push({
            id_projet: data.id_projet,
            code_equipe: elem.id_equipe
          });
          /**
           * Inserer Equipe table
           */
          this.api.getEquipe(id_equipe).subscribe((res: Equipe[]) => {  
            console.log("************************Import Data Service::: EQUIPE....");
            console.log(res);
            data_equipe = res;
            if  (data_equipe.length > 0) {
              data_equipe.forEach((elem_equipe, i) => {
      
                const insert_eq = `INSERT OR IGNORE INTO equipe(code_equipe, img, matricule, nom, prenom, sexe, dt_nais, cin, dt_delivrance, lieu_delivrance, img_cin, email, num_perso, num_float, id_fonct, intitule_fct, statuts) 
                                    VALUES (${elem_equipe.code_equipe},"${elem_equipe.img}", "${elem_equipe.matricule}", "${elem_equipe.nom}","${elem_equipe.prenom}","${elem_equipe.sexe}", strftime('%Y-%m-%d','${elem_equipe.dt_nais}'), ${elem_equipe.cin}, strftime('%Y-%m-%d','${elem_equipe.dt_delivrance}'), "${elem_equipe.lieu_delivrance}", "${elem_equipe.img_cin}", "${elem_equipe.email}", "${elem_equipe.num_perso}", "${elem_equipe.num_float}", ${elem_equipe.id_fonct}, "${elem_equipe.intitule_fct}", "${elem_equipe.statuts}");`;
                
                console.log(elem_equipe);
                this.insertData(insert_eq);
        
                if (i == (data_equipe.length - 1)) {
                  console.log("==Fin du boucle Equipe=="); 
                
                  const insert = `INSERT OR IGNORE INTO projet_equipe(code, id_projet, id_equipe, status_pe) 
                                  VALUES (${elem.code},"${elem.id_projet}",${elem.id_equipe}, "${elem.status_pe}");`;
        
                  console.log(elem);
                  this.insertData(insert);
                }
              });
            }
            if (ind == (data_equipe_pr.length - 1)) {
              console.log("==Fin du boucle Equipe==");
              this.select("projet_equipe", data_equipe_pr);
              this.loadProjetEquipeVolet(data_code_equipe_pr);
            }
          });
        });
      }
    });
  }

  loadProjetEquipeVolet(data: any[]) {
    let  data_equipe_volet: ProjetEquipeVolet[] = [];
    data.forEach(item => {
      this.api.getProjetEquipeVolet(item).subscribe(res => {
        data_equipe_volet = res;
        if (data_equipe_volet.length >  0) {
          data_equipe_volet.forEach(elem_equipe_volet => {
            const insert = `INSERT INTO projet_equipe_volet(code, id_projet, id_equipe, id_volet, status_pev) 
                          VALUES (${elem_equipe_volet.code},"${elem_equipe_volet.id_projet}", ${elem_equipe_volet.id_equipe}, ${elem_equipe_volet.id_volet}, "${elem_equipe_volet.status_pev}");`;
  
            this.insertData(insert);
          });
        }
      });
    });
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
            const insert = `INSERT OR IGNORE INTO projet_equipe(code, id_projet, id_equipe, status_pe) 
                            VALUES (${elem.code},"${elem.id_projet}",${elem.id_equipe}, "${elem.status_pe}");`;

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
