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
import { AnnotationData } from '../timeline/AnnotationData';
import { Mc2RadiationItem } from '../map/mc2-radiation-item';
import { Mc2DataRepositoryService } from '@app/core/services/mc2-data-repository.service';


@Component({
  selector: 'dbvis-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit, OnDestroy {

  globalHoverLine: Date;

  dashboardLayout: 'default' | 'timelines' | 'annotations' = 'timelines';

  timelineData: MasterTimelineItem[] = [];

  timelineDataTitles: string[] = [];

  episodeData: Episode;

  masterTimelineItem: MasterTimelineItem;

  timelineOtherBrushes: TimelineOtherBrushes[] = [];

  brushExternal: [Date, Date] = [new Date('2020-04-08 07:24:00'), new Date('2020-04-08 14:45:00')];


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

  allAnnotations: AnnotationData[] = [];

  allRadiationData: Mc2RadiationItem[] = [];
  filteredRadiationData: Mc2RadiationItem[] = [];

  streamGraphTitles: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupRepository: GroupRepositoryService,
    private userOptionsRepository: UserOptionsRepositoryService,
    private mc1DataRepository: Mc1DataRepositoryService,
    private streamGraphRepository: StreamGraphRepositoryService,
    public dialog: MatDialog,
    private masterTimelineRepository: MasterTimelineRepositoryService,
    private mc2DataRepository: Mc2DataRepositoryService
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

      if (opts) {
        this.userOptionsRepository.sayHello(opts.id, this.currentGroup.groupId);
      }

      this.groupRepository.listenForUpdates(group.groupId).subscribe((groupSettings) => {
        this.groupSettings = groupSettings;

        if (groupSettings.users.filter(u => u.id === opts.id).length === 0) {
          // I got kicked lol
          this.userOptionsRepository.leaveGroup();
          this.router.navigate(['/groups', {kicked: true}]);
        }

        this.otherUserOptionsUpdated(groupSettings.users.filter(u => u.id !== opts.id));

        const myMap: Map<string, MasterTimelineItem> = new Map();

        this.timelineData.forEach(t => {
          myMap.set(t.originalTitle, t);
          // remove annotations
          t.annotations = [];
        });

        console.log('group', groupSettings.users);

        // collect all annotations from each user
        const tmpAllAnnotations: AnnotationData[] = [];
        groupSettings.users.forEach(u => (u.annotations || []).forEach(a => {
          if (u.id !== a.userId) {
            return;
          }
          // @sperrle see here
          const aClass = new AnnotationData(a.color, new Date(a.data.date), a.data.y, a.note.title, a.note.label2);
          aClass.masterTimelineOriginalTitle = a.masterTimelineOriginalTitle;
          // aClass.uuid = a.uuid; // FIXME
          aClass.userId = a.userId;
          aClass.userName = a.userName;

          if (tmpAllAnnotations.filter(a1 => {
            return a1.userName === aClass.userName
            && a1.data.date.getTime() === aClass.data.date.getTime()
            && a1.note.title === aClass.note.title;
          }).length === 0) {
            tmpAllAnnotations.push(aClass);

            // inject into own masterTimelineItems
            if (myMap.has(a.masterTimelineOriginalTitle)) {

              myMap.get(a.masterTimelineOriginalTitle).annotations.push(aClass);
            }
          }
        }));

        tmpAllAnnotations
          .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());

        const uniqueAnnotations = this.getUniqueAnnotations(tmpAllAnnotations);

        console.log('fetch unique size', uniqueAnnotations.length);

        this.allAnnotations = uniqueAnnotations;
        // console.log('all annotations', this.allAnnotations);
      });

      if (opts.groupId !== group.groupId) {
        opts.groupId = group.groupId;
        this.userOptionsRepository.setOptions(opts);
      }
    });

    this.userOptionsRepository.userOptions$.subscribe(opts => {
      this.userOptions = opts;

      if (this.masterTimelineItem) {
        this.masterTimelineItem.timelineOptions = {
          ...this.masterTimelineItem.timelineOptions,
          userColor: this.userOptions.color
        };
      }
    });

    this.mc2DataRepository.getData().subscribe(data => {
      this.allRadiationData = data;
    });
    // throw new Error('Method not implemented.');


    this.masterTimelineRepository.getDefaults().then(data => {
      this.timelineData = data;
    });
    this.timelineDataTitles = this.masterTimelineRepository.getAllTitles();

    this.setSingleTimelineItem('Rumble Damages Volume');


    this.updateRadiationMapData();

    this.streamGraphTitles = this.masterTimelineRepository.getStreamGraphTitles();
  }

  updateRadiationMapData() {
    this.filteredRadiationData = [ ... this.allRadiationData
      .filter(
        i => i.timestamp.getTime() >= this.brushExternal[0].getTime() &&
        i.timestamp.getTime() <= this.brushExternal[1].getTime())
    ];
  }

  setSingleTimelineItem(originalTitle: string) {
    this.masterTimelineItem = null;
    this.masterTimelineRepository.getByTitle(originalTitle).then(tlOrig => {
      // shallow copy
      const tl = {... tlOrig};

      // turn on the brush for this one
      tl.timelineOptions = { ... tl.timelineOptions, brushOn: true, userColor: this.userOptions.color};

      this.masterTimelineItem = tl;
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
    setTimeout(() => {
      this.mc1DataRepository.getBrushFilteredMc1Data(brush)
        .subscribe(data => this.brushedMc1Data = data);
    });


    this.mapOptions.timelineBrush = brush;

    setTimeout(() => {
      this.updateRadiationMapData();
    });
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
    this.masterTimelineRepository
      .getByTitle(title)
      .then(item => {
        this.timelineData.push(item);
        console.log('added new item', item);
      });
  }

  removeMasterTimeline(tl: MasterTimelineItem) {
    const idx = this.timelineData.indexOf(tl);
    if (idx > -1) {
      this.timelineData.splice(idx, 1);
    }
  }

  annotationsChanged(annotations: AnnotationData[], timelineItem: MasterTimelineItem) {
    annotations
      .forEach(a => {
        a.masterTimelineOriginalTitle = timelineItem.originalTitle;
        a.userId = this.userOptions.id;
        a.userName = this.userOptions.name;
        a.color = this.userOptions.color;
      });

    const tmpAllAnnotations = this.allAnnotations.filter(a => a.masterTimelineOriginalTitle !== timelineItem.originalTitle);
    const allAnnotations = [...tmpAllAnnotations, ...annotations];

    const uniqueAnnotations = this.getUniqueAnnotations(allAnnotations);

    console.log('add unique size', uniqueAnnotations.length);

    this.userOptions.annotations = uniqueAnnotations;
    this.userOptionsRepository.setOptions(this.userOptions);
  }

  removeAnnotation(annoation: AnnotationData) {
    this.allAnnotations.splice(this.allAnnotations.indexOf(annoation), 1);

    const uniqueAnnotations = this.getUniqueAnnotations(this.allAnnotations);

    console.log('remove unique size', uniqueAnnotations.length);
    this.userOptions.annotations = uniqueAnnotations;
    this.userOptionsRepository.setOptions(this.userOptions);
  }

  getUniqueAnnotations(annoatations: AnnotationData[]): AnnotationData[] {
    const myMap: Set<string> = new Set();
    const tmpAnnotation: AnnotationData[] = [];
    annoatations.forEach(a => {
      const keyStr = a.userName + ':' + a.note.title + ':' + a.data.date.getTime();
      if (!myMap.has(keyStr)) {
        tmpAnnotation.push(a);
      }
      myMap.add(keyStr);
    });
    return tmpAnnotation;
  }

  changeLayout(layout: 'default' | 'timelines' | 'annotations') {
    this.dashboardLayout = layout;

    if (this.dashboardLayout === 'default') {
      this.timelineBrushed(this.brushExternal);
    }
  }

}
