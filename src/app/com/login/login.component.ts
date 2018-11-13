import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login-v2';
import { LoginService } from 'src/app/services/login.service';
import { Account,AuthData } from '../../model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  account: Account = new Account;
  hide: boolean = true;
  constructor(public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuthData,
    private socialAuthService: AuthService,
    private loginService: LoginService) { }

  ngOnInit() {

  }

  socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
      this.socialAuthService.signIn(socialPlatformProvider).then(
        (userData) => {
          
          this.loginService.login_fb(userData.id, userData.token).subscribe(login => {
            this.data.username = login.username;
            this.data.orn = login.orn;
            this.data.profilepic = login.profilepic;
            this.data.auth = login.auth;
            this.dialogRef.close();
          });
        }
      );
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
      this.socialAuthService.signIn(socialPlatformProvider).then(
        (userData) => {
          
          this.loginService.login_g(userData.token, userData.idToken).subscribe(login => {
            this.data.username = login.username;
            this.data.orn = login.orn;
            this.data.profilepic = login.profilepic;
            this.data.auth = login.auth;
            this.data.usercode = login.usercode;
            this.dialogRef.close();
          });
        }
      );
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}