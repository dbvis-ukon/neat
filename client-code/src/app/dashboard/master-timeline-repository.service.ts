import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { MasterTimelineItem } from './master-timeline-item';
import { StreamGraphRepositoryService } from './timeline/stream-graph-repository.service';
import { TimelineOptions } from './timeline/timeline-options';
import { EpisodeRepositoryService } from './episodes/episode-repository.service';
import { ScaleOrdinal } from 'd3';

@Injectable({
  providedIn: 'root'
})
export class MasterTimelineRepositoryService {

  private static readonly locationColorScale: ScaleOrdinal<string, string> = d3.scaleOrdinal<string>()
    .domain(['Loc1', 'Loc2'])
    .range(['red', 'green']);

    private static readonly damagesColorScale: ScaleOrdinal<string, string> = d3.scaleOrdinal<string>()
    .domain(['M1Water', 'M1Shakeintensity', 'M1RoadsAndBridges', 'M1Power', 'M1Medical', 'M1Buildings'])
    .range(['#80b1d3', '#fb8072', '#fdb462', '#ffffb3', '#8dd3c7', '#bebada']);

    private static readonly locationm1ColorScale: ScaleOrdinal<string, string> = d3.scaleOrdinal<string>()
    .domain(['Palace Hills', 'Northwest', 'Old Town', 'Safe Town', 'Southwest', 'Downtown', 'Wilson Forest', 'Scenic Vista', 'Broadview', 'Chapparal', 'Terrapin Springs', 'Pepper Mill', 'Cheddarford', 'Weston', 'Southton', 'Oak Willow', 'East Parton', 'West Parton'])
    .range(['#63A0EA', '#74AFF1', '#69A5EC', '#5897E5', '#4688DE', '#86BEF8', '#2F74D4', '#97CDFF', '#91C8FD', '#4083DC', '#5D9CE8', '#8CC3FB', '#7AB4F4', '#3579D7', '#4C8DE0', '#6FAAEF', '#80B9F6', '#3B7ED9']);

    private static readonly radiationColorScale: ScaleOrdinal<string, string> = d3.scaleOrdinal<string>()
    .domain(['M2 Too Low Error', 'M2 Almost Nothing', 'M2 Low', 'M2 Normal', 'M2 Slightly Elevated', 'M2 Higher Than Ususal', 'M2 Almost Warning', 'M2 Warning', 'M2 Danger', 'M2 Too High - Error'])
    .range(['#808080', '#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026', '#808080']);

    private static readonly crisisColorScale: ScaleOrdinal<string, string> = d3.scaleOrdinal<string>()
    .domain(['Dead', 'Injured', 'Missing', 'Water', 'Food', 'Shelter', 'Supplies', 'Services', 'Logistics', 'Money', 'Animal', 'Safety', 'Health', 'Children', 'Personal', 'Displaced', 'Caution', 'Infrastructure', 'Telecommunications', 'Agencies', 'Weather'])
    .range(['#b10026', '#fc4e2a', '#fd8d3c', '#6e016b', '#88419d', '#8c6bb1', '#8c96c6', '#9ebcda', '#bfd3e6', '#e0ecf4', '#f7fcfd', '#ce1256', '#e7298', '#df65b0', '#c994c7', '#d4b9da', '#1d91c0', '#41b6c4', '#7fcdbb', '#c7e9b4', '#edf8b1']);

    private static readonly locationm3ColorScale: ScaleOrdinal<string, string> = d3.scaleOrdinal<string>()
    .domain(['Palace Hills', 'Northwest', 'Old Town', 'Safe Town', 'Southwest', 'Downtown', 'Wilson Forest', 'Scenic Vista', 'Broadview', 'Chapparal', 'Terrapin Springs', 'Pepper Mill', 'Cheddarford', 'Weston', 'Southton', 'Oak Willow', 'East Parton', 'West Parton', '<name with-held due to contract>', 'UNKNOWN'])
    .range(['#63A0EA', '#74AFF1', '#69A5EC', '#5897E5', '#4688DE', '#86BEF8', '#2F74D4', '#97CDFF', '#91C8FD', '#4083DC', '#5D9CE8', '#8CC3FB', '#7AB4F4', '#3579D7', '#4C8DE0', '#6FAAEF', '#80B9F6', '#3B7ED9', '#ff6666', '#808080']);

