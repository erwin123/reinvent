import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Follow, User } from 'src/app/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css']
})
export class FollowComponent implements OnInit, AfterViewInit {
  @Input('UserCode') UserCode: string = "";
  @Input('Follower') Follower: string = "";
  header:string="Follower";
  follow: Array<Follow> = new Array<Follow>();
  constructor(private profileService: ProfileService, private router:Router) { }

  ngOnInit() {
    if (this.Follower === "1") { //follower mode
      this.profileService.getFollow(this.UserCode).subscribe(res => {
        this.follow = res;
      })
    }
    if (this.Follower === "0") { //following mode
      this.header = "Following";
      this.profileService.getFollow(this.UserCode, false).subscribe(res => {
        this.follow = res;
      })
    }
  }

  viewProfile(user:User){
    this.router.navigate(['main/profile'], { queryParams: { pop: user.UserCode } });
  }

  ngAfterViewInit(){
    
  }

}
