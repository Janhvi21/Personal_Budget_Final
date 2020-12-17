import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase';
import { DataService } from './data.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  ErrorMessage: '';
  isLoggedIn = false;
  Token: '';
  public date = new Date();

  constructor(
    public firebaseAuth: AngularFireAuth,
    private router: Router,
    private http: HttpClient,
    private dataService: DataService
  ) {}

  async signin(email: string, password: string): Promise<boolean> {
    let currentToken = '';
    await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(async (res) => {
        let uid = res.user.uid;
        let username = res.user.displayName;
        const promise = new Promise<void>((resolve, reject) => {
          this.http
            .post(environment.URL + ':3000/createToken', {
              uid: uid,
              username: username,
            })
            .toPromise()
            .then((res1: any) => {
              this.http
                .get(environment.URL + ':3000/verifyToken', {
                  headers: {
                    Authorization: `Bearer ${res1.token}`,
                  },
                })
                .toPromise()
                .then((tokenResponse) => {
                  localStorage.setItem('Email', email);
                  localStorage.setItem('Password', password);
                  localStorage.setItem('TOKEN', res1.token);
                  currentToken = res1.token;
                  localStorage.setItem('uid', uid);
                  this.isLoggedIn = true;
                  this.dataService.setMonth = this.dataService.allmonths[
                    this.date.getUTCMonth()
                  ];
                  this.dataService.setYear = this.date.getFullYear().toString();
                  this.router.navigate(['/sidebar']);
                });
            });
        });
        return true;
      })
      .catch((Error) => {
        this.ErrorMessage = Error.message;
      });
    return false;
  }
  async signup(name: string, email: string, password: string) {
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .post(environment.URL + ':3000/createNewUser', {
          username: name,
          password: password.trim(),
          email: email.trim(),
          monthly_expenses: '',
        })
        .toPromise()
        .then((res1: any) => {
          if (res1.success == true) {
            this.signin(email, password).then((res: any) => {
              resolve();
            });
          }
        });
    });
  }
  logout() {
    this.isLoggedIn=false;
    this.firebaseAuth.signOut();
    this.router.navigate(['/login']);
  }
}
