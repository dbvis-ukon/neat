import { streamgraph_data } from './streamgraph_data';
import * as d3 from 'd3';


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
        let colorrange = ['#045A8D', '#2B8CBE', '#74A9CF', '#A6BDDB', '#D0D1E6', '#F1EEF6'];
        //console.log('stream data', someData);




        

        const map = new Map();
        someData.forEach(datum => {
            if (!map.has(datum.key)) {
                map.set(datum.key, 1);
            } else {
                map.set(datum.key, map.get(datum.key) + 1);
            }
        });
        console.log('maplength', map.size);
        console.log('map', map);

        let n = map.size; //number of layers
        let m = map.get(map.keys().next().value); // samples per layer

        

        let stack = d3.stack().keys(d3.range(n).map((d) => 'layer' + d)).offset(d3.stackOffsetWiggle);

        // Create empty data structures
        let matrix0 = d3.range(m).map((d) => { return { x: d }; });
        let matrix1 = d3.range(m).map((d) => { return { x: d }; });

        d3.range(n).map((d) => { this.bumpLayer(m, matrix0, d); });
        d3.range(n).map((d) => { this.bumpLayer(m, matrix1, d); });

        //console.log(matrix0);

        let layers0 = stack(matrix0);
        let layers1 = stack(matrix1);

        let x = d3.scaleLinear()
            .domain([0, m - 1])
            .range([0, chartWidth]);

        let y = d3.scaleLinear()
            .domain([d3.min(layers0.concat(layers1), function (layer) { return d3.min(layer, function (d) { return d[0]; }); }), d3.max(layers0.concat(layers1), function (layer) { return d3.max(layer, function (d) { return d[1]; }); })])
            .range([chartHeight, 0]);

        let color = d3.scaleLinear<string>()
            .range(['#aad', '#556']);

        let area: any = d3.area()
            .x(function (d: any, i) { return x(d.data.x); })
            .y0(function (d) { return y(d[0]); })
            .y1(function (d) { return y(d[1]); });

        this.chart.selectAll("path")
            .data(layers0)
            .enter().append("path")
            .attr("d", area)
            .style("fill", function () { return color(Math.random()); });

        function transition() {
            d3.selectAll("path")
                .data(function () {
                    var d = layers1;
                    layers1 = layers0;
                    return layers0 = d;
                })
                .transition()
                .duration(2500)
                .attr("d", area);
        }

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

    bumpLayer(n, matrix, layer) {

        function bump(a) {
            let x = 1 / (.1 + Math.random());
            let y = 2 * Math.random() - .5;
            let z = 10 / (.1 + Math.random());
            for (let i = 0; i < n; i++) {
                let w = (i / n - y) * z;
                a[i] += x * Math.exp(-w * w);
            }
        }

        let a = [];
        let i;
        for (i = 0; i < n; ++i) a[i] = 0;
        for (i = 0; i < 5; ++i) bump(a);
        return a.forEach((d, i) => { matrix[i]['layer' + layer] = Math.max(0, d) + 1; });
    }

}
