import { Injectable } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
//import { createSchema, twoUsers, projets, quartier } from 'src/app/utils/no-encryption-utils';
import { createSchema} from '../utils/ctas-db-component';
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
