import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { Comment, AuthData, User } from '../../model';
import { StatemanagementService } from 'src/app/services/statemanagement.service';
import { ProfileService } from 'src/app/services/profile.service';
import { reserveSlots } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, AfterViewInit {
  @Input('articleCode') articleCode: string;
  comments: Array<Comment> = new Array<Comment>();
  commentIn: Comment = new Comment();
  authData: AuthData = new AuthData();
  lock: boolean = false;
  writerCurrent: User = new User();
  message: string = "Belum ada komentar";
  constructor(private commentService: CommentService,
    private stateService: StatemanagementService,
    private userService: ProfileService) { }

  ngOnInit() {
    this.authData = this.stateService.getAuth();
    if (this.authData) {
      this.userService.getCode(this.authData.usercode).subscribe(user => {
        this.writerCurrent = user[0];
      })
    }
  }
  ngAfterViewInit() {
    
    this.fetch();
  }
  fetch() {
    console.log("calle");
    this.commentService.get(this.articleCode).subscribe(res => {
      //this.comments = res;
      if (res.length > 0) {
        this.message = "Memuat komentar";
        res.forEach((el, idx) => {
          this.userService.getCode(el.CreatedBy).subscribe(user => {
            el.Writer = user[0];
          })
          if (res.length - 1 === idx) {
            setTimeout(() => {
              this.comments = res
            }, 1000);
          }
        });
      }
    })
  }

  send() {
    if (this.commentIn.Text.length == 0)
      return;
    this.lock = true;
    this.commentIn.CreatedBy = this.authData.usercode;
    this.commentIn.ArticleCode = this.articleCode;
    this.commentIn.Status = 1;
    this.commentService.post(this.commentIn).subscribe(res => {
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
