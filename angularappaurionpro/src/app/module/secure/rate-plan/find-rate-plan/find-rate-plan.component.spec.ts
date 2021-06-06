import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindRatePlanComponent } from './find-rate-plan.component';

describe('FindRatePlanComponent', () => {
  let component: FindRatePlanComponent;
  let fixture: ComponentFixture<FindRatePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindRatePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindRatePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
