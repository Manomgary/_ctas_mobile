import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_PATH } from '../utils/global-variables';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  // API Path
  base_path = BASE_PATH;

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // culture
  syncCulture(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'culture/update', data, this.httpOptions);
  }

  // sync Suivi
  syncSuivi(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'culture/update_suivi', data, this.httpOptions);
  }

  // sync Mep bloc
  syncMepBloc(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'culture/update_mep_bloc', data, this.httpOptions);
  }

  // Sync Suivi Bloc
  syncSuiviBloc(data: any): Observable<any> {
    return this.http.post<any>(this.base_path + 'culture/update_suivi_bloc', data, this.httpOptions);
  }
}
