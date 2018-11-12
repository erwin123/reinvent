import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NguCarousel, NguCarouselStore } from '@ngu/carousel';
import { MediaArticle } from 'src/app/model';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @ViewChild('videoPlayer') videoplayer: any;
  @Input() medias: MediaArticle[];
  public carouselBanner: NguCarousel;
  constructor() { }

  ngOnInit() {
    this.carouselBanner = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, all: 0 },
      slide: 1,
      speed: 400,
      interval: 3000,
      point: {
        visible: true,
        pointStyles: `
          .ngucarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            position: absolute;
            width: 100%;
            bottom: 20px;
            left: 0;
            box-sizing: border-box;
          }
          .ngucarouselPoint li {
            display: inline-block;
            border-radius: 999px;
            background: #ff9400;
            padding: 5px;
            margin: 0 3px;
            transition: .4s ease all;
          }
          .ngucarouselPoint li.active {
              background: #f9c60c;
              width: 10px;
          }
        `
      },
      load: 2,
      loop: false,
      touch: true
    };
  }

  stopVideo() {
    event.preventDefault();
    let video: HTMLVideoElement = this.videoplayer.nativeElement;
    video.pause();
    
}



  /* It will be triggered on every slide*/
  onmoveFn(data: NguCarouselStore) {

  }
}
