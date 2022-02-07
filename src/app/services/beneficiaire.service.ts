import { Injectable } from '@angular/core';

// Imports
import { SqliteService } from './sqlite.service';
import { DatabaseService } from './database.service';
import { DB_NAME_KEY, DB_NAME } from '../utils/global-variables';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Users } from '../utils/interface-benef';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaireService {

  private dbName: string = DB_NAME;
  private users = new BehaviorSubject([]);
  private dbReadyBenf: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private db: SQLiteDBConnection = new SQLiteDBConnection(this.dbName, CapacitorSQLite);

  constructor(private _sqlite: SqliteService, private dataService: DatabaseService) {
  }
  
  async init() {
    console.log("======Beneficiaire service====> " + this.dataService.dbReady.value);

    if (this.dataService.dbReady.value) {

      console.log('**db is ready**::' + this.dataService.dbReady.value);

      if (!(await this._sqlite.isConnection(this.dbName)).result) {
        console.log("***connection fermé***");
        /**db =  await this._sqlite.createConnection(this.dbName, false, "no-encryption", 1);
        await db.open();*/
      } else {
        console.log("***Connection ouvert***");
        //await db.open();
      }
      this.loadUsersList();

    } else {
        console.log('**db is not ready**::' + this.dataService.dbReady.value);
    }
  }

  async loadUsersList() {

    let user: Users[]  = [];
    console.log('db is ready::' + this.dataService.dbReady.value);

    const statement = 'SELECT * FROM users;';

    //let values: Array<any> = [];
    this.db.query(statement).then(data => {
      if (data.values.length >0) {
          console.log("select all Utilisateurs::::  " + data.values);
          console.log("select all Utilisateurs::::  " + data.values.length);
          data.values.forEach(element => {
            console.log("element foreach===" + element);
            user.push({
              id: element.id,
              image: element.image,
              nom: element.nom,
              prenom: element.prenom,
              email: element.email,
              age: element.age,
              id_project: element.id_project
            });
          });

          this.users.next(user);
          this.dbReadyBenf.next(true);
      } else console.log("users");
    });
  }

  getDatabaseState() {
    return this.dbReadyBenf.asObservable();
  }

  getUsers(): Observable<any[]> {
    return this.users.asObservable();
  }

  getUsersById(id): Promise<Users> {
    return this.db.query("SELECT * FROM users WHERE id = ?", [id]).then(data => {
      console.log("Single User element === " + data);
      console.log(data);
      let user: Users = {
        id: data.values[0].id,
        image: data.values[0].image,
        nom: data.values[0].nom,
        prenom: data.values[0].prenom,
        email: data.values[0].email,
        age: data.values[0].age,
        id_project: data.values[0].id_project
      }
      console.log("Single User element === " + user.id);
      return user;
    });
  }
}
