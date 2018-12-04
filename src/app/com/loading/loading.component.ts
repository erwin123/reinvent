import { Component, OnInit } from '@angular/core';
import * as globalVar from '../../global';
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  baseAsssetUrl: string = globalVar.global_url + "assets/picture/content/";
  constructor() { }

  ngOnInit() {
  }

}
