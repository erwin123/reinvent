import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { Category, UserCategory, Article, MediaArticle, ArticleCategory, ArticleLikes } from '../model';
import { StatemanagementService } from './statemanagement.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private url = globalVar.global_api;  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;
  constructor(private httpClient: HttpClient, private stateService: StatemanagementService) {
  }

  routineActiveFeed(upDown:string) {
    let articles;
    let loclastId:number=0;
    let r= this.stateService.getArticleStorage().subscribe(k => {
      articles = k;
    });
    r.unsubscribe();
    let u=this.stateService.getCurrentLastIdFeed().subscribe(lastId => {
      loclastId = lastId;
      console.log(lastId);
    });
    u.unsubscribe();
    let q = this.getFeedStream("10", loclastId.toString(), upDown).subscribe(res => {
      if (res.length > 0) {
        loclastId = res[res.length-1].Id;
        this.stateService.setCurrentLastIdFeed(loclastId);
        if (articles)
          this.stateService.setArticleStorage(articles.concat(res));
        else
          this.stateService.setArticleStorage(res);
      }else{
        q.unsubscribe();
      }
    });
  }

  getFeed(articleCode: string): Observable<Article[]> {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/cr/";
    return this.httpClient.post<Article[]>(url, { ArticleCode: articleCode }, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  getFeedStream(limit: string, lastid: string, upDown:string): Observable<Article[]> {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/feed/";
    return this.httpClient.post<Article[]>(url + limit + "/" + lastid + "/"+upDown, { Status: 1 }, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  getAllFeed(): Observable<Article[]> {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/cr/";
    return this.httpClient.post<Article[]>(url, {}, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  globalSearch(search:string): Observable<Article[]> {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/search/"+search;
    return this.httpClient.get<Article[]>(url,{ headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  getLastMonth(): Observable<Article[]> {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/last/";
    return this.httpClient.get<Article[]>(url,{ headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
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

  putArticle(article: Article) {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/";
    return this.httpClient.put(url, article, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  postArticle(article: Article) {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/";
    return this.httpClient.post<Article[]>(url, article, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  postArticleLikes(articleLike: ArticleLikes) {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/like";
    return this.httpClient.post<ArticleLikes[]>(url, articleLike, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  deleteArticleLikes(articleCode: string, userCode: string) {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/like";
    return this.httpClient.delete(url + "/" + articleCode + "/" + userCode, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  postArticleCategory(articleCategory: ArticleCategory) {
    const headers = this._headers.append('x-access-token', "init");
    let url = globalVar.global_api + "/article/category";
    return this.httpClient.post<ArticleCategory[]>(url, articleCategory, { headers: headers, withCredentials: true }).pipe(map(res => { return res; }));
  }

  postArticleDataMedia(articleMedia: MediaArticle) {
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
