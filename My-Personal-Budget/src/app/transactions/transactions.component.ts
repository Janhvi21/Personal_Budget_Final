import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  constructor(public dataServices: DataService) {}
  headers = [];
  transaction = [];
  categories = [];
  Category = '';
  Date = new Date();
  Details = '';
  Spent = 0;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  showform: boolean = false;

  ngOnInit(): void {
    this.headers = [];
    this.categories = [];
    if (
      this.dataServices.transactions &&
      this.dataServices.transactions.length > 0
    ) {
      for (let row in this.dataServices.transactions[0]) {
        this.headers.push(row);
      }
    }
    for (let cat in this.dataServices.UserData) {
      this.categories.push(cat);
    }
  }
  changeCards(form) {
    this.showform = !this.showform;
  }
  onAddTransaction(
    Category: string,
    Date: Date,
    Detail: string,
    Spent: number
  ) {
    this.dataServices
      .insertTransaction(
        Category,
        Spent.toString(),
        Detail,
        Date.toLocaleDateString('en-US')
      )
      .then((res) => {
        this.dataServices.getDataFromFirebase();
        setTimeout(() => {
          this.ngOnInit();
        }, 800);
      });
    this.showform = false;
  }
  OnDelete(id: string, category: string, spent: string) {
    this.dataServices
      .deleteTransactions(id, category, spent)
      .then((res: any) => {
        this.dataServices.getDataFromFirebase();
        setTimeout(() => {
          this.ngOnInit();
        }, 500);
      });
  }
}
