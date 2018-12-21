import { Component, OnInit } from '@angular/core';
import { Article, AuthData, ArticleLikes } from 'src/app/model';
import { StatemanagementService } from 'src/app/services/statemanagement.service';
import { ArticleService } from 'src/app/services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as globalVar from '../../global';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-article-feed',
  templateUrl: './article-feed.component.html',
  styleUrls: ['./article-feed.component.css']
})
export class ArticleFeedComponent implements OnInit {
  baseAsssetUrl: string = globalVar.global_url + "assets/picture/content/";
  authData: AuthData = new AuthData();
  isLoading: boolean = false;
  constructor(private router: Router,
    private sanitizer: DomSanitizer, private route: ActivatedRoute,
    private stateService: StatemanagementService, private artService: ArticleService) {
  }
  articles: Array<Article> = new Array<Article>();
  likeIt: boolean = true;
  lastScrollPosition: number = 0;
  searchResult: boolean = false;
  searchKey: string = "";
  ngOnInit() {

    this.isLoading = true;
    this.authData = this.stateService.getAuth();
    let locLastId = 0;
    let q = this.stateService.getCurrentLastIdFeed().subscribe(lastId => locLastId = lastId);
    q.unsubscribe();
    if (locLastId === 0) {
      this.artService.getLastMonth().subscribe(res => {
        res = res.sort((a, b) => {
          if (a.Id > b.Id) {
            return -1;
          } else if (a.Id < b.Id) {
            return 1;
          } else {
            return 0;
          }
        });
        this.stateService.setArticleStorage(res);
        setTimeout(() => {
          this.stateService.setCurrentLastIdFeed(res[0].Id);
          this.stateService.setCurrentPrevIdFeed(res[res.length - 1].Id);
        }, 100);
      });
    } else {
      this.artService.routineActiveFeed("1");
    }

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params['fave'] === "1" && this.authData) {
          this.articles = new Array<Article>();
          this.artService.getFaveFeed(this.authData.usercode).subscribe(res => {
            console.log(res);
            if (res[0]) {
              this.articles = res;
              this.articles.forEach(el => {
                el.TextSanitizer = this.sanitizer.bypassSecurityTrustHtml(el.Text);
                if (el.Likes && this.authData) {
                  el.LikeIt = el.Likes.find(f => f.UserCode === this.authData.usercode) ? true : false;
                  if (el.LikeIt) {
                    let myLike: ArticleLikes = new ArticleLikes();
                    myLike = el.Likes.find(f => f.UserCode === this.authData.usercode);
                    el.Likes = el.Likes.filter(del => del.UserCode !== myLike.UserCode);
                    el.Likes.unshift(myLike);
                  }
                }
              });
              this.restoreLastScroll();
            } else {
              this.isLoading = false;
            }
          }, err => { }, () => { });
        }
        else if (params['search']) {
          this.isLoading = true;
          this.searchResult = true;
          this.articles = new Array<Article>();
          this.artService.globalSearch(params['search']).subscribe(res => {
            this.articles = res;
            this.searchKey = "'" + params['search'] + "' ditemukan " + this.articles.length + " artikel yang berkaitan isi atau penulisnya.";
            this.articles.forEach(el => {
              el.TextSanitizer = this.sanitizer.bypassSecurityTrustHtml(el.Text);
              if (el.Likes && this.authData) {
                el.LikeIt = el.Likes.find(f => f.UserCode === this.authData.usercode) ? true : false;
                if (el.LikeIt) {
                  let myLike: ArticleLikes = new ArticleLikes();
                  myLike = el.Likes.find(f => f.UserCode === this.authData.usercode);
                  el.Likes = el.Likes.filter(del => del.UserCode !== myLike.UserCode);
                  el.Likes.unshift(myLike);
                }
              }
            });
            this.restoreLastScroll();
          }, err => { }, () => { this.isLoading = false; });
        }
        else {
          this.searchResult = false;
          this.stateService.getArticleStorage().subscribe(res => {
            this.articles = res;
            this.articles.forEach(el => {
              el.TextSanitizer = this.sanitizer.bypassSecurityTrustHtml(el.Text);
              if (el.Likes && this.authData) {
                el.LikeIt = el.Likes.find(f => f.UserCode === this.authData.usercode) ? true : false;
                if (el.LikeIt) {
                  let myLike: ArticleLikes = new ArticleLikes();
                  myLike = el.Likes.find(f => f.UserCode === this.authData.usercode);
                  el.Likes = el.Likes.filter(del => del.UserCode !== myLike.UserCode);
                  el.Likes.unshift(myLike);
                }
              }
            });
            this.restoreLastScroll();
          }, err => { }, () => { this.isLoading = false; });
        }
      }
    });
  }

  morePrev() {
    this.stateService.setCurrentFeedScroll(document.getElementById('main-scroll').scrollTop);
    let locPrefId = 0;
    let q = this.stateService.getCurrentPrevIdFeed().subscribe(prevId => locPrefId = prevId);
    q.unsubscribe();
    this.artService.getFeedStream("10", locPrefId.toString(), "0").subscribe(res => {
      this.stateService.setCurrentPrevIdFeed(res[0].Id);
      this.stateService.pushArticleStorage(res);
      this.restoreLastScroll();
    });
  }

  restoreLastScroll() {
    this.stateService.getCurrentFeedScroll().subscribe(sc => {
      setTimeout(() => {
        document.getElementById('main-scroll').scrollTo(0, sc);
      }, 500);
    });
  }
}