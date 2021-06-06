import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingConfigCardComponent } from './billing-config-card.component';

describe('BillingConfigCardComponent', () => {
  let component: BillingConfigCardComponent;
  let fixture: ComponentFixture<BillingConfigCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingConfigCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingConfigCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
