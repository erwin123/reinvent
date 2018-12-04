import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.css']
})
export class ProfilePicComponent implements OnInit {
  @Input('src') src:string="";
  @Input('usercode') usercode:string="";
  @Input('size') size:string="";
  constructor(private router: Router) { }

  ngOnInit() {
  }

  viewProfile(){
    this.router.navigate(['main/profile'], { queryParams: { pop: this.usercode } });
  }
}
