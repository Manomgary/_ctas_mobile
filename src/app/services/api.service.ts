import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_PATH } from '../utils/global-variables';
import { Activite, AnneeAgricole, AssociationParceSaison, Commune, District, Fonkotany, Participe_proj_activ, Projet, Region, Utilisateurs, Volet } from '../utils/interface-bd';

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

  // Get Projet Equipe 
  getProjetEquipe(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'projet/projet_equipe', data, this.httpOptions);
  }
  
  //Get Projet Equipe Volet
  getProjetEquipeVolet(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'projet/projet_equipe_volet', data, this.httpOptions);
  }

  // get all project active
  getProjet(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.base_path + 'projet');
  }

  // Get List Volet
  getListVolet(): Observable<Volet[]> {
    return this.http.get<Volet[]>(this.base_path + 'volet');
  }

  // Get Annee agricole
  getAnneeAgricole(): Observable<AnneeAgricole[]> {
    return this.http.get<AnneeAgricole[]>(this.base_path + 'saison/findAnneeAgricole');
  }

  // Get List activite!!!
  getListActivite(): Observable<Activite[]> {
    return this.http.get<Activite[]>(this.base_path + 'activite');
  }

  // get Projet Volet
  getProjetVolet(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'projet/projet_volet', data, this.httpOptions);
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

  // Get Paysant Relais
  getBenefPRBloc(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'beneficiaire/findBenefPRBloc', data, this.httpOptions)
  }
  
  // beneficiaire Parcelle
  getBenefPR(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'parcelle', data, this.httpOptions);
  }

  // beneficiaire Parcelle
  getBenefParcelle(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'parcelle/findAllParceBenefBloc', data, this.httpOptions);
  }

    // beneficiaire Parcelle Bloc
  getBenefParcelleBloc(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'parcelle/findAllParceBenefBloc', data, this.httpOptions);
  }

  // parcellle 
  getParcePRBloc(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'parcelle/findParcellePRBloc', data, this.httpOptions);
  }

    // beneficiaire Parcelle Ass
  getAssociationParcelle(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'parcelle/findParcelleAss', data, this.httpOptions);
  }

  // beneficiaire Parcelle Bloc
  getBlocParcelle(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'parcelle/findParcelleBloc', data, this.httpOptions);
  }

  // load saison
  getSaison(): Observable<any[]>  {
    return this.http.get<any[]>(this.base_path + 'saison');
  }

  // load Categorie Espece
  getCategEspece(): Observable<any[]> {
    return this.http.get<any[]>(this.base_path + 'speculation/findCategEspece');
  }

  // load Espece
  getEspece(): Observable<any[]> {
    return this.http.get<any[]>(this.base_path + 'speculation/findEspece');
  }

  // load variette
  getVariette(): Observable<any[]> {
    return this.http.get<any[]>(this.base_path + 'speculation/findVariette');
  }

  // load Culture
  getCulture_pms(data: any): Observable<any[]> {
    return this.http.post<any[]>(this.base_path + 'culture/find_culturepms', data, this.httpOptions);
  }

  // load suivi pms
  getSuiPms(data: any): Observable<any[]> {
    return this.http.post<any[]>(this.base_path + 'culture/find_suivipms', data, this.httpOptions);
  }

  // load MEP Bloc
  getMepBloc(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'culture/find_mep_bloc', data, this.httpOptions);
  }

  // load Suivi Bloc
  getSuiviBloc(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'culture/find_suivi_bloc', data, this.httpOptions);
  }
  // load PR Animation
  getAnimation(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'prBloc/findAnimationPr', data, this.httpOptions);
  }
  // load specu VE
  getSpecuAnime(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'prBloc/findSpeculationAnime', data, this.httpOptions);
  }
  // load Mep PR
  getMepPR(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'culture/find_mep_pr', data, this.httpOptions);
  }
  // load Suivi Mep PR
  getSuiviMepPR(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'culture/find_suivi_pr', data, this.httpOptions);
  }
  // load Parcelle Pms
  getParcelleSaisonPms(data: any): Observable<AssociationParceSaison[]> {
    return this.http.post<AssociationParceSaison[]>(this.base_path + 'parcelle/findParcelleAssSaison', data, this.httpOptions);
  }
}
