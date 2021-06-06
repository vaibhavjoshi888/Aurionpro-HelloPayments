import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantRatePlanComponent } from './merchant-rate-plan.component';

describe('MerchantRatePlanComponent', () => {
  let component: MerchantRatePlanComponent;
  let fixture: ComponentFixture<MerchantRatePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantRatePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantRatePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
