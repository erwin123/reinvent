import { Component, OnInit, Input } from '@angular/core';
import { Article, AuthData, ArticleLikes } from 'src/app/model';
import { StatemanagementService } from 'src/app/services/statemanagement.service';
import { ArticleService } from 'src/app/services/article.service';
import * as globalVar from '../../global';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent implements OnInit {
  @Input('article') o: Article = new Article();
  baseAsssetUrl: string = globalVar.global_url + "assets/picture/content/";
  authData: AuthData = new AuthData();
  isLoading: boolean = false;
  constructor(private router: Router,private stateService: StatemanagementService, private articleService: ArticleService) { }

  ngOnInit() {
    this.isLoading = true;
    this.authData = this.stateService.getAuth();
  }
  readItUrl(articleCode: string) {
    if (document.documentElement.scrollTop === 0)
    { this.stateService.setCurrentFeedScroll(document.getElementById('main-scroll').scrollTop); }
    else {
      this.stateService.setCurrentFeedScroll(document.documentElement.scrollTop);
    }
    this.router.navigate(['main/article-read'], { queryParams: { pop: articleCode } });
  }
  clickLike(articleCode: string) {
    let userCode: string = this.authData.usercode;
    if (this.o.Likes) {
      if (this.o.Likes.find(like => like.UserCode === userCode)) {
        //dislike
        this.articleService.deleteArticleLikes(articleCode, userCode).subscribe(del => {
          let likes: Array<ArticleLikes> = new Array<ArticleLikes>();
          likes = this.o.Likes;
          likes = likes.filter(delitem => delitem.UserCode !== userCode);
          this.o.LikeIt = false;
          if (likes.length > 0) {
            this.o.Likes = likes;
          } else {
            this.o.Likes = undefined;
          }
        })
      } else {
        //like
        let artLike: ArticleLikes = new ArticleLikes();
        artLike.ArticleCode = articleCode;
        artLike.UserCode = userCode;
        this.articleService.postArticleLikes(artLike).subscribe(add => {
          this.o.Likes.unshift(artLike);
          this.o.LikeIt = true;
        });
      }
    } else {
      //like
      let artLike: ArticleLikes = new ArticleLikes();
      artLike.ArticleCode = articleCode;
      artLike.UserCode = userCode;
      this.articleService.postArticleLikes(artLike).subscribe(add => {
        this.o.Likes = new Array<ArticleLikes>();
        this.o.Likes.push(artLike);
        this.o.LikeIt = true;
      });
    }
  }
}
