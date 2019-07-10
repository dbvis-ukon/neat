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
import * as d3 from 'd3';
import { StreamGraphItem } from '../timeline/stream-graph-item';
import { StreamGraphRepositoryService } from '../timeline/stream-graph-repository.service';
import { TimelineOptions } from '../timeline/timeline-options';
import { TimelineOtherBrushes } from '../timeline/timeline-other-brushes';
import { MatDialog } from '@angular/material';
import { FilterDialogComponent } from '../timeline/filter-dialog/filter-dialog.component';
import { FilterDialogData } from '../timeline/filter-dialog/filter-dialog-data';
import { SelectableFilterItem } from '../timeline/filter-dialog/selectable-filter-item';
import { MasterTimelineRepositoryService } from '../master-timeline-repository.service';
import { MasterTimelineItem } from '../master-timeline-item';

@Component({
  selector: 'dbvis-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit, OnDestroy {

  globalHoverLine: Date;

  dashboardLayout: 'default' | 'timelines' = 'timelines';

  timelineData: MasterTimelineItem[] = [];

  timelineDataTitles: string[] = [];

  episodeData: Episode;

  timelineOptions: TimelineOptions = {
    begin: new Date('2020-04-06 00:00:00'),
    end: new Date('2020-04-10 11:30:00'),
    userColor: 'black',
    brushOn: true,
    height: 100
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
    private groupRepository: GroupRepositoryService,
    private userOptionsRepository: UserOptionsRepositoryService,
    private mc1DataRepository: Mc1DataRepositoryService,
    private streamGraphRepository: StreamGraphRepositoryService,
    public dialog: MatDialog,
    private masterTimelineRepository: MasterTimelineRepositoryService
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

    this.streamGraphRepository.getData('/assets/TRIALJSONM3C.json')
      .subscribe(data => {
        this.streamGraphData = data;
      });


    this.timelineData = this.masterTimelineRepository.getDefaults();
    this.timelineDataTitles = this.masterTimelineRepository.getAllTitles();
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

  drop(event: CdkDragDrop<MasterTimelineItem[]>) {
    moveItemInArray(this.timelineData, event.previousIndex, event.currentIndex);
  }

  openFilterDialog(timelineItem: MasterTimelineItem): void {
    const allKeys = this.streamGraphRepository.getAllKeys(timelineItem.data);
    const selection: SelectableFilterItem[] = timelineItem.selection
      || allKeys.map(s => ({name: s, selected: true} as SelectableFilterItem));
    timelineItem.selection = selection;

    const filterDialogData = {allKeys, selection} as FilterDialogData;

    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '250px',
      data: filterDialogData
    });

    dialogRef.afterClosed().subscribe((result: FilterDialogData) => {
      const res = result || filterDialogData;
      timelineItem.filteredData = this.streamGraphRepository
        .filter(timelineItem.data, res.selection
          .filter(d => d.selected)
          .map(d => d.name)
        );
    });
  }

  addMasterTimeline(title: string) {
    this.timelineData.push(this.masterTimelineRepository.getByTitle(title));
  }

  removeMasterTimeline(tl: MasterTimelineItem) {
    const idx = this.timelineData.indexOf(tl);
    if (idx > -1) {
      this.timelineData.splice(idx, 1);
    }
  }

}
