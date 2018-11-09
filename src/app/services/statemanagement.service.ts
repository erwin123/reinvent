import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StatemanagementService {
  private stateLogin = new BehaviorSubject<any>(localStorage.getItem('auth'));
  currentStateLogin = this.stateLogin.asObservable();
  constructor() { }

  setCurrentStateLogin(data: any) {
    if (data) {
      localStorage.setItem('auth', JSON.stringify(data));
      this.stateLogin.next(data);
    }
  }

  getAuth() {
    return JSON.parse(localStorage.getItem('auth'));
  }

  logOut() {
    localStorage.removeItem('auth');
  }
}
