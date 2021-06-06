import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicContactSupportComponent } from './public-contact-support.component';

describe('PublicContactSupportComponent', () => {
  let component: PublicContactSupportComponent;
  let fixture: ComponentFixture<PublicContactSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicContactSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicContactSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
