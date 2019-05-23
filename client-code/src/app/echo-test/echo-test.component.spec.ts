import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchoTestComponent } from './echo-test.component';

describe('EchoTestComponent', () => {
  let component: EchoTestComponent;
  let fixture: ComponentFixture<EchoTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchoTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchoTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
