import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionListReportComponent } from './transaction-list-report.component';

describe('TransactionListReportComponent', () => {
  let component: TransactionListReportComponent;
  let fixture: ComponentFixture<TransactionListReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionListReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
