import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingConfigComponent } from './billing-config.component';

describe('BillingConfigComponent', () => {
  let component: BillingConfigComponent;
  let fixture: ComponentFixture<BillingConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