  private readonly defaultTimelineOptions: TimelineOptions = {
    begin: new Date('2020-04-06 00:00:00'),
    end: new Date('2020-04-11 00:00:00'),
    userColor: 'black',
    brushOn: false,
    height: 100
  };

  private readonly allMasterTimelineData: MasterTimelineItem[] = [
    {
      type: 'streamgraph',
      title: 'Rumble Damages Volume',
      dataUrl: '/assets/VolumeMC1C.json',
      colorScale: MasterTimelineRepositoryService.damagesColorScale
    },
    {
      type: 'streamgraph',
      title: 'Rumble Damages StdDev',
      dataUrl: '/assets/STDMC1C.json',
      colorScale: MasterTimelineRepositoryService.damagesColorScale
    },
    {
      type: 'streamgraph',
      title: 'Rumble Damages Entropy',
      dataUrl: '/assets/EntropyMC1C.json',
      colorScale: MasterTimelineRepositoryService.damagesColorScale
    },
    {
      type: 'streamgraph',
      title: 'Rumble Damages Mean',
      dataUrl: '/assets/MeanMC1C.json',
      colorScale: MasterTimelineRepositoryService.damagesColorScale
    },
    {
      type: 'streamgraph',
      title: 'Rumble Damages Sum',
      dataUrl: '/assets/SumMC1C.json',
      colorScale: MasterTimelineRepositoryService.damagesColorScale
    },
    {
      type: 'streamgraph',
      title: 'Rumble Damages Median',
      dataUrl: '/assets/MedianMC1C.json',
      colorScale: MasterTimelineRepositoryService.damagesColorScale
    },

    {
      type: 'streamgraph',
      title: 'Rumble Location Volume',
      dataUrl: '/assets/VolumeMC1L.json',
      colorScale: MasterTimelineRepositoryService.locationm1ColorScale
    },
    {
      type: 'streamgraph',
      title: 'Rumble Location StdDev',
      dataUrl: '/assets/STDMC1L.json',
      colorScale: MasterTimelineRepositoryService.locationm1ColorScale
    },
    {
      type: 'streamgraph',
      title: 'Rumble Location Entropy',
      dataUrl: '/assets/EntropyMC1L.json',
      colorScale: MasterTimelineRepositoryService.locationm1ColorScale
    },
    {
      type: 'streamgraph',
      title: 'Rumble Location Mean',
      dataUrl: '/assets/MeanMC1L.json',
      colorScale: MasterTimelineRepositoryService.locationm1ColorScale
    },
    {
      type: 'streamgraph',
      title: 'Rumble Location Sum',
      dataUrl: '/assets/SumMC1L.json',
      colorScale: MasterTimelineRepositoryService.locationm1ColorScale
    },
    {
      type: 'streamgraph',
      title: 'Rumble Location Median',
      dataUrl: '/assets/MedianMC1L.json',
      colorScale: MasterTimelineRepositoryService.locationm1ColorScale
    },

    {
      type: 'streamgraph',
      title: 'Radiation Category Volume',
      dataUrl: '/assets/VolumeMC2C.json',
      colorScale: MasterTimelineRepositoryService.radiationColorScale
    },
    {
      type: 'streamgraph',
      title: 'Radiation Category StdDev',
      dataUrl: '/assets/STDMC2C.json',
      colorScale: MasterTimelineRepositoryService.radiationColorScale
    },
    {
      type: 'streamgraph',
      title: 'Radiation Category Entropy',
      dataUrl: '/assets/EntropyMC2C.json',
      colorScale: MasterTimelineRepositoryService.radiationColorScale
    },

    {
      type: 'streamgraph',
      title: 'Radiation Location Volume',
      dataUrl: '/assets/VolumeMC2L.json',
      colorScale: MasterTimelineRepositoryService.locationm1ColorScale
    },
    {
      type: 'streamgraph',
      title: 'Radiation Location StdDev',
      dataUrl: '/assets/STDMC2L.json',
      colorScale: MasterTimelineRepositoryService.locationm1ColorScale
    },
    {
      type: 'streamgraph',
      title: 'Radiation Location Entropy',
      dataUrl: '/assets/EntropyMC2L.json',
      colorScale: MasterTimelineRepositoryService.locationm1ColorScale
    },

    {
      type: 'streamgraph',
      title: 'Y*INT Category Volume',
      dataUrl: '/assets/VolumeMC3C.json',
      colorScale: MasterTimelineRepositoryService.crisisColorScale
    },
    {
      type: 'streamgraph',
      title: 'Y*INT Category StdDev',
      dataUrl: '/assets/STDMC3C.json',
      colorScale: MasterTimelineRepositoryService.crisisColorScale
    },
    {
      type: 'streamgraph',
      title: 'Y*INT Category Entropy',
      dataUrl: '/assets/EntropyMC3C.json',
      colorScale: MasterTimelineRepositoryService.crisisColorScale
    },

    {
      type: 'streamgraph',
      title: 'Y*INT Location Volume',
      dataUrl: '/assets/VolumeMC3L.json',
      colorScale: MasterTimelineRepositoryService.locationm3ColorScale
    },
    {
      type: 'streamgraph',
      title: 'Y*INT Location StdDev',
      dataUrl: '/assets/STDMC3L.json',
      colorScale: MasterTimelineRepositoryService.locationm3ColorScale
    },
    {
      type: 'streamgraph',
      title: 'Y*INT Location Entropy',
      dataUrl: '/assets/EntropyMC3L.json',
      colorScale: MasterTimelineRepositoryService.locationm3ColorScale
    },
  ];

