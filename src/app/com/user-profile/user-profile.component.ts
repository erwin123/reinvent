import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { User, Follow, AuthData } from 'src/app/model';
import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { StatemanagementService } from 'src/app/services/statemanagement.service';
import { ActivatedRoute, Router } from '@angular/router';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class UserProfileComponent implements OnInit {

  constructor(private router: Router,private profileService: ProfileService, private route: ActivatedRoute, public snackBar: MatSnackBar, private stateService: StatemanagementService) { }
  profile: User = new User();
  date = new FormControl(moment());
  viewMode: boolean = false;
  followed: boolean = false;
  currentUser: AuthData;
  ngOnInit() {

    
    if (this.stateService.getAuth()) {
      this.currentUser = this.stateService.getAuth();
    }else{
      this.router.navigate(['main/write']);
    }
    

    this.route.queryParams.subscribe(params => {
      if (params.pop) {
        this.viewMode = true;
        setTimeout(() => {
          this.profileService.getCode(params.pop).subscribe(res => {
            if (res[0].UserCode) {
              this.profileService.getFollowCr(params.pop, this.currentUser.usercode).subscribe(f => {
                this.profile = res[0];
                if (f.length>0) {
                  this.followed = true;
                } else {
                  this.followed = false;
                }
              })
            }
          });
        }, 10);
      } else {
        this.viewMode = false;
        setTimeout(() => {
          this.profileService.getCode(this.currentUser.usercode).subscribe(res => {
            this.profile = res[0];
          });
        }, 300);
      }
    });


  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 5000,
      panelClass: ['blue-snackbar']
    });
  }

  follow(userCode: string) {
    let follow: Follow = new Follow();
    follow.UserCode = userCode;
    follow.FollowerCode = this.currentUser.usercode;
    if (!this.followed) {
      this.profileService.addFollow(follow).subscribe(add => {
        if (add[0]) {
          this.followed = true;
        }
      })
    } else {
      this.profileService.delFollow(follow).subscribe(add => {

        this.followed = false;

      })
    }
  }

  save() {
    let newDate = new Date(this.profile.BirthDate);
    this.profile.BirthDate = moment(newDate).format();
    this.profileService.put(this.profile).subscribe(res => {
      this.openSnackBar("Tersimpan");
    });
  }
}