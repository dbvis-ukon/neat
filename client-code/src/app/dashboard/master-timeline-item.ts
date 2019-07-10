import { StreamGraphItem } from './timeline/stream-graph-item';

import { TimelineOptions } from './timeline/timeline-options';

import { SelectableFilterItem } from './timeline/filter-dialog/selectable-filter-item';

import { EpisodeCategory } from './episodes/EpisodeCategory';
import {AnnotationData} from '@app/dashboard/timeline/AnnotationData';
import { ScaleOrdinal } from 'd3-scale';

export interface MasterTimelineItem {
  type: 'streamgraph' | 'episodes' | 'separator';

  readonly originalTitle: string;

  /**
   * this title will be edited
   */
  title?: string;

  titleEditMode?: boolean;

  dataUrl?: string;

  colorScale?: ScaleOrdinal<string, string>;
  data?: StreamGraphItem[];
  timelineOptions?: TimelineOptions;

  selection?: SelectableFilterItem[];

  filteredData?: StreamGraphItem[];

  episodeCategory?: EpisodeCategory;

  episodeOptions?: {
    showText: boolean;
    rotate: boolean;
  };

  annotations?: AnnotationData[];
}
