import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamgraphTooltipComponent } from './streamgraph-tooltip.component';

describe('StreamgraphTooltipComponent', () => {
  let component: StreamgraphTooltipComponent;
  let fixture: ComponentFixture<StreamgraphTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamgraphTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamgraphTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
