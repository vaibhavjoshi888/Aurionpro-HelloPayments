import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransactionReportComponent } from './view-transaction-report.component';

describe('ViewTransactionReportComponent', () => {
  let component: ViewTransactionReportComponent;
  let fixture: ComponentFixture<ViewTransactionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTransactionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
