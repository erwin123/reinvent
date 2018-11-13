import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { Category, UserCategory } from '../model';

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

  getAllCatUser(userCode:string): Observable<UserCategory[]> {
    //this.token = localStorage.getItem('currentUser');
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/cat/usr/cr/";
    return this.httpClient.post<UserCategory[]>(url, {UserCode:userCode},{ headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }

  delCatUser(userCode:string, catCode:string){
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/cat/usr/"+catCode+"/"+userCode;
    return this.httpClient.delete<UserCategory[]>(url, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }

  addCatMod(catName:string, articleCode:string){
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/cat/moderation/";
    return this.httpClient.post<any>(url, {CategoryName:catName, ArticleCode:articleCode}, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }

  addCatUser(userCode:string, catCode:string){
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/cat/usr/";
    return this.httpClient.post<UserCategory[]>(url, {UserCode:userCode, CategoryCode:catCode}, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }
}
