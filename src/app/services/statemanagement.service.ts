import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Article } from '../model';

@Injectable({
  providedIn: 'root'
})
export class StatemanagementService {
  private stateLogin = new BehaviorSubject<any>(localStorage.getItem('auth'));
  currentStateLogin = this.stateLogin.asObservable();

  private feedScroll = new BehaviorSubject<any>(0);
  currentFeedScroll = this.feedScroll.asObservable();

  private lastIdFeed = new BehaviorSubject<any>(0);
  currentLastIdFeed = this.lastIdFeed.asObservable();

  private prevIdFeed = new BehaviorSubject<any>(0);
  currentPrevIdFeed = this.prevIdFeed.asObservable();

  private articleStorage = new BehaviorSubject<Array<Article>>(new Array<Article>());
  currentArticleStorage = this.articleStorage.asObservable();

  constructor() { }

  setCurrentStateLogin(data: any) {
    if (data) {
      localStorage.setItem('auth', JSON.stringify(data));
      this.stateLogin.next(data);
    }
  }

  getAuth() {
    return JSON.parse(localStorage.getItem('auth'));
  }

  logOut() {
    localStorage.removeItem('auth');
  }

  setCurrentFeedScroll(val) {
    this.feedScroll.next(val);
  }

  getCurrentFeedScroll() {
    return this.feedScroll.asObservable();
  }

  setCurrentPrevIdFeed(val) {
    this.prevIdFeed.next(val);
  }

  getCurrentPrevIdFeed() {
    return this.prevIdFeed.asObservable();
  }

  setCurrentLastIdFeed(val) {
    console.log(val);
    this.lastIdFeed.next(val);
  }

  getCurrentLastIdFeed() {
    return this.lastIdFeed.asObservable();
  }

  pushArticleStorage(article: Article[]) {
    this.articleStorage.next(this.articleStorage.getValue().concat(article));
  }

  setArticleStorage(arrArticle: Article[]) {
    this.articleStorage.next(arrArticle);
  }

  getArticleStorage() {
    return this.articleStorage.asObservable();
  }

}
