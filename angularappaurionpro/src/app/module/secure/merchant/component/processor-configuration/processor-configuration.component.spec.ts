import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessorConfigurationComponent } from './processor-configuration.component';

describe('ProcessorConfigurationComponent', () => {
  let component: ProcessorConfigurationComponent;
  let fixture: ComponentFixture<ProcessorConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessorConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessorConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
