import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { Category, UserCategory, Article, MediaArticle } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private url = globalVar.global_api;  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;
  constructor(private httpClient: HttpClient) {
  }

  getAllFeed():Observable<Article[]>{
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/fave/cr/";
    return this.httpClient.post<Article[]>(url, { }, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }

  getFaveFeed(userCode:string):Observable<Article[]>{
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/fave/cr/";
    return this.httpClient.post<Article[]>(url, { UserCode:userCode }, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }

  getCatFeed(catCode:string){
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/fave/cr/";
    return this.httpClient.post<Article[]>(url, { CategoryCode:catCode }, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }

  getMedia(articleCode:string){
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/media/";
    return this.httpClient.post<MediaArticle[]>(url, { ArticleCode:articleCode }, { headers: headers, withCredentials:true }).pipe(map(res => { return res; }));
  }
}
