import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicChangePasswordComponent } from './public-change-password.component';

describe('PublicChangePasswordComponent', () => {
  let component: PublicChangePasswordComponent;
  let fixture: ComponentFixture<PublicChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
