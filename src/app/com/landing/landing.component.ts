import { Component, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  
  constructor() { }
  @Output('login') login = new EventEmitter<string>();
  doLogin() {
    this.login.emit('login');
  }
  ngOnInit() {
    this.doLogin();
  }

}
