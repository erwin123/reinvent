import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Category, AuthData } from 'src/app/model';
import * as globalVar from '../../global';
import { join, leftJoin } from 'array-join';
import { forkJoin } from 'rxjs';
import { StatemanagementService } from 'src/app/services/statemanagement.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit, AfterViewInit {
  regularDistribution = 100 / 5 + '%';
  cats:Array<Category> = new Array<Category>();
  assetUrl = globalVar.global_url + "assets/picture/content/";
  authData: AuthData = new AuthData();
  constructor(private catService:CategoryService, private stateService:StatemanagementService) { }
  ngOnInit() {
    this.authData = this.stateService.getAuth();
    let q = forkJoin(this.catService.getAll(), this.catService.getAllCatUser(this.authData.usercode));
    q.subscribe(res=>{
      this.cats = leftJoin(res[0],res[1],{ key:"CategoryCode"});
      console.log(this.cats);
    });
  }
  ngAfterViewInit(){
    
  }

  following(catCode:string){
    if(this.cats.find(f => f.CategoryCode === catCode).UserCode){
      this.catService.delCatUser(this.authData.usercode, catCode).subscribe(del=>{
        this.cats.find(f => f.CategoryCode === catCode).UserCode = undefined;
      });
    }else{
      this.catService.addCatUser(this.authData.usercode, catCode).subscribe(add=>{
        this.cats.find(f => f.CategoryCode === catCode).UserCode =this.authData.usercode;
      });
    }

  }
  
}
