import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { User } from 'src/app/model';
import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { StatemanagementService } from 'src/app/services/statemanagement.service';

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
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class UserProfileComponent implements OnInit {

  constructor(private profileService: ProfileService, public snackBar: MatSnackBar, private stateService: StatemanagementService) { }
  profile: User = new User();
  date = new FormControl(moment());
  ngOnInit() {
    let currentUser: any
    if (this.stateService.getAuth()) {
      currentUser = this.stateService.getAuth();
      this.profileService.get(currentUser.username).subscribe(res => {
        this.profile = res[0];
      });
    }
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
      duration: 10000,
      panelClass: ['blue-snackbar']
    });
  }

  save() {
    let newDate = new Date(this.profile.BirthDate);
    this.profile.BirthDate = moment(newDate).format();
    console.log(this.profile.BirthDate);
    this.profileService.put(this.profile).subscribe(res => {
      this.openSnackBar("Tersimpan");
    });
  }
}