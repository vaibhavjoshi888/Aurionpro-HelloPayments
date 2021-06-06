import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRatePlanComponent } from './add-rate-plan.component';

describe('AddRatePlanComponent', () => {
  let component: AddRatePlanComponent;
  let fixture: ComponentFixture<AddRatePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRatePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRatePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
