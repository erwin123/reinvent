import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { Category } from '../model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = globalVar.global_api;  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;
  constructor(private httpClient: HttpClient) {
  }

  get(categoryCode:string): Observable<Category> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/cat/cr/";
    return this.httpClient.post<Category>(url, { Username:categoryCode }, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }

  getAll(): Observable<Category[]> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/cat/";
    return this.httpClient.get<Category[]>(url, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }
}
