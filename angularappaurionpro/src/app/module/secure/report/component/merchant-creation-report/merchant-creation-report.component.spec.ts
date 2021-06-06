import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantCreationReportComponent } from './merchant-creation-report.component';

describe('MerchantCreationReportComponent', () => {
  let component: MerchantCreationReportComponent;
  let fixture: ComponentFixture<MerchantCreationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantCreationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantCreationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
