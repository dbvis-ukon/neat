// tslint:disable:variable-name
// tslint:disable:only-arrow-functions

import * as d3 from 'd3';
import mapData from '@assets/map-data.json';
import {Mc1Item} from '@shared/mc1-item';
import {GeoPos} from '@shared/geo-pos';
import {MapProjectionService} from '../map-projection.service';

interface TimeKV {
  /**
   * represents the time (getTime())
   */
  key: string;
  values: Mc1Item[];
}

interface AllData {
  /**
   * this represents the district number
   */
  key: string;

  values: TimeKV[];
}



export class MapGlyph {
  // Dirk constants:
  private readonly parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');
  private readonly GLYPH_WIDTH = 200;
  private readonly MULTI_HEIGHT = 400;
  private readonly MULTI_ATTRIBUTES = [
    'shake_intensity',
    'sewer_and_water',
    'power',
    'roads_and_bridges',
    'medical',
    'buildings'
  ];
  private readonly MULTI_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  private readonly MULTI_MISSING_HEIGHT = 10;
  private readonly MULTI_LOWER_COLOR = 'blue';
  private readonly MULTI_UPPER_COLOR = 'red';
  private readonly TIMELINE_SEP_HEIGHT = 2;
  private readonly TIMELINE_HEIGHT = 25;

  // Dirk variables:
  private all_data: AllData[];
  private time_extent: Date[];
  private time_selection: number[];
  private window_size: number;
  private step_start = this.parseDate('2020-04-06 00:00:00').getTime();
  private step_size = 300000; // in milliseconds
  private window_end = this.parseDate('2020-04-06 02:00:00').getTime();
  private timeline_bands: number[] = [];

   private cMulti = d3
     .scaleLinear<string, number>()
     .range([this.MULTI_LOWER_COLOR, 'gray', this.MULTI_UPPER_COLOR])
     .domain([0.5, 1, 2])
     .interpolate(d3.interpolateHcl);

  private tMulti = d3
    .scaleSqrt()
    .domain([0, 1000])
    .range([0.05, 1])
    .clamp(true);

  private xMulti = d3
    .scaleBand()
    .domain(this.MULTI_ATTRIBUTES)
    .range([0, this.GLYPH_WIDTH]);

  private yMulti = d3
    .scaleBand<number>()
    .domain(this.MULTI_VALUES)
    .range([this.MULTI_HEIGHT, 0]);

