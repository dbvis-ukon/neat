import { Component, OnInit, OnDestroy } from '@angular/core';
import { Episode } from '../episodes/episode';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { GroupRepositoryService } from '../../core/services/group-repository.service';
import { switchMap } from 'rxjs/operators';
import { Group, UserOptions, GroupSettings, Mc1Item } from '@shared';
import { Observable } from 'rxjs';
import { UserOptionsRepositoryService } from '@app/core';
import { Mc1DataRepositoryService } from '@app/core/services/mc1-data-repository.service';
import { MapOptions } from '../map/map-options';
import { NeighborhoodSelection } from '@shared/neighborhood-selection';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import { StreamGraphItem } from '../timeline/stream-graph-item';
import { StreamGraphRepositoryService } from '../timeline/stream-graph-repository.service';
import { TimelineOptions } from '../timeline/timeline-options';
import { TimelineOtherBrushes } from '../timeline/timeline-other-brushes';

interface TimelineItem {
  type: 'streamgraph' | 'episodes';
  title: string;
  dataUrl: string;
  colors: string[];
  data?: StreamGraphItem[]; // FIXME
}

@Component({
  selector: 'dbvis-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit, OnDestroy {

  dashboardLayout: 'default' | 'timelines' = 'timelines';

  timelineData: TimelineItem[] = [
    {
      type: 'streamgraph',
      title: 'Uncertainties',
      dataUrl: '/assets/TRIALJSONMC3.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'Tweets',
      dataUrl: '/assets/TRIALJSONMC3.json',
      colors: d3.schemeCategory10 as string[]
    }
  ];

  episodeData: Episode;

  timelineOptions: TimelineOptions = {
    begin: new Date('2020-04-06 00:00:00'),
    end: new Date('2020-04-10 11:30:00'),
    userColor: 'black'
  };

  timelineOtherBrushes: TimelineOtherBrushes[] = [];

  brushExternal: [Date, Date];


  mapOptions: MapOptions = {
    visibleLayers: [1]
  };

  groupSettings: GroupSettings;

  currentGroup$: Observable<Group>;
  currentGroup: Group;

  userOptions: UserOptions;

  /**
   * This variable contains the brushed mc1 data.
   */
  brushedMc1Data: Mc1Item[];

  streamGraphData: StreamGraphItem[];

  // streamGraphColors: string[] = ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'];
  streamGraphColors: string[] = d3.schemeCategory10 as string[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupRepository: GroupRepositoryService,
    private userOptionsRepository: UserOptionsRepositoryService,
    private mc1DataRepository: Mc1DataRepositoryService,
    private http: HttpClient,
    private streamGraphRepository: StreamGraphRepositoryService
  ) {}

  ngOnInit(): void {
    this.currentGroup$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.groupRepository.get(params.get('id'));
      })
    );

    this.currentGroup$.subscribe(group => {
      this.currentGroup = group;

      const opts = this.userOptionsRepository.getOptions();

      this.groupRepository.listenForUpdates(group.groupId).subscribe((groupSettings) => {
        this.groupSettings = groupSettings;
        this.otherUserOptionsUpdated(groupSettings.users.filter(u => u.id !== opts.id));
      });

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

    this.streamGraphRepository.getData('/assets/TRIALJSONMC3.json')
      .subscribe(data => {
        this.streamGraphData = data;
      });


    this.timelineData.forEach(tl => {
      if (tl.type === 'streamgraph') {
        this.streamGraphRepository.getData(tl.dataUrl).subscribe(data => tl.data = data);
      }
    });
  }

  ngOnDestroy(): void {
    this.userOptionsRepository.deleteUser(this.userOptions.id);
    this.groupRepository.stopListenForUpdates();
  }

  timelineBrushed(brush: [Date, Date]) {
    this.brushExternal = [brush[0], brush[1]];
    this.userOptions.timelineBrush = brush;
    this.userOptionsRepository.setOptions(this.userOptions);

    // update mc1 data
    this.mc1DataRepository.getBrushFilteredMc1Data(brush)
      .subscribe(data => this.brushedMc1Data = data);

    this.mapOptions.timelineBrush = brush;
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

  mapNeighborhoodChanged(data: NeighborhoodSelection) {
    this.userOptions.neighborhoodSelection = data;
    this.userOptionsRepository.setOptions(this.userOptions);
  }

  drop(event: CdkDragDrop<TimelineItem[]>) {
    moveItemInArray(this.timelineData, event.previousIndex, event.currentIndex);
  }

}
