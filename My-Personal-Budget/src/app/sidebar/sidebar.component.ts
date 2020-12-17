import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  selectedMenu: string = 'Dashboard';

  public refreshmodal;
  public intervalId;

  constructor(
    public loginServiceService: LoginServiceService,
    public dataService: DataService,
    public router: Router
  ) {}
  ngOnInit() {}
  ngAfterViewInit(): void {
    this.intervalId = setTimeout(this.callTimer.bind(this), 60000);
    this.refreshmodal = setTimeout(this.showRefreshToken.bind(this), 50000);
  }
  showRefreshToken(): void {
    document.getElementById('refresh').click();
  }
  callTimer(): void {
    document.getElementById('closeRefreshModal').click();
    //this.loginServiceService.logout();
    clearTimeout(this.intervalId);
    clearTimeout(this.refreshmodal);
  }

  onRefreshTimer() {
    this.loginServiceService.signin(
      localStorage.getItem('Email'),
      localStorage.getItem('Password')
    );
    clearTimeout(this.intervalId);
    clearTimeout(this.refreshmodal);
    this.ngAfterViewInit();
  }
  public OnLogout(): void {
    this.loginServiceService.logout();
  }
  public onChangeMenu(menu): void {
    this.selectedMenu = menu;
  }
}
