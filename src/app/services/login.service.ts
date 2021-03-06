import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { User } from '../model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = globalVar.global_api;  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;

  constructor(private httpClient: HttpClient) {
  }

  login(username:string,password:string): Observable<any> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/account/login/";
    return this.httpClient.post<any>(url, { username:username, password:password }, { headers: headers }).pipe(map(res => { return res; }));
  }

  login_g(id:string,token:string): Observable<any> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/account/login/g/";
    return this.httpClient.post<any>(url, { id:id, token:token },  { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }

  login_fb(id:string,token:string): Observable<any> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/account/login/fb/";
    return this.httpClient.post<any>(url, { id:id, token:token }, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }

  getUser(username:string): Observable<User[]>{
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/user/whoami/";
    return this.httpClient.get<User[]>(url, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }
}
