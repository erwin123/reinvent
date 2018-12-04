import { Component, OnInit } from '@angular/core';
import { Article, AuthData, ArticleLikes } from 'src/app/model';
import { StatemanagementService } from 'src/app/services/statemanagement.service';
import { ArticleService } from 'src/app/services/article.service';
import { ProfileService } from 'src/app/services/profile.service';
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
    private sanitizer: DomSanitizer, private route: ActivatedRoute, private stateService: StatemanagementService, private artService: ArticleService, private userService: ProfileService) { }
  articles: Array<Article> = new Array<Article>();
  likeIt: boolean = true;
  
  ngOnInit() {
    this.isLoading = true;
    this.authData = this.stateService.getAuth();
    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params['fave'] === "1" && this.authData) {
          this.artService.getFaveFeed(this.authData.usercode).subscribe(res => {
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
          }, err => { }, () => { this.isLoading = false; });
        } else {
          this.artService.getAllFeed().subscribe(res => {
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
          }, err => { }, () => { this.isLoading = false; });
        }
      }
    });
  }


  clickLike(articleCode: string) {
    let userCode: string = this.authData.usercode;
    if (this.articles.find(art => art.ArticleCode === articleCode).Likes) {
      if (this.articles.find(art => art.ArticleCode === articleCode).Likes.find(like => like.UserCode === userCode)) {
        //dislike
        this.artService.deleteArticleLikes(articleCode, userCode).subscribe(del => {
          let likes: Array<ArticleLikes> = new Array<ArticleLikes>();
          likes = this.articles.find(art => art.ArticleCode === articleCode).Likes;
          likes = likes.filter(delitem => delitem.UserCode !== userCode);
          this.articles.find(art => art.ArticleCode === articleCode).LikeIt = false;
          if (likes.length > 0) {
            this.articles.find(art => art.ArticleCode === articleCode).Likes = likes;
          } else {
            this.articles.find(art => art.ArticleCode === articleCode).Likes = undefined;
          }
        })
      } else {
        //like
        let artLike: ArticleLikes = new ArticleLikes();
        artLike.ArticleCode = articleCode;
        artLike.UserCode = userCode;
        this.artService.postArticleLikes(artLike).subscribe(add => {
          this.articles.find(art => art.ArticleCode === articleCode).Likes.unshift(artLike);
          this.articles.find(art => art.ArticleCode === articleCode).LikeIt = true;
        });
      }
    } else {
      //like
      let artLike: ArticleLikes = new ArticleLikes();
      artLike.ArticleCode = articleCode;
      artLike.UserCode = userCode;
      this.artService.postArticleLikes(artLike).subscribe(add => {
        this.articles.find(art => art.ArticleCode === articleCode).Likes = new Array<ArticleLikes>();
        this.articles.find(art => art.ArticleCode === articleCode).Likes.push(artLike);
        this.articles.find(art => art.ArticleCode === articleCode).LikeIt = true;
      });
    }
  }

  readItUrl(articleCode: string) {
    this.router.navigate(['main/article-read'], { queryParams: { pop: articleCode } });
  }

  // readIt(articleCode: string) {

  //   let parsing: Article = this.articles.find(f => f.ArticleCode === articleCode);
  //   const dialogRef = this.dialog.open(ArticleComponent, {
  //     maxWidth: '600px',
  //     minWidth: '320px',
  //     width: '88%',
  //     height: 'auto',
  //     data: { parsing },
  //     position: { top: '50px' },
  //     id:"article-read"
  //   });
  //   dialogRef.afterClosed().subscribe(result => {

  //     //this.location.go('/main/article-feed');
  //     //this.router.navigate(['main/article-feed']);
  //   });
  // }
}