  private readonly defaultItems: string[] = [
    'Rumble Damages Volume',
    'Radiation Category Volume',
    'Dead People'
  ];

  constructor(
    private streamGraphRepository: StreamGraphRepositoryService,
    private episodeRepository: EpisodeRepositoryService
  ) {
    // inject all the episode data stuff at the end
    this.episodeRepository.subscribeAllEpisodes().subscribe(episodeCategories => {
      episodeCategories.forEach(ec => {
        this.allMasterTimelineData.push({
          type: 'episodes',
          episodeCategory: ec,
          title: ec.crisislexCategory.name,
          episodeOptions: {
            showText: false,
            rotate: true
          }
        } as MasterTimelineItem);
      });
    });

  }

  public async getDefaults(): Promise<MasterTimelineItem[]> {
    return Promise.all(this.allMasterTimelineData
      .filter(i => this.defaultItems.includes(i.title))
      .sort((a, b) => this.defaultItems.indexOf(a.title) - this.defaultItems.indexOf(b.title))
      .map(async i => await this.init(i)));
  }

  public async getByTitle(title: string): Promise<MasterTimelineItem> {
    if (title === 'separator') {
      return {
        title: 'Separator',
        type: 'separator'
      } as MasterTimelineItem;
    }

    return this.allMasterTimelineData
      .filter(i => i.title === title)
      .map(async i => await this.init(i))[0];
  }

  public getAllTitles(): string[] {
    return this.allMasterTimelineData
      .map(i => i.title);
  }

  private async init(item: MasterTimelineItem): Promise<MasterTimelineItem> {
    if (item.type === 'streamgraph' && !item.data) {
      item.data = await this.streamGraphRepository.getData(item.dataUrl).toPromise();
      item.filteredData = item.data;
      item.timelineOptions = {... this.defaultTimelineOptions, brushOn: false};
    }
    return item;
  }
}
