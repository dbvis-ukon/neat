import { streamgraph_data } from './streamgraph_data';
import * as d3 from 'd3';
import { StreamlineGraphItem } from './streamline-graph-data';


export class StreamGraph {

    private chart: d3.Selection<SVGGElement, null, undefined, null>;

    private chartWidth: number;

    private chartHeight: number;

    constructor(chartRoot: d3.Selection<SVGGElement, null, undefined, null>) {
        this.chart = chartRoot;
    }

    public render(mydata: StreamlineGraphItem[], colors: string[], chartWidth: number, chartHeight: number): void {
        this.chartWidth = chartWidth;
        this.chartHeight = chartHeight;
        let colorrange = ['#045A8D', '#2B8CBE', '#74A9CF', '#A6BDDB', '#D0D1E6', '#F1EEF6'];
        //console.log('stream data', someData);
        
        mydata = [
            {
                timestamp: 0,
                data: [
                    {
                        name: 'test0',
                        value: 1
                    },
                    {
                        name: 'test1',
                        value: 2
                    }
                ]
            },{
                timestamp: 1,
                data: [
                    {
                        name: 'test0',
                        value: 3
                    },
                    {
                        name: 'test1',
                        value: 4
                    }
                ]
            },{
                timestamp: 3,
                data: [
                    {
                        name: 'test0',
                        value: 1
                    },
                    {
                        name: 'test1',
                        value: 2
                    }
                ]
            }
        ];
        let m = mydata.length; // samples per layer

        const uniqEs6 = (arrArg) => {
            return arrArg.filter((elem, pos, arr) => {
              return arr.indexOf(elem) === pos;
            });
          };

        const allKeys = uniqEs6(mydata.flatMap(item => item.data.map(d => d.name)));

        console.log('allkeys', allKeys);

        const stack = d3.stack()
            .keys(allKeys)
            .order(d3.stackOrderNone)
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

        console.log('transformed data', transformedData);
        console.log('stacked', stack(transformedData));

        const layers0 = stack(transformedData);

        // let stack = d3.stack().keys(d3.range(n).map((d) => 'layer' + d)).offset(d3.stackOffsetWiggle);

        // Create empty data structures
        let matrix0 = d3.range(m).map((d) => { return { x: d }; });
        //let matrix1 = d3.range(m).map((d) => { return { x: d }; });



        
        //d3.range(n).map((d) => { this.bumpLayer(m, matrix0, d); });
        //d3.range(n).map((d) => { this.bumpLayer(m, matrix1, d); });

        //console.log(matrix0);

        //let layers0 = stack(matrix0);
        //let layers1 = stack(matrix1);

        console.log('layers0', layers0);

        let x = d3.scaleLinear()
            .domain([0, m - 1])
            .range([0, chartWidth]);

        let y = d3.scaleLinear()
            .domain([d3.min(layers0, function (layer) { return d3.min(layer, function (d) { return d[0]; }); }), d3.max(layers0, function (layer) { return d3.max(layer, function (d) { return d[1]; }); })])
            .range([chartHeight, 0]);

        let color = d3.scaleLinear<string>()
            .range(['#aad', '#556']);

        let area: any = d3.area()
            .x(function (d: any, i) { return x(d.data.timestamp); })
            .y0(function (d) { return y(d[0]); })
            .y1(function (d) { return y(d[1]); });

        this.chart.selectAll("path")
            .data(layers0)
            .enter().append("path")
            .attr("d", area)
            .style("fill", () =>  color(Math.random()));

        // function transition() {
        //     d3.selectAll("path")
        //         .data(function () {
        //             var d = layers1;
        //             layers1 = layers0;
        //             return layers0 = d;
        //         })
        //         .transition()
        //         .duration(2500)
        //         .attr("d", area);
        // }

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
