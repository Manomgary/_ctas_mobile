import { Injectable } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
//import { createSchema, twoUsers, projets, quartier } from 'src/app/utils/no-encryption-utils';
import { createSchema, projet, data_projet,
        fonction, data_fonct,
        volet, data_volet,
        activite_projet, data_activ_projet,
        volet_projet, data_volet_projet,
        region, data_region,
        district, data_district,
        commune, data_commune,
        fokontany, data_fkt
        } from '../utils/ctas-db-component';
import { Storage } from '@capacitor/storage';
import { HttpClient } from '@angular/common/http';
import { JsonSQLite } from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs';
import { DB_NAME_KEY, DB_NAME } from '../utils/global-variables';


const DB_RUN_KEY = 'first_db_setup';
 
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  dbReady = new BehaviorSubject(false);
  dbName: string = '';
  count = 0;
  
  constructor(private http: HttpClient, private _sqlite: SqliteService) { }

  async init(): Promise<void> {
    console.log("%%%% in TestencryptionPage this._sqlite %%%%" + this._sqlite)
    try {
      await this.runTest();
      console.log("$$$ runTest was successful");
    } catch (err) {
      console.log(`$$$ runTest failed ${err.message}`);
    }
  }

  async runTest(): Promise<void> {
    const dbRunDone = await Storage.get({ key: DB_RUN_KEY });

    if (!dbRunDone.value) {
      console.log(":::Première Synchronisation de la bdd ===>");
      this.SyncInit();
      //this.DownloadDbJson();
    } else {
      console.log("::: Base de donnnées déjà Synchroniser ===>");
      
      this.dbName = (await Storage.get({ key: DB_NAME_KEY })).value;
      // initialize the connection
      let db = await this._sqlite.createConnection(this.dbName, false, "no-encryption", 1);

      let bdd = await this._sqlite.isDatabase(this.dbName);
      if(bdd.result) console.log(".:::: bdd existe déjà :::");
      else console.log("::::: bdd n'existe pas !!!");

      // open db testEncryption
      await db.open();
      console.log(`::::runTest open db ctas-db success:::`);
      this.dbReady.next(true);
    }
  }

   // Synchroniser bdd
   private async SyncInit() {
    try {
      /**
      *  stocker le nom de la base de données dans Capacitor Storage!!!
      */
      await Storage.set({ key: DB_NAME_KEY, value: DB_NAME });
      await Storage.set({ key: DB_RUN_KEY, value:  '1'});

      const nameDb = (await Storage.get({ key: DB_NAME_KEY })).value;

      console.log("::::::::Sync Initiale Starage dbName ::::::::::: " + nameDb);

      let result: any = await this._sqlite.echo("Hello World");
      console.log("from Echo::: " + result.value);

      // ************************************************
      // Create Database No Encryption
      // ************************************************

      // initialize the connection
      let db = await this._sqlite.createConnection(DB_NAME, false, "no-encryption", 1);
      // open db testEncryption
      await db.open();
      console.log(`::::runTest open db testEncryption success:::`);

      // create tables in db
      let ret: any = await db.execute(createSchema);
      console.log('$$$ ret.changes.changes in db ' + ret.changes.changes)
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSchema failed"));
      }

      // create synchronization table 
      ret = await db.createSyncTable();
      console.log(`:::execute create synchronization table successs:::`);
      if (ret.changes.length < 0) {
        return Promise.reject(new Error("Execute createSyncTable failed"));
      }
      
      // set the synchronization date
      const syncDate: string = "2022-01-03T08:30:25.000Z";
      await db.setSyncDate(syncDate);

      /************************************************************
       * INSERT DATA
       ************************************************************/

/**     
      // add projet
      projet.forEach(async (elem) => {
        this.count ++;
        await db.execute(elem.req);
        if (projet.length === this.count) {
          console.log(`:::execute add projet in db successs::: ` + projet.length + ':::: ' + this.count);
        }
      });
      // add fonction
      fonction.forEach(async (elem) => {
        await db.execute(elem.req);
        console.log(`:::execute add Fonction in db successs::: ` + fonction.length);
      });
      // add equipe
      equipe.forEach(async (elem) => {
        this.count ++;
        let ret = await db.execute(elem.req);
        console.log(`:::execute add Equipe in db successs::: ` + equipe.length);
      });

      // add Users
      users.forEach(async (elem) => {
        this.count ++;
        await db.execute(elem.req);
        console.log(`:::execute add Equipe in db successs::: ` + users.length);
      });

      // add volet
      volet.forEach(async (elem) => {
        this.count ++;
        await db.execute(elem.req);
        console.log(`:::execute add volet in db successs::: ` + volet.length);
      });

      // add activite 
      activite.forEach(async (elem) => {
        this.count ++;
        await db.execute(elem.req);
        console.log(`:::execute add activite in db successs::: ` + activite.length);
      });

      // add volet projet
      volet_projet.forEach(async (elem) => {
        this.count ++;
        await db.execute(elem.req);
        console.log(`:::execute add volet_projet in db successs::: ` + volet_projet.length);
      });
      

      // add activite projet
      activite_projet.forEach(async (elem) => {
        this.count ++;
        await db.execute(elem.req);
        console.log(`:::execute add activite_projet in db successs::: ` + activite_projet.length);
      });

      // add region
      region.forEach(async (elem) => {
        this.count ++;
        await db.execute(elem.req);
        console.log(`:::execute add Region in db successs::: ` + region.length);
      });

      // add district
      district.forEach(async (elem) => {
        this.count ++;
        await db.execute(elem.req);
        console.log(`:::execute add District in db successs::: ` + district.length);
      });

      // add commune
      commune.forEach(async (elem) => {
        this.count ++;
        await db.execute(elem.req);
        console.log(`:::execute add Commune in db successs::: ` + commune.length);
      });

      // add fokontany
      fokontany.forEach(async (elem) => {
        this.count ++;
        await db.execute(elem.req);
        console.log(`:::execute add Fokontany in db successs::: ` + fokontany.length);
      });

      // select all projet in db
      ret = await db.query("SELECT * FROM projet;");
      console.log(`:::execute select all projet in db successs::: ` + ret.values.length + " ::: " + ret.values);
      if(ret.values.length !== data_projet.length) {
        return Promise.reject(new Error("Query Projet failed"));
      }

      ret = await db.query("SELECT * FROM fonction;");
      console.log(ret.values);
      if(ret.values.length !== data_fonct.length) {
        return Promise.reject(new Error("Query Fonction failed"));
      }

      ret = await db.query("SELECT * FROM equipe;");
      console.log(ret.values);
      console.log(`:::execute select Equipe in db successs::: ` + ret.values.length + " ::: " + ret.values);
      if(ret.values.length !== data_equipe.length) {
        return Promise.reject(new Error("Query Equipe failed"));
      }

      ret = await db.query("SELECT date(dt_nais), date(dt_delivrance)  FROM equipe;");
      console.log(ret.values);
      console.log(`:::execute select Equipe in db successs::: ` + ret.values.length + " ::: " + ret.values);
      if(ret.values.length !== data_equipe.length) {
        return Promise.reject(new Error("Query Equipe date_naissance, date delivrance failed"));
      }

      ret = await db.query("SELECT * FROM utilisateurs;");
      console.log(`:::execute select all utilisateurs in db successs::: ` + ret.values.length + " ::: " + ret.values);
      if(ret.values.length !== data_Users.length) {
        return Promise.reject(new Error("Query utilisateurs failed"));
      }

      ret = await db.query("SELECT * FROM volet;");
      console.log(`:::execute select all volet in db successs::: ` + ret.values.length + " ::: " + ret.values);
      if(ret.values.length !== data_volet.length) {
        return Promise.reject(new Error("Query volet failed"));
      }

      ret = await db.query("SELECT * FROM activite;");
      console.log(`:::execute select all activite in db successs::: ` + ret.values.length + " ::: " + ret.values);
      if(ret.values.length !== data_activite.length) {
        return Promise.reject(new Error("Query activite failed"));
      }

      ret = await db.query("SELECT * FROM participe_proj_activ;");
      console.log(`:::execute select all participe_proj_activ in db successs::: ` + ret.values.length + " ::: " + ret.values);
      if(ret.values.length !== data_activ_projet.length) {
        return Promise.reject(new Error("Query projet_activité failed"));
      }

      ret = await db.query("SELECT * FROM participe_proj_volet;");
      console.log(`:::execute select all participe_proj_volet in db successs::: ` + ret.values.length + " ::: " + ret.values);
      if(ret.values.length !== data_volet_projet.length) {
        return Promise.reject(new Error("Query projet_activité failed"));
      }

      ret = await db.query("SELECT * FROM zone_region;");
      console.log(`:::execute select all zone_region in db successs::: ` + ret.values.length + " ::: " + ret.values);
      if(ret.values.length !== data_region.length) {
        return Promise.reject(new Error("Query zone_region failed"));
      }

      ret = await db.query("SELECT * FROM zone_district;");
      console.log(`:::execute select all zone_district in db successs::: ` + ret.values.length + " ::: " + ret.values);
      if(ret.values.length !== data_district.length) {
        return Promise.reject(new Error("Query zone_district failed"));
      }

      ret = await db.query("SELECT * FROM zone_commune;");
      console.log(`:::execute select all zone_commune in db successs::: ` + ret.values.length + " ::: " + ret.values);
      if(ret.values.length !== data_commune.length) {
        return Promise.reject(new Error("Query zone_commune failed"));
      }

      ret = await db.query("SELECT * FROM zone_fonkotany;");
      console.log(`:::execute select all zone_fonkotany in db successs::: ` + ret.values.length + " ::: " + ret.values);
      if(ret.values.length !== data_fkt.length) {
        return Promise.reject(new Error("Query zone_fonkotany failed"));
      } */

      this.dbReady.next(true);

    } catch (err) {
      return Promise.reject(err);
    }
  }

  // Download from json
  private DownloadDbJson(update = false) {
    this.http.get('https://devdactic.fra1.digitaloceanspaces.com/tutorial/db.json').subscribe(async (jsonExport: JsonSQLite) => {
      const jsonstring = JSON.stringify(jsonExport);
      const isValid = await this._sqlite.isJsonValid(jsonstring);

      if (isValid.result) {
        this.dbName = jsonExport.database;
        await Storage.set({ key: DB_NAME_KEY, value: DB_NAME });
        const importJS = await this._sqlite.importFromJson(jsonstring);
        console.log("::: import from JSON ==> " + importJS.changes.changes);
        await Storage.set({ key: DB_RUN_KEY, value: '1' });
        let db = await this._sqlite.createConnection(DB_NAME, false, "full", 1);
        await db.open();

        if (!update) {
          await db.createSyncTable();
          console.log("::: Create Sync table Success full!!!!");
        } else {
          // set the synchronization date
          const syncDate: string = "2022-01-03T08:30:25.000Z";
          await db.setSyncDate(syncDate);
        }
        // select all users in db
        let ret = await db.query("SELECT * FROM vendors;");
        console.log(`:::execute select all users in db successs::: ` + ret.values);
        console.log(`:::execute select all users in db successs::: ` + ret.values.length);
      }

    });
  }
 
}
