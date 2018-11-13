import { Component, OnInit, Input } from '@angular/core';
import { Article, AuthData } from 'src/app/model';
import { StatemanagementService } from 'src/app/services/statemanagement.service';
import { ArticleService } from 'src/app/services/article.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-article-feed',
  templateUrl: './article-feed.component.html',
  styleUrls: ['./article-feed.component.css']
})
export class ArticleFeedComponent implements OnInit {
  @Input() filtering: string = "";
  authData: AuthData = new AuthData();
  constructor(private stateService: StatemanagementService, private artService: ArticleService, private userService: ProfileService) { }
  articles: Array<Article> = new Array<Article>();
  likeIt: boolean = true;
  ngOnInit() {
    this.authData = this.stateService.getAuth();
    if (this.filtering === "") {
      this.artService.getAllFeed().subscribe(res => {
        this.articles = res;
        this.articles.forEach(el => {
          this.artService.getMedia(el.ArticleCode).subscribe(med => {
            el.Medias = med;
          })
          this.userService.getCode(el.UserCode).subscribe(writer => {
            el.Writer = writer[0];
          })
        });
      });

  }else{
    this.artService.getFaveFeed(this.authData.usercode).subscribe(res => {
      this.articles = res;
      this.articles.forEach(el => {
        this.artService.getMedia(el.ArticleCode).subscribe(med => {
          el.Medias = med;
        })
        this.userService.getCode(el.UserCode).subscribe(writer => {
          el.Writer = writer[0];
        })
      });
    });
  }
}

clickLike(){
  this.likeIt = !this.likeIt;
}
}