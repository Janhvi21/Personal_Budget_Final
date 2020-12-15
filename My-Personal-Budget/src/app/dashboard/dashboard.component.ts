import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Chart } from 'chart.js';
import * as d3 from 'd3';
import { isEmptyObject } from 'jquery';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
declare var $: any;
import {
  KeyValueChanges,
  KeyValueDiffer,
  KeyValueDiffers,
} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit, OnInit, OnDestroy {
  private svg;
  private margin = 50;
  private width = 750;
  private height = 470;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;
  public totalBudget = 0;
  public totalSpent = 0;
  public totalSaving = 0;
  public budget;
  public transactions = [];
  public monthData = [];
  public month;
  public addMonth;
  public addmonthSelected = 'January';
  public addyearSelected = '2020';
  public years;
  public date = new Date();
  public timeout;
  public refreshmodal;
  public showRefreshTokenModal = false;

  constructor(
    public dataService: DataService,
    public loginServiceService: LoginServiceService,
    private router: Router,
    private differs: KeyValueDiffers
  ) {}
  ngOnInit(): void {
    $('#datepicker').datepicker({
      format: 'mm-yyyy',
      startView: 'months',
      minViewMode: 'months',
    });
    this.years = [];
    for (let i = 0; i < 20; ++i) {
      this.years.push(2010 + i);
    }
  }
  ngOnDestroy(): void {
    console.log('Destroyed');
    clearTimeout(this.timeout);
    clearTimeout(this.refreshmodal);
  }
  ngAfterViewInit(): void {
    if (
      isEmptyObject(this.dataService.data) ||
      isEmptyObject(this.dataService.dataSource)
    ) {
      this.dataService.getDataFromFirebase();
      this.showRefreshToken();
      this.callTimer();
    }

    setTimeout(() => {
      this.createChart();
      //this.drawChart();
      this.createBarChart();
      this.budget = this.dataService.UserData;
      this.calculateTotalBudget();
      this.month = this.dataService.setMonth + ' ' + this.dataService.setYear;
    }, 500);
  }
  onRefreshTimer() {
    this.loginServiceService.signin(
      localStorage.getItem('Email'),
      localStorage.getItem('Password')
    );
    clearTimeout(this.timeout);
    clearTimeout(this.refreshmodal);
    this.showRefreshToken();
    this.callTimer();
  }
  showRefreshToken(): void {
    this.refreshmodal = setTimeout(() => {
      document.getElementById('refresh').click();
    }, 50000);
  }
  callTimer(): void {
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      document.getElementById('closeRefreshModal').click();
      localStorage.clear();
      this.loginServiceService.logout();
    }, 60000);
  }
  calculateTotalBudget(): void {
    this.totalSpent = 0;
    this.totalSaving = 0;
    this.totalBudget = 0;
    for (
      let i = 0;
      i < this.dataService.dataSource.datasets[0].data.length;
      i++
    ) {
      this.totalBudget += this.dataService.dataSource.datasets[0].data[i];
      this.totalSpent += this.dataService.spentData[i];
    }
    this.totalSaving = this.totalBudget - this.totalSpent;
  }
  reload(msg: string): void {
    this.dataService.dataSource.datasets[0].data = [];
    this.dataService.dataSource.labels = [];
    this.dataService.spentData = [];
    this.ngAfterViewInit();
  }
  createBarChart(): void {
    let myBarChart;
    if (myBarChart != null) {
      myBarChart.destroy();
    }
    const ctx = document.getElementById('barChart');

    const barData = {
      labels: this.dataService.dataSource.labels,
      datasets: [
        {
          label: 'Spent',
          backgroundColor: '#000000',
          data: this.dataService.spentData,
        },
        {
          label: 'Budget',
          backgroundColor: this.dataService.dataSource.datasets[0]
            .backgroundColor,
          data: this.dataService.dataSource.datasets[0].data,
        },
      ],
    };

    myBarChart = new Chart(ctx, {
      type: 'bar',
      data: barData,
      options: {
        barValueSpacing: 20,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
        },
      },
    });
  }
  // Using Chart.js
  createChart(): void {
    const ctx = document.getElementById('myChart');
    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataService.dataSource,
    });
  }
  onChangeMonth(month): void {
    this.dataService.setyearMonth(month);
    this.reload('');
  }
  addMonthToBudget(addmonth, addYear): void {
    let currmonth = this.month.split(' ');
    this.dataService.addMonthToDB(addmonth, addYear);
    this.reload('');
  }
}
