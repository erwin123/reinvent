import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Menu, AuthData, User, Article } from '../../app/model';
import { LoginComponent } from '../com/login/login.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { StatemanagementService } from '../services/statemanagement.service';
import { LoginService } from '../services/login.service';
import * as globalVar from '../global';
import { ProfileService } from '../services/profile.service';
import { ArticleService } from '../services/article.service';
import { take, distinct } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { from } from 'rxjs';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  @ViewChild('snav') snav;
  //fillerNav:Menu[] = Menus; 
  baseAsssetUrl: string = globalVar.global_url + "assets/picture/content/";
  searchValue: string;
  fillerNav = menus;
  authData: AuthData = new AuthData();
  profiles: Array<User> = new Array<User>();
  articles: Array<Article> = new Array<Article>();
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public dialog: MatDialog, private router: Router,
    private stateService: StatemanagementService, private artService: ArticleService,
    private userService: LoginService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  onActivate(event) {
    if (event.login) {
      event.login.subscribe(log => {
        if (log === "login")
          this.openLoginDialog();
      })
    }
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }

  globalSearch() {
    this.router.navigate(['main/article-feed'], { queryParams: { search: this.searchValue } });
    this.searchValue = "";
  }

  ngOnInit() {
    if (!this.mobileQuery.matches) {
      this.snav.toggle('show');
    }
    if (this.stateService.getAuth())
      this.authData = this.stateService.getAuth();
    if (this.authData.auth) {
      this.fillerNav.push({ Text: "Artikel Favorit", Path: "article-feed", Icon: "book", Params: "1" });
    }
    let locWriters: Array<User> = new Array<User>();
    setTimeout(() => {
      let q = this.stateService.getArticleStorage().subscribe(art => {
        art = art.sort((a, b) => {
          if (a.Viewed > b.Viewed) {
            return -1;
          } else if (a.Viewed < b.Viewed) {
            return 1;
          } else {
            return 0;
          }
        });

        setTimeout(() => {
          art.forEach((el, idx) => {
            locWriters.push(el.Writer);
          });
          from(locWriters).pipe(distinct((p: User) => p.UserCode)).pipe(take(8)).subscribe(wr => {
            this.profiles.push(wr);
          });
          from(art).pipe(distinct((p: Article) => p.ArticleCode)).pipe(take(5)).subscribe(wr => {
            this.articles.push(wr);
          });
        }, 1000);
      });
      setTimeout(() => {
        q.unsubscribe();
      }, 5000);
    }, 1500);
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '300px',
      data: this.authData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.authData.auth) {

        this.stateService.setCurrentStateLogin(this.authData);
        setTimeout(() => {
          this.userService.getUser(this.authData.username).subscribe(user => {
            let auth = this.stateService.getAuth();
            auth.usercode = user[0].UserCode;
            this.stateService.setCurrentStateLogin(auth);
            setTimeout(() => {
              window.location.reload();
            }, 100);
          });
        }, 500);

      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logOut() {
    this.stateService.logOut();
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  goTo(path: string, params?: string) {
    if (params) {
      this.router.navigate([path], { queryParams: { fave: params } });
    }
    else
      this.router.navigate([path]);
  }

}


let menus: Menu[] = [
  { Text: "Beranda", Path: "article-feed", Icon: "home", Params: "" },
  { Text: "Mulai Berbagi", Path: "write", Icon: "create", Params: "" },
  { Text: "Tentang Kami", Path: "#", Icon: "perm_device_information", Params: "" }
]

