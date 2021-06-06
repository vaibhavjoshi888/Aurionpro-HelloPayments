import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMerchantComponent } from './find-merchant.component';

describe('FindMerchantComponent', () => {
  let component: FindMerchantComponent;
  let fixture: ComponentFixture<FindMerchantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindMerchantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
