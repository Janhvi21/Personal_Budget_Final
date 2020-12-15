import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  selectedMenu: string = 'Dashboard';
  constructor(public loginServiceService: LoginServiceService) {}

  ngOnInit(): void {}

  public OnLogout(): void {
    this.loginServiceService.logout();
  }
  public onChangeMenu(menu): void {
    this.selectedMenu = menu;
  }
}
