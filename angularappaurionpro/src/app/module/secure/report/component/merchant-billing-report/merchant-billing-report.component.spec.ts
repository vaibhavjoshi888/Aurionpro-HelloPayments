import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantBillingReportComponent } from './merchant-billing-report.component';

describe('MerchantBillingReportComponent', () => {
  let component: MerchantBillingReportComponent;
  let fixture: ComponentFixture<MerchantBillingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantBillingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantBillingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
