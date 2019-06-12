export class StreamGraph {


    private chart: d3.Selection<SVGGElement, null, undefined, null>;

    private chartWidth: number;

    private chartHeight: number;

    constructor(chartRoot: d3.Selection<SVGGElement, null, undefined, null>) {
        this.chart = chartRoot;
    }

    public render(someData: string, chartWidth: number, chartHeight: number): void {
        this.chartWidth = chartWidth;
        this.chartHeight = chartHeight;

        // draw some stuff
        this.chart
            .append('text')
            .attr('x', 10)
            .attr('y', 10)
            .text(someData);
    }
}
