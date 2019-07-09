import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { MasterTimelineItem } from './master-timeline-item';
import { StreamGraphRepositoryService } from './timeline/stream-graph-repository.service';
import { TimelineOptions } from './timeline/timeline-options';
import { EpisodeRepositoryService } from './episodes/episode-repository.service';

@Injectable({
  providedIn: 'root'
})
export class MasterTimelineRepositoryService {

  private readonly defaultTimelineOptions: TimelineOptions = {
    begin: new Date('2020-04-06 00:00:00'),
    end: new Date('2020-04-10 12:00:00'),
    userColor: 'black',
    brushOn: false,
    height: 100
  };

  private readonly allMasterTimelineData: MasterTimelineItem[] = [
    {
      type: 'streamgraph',
      title: 'MC1 Category Volume',
      dataUrl: '/assets/VolumeMC1C.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC1 Category StdDev',
      dataUrl: '/assets/STDMC1C.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC1 Category Entropy',
      dataUrl: '/assets/EntropyMC1C.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC1 Category Mean',
      dataUrl: '/assets/MeanMC1C.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC1 Category Sum',
      dataUrl: '/assets/SumMC1C.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC1 Category Median',
      dataUrl: '/assets/MedianMC1C.json',
      colors: d3.schemeCategory10 as string[]
    },

    {
      type: 'streamgraph',
      title: 'MC1 Location Volume',
      dataUrl: '/assets/VolumeMC1L.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC1 Location StdDev',
      dataUrl: '/assets/STDMC1L.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC1 Location Entropy',
      dataUrl: '/assets/EntropyMC1L.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC1 Location Mean',
      dataUrl: '/assets/MeanMC1L.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC1 Location Sum',
      dataUrl: '/assets/SumMC1L.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC1 Location Median',
      dataUrl: '/assets/MedianMC1L.json',
      colors: d3.schemeCategory10 as string[]
    },

    {
      type: 'streamgraph',
      title: 'MC2 Category Volume',
      dataUrl: '/assets/VolumeMC2C.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC2 Category StdDev',
      dataUrl: '/assets/STDMC2C.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC2 Category Entropy',
      dataUrl: '/assets/EntropyMC2C.json',
      colors: d3.schemeCategory10 as string[]
    },

    {
      type: 'streamgraph',
      title: 'MC2 Location Volume',
      dataUrl: '/assets/VolumeMC2L.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC2 Location StdDev',
      dataUrl: '/assets/STDMC2L.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC2 Location Entropy',
      dataUrl: '/assets/EntropyMC2L.json',
      colors: d3.schemeCategory10 as string[]
    },

    {
      type: 'streamgraph',
      title: 'MC3 Category Volume',
      dataUrl: '/assets/VolumeMC3C.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC3 Category StdDev',
      dataUrl: '/assets/STDMC3C.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC3 Category Entropy',
      dataUrl: '/assets/EntropyMC3C.json',
      colors: d3.schemeCategory10 as string[]
    },

    {
      type: 'streamgraph',
      title: 'MC3 Location Volume',
      dataUrl: '/assets/VolumeMC3L.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC3 Location StdDev',
      dataUrl: '/assets/STDMC3L.json',
      colors: d3.schemeCategory10 as string[]
    },
    {
      type: 'streamgraph',
      title: 'MC3 Location Entropy',
      dataUrl: '/assets/EntropyMC3L.json',
      colors: d3.schemeCategory10 as string[]
    },
  ];

  private readonly defaultItems: string[] = [
    'MC1 Category Volume',
    'MC2 Category Volume',
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

  public getDefaults(): MasterTimelineItem[] {
    return this.allMasterTimelineData
      .filter(i => this.defaultItems.includes(i.title))
      .sort((a, b) => this.defaultItems.indexOf(a.title) - this.defaultItems.indexOf(b.title))
      .map(i => this.init(i));
  }

  public getByTitle(title: string): MasterTimelineItem {
    if (title === 'separator') {
      return {
        title: 'Separator',
        type: 'separator'
      } as MasterTimelineItem;
    }

    return this.allMasterTimelineData
      .filter(i => i.title === title)
      .map(i => this.init(i))[0];
  }

  public getAllTitles(): string[] {
    return this.allMasterTimelineData
      .map(i => i.title);
  }

  private init(item: MasterTimelineItem): MasterTimelineItem {
    if (item.type === 'streamgraph' && !item.data) {
      this.streamGraphRepository.getData(item.dataUrl).subscribe(data => {
        item.data = data;
        item.filteredData = data;
      });
      item.timelineOptions = {... this.defaultTimelineOptions, brushOn: false};
    }
    return item;
  }
}
