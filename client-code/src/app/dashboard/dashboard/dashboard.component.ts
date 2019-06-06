import { Component, OnInit, OnDestroy } from '@angular/core';
import { Episode } from '../episodes/episode';
import { TimelineOptions } from '../timeline-vis/timeline-options';
import { MapData } from '../map-vis/map-data';
import { MatSliderChange } from '@angular/material';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { GroupRepositoryService } from '../../core/services/group-repository.service';
import { switchMap } from 'rxjs/operators';
import { Group, UserOptions, GroupSettings } from '@shared';
import { Observable } from 'rxjs';
import { UserOptionsRepositoryService } from '@app/core';
import { TimelineOtherBrushes } from '../timeline-vis/timeline-other-brushes';

@Component({
  selector: 'dbvis-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit, OnDestroy {
  episodeData: Episode;

  timelineOptions: TimelineOptions = {
    begin: new Date('2020-01-01 00:00:00'),
    end: new Date('2020-03-31 23:59:59'),
    userColor: 'black'
  };

  timelineOtherBrushes: TimelineOtherBrushes[] = [];

  mapData: MapData[];

  groupSettings: GroupSettings;

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
    this.currentGroup$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.groupRepository.get(params.get('id'));
      })
    );

    this.currentGroup$.subscribe(group => {
      this.currentGroup = group;

      this.groupRepository.listenForUpdates(group.groupId).subscribe((groupSettings) => {
        this.groupSettings = groupSettings;
        this.otherUserOptionsUpdated(groupSettings.users.filter(u => u.id !== opts.id));
      });

      const opts = this.userOptionsRepository.getOptions();
      if (opts.groupId !== group.groupId) {
        opts.groupId = group.groupId;
        this.userOptionsRepository.setOptions(opts);
      }
    });

    this.userOptionsRepository.userOptions$.subscribe(opts => {
      this.userOptions = opts;

      this.timelineOptions.userColor = this.userOptions.color;

      this.timelineOptions = {...this.timelineOptions};
    });
    // throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.userOptionsRepository.deleteUser(this.userOptions.id);
    this.groupRepository.stopListenForUpdates();
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

  timelineBrushed(brush: [Date, Date]) {
    this.userOptions.timelineBrush = brush;
    this.userOptionsRepository.setOptions(this.userOptions);
  }


  private otherUserOptionsUpdated(userOptions: UserOptions[]) {
    const newBrushes: TimelineOtherBrushes[] = userOptions.map(d => {
      return {
        name: d.name,
        color: d.color,
        brush: d.timelineBrush
      } as TimelineOtherBrushes;
    });
    this.timelineOtherBrushes = newBrushes;
  }

  removeUserFromGroup(user: UserOptions) {
    this.userOptionsRepository.deleteUser(user.id);
  }

}
