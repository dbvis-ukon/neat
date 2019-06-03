import { Component, OnInit } from '@angular/core';
import { Episode } from '../episode-vis/episode';
import { TimelineOptions } from '../timeline-vis/timeline-options';
import { MapData } from '../map-vis/map-data';
import { MatSliderChange } from '@angular/material';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { GroupRepositoryService } from '../group-repository.service';
import { switchMap } from 'rxjs/operators';
import { Group } from '../../../../shared/group';
import { Observable } from 'rxjs';
import { UserOptions } from '../../../../shared/user-options';
import { UserOptionsRepositoryService } from '../user-options-repository.service';

@Component({
  selector: 'dbvis-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  episodeData: Episode;

  timelineOptions: TimelineOptions = {
    begin: new Date('2020-01-01 00:00:00'),
    end: new Date('2020-03-31 23:59:59')
  };

  mapData: MapData[];

  currentGroup$: Observable<Group>;
  currentGroup: Group;

  userOptions: UserOptions;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupRepository: GroupRepositoryService,
    private userOptionsRepository: UserOptionsRepositoryService
  ) {}

  ngOnInit(): void {
    console.log('init', this.route.params);
    // this.route.paramMap.subscribe(params => {
    //   console.log('param changed', params);
    // });
    this.currentGroup$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        console.log('params', params);
        return this.groupRepository.get(params.get('id'));
      })
    );

    this.currentGroup$.subscribe(group => {
      this.currentGroup = group;
    });

    this.userOptionsRepository.userOptions$.subscribe(opts => {
      this.userOptions = opts;
    });
    // throw new Error('Method not implemented.');
  }

  /**
   * on every slider change this function is triggered
   * @param change the change event
   */
  sliderChanged(change: MatSliderChange) {
    this.mapData = this.generateRandomMapData(change.value);
  }

  private generateRandomMapData(n: number): MapData[] {
    const arr: MapData[] = [];

    for (let i = 0; i < n; i++) {
      arr.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random()
      });
    }

    return arr;
  }

}
