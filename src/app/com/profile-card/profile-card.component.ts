import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {
  @Input('profile') obj:User = new User();
  constructor(private router:Router) { }

  ngOnInit() {
  }
  viewProfile(user:User){
    this.router.navigate(['main/profile'], { queryParams: { pop: user.UserCode } });
  }
}
