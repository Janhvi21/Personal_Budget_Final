import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../login-service.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  Password: string = '';
  Email: string = '';
  SignedIn: boolean = false;
  constructor(
    private loginServiceService: LoginServiceService
  ) {}

  ngOnInit(): void {}

  async onSignIn(email: string, password: string) {
    this.SignedIn = await this.loginServiceService.signin(email, password);

  }
}