  private yMissing = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, this.MULTI_MISSING_HEIGHT]);

  private xTime = d3
    .scaleTime()
    .domain([0, 1]) // Dummy
    .range([0, this.GLYPH_WIDTH]);

  private yCount = d3
    .scaleLog()
    .domain([0.1, 1])
    .range([0, 1]);

  private yHorizon = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, -this.TIMELINE_HEIGHT])
    .clamp(true);

  private cHorizon = d3
    .scaleSequential(
      d3.piecewise(d3.interpolateRgb.gamma(2.2), ['cyan', 'gray', 'red'])
    )
    .domain([-3, 3])
    .clamp(true);

  constructor(
    private glyphSVGGroup: d3.Selection<SVGGElement, undefined, SVGElement, undefined>,
    private mapProjectionService: MapProjectionService
  ) {
  }

  public render(data?: Mc1Item[], timelineBrush?: [Date, Date]) {
    if (!data || !timelineBrush) { // data may be null or undefined
      return;
    }
    this.drawDirkGlyphs(data, timelineBrush);
  }

  private drawDirkGlyphs(data: Mc1Item[], brush_extent?: [Date, Date]) {
    // Need to round selected times
    this.time_extent = brush_extent || d3.extent(data, (d: Mc1Item): Date => d.time);
    this.time_selection = this.time_extent.map((d, i) => {
      const steps = Math.floor((d.valueOf() - this.step_start) / this.step_size);
      let rounded = steps * this.step_size + this.step_start;
      // Make sure that we are in the bounds
      if (i === 0 && rounded !== d.valueOf()) {
        rounded += this.step_size;
      }
      return rounded;
    });
    this.window_end = this.time_selection[1];
    this.window_size = .5 * (this.window_end - this.time_selection[0]);

    // Data preparation
    data.sort((a, b) => d3.ascending(a.time, b.time));
    this.all_data = d3
      .nest<Mc1Item, Mc1Item>()
      .key((d) => d.location + '')
      .sortKeys((a, b) => d3.ascending(parseInt(a, 10), parseInt(b, 10)))
      .key((d) => d.time.valueOf() + '')
      .sortKeys(d3.ascending)
      .entries(data);

    // Add entries for missing data
    this.all_data.forEach((d, i) => {
      const times: TimeKV[] = [];
      const messages = this.all_data[i].values;
      let j = 0;
      for (let t = this.time_selection[0].valueOf(); t <= this.time_selection[1].valueOf(); t += this.step_size) {
        if (messages[j] !== undefined && messages[j].key === t + '') {
          times.push(messages[j++]);
        } else {
          times.push({key: t + '', values: []});
        }
      }
      this.all_data[i].values = times;
    });

    // Setup bands for horizon graph
    const max_count_log = Math.ceil(
      Math.log10(
        d3.max(this.all_data, d =>
          d3.max(d.values, (e: TimeKV) => e.values.length)
        )
      )
    );
    this.timeline_bands = [];
    for (let i = -1; i <= max_count_log; i++) {
      this.timeline_bands.push(i);
    }

    this.update_glyphs();
  }

  private update_glyphs() {
    this.xTime.domain([this.window_end - 2 * this.window_size, this.window_end]);

    const glyphs = this.glyphSVGGroup
      .selectAll<SVGGElement, AllData>('g.glyph')
      .data(this.all_data);

    glyphs
      .enter()
      .append('g')
      .attr('class', 'glyph')
      .each((d, i, n) => this.init_glyph(d, i, n))
      .merge(glyphs)
      .attr('transform', d => {
        const pos = this.mapProjectionService.geoToPixels(mapData.glyphLocations.filter(g => g.key === d.key)[0] as GeoPos);
        return `translate(${pos.x}, ${pos.y})`;
      })
      .each((d, i, n) => this.update_glyph(d, i, n));
  }

  private init_glyph(data: AllData, i: number, n: SVGGElement[] | ArrayLike<SVGGElement>) {
    const selection = d3.select<SVGGElement, AllData>(n[i]);
    const {
      GLYPH_WIDTH,
      MULTI_HEIGHT,
      MULTI_MISSING_HEIGHT,
      MULTI_VALUES,
      MULTI_ATTRIBUTES,
      TIMELINE_HEIGHT,
      TIMELINE_SEP_HEIGHT
    } = this;

    const {mapProjectionService} = this;

    const glyph = selection
      .on('mouseover', (_d, _i, _n) => {
        d3.select<SVGGElement, AllData>(_n[_i])
          .attr(
            'transform',
            d => {
              const pos = this.mapProjectionService.geoToPixels(mapData.glyphLocations.filter(g => g.key === d.key)[0] as GeoPos);
              return `translate(${pos.x}, ${pos.y}) scale(4) translate(${-0.5 * GLYPH_WIDTH})`;
            })
          .raise();
      })
      .on('mouseout', (_d, _i, _n) => {
        d3.select<SVGElement, AllData>(_n[_i])
          .attr(
          'transform',
          d => {
              const pos = this.mapProjectionService.geoToPixels(mapData.glyphLocations.filter(g => g.key === d.key)[0] as GeoPos);
              return `translate(${pos.x}, ${pos.y})`;
        });
      });

    const multi = glyph.append('g').attr('class', 'multi');

    // Frame
    multi
      .append('rect')
      .attr('class', 'frame')
      .attr('width', GLYPH_WIDTH)
      .attr('height', MULTI_HEIGHT + MULTI_MISSING_HEIGHT);
    // Axes
    multi.append('g')
      .attr('class', 'axis top')
      .call(d3.axisTop(this.xMulti));
    multi.append('g')
      .attr('class', 'axis left')
      .call(d3.axisLeft(this.yMulti));
    multi.append('g')
      .attr('class', 'axis left')
      .attr('transform', 'translate(0,' + MULTI_HEIGHT + ')')
      .call(d3.axisLeft(this.yMissing));

    for (let _i = 0; _i < MULTI_ATTRIBUTES.length; _i++) {
      const a = multi
        .append('g')
        .attr('class', 'attribute')
        .attr('transform', 'translate(' + this.xMulti(MULTI_ATTRIBUTES[_i]) + ',0)');
      a.selectAll('rect')
        .data(MULTI_VALUES)
        .enter().append('rect')
        .attr('width', this.xMulti.bandwidth())
        .attr('height', this.yMulti.bandwidth())
        .attr('y', d => this.yMulti(d));
      a.append('line')
        .attr('class', 'median-bar')
        .attr('x1', 0)
        .attr('x2', this.xMulti.bandwidth());
      a.append('line')
        .attr('class', 'median-tail')
        .attr('x1', 0.5 * this.xMulti.bandwidth())
        .attr('x2', 0.5 * this.xMulti.bandwidth());

      const missing = a
        .append('g')
        .attr('class', 'missing')
        .attr('transform', 'translate(0,' + MULTI_HEIGHT + ')');
      missing
        .append('line')
        .attr('class', 'missing-tail')
        .attr('y1', 0)
        .attr('x1', 0.5 * this.xMulti.bandwidth())
        .attr('x2', 0.5 * this.xMulti.bandwidth());
      missing
        .append('circle')
        .attr('class', 'missing-head')
        .attr('r', 1.5)
        .attr('cx', 0.5 * this.xMulti.bandwidth());
    }

    const timeline = glyph
      .append('g')
      .attr('class', 'timeline')
      .attr(
        'transform',
        'translate(0,' +
        (MULTI_HEIGHT + MULTI_MISSING_HEIGHT + TIMELINE_SEP_HEIGHT) +
        ')'
      );
    timeline
      .append('rect')
      .attr('class', 'frame')
      .attr('width', GLYPH_WIDTH)
      .attr('height', TIMELINE_HEIGHT);
    timeline
      .append('rect')
      .attr('class', 'background')
      .attr('x', 0.8 * GLYPH_WIDTH)
      .attr('width', 0.2 * GLYPH_WIDTH)
      .attr('height', TIMELINE_HEIGHT);
    timeline.append('g').attr('class', 'horizon');
    timeline
      .append('line')
      .attr('class', 'divider')
      .attr('x1', 0.5 * GLYPH_WIDTH)
      .attr('x2', 0.5 * GLYPH_WIDTH)
      .attr('y1', TIMELINE_HEIGHT)
      .attr('y2', 0);
    // Axis
    timeline.append('g')
      .attr('class', 'axis bottom')
      .attr('transform', 'translate(0,' + TIMELINE_HEIGHT + ')')
      .call(d3.axisBottom(this.xTime));
  }

  private update_glyph(data: AllData, i: number, n: SVGGElement[] | ArrayLike<SVGGElement>) {
    const {
      MULTI_ATTRIBUTES,
      MULTI_VALUES,
      MULTI_LOWER_COLOR,
      MULTI_UPPER_COLOR,
      TIMELINE_HEIGHT,
      window_size,
      cMulti,
      tMulti,
      yMulti,
      yMissing,
      step_size,
      GLYPH_WIDTH,
      timeline_bands,
      horizon_path,
      cHorizon,
      window_end
    } = this;

    const glyph = d3.select<SVGGElement, AllData>(n[i]);

    const agg_reference = this.aggregate_window(
      data.values,
      window_end - 2 * window_size,
      window_end - window_size
    );

    const agg_now = this.aggregate_window(
      data.values,
      window_end - window_size,
      window_end
    );

    const total_messages_ref = data.values
      .filter(
        d =>
          parseInt(d.key, 10) > window_end - 2 * window_size &&
          parseInt(d.key, 10) <= window_end - window_size
      )
      .map(d => d.values.length)
      .reduce((a, b) => a + b, 0);
    const total_messages_now = data.values
      .filter(d => parseInt(d.key, 10) > window_end - window_size && parseInt(d.key, 10) <= window_end)
      .map(d => d.values.length)
      .reduce((a, b) => a + b, 0);

    // Multi attribute overview
    const multi = glyph.selectAll('.multi');
    const multi_attributes = multi
      .selectAll<SVGGElement, string>('g.attribute')
      .data(MULTI_ATTRIBUTES)
      .each((attr, _i, _n) => {
        const a = d3.select<SVGGElement, string>(_n[_i]);
        const vs = a.selectAll<SVGRectElement, string>('rect');
        let cumsum_ref = 0;
        let cumsum_now = 0;
        let median_ref = 0;
        let median_now = 0;
        let sum_ref = 0;
        let sum_now = 0;
        if (agg_reference[attr] !== undefined) {
          agg_reference[attr].forEach(d => {
            sum_ref += d;
          });
        }
        if (agg_now[attr] !== undefined) {
          agg_now[attr].forEach(d => {
            sum_now += d;
          });
        }

        vs.each((_d1, _i1, _n1) => {
          const cur_ref =
            agg_reference[attr] === undefined
              ? 0
              : agg_reference[attr][_i1] || 0;
          const cur_now =
            agg_now[attr] === undefined
              ? 0
              : agg_now[attr][_i1] || 0;
          cumsum_ref += cur_ref;
          cumsum_now += cur_now;
          if (median_ref === 0 && cumsum_ref > 0.5 * sum_ref) {
            median_ref = _i1;
          }
          if (median_now === 0 && cumsum_now > 0.5 * sum_now) {
            median_now = _i1;
          }

          d3.select(_n1[_i1])
            .attr(
              'fill',
              cumsum_now === 0 && cumsum_ref === 0
                ? 'white'
                : cumsum_now === 0 || sum_now === 0
                  ? MULTI_LOWER_COLOR
                  : cumsum_ref === 0 || sum_ref === 0
                    ? MULTI_UPPER_COLOR
                    : cMulti((sum_ref * cumsum_now) / (cumsum_ref * sum_now))
            )
            .attr(
              'fill-opacity',
              cumsum_now === 0 && cumsum_ref === 0
                ? 0
                : tMulti((MULTI_VALUES.length - _i1) * (cur_ref + cur_now))
            );
        });
        a.select('line.median-bar')
          .attr('y1', yMulti(median_now) + .5 * yMulti.bandwidth())
          .attr('y2', yMulti(median_now) + .5 * yMulti.bandwidth())
          .classed('no-reports', sum_now === 0);
        a.select('line.median-tail')
          .attr('y1', yMulti(median_now) + .5 * yMulti.bandwidth())
          .attr('y2', yMulti(median_ref) + .5 * yMulti.bandwidth())
          .classed('rising', median_now > median_ref);

        // Missing
        const missing_ref = (total_messages_ref - sum_ref) / total_messages_ref;
        const missing_now = (total_messages_now - sum_now) / total_messages_now;
        a.select('line.missing-tail')
          .attr('y1', yMissing(missing_ref))
          .attr('y2', yMissing(missing_now))
          .classed('dropping', missing_ref > missing_now);
        a.select('circle.missing-head')
          .attr('cy', yMissing(missing_now))
          .classed('dropping', missing_ref > missing_now)
          .classed('no-reports', sum_now === 0);
      });

    // Timeline
    const timeline = glyph
      .select('g.timeline')
      .attr('clip-path', 'url(#timeline-clip)');
    const steps_per_window = window_size / step_size;
    // This factor how unlikely a time step without any messages is
    const factor = Math.max(
      0,
      Math.min(Math.log10(total_messages_ref / steps_per_window), 1)
    );

    timeline
      .select('rect.background')
      .attr('width', factor * TIMELINE_HEIGHT)
      .attr('x', GLYPH_WIDTH - factor * TIMELINE_HEIGHT)
      .attr('height', factor * TIMELINE_HEIGHT)
      .attr('y', (1 - factor) * TIMELINE_HEIGHT);

    const paths = timeline
      .select('.horizon')
      .selectAll<SVGPathElement, number>('path')
      .data(timeline_bands);
    paths
      .enter()
      .append('path')
      .attr('transform', 'translate(0,' + TIMELINE_HEIGHT + ')')
      .merge(paths)
      .attr('d', band => this.horizon_path(band)(data.values))
      .style('fill', band =>
        cHorizon(band - mapData.glyphLocations.filter(g => g.key === data.key)[0].expectedBand)
      );

    timeline.select('g.axis.bottom')
      .call(d3.axisBottom(this.xTime));
  }

  private horizon_path(level: number) {
    const {xTime, yCount, yHorizon} = this;

    return d3
      .area<TimeKV>()
      .x((d: TimeKV) => xTime(Number(d.key)))
      .y0(0)
      .y1(function(d: TimeKV) {
        const count = d.values.length;
        return count === 0 ? 0 : yHorizon(yCount(count) - level);
      });
  }


  private aggregate_window(stream: TimeKV[], start: number, end: number) {
//    console.log('stream[s,e]', stream, start, end);
    return stream
      .filter(d => parseInt(d.key, 10) > start && parseInt(d.key, 10) <= end)
      .reduce((a, b) => {
        const ret = a;
        for (const message of b.values) {
          Object.keys(message).forEach((d) => {
            // Do not aggregate the space time information
            if (d === 'time' || d === 'location') {
              return;
            }
            if (ret[d] === undefined) {
              ret[d] = [];
              ret[d][message[d]] = 1;
            } else if (ret[d][message[d]] === undefined) {
              ret[d][message[d]] = 1;
            } else {
              ret[d][message[d]]++;
            }
          });
        }
        return ret;
      }, {});
  }
}
