import { Component, OnInit, Input } from '@angular/core';
import { Article, AuthData } from 'src/app/model';
import { StatemanagementService } from 'src/app/services/statemanagement.service';
import { ArticleService } from 'src/app/services/article.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ActivatedRoute } from '@angular/router';
import * as globalVar from '../../global';
import {DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { sanitizeResourceUrl } from '@angular/core/src/sanitization/sanitization';
import { MatDialog } from '@angular/material';
import { ArticleComponent } from '../article/article.component';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';

@Component({
  selector: 'app-article-feed',
  templateUrl: './article-feed.component.html',
  styleUrls: ['./article-feed.component.css']
})
export class ArticleFeedComponent implements OnInit {
  baseAsssetUrl:string = globalVar.global_url+"assets/picture/content/";
  authData: AuthData = new AuthData();
  isLoading: boolean = false;
  constructor(public dialog: MatDialog,private sanitizer: DomSanitizer,private route: ActivatedRoute, private stateService: StatemanagementService, private artService: ArticleService, private userService: ProfileService) { }
  articles: Array<Article> = new Array<Article>();
  likeIt: boolean = true;
  ngOnInit() {
    this.isLoading = true;
    this.authData = this.stateService.getAuth();
    this.route.queryParams.subscribe(params => {
      if (params) {

        if (params['fave'] === "1") {
          this.artService.getFaveFeed(this.authData.usercode).subscribe(res => {
            this.articles = res;
            this.articles.forEach(el => {
              el.TextSanitizer = this.sanitizer.bypassSecurityTrustHtml(el.Text);
              this.artService.getMedia(el.ArticleCode).subscribe(med => {
                el.Medias = med;
              })
              this.userService.getCode(el.CreatedBy).subscribe(writer => {
                el.Writer = writer[0];
              })
            });
          },err=>{},()=>{this.isLoading = false;});
          
        } else if(params['article']){
          this.artService.getFeed(params['article']).subscribe(res => {
            this.articles = res;
            this.articles.forEach(el => {
              el.TextSanitizer = this.sanitizer.bypassSecurityTrustHtml(el.Text);
              this.artService.getMedia(el.ArticleCode).subscribe(med => {
                el.Medias = med;
              })
              this.userService.getCode(el.CreatedBy).subscribe(writer => {
                el.Writer = writer[0];
              })
            });
          },err=>{},()=>{this.isLoading = false;});
        }else if(params['pop']){
          this.readIt(params['pop']);
        }else {
          this.artService.getAllFeed().subscribe(res => {
            this.articles = res;
            this.articles.forEach(el => {
              el.TextSanitizer = this.sanitizer.bypassSecurityTrustHtml(el.Text);
              this.artService.getMedia(el.ArticleCode).subscribe(med => {
                el.Medias = med;
              })
              this.userService.getCode(el.CreatedBy).subscribe(writer => {
                el.Writer = writer[0];
              })
            });
          },err=>{},()=>{this.isLoading = false;});
        }
      }
    });
  }

    clickLike() {
      this.likeIt = !this.likeIt;
    }

    readIt(articleCode:string){
      let parsing:Article = this.articles.find(f=>f.ArticleCode === articleCode);
      const dialogRef = this.dialog.open(ArticleComponent, {
        maxWidth:'650px',
        minWidth:'300px',
        width: '75%',
        data: { parsing },
        position:{top:'50px'},
        id:"article-read"
      });
  
      dialogRef.afterClosed().subscribe(result => {
        
        
      });
    }
  }