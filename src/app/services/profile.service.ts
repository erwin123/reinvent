import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { User } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private url = globalVar.global_api;  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;
  constructor(private httpClient: HttpClient) {
  }

  get(username:string): Observable<User> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/user/cr/";
    return this.httpClient.post<User>(url, { Username:username }, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }

  put(user:User): Observable<User> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/user/";
    return this.httpClient.put<User>(url, user, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }
}
