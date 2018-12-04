import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Article, Category, MediaArticle, AuthData, ArticleCategory } from 'src/app/model';
import { CategoryService } from 'src/app/services/category.service';
import { ArticleService } from 'src/app/services/article.service';
import { StatemanagementService } from 'src/app/services/statemanagement.service';
import * as globalVar from '../../global';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit {
  @Output('login') login = new EventEmitter<string>();
  
  article: Article = new Article();
  medias: Array<MediaArticle> = new Array<MediaArticle>();
  loadedPhoto: boolean = false;
  imgRwd: Array<File> = new Array();
  authData: AuthData = new AuthData();
  baseAsssetUrl: string = globalVar.global_url + "assets/picture/content/";
  block: boolean = false;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  catCtrl = new FormControl();
  filteredCats: Observable<string[]>;
  cats: Array<string> = new Array<string>();
  allCats: Array<string> = new Array<string>();
  masterCats: Array<Category> = new Array<Category>();

  @ViewChild('catInput') catInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  wyswyg: any = wyswyg;

  constructor(private catService: CategoryService,
    public snackBar: MatSnackBar, private artService: ArticleService,
    private stateService: StatemanagementService) {
    this.filteredCats = this.catCtrl.valueChanges.pipe(
      startWith(null),
      map((cat: string | null) => cat ? this._filter(cat) : this.allCats.slice()));
  }

  resetForm() {
    this.catCtrl = new FormControl();
    this.filteredCats = new Observable<string[]>();
    this.cats = new Array<string>();
    this.allCats = new Array<string>();
    this.masterCats = new Array<Category>();
    this.article = new Article();
    this.medias = new Array<MediaArticle>();
    this.loadedPhoto = false;
    this.imgRwd = new Array<File>();
  }

  doLogin() {
    this.login.emit('login');
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.cats.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.catCtrl.setValue(null);
    }
  }

  remove(cat: string): void {
    const index = this.cats.indexOf(cat);

    if (index >= 0) {
      this.cats.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.cats.push(event.option.viewValue);
    this.catInput.nativeElement.value = '';
    this.catCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCats.filter(cat => cat.toLowerCase().indexOf(filterValue) === 0);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 5000,
      panelClass: ['blue-snackbar']
    });
  }

  ngOnInit() {
    this.authData = this.stateService.getAuth();
    if(!this.authData)
    {
      this.doLogin();
      return;
    }
    this.catService.getAll().subscribe(cat => {
      this.masterCats = cat;
      cat.forEach(el => {
        this.allCats.push(el.CategoryName);
      })
    })
  }

  readUrlImg(event: any) {
    this.loadedPhoto = true;
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        let type = this.getFileType(event.target.files[i].type);
        if (type === "img") {
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[i]);
         
          reader.onload = (event: any) => {
            this.medias.push({ MediaPath: event.target.result, MediaType: type, ArticleCode: "", Id: 0, ModeEdit: false });
            this.loadedPhoto = false;
          }

        } else {
          this.medias.push({ MediaPath: event.target.result, MediaType: type, ArticleCode: "", Id: 0, ModeEdit: true });
          this.loadedPhoto = false;
        }
        this.imgRwd.push(event.target.files[i]);
      }
    }
  }

  getFileType(name: string): string {
    return name.indexOf('video') >= 0 ? "video" : "img";
  }

  save() {
    if (this.imgRwd.length == 0) {
      this.openSnackBar("Minimal 1 foto atau video untuk posting. tulisan");
      return;
    }
    if (this.article.Title.length <= 10) {
      this.openSnackBar("Judul minimal 10 karakter");
      return;
    }
    if (this.article.Text.length <= 100) {
      this.openSnackBar("Tulisan minimal 100 karakter");
      return;
    }
    if (this.cats.length == 0) {
      this.openSnackBar("Isi kategori tulisan");
      return;
    }
    this.article.CreatedBy = this.authData.usercode;
    this.block = true;
    this.artService.postArticle(this.article).subscribe(added => {
      let itemsProcessed: number = this.imgRwd.length - 1;
      this.imgRwd.forEach((el, index, array) => {
        this.artService.postArticleFileMedia(el).subscribe(res => {
          let elType = this.getFileType(el.type);
          let mediaArticle: MediaArticle = new MediaArticle();
          let urlPath: any = res;
          mediaArticle.MediaPath = urlPath;
          mediaArticle.MediaType = elType;
          mediaArticle.ArticleCode = added[0].ArticleCode;

          this.artService.postArticleDataMedia(mediaArticle).subscribe(mediaData => {
            console.log(mediaData);
          });
        }, err => {
          console.log("error");
        }, () => {
          if (itemsProcessed === index) {
            setTimeout(() => {
              this.block = false;
              this.resetForm();
            }, 6000);
          }
          console.log("done data media");
        });
      });

      this.cats.forEach(cat => {
        if (this.masterCats.find(f => f.CategoryName === cat)) {
          let artCat: ArticleCategory = new ArticleCategory();
          artCat.ArticleCode = added[0].ArticleCode;
          artCat.CategoryCode = this.masterCats.find(f => f.CategoryName === cat).CategoryCode;
          this.artService.postArticleCategory(artCat).subscribe();
        } else {
          this.openSnackBar("Kategori baru Anda memerlukan moderasi. Article belum memiliki kategori");
          this.catService.addCatMod(cat, added[0].ArticleCode).subscribe();
        }

      })

    })

  }
}


let wyswyg: any = {
  "editable": true,
  "spellcheck": false,
  "height": "80px",
  "minHeight": "0",
  "width": "auto",
  "minWidth": "0",
  "translate": "yes",
  "enableToolbar": true,
  "showToolbar": true,
  "placeholder": "Enter text here...",
  "imageEndPoint": "",
  "toolbar": [
    ["bold", "italic", "underline", "strikeThrough"],
    ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
    ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
    ["link", "unlink", "image", "video"]
  ]
}