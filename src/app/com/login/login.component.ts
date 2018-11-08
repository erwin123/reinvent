import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login-v2';
import { LoginService } from 'src/app/services/login.service';
import { Account } from '../../model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  account: Account= new Account;
  hide: boolean = true;
  constructor(public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private socialAuthService: AuthService,
    private loginService:LoginService) { }

  ngOnInit() {
    
  }

  socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
      this.socialAuthService.signIn(socialPlatformProvider).then(
        (userData) => {
          this.loginService.login_fb(userData.id, userData.token).subscribe(login =>{
            console.log(login);
          });
        }
      );
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
      this.socialAuthService.signIn(socialPlatformProvider).then(
        (userData) => {
          console.log(userData.idToken);
          this.loginService.login_g(userData.email, userData.idToken).subscribe(login =>{
            console.log(login);
          });
        }
      );
    }
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  manual() {
    this.loginService.login(this.account.username, this.account.password).subscribe(login =>{
      console.log(login);
    });
  }

}

export interface DialogData {
  animal: string;
  name: string;
}