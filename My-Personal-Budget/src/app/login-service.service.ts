import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase';
import { DataService } from './data.service';

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
        await firebase
          .auth()
          .currentUser.getIdToken(true)
          .then(function (idToken) {
            localStorage.setItem('Email', email);
            localStorage.setItem('Password', password);
            localStorage.setItem('TOKEN', idToken);
            currentToken = idToken;
          });
        const params = {
          token: currentToken,
        };
        this.http
          .get('http://localhost:3000/verifyUser', { params })
          .toPromise()
          .then((res2: any) => {
            this.isLoggedIn = true;
            this.dataService.setMonth = this.dataService.allmonths[
              this.date.getUTCMonth()
            ];
            this.dataService.setYear = this.date.getFullYear().toString();
            this.router.navigate(['/sidebar']);
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
        .post('http://localhost:3000/createNewUser', {
          username: name,
          password: password.trim(),
          email: email.trim(),
          monthly_expenses: '',
        })
        .toPromise()
        .then((res1: any) => {
          this.signin(email, password).then((res: any) => {
            resolve();
          });
        });
    });
  }
  logout() {
    this.firebaseAuth.signOut();
    this.router.navigate(['/login']);
  }
}
