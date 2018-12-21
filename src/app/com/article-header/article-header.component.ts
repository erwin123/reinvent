import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/model';
import { Router } from '@angular/router';
import { StatemanagementService } from 'src/app/services/statemanagement.service';

@Component({
  selector: 'app-article-header',
  templateUrl: './article-header.component.html',
  styleUrls: ['./article-header.component.css']
})
export class ArticleHeaderComponent implements OnInit {
  @Input('user') user: User = new User();
  @Input('articlecode') articlecode: string = "";
  @Input('articletitle') articletitle: string = "";
  constructor(private router: Router,private stateService: StatemanagementService) { }

  ngOnInit() {
    
  }

  readItUrl(){
    if (document.documentElement.scrollTop === 0)
    { this.stateService.setCurrentFeedScroll(document.getElementById('main-scroll').scrollTop); }
    else {
      this.stateService.setCurrentFeedScroll(document.documentElement.scrollTop);
    }
  }
}
