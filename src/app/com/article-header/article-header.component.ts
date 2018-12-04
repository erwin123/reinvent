import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-header',
  templateUrl: './article-header.component.html',
  styleUrls: ['./article-header.component.css']
})
export class ArticleHeaderComponent implements OnInit {
  @Input('user') user: User = new User();
  @Input('articlecode') articlecode: string = "";
  @Input('articletitle') articletitle: string = "";
  constructor(private router: Router) { }

  ngOnInit() {
    
  }

  readItUrl(){
    this.router.navigate(['main/article-read'], { queryParams: { pop: this.articlecode } });
  }
}
