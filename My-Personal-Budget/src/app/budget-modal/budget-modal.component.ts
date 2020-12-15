import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-budget-modal',
  templateUrl: './budget-modal.component.html',
  styleUrls: ['./budget-modal.component.scss'],
})
export class BudgetModalComponent implements OnInit {
  category: string = '';
  amount: string = '';
  mySubscription: any;
  @Input() budget;
  @Output() childEvent = new EventEmitter();
  constructor(public dataService: DataService) {}

  ngOnInit(): void {
  }

  onAddCategory(category: string, amount: string) {
    this.dataService
      .insertCategory(category, amount)
      .then((res: any) => {
        this.dataService.getDataFromFirebase();
        setTimeout(() => {
          this.budget = this.dataService.UserData;
          this.ngOnInit();
        }, 500);
      });
  }
  OnDelete(rows) {
    this.dataService.deleteCategory(rows).then((res: any) => {
      this.dataService.getDataFromFirebase();
      setTimeout(() => {
        this.budget = this.dataService.UserData;
        this.ngOnInit();
      }, 500);
    });
  }
  onClose() {
    this.childEvent.emit('reload');
  }
}
