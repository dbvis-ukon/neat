import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeTooltipComponent } from './episode-tooltip.component';

describe('EpisodeTooltipComponent', () => {
  let component: EpisodeTooltipComponent;
  let fixture: ComponentFixture<EpisodeTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpisodeTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodeTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
