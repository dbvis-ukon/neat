import { streamgraph_data } from './streamgraph_data';

export class StreamGraph {


    private chart: d3.Selection<SVGGElement, null, undefined, null>;

    private chartWidth: number;

    private chartHeight: number;

    constructor(chartRoot: d3.Selection<SVGGElement, null, undefined, null>) {
        this.chart = chartRoot;
    }

    public render(someData: streamgraph_data[], chartWidth: number, chartHeight: number): void {
        this.chartWidth = chartWidth;
        this.chartHeight = chartHeight;

        console.log('stream data', someData);

        // draw some stuff
        this.chart
            .append('text')
            .attr('x', 10)
            .attr('y', 10)
            .text('deimudda')
            // .on('click', (d, i, n) => {
            //     d3.select(n[i]).
            // })
    }
}
