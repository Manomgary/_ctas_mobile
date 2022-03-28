import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_PATH } from '../utils/global-variables';
import { Activite, Commune, District, Fonkotany, Participe_proj_activ, Projet, Region, Utilisateurs, Volet } from '../utils/interface-bd';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // API Path
  base_path = BASE_PATH;

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // login
  getLogin(data): Observable<Utilisateurs> {
    return this.http.post<any>(this.base_path + 'users/login', data, this.httpOptions);
  }

  // Get List Projet
  getListProjet(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'projet', data, this.httpOptions);
  }

  // Get Equipe
  getEquipe(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'equipe', data, this.httpOptions);
  }

  // Get Equipe
  getProjetEquipe(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'projet/projet_equipe', data, this.httpOptions);
  }
  

  // get all project active
  getProjet(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.base_path + 'projet');
  }

  // Get List Volet
  getListVolet(): Observable<Volet[]> {
    return this.http.get<Volet[]>(this.base_path + 'volet');
  }

  // Get List activite!!!
  getListActivite(): Observable<Activite[]> {
    return this.http.get<Activite[]>(this.base_path + 'activite');
  }

  // Get List activite Projet
  getListActiveProjet(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'projet/findActive', data, this.httpOptions);
  }

  /**
   * Get Zone
   */
  // region
  getRegion(): Observable<Region[]> {
    return this.http.get<any[]>(this.base_path + 'region');
  }

  // District
  getDistrict(): Observable<District[]> {
    return this.http.get<any[]>(this.base_path + 'district');
  }

  // Commune
  getCom(): Observable<Commune[]> {
    return this.http.get<any[]>(this.base_path + 'commune');
  }

  // Fonkotany
  getFkt(): Observable<Fonkotany[]> {
    return this.http.get<any[]>(this.base_path + 'fonkotany');
  }

  // collaborateur
  getCol(): Observable<any[]> {
    return this.http.get<any[]>(this.base_path + 'collaborateur');
  }

  // collaborateur
  getColActive(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'activite/collaboActive', data, this.httpOptions);
  }

  // bloc
  getBloc(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'bloc/findblocByProjet', data, this.httpOptions);
  }

  // bloc zone
  getBlocZone(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'bloc/findBlocByzone', data, this.httpOptions);
  }

  // association zone
  getAssociation(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'association/findassocByProjet', data, this.httpOptions);
  }

  // beneficiaire pms
  getBenefRp(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'beneficiaire/findRpByProjet', data, this.httpOptions);
  }

  // beneficiaire bloc
  getBenefBloc(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'beneficiaire/findBenefBlocByProjet', data, this.httpOptions);
  }

  // beneficiaire Parcelle
  getBenefParcelle(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'parcelle', data, this.httpOptions);
  }

    // beneficiaire Parcelle Bloc
  getBenefParcelleBloc(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'parcelle/findAllParceBenefBloc', data, this.httpOptions);
  }

    // beneficiaire Parcelle Ass
  getAssociationParcelle(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'parcelle/findParcelleAss', data, this.httpOptions);
  }

  // beneficiaire Parcelle Bloc
  getBlocParcelle(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'parcelle/findParcelleBloc', data, this.httpOptions);
  }

}
