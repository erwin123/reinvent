import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Article, AuthData } from 'src/app/model';
import { StatemanagementService } from 'src/app/services/statemanagement.service';
import { ArticleService } from 'src/app/services/article.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit, AfterViewInit {

  o: Article = new Article();
  constructor(public dialogRef: MatDialogRef<ArticleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private articleService: ArticleService) { }

  ngOnInit() {

    if (this.data.parsing) {
      //this.articleService.getFeed(this.data.parsing.ArticleCode).subscribe(res=>{
      this.o = this.data.parsing;
      
      //});
    }
  }

  ngAfterViewInit() {
    
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('content-read');
    if (top !== null) {
      setTimeout(() => {
        top.scrollTop = 0;
      }, 10);
      
    }
  }

}
