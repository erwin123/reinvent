import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import {  Comment } from '../model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private url = globalVar.global_api;  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;
  constructor(private httpClient: HttpClient) {
  }

  get(articleCode:string): Observable<Comment[]> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/comment/cr/";
    return this.httpClient.post<Comment[]>(url, { ArticleCode:articleCode }, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }

  post(comment:Comment): Observable<Comment> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/comment";
    return this.httpClient.post<Comment>(url,comment, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }
}
