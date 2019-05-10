import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeVisComponent } from './episode-vis.component';

describe('EpisodeVisComponent', () => {
  let component: EpisodeVisComponent;
  let fixture: ComponentFixture<EpisodeVisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpisodeVisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodeVisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
