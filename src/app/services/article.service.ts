import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { Category, UserCategory, Article, MediaArticle, ArticleCategory } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private url = globalVar.global_api;  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;
  constructor(private httpClient: HttpClient) {
  }


  getAllFeed(): Observable<Article[]> {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/cr/";
    return this.httpClient.post<Article[]>(url, {}, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  getFaveFeed(userCode: string): Observable<Article[]> {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/fave/cr/";
    return this.httpClient.post<Article[]>(url, { UserCode: userCode }, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  getCatFeed(catCode: string) {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/fave/cr/";
    return this.httpClient.post<Article[]>(url, { CategoryCode: catCode }, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  getMedia(articleCode: string) {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/media/";
    return this.httpClient.post<MediaArticle[]>(url, { ArticleCode: articleCode }, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  postArticle(article:Article) {
    console.log(article);
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/";
    return this.httpClient.post<Article[]>(url, article, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  postArticleCategory(articleCategory:ArticleCategory) {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/category";
    return this.httpClient.post<ArticleCategory[]>(url, articleCategory, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  postArticleDataMedia(articleMedia:MediaArticle) {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/media/data";
    return this.httpClient.post<MediaArticle[]>(url, articleMedia, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  postArticleFileMedia(fileToUpload: File): Observable<string> {
    let _headers = new HttpHeaders().set('x-access-token', 'init'); //exclude content type json
    const formData: FormData = new FormData();
    let url = globalVar.global_api + "/article/media/upload";

    formData.append('article', fileToUpload, fileToUpload.name);
    console.log(formData);
    return this.httpClient.post<any>(url, formData, { headers: _headers, withCredentials: true })
      .pipe(map(res => {
        if (res) {
          var str: string = String(res.filename);
          return str;
        }
        throw new Error('Not Found');
      }));
  }
}
