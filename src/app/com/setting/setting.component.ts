import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/model';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit, AfterViewInit {
  regularDistribution = 100 / 5 + '%';
  cats:Array<Category> = new Array<Category>();
  
  constructor(private catService:CategoryService) { }
  ngOnInit() {
    // this.catService.getAll().subscribe(res=>{
    //   this.cats = res;
    // });
  }
  ngAfterViewInit(){
    this.catService.getAll().subscribe(res=>{
      this.cats = res;
      this.cats.forEach(el=>{
        el.Color = "linear-gradient(135deg, "+this.getColor()+" 0%,#fff 99%)" ;
      })
    });
  }
  getColor() {
    // var letters = '0123456789ABCDEF'.split('');
    // var color = '#';
    // for (var i = 0; i < 6; i++) {
    //     color += letters[Math.round(Math.random() * 10)];
    // }
    // return color;
    var letters = '012345'.split('');
    var color = '#';        
    color += letters[Math.round(Math.random() * 5)];
    letters = '0123456789ABCDEF'.split('');
    for (var i = 0; i < 5; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
    //return "#"+((1<<24)*Math.random()|0).toString(16);
  }
}
