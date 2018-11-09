import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Menu, AuthData } from '../../app/model';
import { LoginComponent } from '../com/login/login.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { StatemanagementService } from '../services/statemanagement.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  //fillerNav:Menu[] = Menus; 
  fillerNav = menus;
  authData: AuthData = new AuthData();
  fillerContent = Array.from({ length: 50 }, () =>
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public dialog: MatDialog, private router: Router, private stateService: StatemanagementService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit() {
    if (this.stateService.getAuth())
      this.authData = this.stateService.getAuth();
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '300px',
      data: this.authData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.authData.auth) {
        this.stateService.setCurrentStateLogin(this.authData);
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

  goTo(path: string) {
    console.log(path);
    this.router.navigate([path]);
  }

}


let menus: Menu[] = [
  { Text: "Beranda", Path: "#", Icon: "home" },
  { Text: "Artikel", Path: "#", Icon: "description" },
  { Text: "Tanya Saya", Path: "#", Icon: "question_answer" },
  { Text: "Belajar & Mengajar", Path: "#", Icon: "school" },
  { Text: "Tentang Kami", Path: "#", Icon: "perm_device_information" }
]

