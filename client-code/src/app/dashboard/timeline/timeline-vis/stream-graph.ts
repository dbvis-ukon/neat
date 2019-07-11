import * as d3 from 'd3';
import { StreamGraphItem } from '../stream-graph-item';
import { TooltipService } from '@app/core/services/tooltip.service';
import { StreamgraphTooltipComponent } from '../streamgraph-tooltip/streamgraph-tooltip.component';
import { ScaleTime, ScaleOrdinal } from 'd3';
import { StreamGraphRepositoryService } from '../stream-graph-repository.service';
import {EventEmitter} from '@angular/core';


export class StreamGraph {

    private chart: d3.Selection<SVGGElement, null, undefined, null>;

    private chartWidth: number;

    private chartHeight: number;

    constructor(
        chartRoot: d3.Selection<SVGGElement, null, undefined, null>,
        private tooltipservice: TooltipService,
        private streamGraphRepository: StreamGraphRepositoryService,
        private hoverLineChange: EventEmitter<Date>
    ) {
        this.chart = chartRoot;
    }

    public render(
        mydata: StreamGraphItem[],
        colors: ScaleOrdinal<string, string>,
        chartWidth: number,
        chartHeight: number,
        timeScale: ScaleTime<number, number>
    ): void {
        if (isNaN(chartHeight)) {
            return;
        }
        this.chartWidth = chartWidth;
        this.chartHeight = chartHeight;

        const allKeys = this.streamGraphRepository.getAllKeys(mydata);


        const stack = d3.stack()
            .keys(allKeys)
            .value((d, key) => d[key] || 0) // do not generate NaN values!
            // .order(d3.stackOrderNone)
            .offset(d3.stackOffsetWiggle);

        const transformedData = mydata.map(item => {
            const keys = item.data.reduce((obj, dataItem) => {
                obj[dataItem.name] = dataItem.value;
                return obj;
            }, {});
            return {
                timestamp: item.timestamp,
                ...keys
            } as { [key: string]: number; };
        });


        const layers0 = stack(transformedData);

        const y = d3.scaleLinear()
            .domain([
                d3.min(layers0, (layer) => d3.min(layer, (d) => d[0])),
                d3.max(layers0, (layer) => d3.max(layer, (d) => d[1]))
            ])
            .range([chartHeight, 0]);

        const area: any = d3.area()
            .x((d: any) => timeScale(d.data.timestamp))
            .y0((d) => y(d[0]))
            .y1((d) => y(d[1]));

        const sel = this.chart.selectAll<SVGPathElement, d3.Series<{[key: string]: number}, string>>('path')
            .data(layers0, d => d.key);

        sel
            .enter()
            .append('path')
            .merge(sel)
            .attr('d', area)
            .attr('name', d => d.key)
            .style('fill', d => {
                const c = colors(d.key);
                if (!c) {
                    return 'black';
                }
                return c;
            })
            .on('mouseenter', (d, i, n) => {
                const mouseEvent: MouseEvent = d3.event;

                const exampleTooltipComponentInstance = this.tooltipservice.openAtMousePosition(StreamgraphTooltipComponent, mouseEvent);

                // const randomNumber = Math.random();

                exampleTooltipComponentInstance.text = d.key;

                d3.select(n[i])
                    .style('stroke', 'black')
                    .style('stroke-width', 1);
            })
            .on('mouseleave', (d, i, n) => {
                this.tooltipservice.close();
                d3.select(n[i])
                    .style('stroke', 'none')
                    .style('stroke-width', 1);
            })
            .on('mousemove', () => {
                const mouse = d3.mouse(this.chart.node());
                const x = timeScale.invert(mouse[0]);
                this.hoverLineChange.emit(x);
            });

        sel.exit().remove();
    }

}
