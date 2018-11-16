import { Component, OnInit,Input } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import {  Comment, AuthData, User } from '../../model';
import { StatemanagementService } from 'src/app/services/statemanagement.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input('articleCode') articleCode:string;
  comments:Array<Comment> =  new Array<Comment>();
  commentIn:Comment = new Comment();
  authData:AuthData = new AuthData();
  lock:boolean = false;
  writerCurrent:User = new User();
  constructor(private commentService:CommentService,
    private stateService:StatemanagementService,
    private userService:ProfileService) { }

  ngOnInit() {
    this.authData = this.stateService.getAuth();
    this.userService.getCode(this.authData.usercode).subscribe(user =>{
      this.writerCurrent = user[0];
    })
    this.fetch();
  }

  fetch(){
    this.commentService.get(this.articleCode).subscribe(res=>{
      this.comments = res;
      this.comments.forEach(el=>{
        this.userService.getCode(el.CreatedBy).subscribe(user=>{
          el.Writer = user[0];
        })
      })
    })
  }

  send(){
    if(this.commentIn.Text.length == 0)
      return;
    this.lock = true;
    this.commentIn.CreatedBy = this.authData.usercode;
    this.commentIn.ArticleCode = this.articleCode;
    this.commentIn.Status =1;
    this.commentService.post(this.commentIn).subscribe(res=>{
      res[0].Writer = this.writerCurrent;
      this.comments.push(res[0]);
      this.comments.sort((a, b) => {
        if (a.Id < b.Id) return 1;
        else if (a.Id > b.Id) return -1;
        else return 0;
      });
      setTimeout(() => {
        this.lock = false;
        this.commentIn = new Comment();
      }, 1000);
      
    });

  }
}
