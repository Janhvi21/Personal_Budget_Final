import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetModalComponent } from './budget-modal.component';

describe('BudgetModalComponent', () => {
  let component: BudgetModalComponent;
  let fixture: ComponentFixture<BudgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
