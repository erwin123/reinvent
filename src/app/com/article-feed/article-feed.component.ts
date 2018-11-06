import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/model';

@Component({
  selector: 'app-article-feed',
  templateUrl: './article-feed.component.html',
  styleUrls: ['./article-feed.component.css']
})
export class ArticleFeedComponent implements OnInit {

  constructor() { }
  articles:Article[] = articles;
  likeIt:boolean = true;
  ngOnInit() {
  }

  clickLike(){
    this.likeIt = !this.likeIt;
  }
}


let articles:Article[]=[
  {Id:0,Title:"KPK Panggil Eks Sekretaris MA Nurhadi", Text:"KPK kembali menjadwalkan pemeriksaan terhadap eks Sekretaris Mahkamah Agung (MA), Nurhadi sebagai saksi, Selasa (6/11) besok. Nurhadi akan diperiksa dalam kasus dugaan suap salah satu petinggi Lippo Group, Eddy Sindoro.",
   CreatedDate:"", CreatedBy:"", ArticleCode:"", Shared:0, Viewed:0, MediaType:"Pic", MediaPath:"https://alibaba.kumpar.com/kumpar/image/upload/c_fill,g_face,f_jpg,q_auto,fl_progressive,fl_lossy,w_800/dihmih4eyaxutet1weoy.jpg", Status:1 },
   {Id:0,Title:"Karakter Keuangan Setiap Generasi, Mana yang Paling Bagus?", Text:"Menurut William Strauss dan Neil Howe dalam bukunya yang berjudul Generations: The History of America's Future, dalam kurun waktu 100 tahun terakhir, ada lima generasi saat ini: Baby Boomers, X,Y (Milenial), Z, dan Alpha.",
   CreatedDate:"", CreatedBy:"", ArticleCode:"", Shared:0, Viewed:0, MediaType:"Pic", MediaPath:"https://alibaba.kumpar.com/kumpar/image/upload/c_fill,g_face,f_jpg,q_auto,fl_progressive,fl_lossy,w_800/ru8bqmfucsdhjsfhcgbr.jpg", Status:1 },
]