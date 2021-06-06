import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingConfigAchComponent } from './billing-config-ach.component';

describe('BillingConfigAchComponent', () => {
  let component: BillingConfigAchComponent;
  let fixture: ComponentFixture<BillingConfigAchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingConfigAchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingConfigAchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
