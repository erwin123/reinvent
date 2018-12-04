import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { User, Follow } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private url = globalVar.global_api;  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;
  constructor(private httpClient: HttpClient) {
  }

  get(username: string): Observable<User> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/user/cr/";
    return this.httpClient.post<User>(url, { Username: username }, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  getCode(userCode: string): Observable<User> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/user/cr/";
    return this.httpClient.post<User>(url, { UserCode: userCode }, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  put(user: User): Observable<User> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/user/";
    return this.httpClient.put<User>(url, user, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  //follow
  getFollowCr(userCode: string, followerCode: string): Observable<Follow[]> {
    let req: any = {
      UserCode: userCode,
      FollowerCode: followerCode
    }
    
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/user/follow/cr/";
    return this.httpClient.post<Follow[]>(url, req, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }
  getFollow(userCode: string, following: boolean = true): Observable<Follow[]> {
    let req: any = {
      UserCode: userCode
    }
    if (!following) {
      req = {
        FollowerCode: userCode
      }
    }
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/user/follow/cr/";
    return this.httpClient.post<Follow[]>(url, req, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  addFollow(follow:Follow): Observable<Follow[]> {
    
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/user/follow/";
    return this.httpClient.post<Follow[]>(url, follow, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  delFollow(follow:Follow) {
    
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/user/follow/"+follow.UserCode+"/"+follow.FollowerCode;
    return this.httpClient.delete(url, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

}
