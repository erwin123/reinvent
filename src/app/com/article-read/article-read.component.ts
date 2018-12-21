import { Component, OnInit } from '@angular/core';
import { Article, AuthData, ArticleLikes } from 'src/app/model';
import { StatemanagementService } from 'src/app/services/statemanagement.service';
import { ArticleService } from 'src/app/services/article.service';
import { ActivatedRoute, Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { filter, pairwise } from 'rxjs/operators';
import { RouterExtService } from 'src/app/services/router-ext.service';

@Component({
  selector: 'app-article-read',
  templateUrl: './article-read.component.html',
  styleUrls: ['./article-read.component.css']
})
export class ArticleReadComponent implements OnInit {
  authData: AuthData = new AuthData();
  o: Article = new Article();
  likeIt: boolean = true;
  private previousUrl: string = undefined;
  private currentUrl: string = undefined;
  constructor(private router: Router, private sanitizer: DomSanitizer, private articleService: ArticleService,
    private route: ActivatedRoute, private stateService: StatemanagementService, private routerExtService: RouterExtService) {

  }

  public goToPrevious(): void {
    let previous = this.routerExtService.getPreviousUrl();
    if (previous)
      this.routerExtService.router.navigateByUrl(previous);
  }

  ngOnInit() {
    this.authData = this.stateService.getAuth();
    this.route.queryParams.subscribe(params => {
      if (params['pop'])
        this.articleService.getFeed(params['pop']).subscribe(res => {
          this.o = res[0];
          this.o.TextSanitizer = this.sanitizer.bypassSecurityTrustHtml(this.o.Text);
          if (this.o.Likes && this.authData) {
            this.o.LikeIt = this.o.Likes.find(f => f.UserCode === this.authData.usercode) ? true : false;
            if (this.o.LikeIt) {
              let myLike: ArticleLikes = new ArticleLikes();
              myLike = this.o.Likes.find(f => f.UserCode === this.authData.usercode);
              this.o.Likes = this.o.Likes.filter(del => del.UserCode !== myLike.UserCode);
              this.o.Likes.unshift(myLike);
            }
          }
          if (this.o.Viewed)
            this.o.Viewed++;
          else
            this.o.Viewed = 1;
          this.articleService.putArticle(this.o).subscribe();
        });

    });

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