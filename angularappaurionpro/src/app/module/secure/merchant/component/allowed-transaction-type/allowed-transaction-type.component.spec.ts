import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowedTransactionTypeComponent } from './allowed-transaction-type.component';

describe('AllowedTransactionTypeComponent', () => {
  let component: AllowedTransactionTypeComponent;
  let fixture: ComponentFixture<AllowedTransactionTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowedTransactionTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowedTransactionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
