import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from '@angular/router';
import 'rxjs';
import { AppModule } from './app.module';
import { stringify } from '@angular/compiler/src/util';

export class Element {
  value: '';
  labels: '';
  constructor() {}
}
@Injectable({
  providedIn: 'root',
})
export class DataService {
  public allmonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  public transactions = [];
  public UserData = [];
  public spentData = [];
  public dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#98abc5',
          '#8a89a6',
          '#7b6888',
          '#6b486b',
          '#a05d56',
          '#d0743c',
          '#ff8c00',
        ],
      },
    ],
    labels: [],
  };
  public months = [];
  public data = [];
  public result;
  public setYear = '';
  public setMonth = '';
  constructor(private http: HttpClient) {}

  /*getData() {
    this.data = [];
    const promise = new Promise((resolve, reject) => {
      this.http
        .get('http://localhost:3000/budget')
        .toPromise()
        .then((res: any) => {
          /*for (let i = 0; i < res.myBudget.length; i++) {
            this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
            this.dataSource.labels[i] = res.myBudget[i].title;
            this.spentData[i] = res.myBudget[i].spent;
            const ele = new Element();
            ele.value = res.myBudget[i].budget;
            ele.labels = res.myBudget[i].title;
            this.data.push(ele);
            resolve();
          }*/
  /*});
    });
    return promise;
  }*/
  setyearMonth(monthyear) {
    let temp = monthyear.split(' ');
    this.setMonth = temp[0];
    this.setYear = temp[1];
  }
  getDataFromFirebase() {
    this.spentData = [];
    this.UserData = [];
    this.transactions = [];
    this.dataSource.datasets[0].data = [];
    const params = {
      token: localStorage.getItem('TOKEN'),
    };
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .get('http://localhost:3000/getAllData', { params })
        .toPromise()
        .then((res: any) => {
          this.months = [];
          let i = 0;
          for (let year in res) {
            if (year != 'email' && year != 'username') {
              for (let month in res[year]) {
                this.months.push(month + ' ' + year);
              }
            }
          }
          if (!this.setMonth || !this.setYear) {
            const date = new Date();
            this.setMonth = this.allmonths[date.getUTCMonth()];
            this.setYear = date.getFullYear().toString();
          }
          const budgetData = res[this.setYear][this.setMonth]['Budget'];
          const expData = res[this.setYear][this.setMonth]['Expense'];
          for (let budget in budgetData) {
            this.dataSource.datasets[0].data[i] = budgetData[budget];
            this.dataSource.labels[i] = budget;
            this.spentData[i] = expData[budget];

            i++;
          }
          this.transactions = res[this.setYear][this.setMonth]['Transactions'];
          this.UserData = res[this.setYear][this.setMonth]['Budget'];
          resolve();
        });
    });
    return promise;
  }
  insertCategory(category: string, amount: string) {
    const params = {
      token: localStorage.getItem('TOKEN'),
      category: category,
      Amount: amount,
      month: this.setMonth,
      year: this.setYear,
    };
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .get('http://localhost:3000/insertCategory', { params })
        .toPromise()
        .then((res: any) => {
          resolve();
        });
    });
    return promise;
  }
  deleteCategory(rows) {
    const params = {
      token: localStorage.getItem('TOKEN'),
      key: rows.key,
      value: rows.value,
      month: this.setMonth,
      year: this.setYear,
    };
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .get('http://localhost:3000/deleteCategory', { params })
        .toPromise()
        .then((res: any) => {
          resolve();
        });
    });
    return promise;
  }
  insertTransaction(
    category: string,
    amount: string,
    detail: string,
    date: string
  ) {
    const params = {
      token: localStorage.getItem('TOKEN'),
      Category: category,
      Date: date,
      Details: detail,
      Spent: amount,
      month: this.setMonth,
      year: this.setYear,
    };
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .get('http://localhost:3000/insertTransaction', { params })
        .toPromise()
        .then((res: any) => {
          resolve();
        });
    });
    return promise;
  }
  deleteTransactions(id: string, category: string, spent: string) {
    const params = {
      token: localStorage.getItem('TOKEN'),
      id: id,
      category: category,
      spent: spent,
      month: this.setMonth,
      year: this.setYear,
    };
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .get('http://localhost:3000/deleteTransactions', { params })
        .toPromise()
        .then((res: any) => {
          resolve();
        });
    });
    return promise;
  }
  addMonthToDB(month: string, year: string) {
    const params = {
      token: localStorage.getItem('TOKEN'),
      month: month,
      year: year,
      currMonth: this.setMonth,
      currYear: this.setYear,
    };
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .get('http://localhost:3000/addMonthtoDB', { params })
        .toPromise()
        .then((res: any) => {
          resolve();
        });
    });

    return promise;
  }
}
