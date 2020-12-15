import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  Password: '';
  Email: '';
  firstName: '';
  lastName: '';
  constructor(public loginServiceService: LoginServiceService) {}

  ngOnInit(): void {}

  async onSignUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const userName = firstName + lastName;
    await this.loginServiceService.signup(userName, email, password);
  }
}
