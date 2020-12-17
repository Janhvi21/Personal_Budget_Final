import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data, Router } from '@angular/router';
import 'rxjs';
import { AppModule } from './app.module';
import { stringify } from '@angular/compiler/src/util';
declare var $: any;
import { environment } from '../environments/environment';

export class Element {
  value: '';
  labels: '';
  constructor() {}
}
@Injectable({
  providedIn: 'root',
})
export class DataService {
  public userName = '';
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
  constructor(private http: HttpClient, public router: Router) {}

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
    let token = localStorage.getItem('TOKEN');
    let uid = localStorage.getItem('uid');
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .get(environment.URL + ':3000/getAllData', {
          headers: {
            Authorization: `Bearer ${token}`,
            uid: uid,
          },
        })
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
          this.userName = res['username'];
          resolve();
        })
        .catch((error: any) => {
          resolve();
          if (error.status == 401 || error.statusText == 'Unauthorized') {
            this.router.navigate(['/login']);
            this.removeBackdrop();
          }
        });
    });
    return promise;
  }
  insertCategory(category: string, amount: string) {
    let token = localStorage.getItem('TOKEN');
    let uid = localStorage.getItem('uid');
    const params = {
      category: category,
      Amount: amount,
      month: this.setMonth,
      year: this.setYear,
    };
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .post(
          environment.URL + ':3000/insertCategory',
          { params },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              uid: uid,
            },
          }
        )
        .toPromise()
        .then((res: any) => {
          resolve();
        })
        .catch((error: any) => {
          resolve();
          if (error.status == 401 || error.statusText == 'Unauthorized') {
            this.router.navigate(['/login']);
            this.removeBackdrop();
          }
        });
    });
    return promise;
  }
  deleteCategory(rows) {
    let token = localStorage.getItem('TOKEN');
    let uid = localStorage.getItem('uid');
    const params = {
      key: rows.key,
      value: rows.value,
      month: this.setMonth,
      year: this.setYear,
    };
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .post(
          environment.URL + ':3000/deleteCategory',
          { params },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              uid: uid,
            },
          }
        )
        .toPromise()
        .then((res: any) => {
          resolve();
        })
        .catch((error: any) => {
          resolve();
          if (error.status == 401 || error.statusText == 'Unauthorized') {
            this.router.navigate(['/login']);
            this.removeBackdrop();
          }
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
    let token = localStorage.getItem('TOKEN');
    let uid = localStorage.getItem('uid');
    const params = {
      Category: category,
      Date: date,
      Details: detail,
      Spent: amount,
      month: this.setMonth,
      year: this.setYear,
    };
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .post(
          environment.URL + ':3000/insertTransaction',
          { params },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              uid: uid,
            },
          }
        )
        .toPromise()
        .then((res: any) => {
          resolve();
        })
        .catch((error: any) => {
          resolve();
          if (error.status == 401 || error.statusText == 'Unauthorized') {
            this.router.navigate(['/login']);
            this.removeBackdrop();
          }
        });
    });
    return promise;
  }
  deleteTransactions(id: string, category: string, spent: string) {
    let token = localStorage.getItem('TOKEN');
    let uid = localStorage.getItem('uid');
    const params = {
      id: id,
      category: category,
      spent: spent,
      month: this.setMonth,
      year: this.setYear,
    };
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .post(
          environment.URL + ':3000/deleteTransactions',
          { params },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              uid: uid,
            },
          }
        )
        .toPromise()
        .then((res: any) => {
          resolve();
        })
        .catch((error: any) => {
          resolve();
          if (error.status == 401 || error.statusText == 'Unauthorized') {
            this.router.navigate(['/login']);
            this.removeBackdrop();
          }
        });
    });
    return promise;
  }
  addMonthToDB(month: string, year: string) {
    let token = localStorage.getItem('TOKEN');
    let uid = localStorage.getItem('uid');
    const params = {
      month: month,
      year: year,
      currMonth: this.setMonth,
      currYear: this.setYear,
    };
    const promise = new Promise<void>((resolve, reject) => {
      this.http
        .post(
          environment.URL + ':3000/addMonthtoDB',
          { params },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              uid: uid,
            },
          }
        )
        .toPromise()
        .then((res: any) => {
          resolve();
        })
        .catch((error: any) => {
          console.log(error);
          resolve();
          if (error.status == 401 || error.statusText == 'Unauthorized') {
            this.router.navigate(['/login']);
            this.removeBackdrop();
          }
        });
    });

    return promise;
  }
  removeBackdrop() {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
}
