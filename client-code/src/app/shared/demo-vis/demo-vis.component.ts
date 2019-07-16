import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { TooltipService } from '@app/core/services/tooltip.service';
import { ExampleTooltipComponent } from '../example-tooltip/example-tooltip.component';

@Component({
  selector: 'dbvis-demo-vis',
  template: `<svg #svg></svg>`,
  styleUrls: ['./demo-vis.component.less']
})
export class DemoVisComponent implements OnInit {

  @ViewChild('svg', { static: true }) svgRef: ElementRef<SVGElement>;

  constructor(private tooltipService: TooltipService) { }

  ngOnInit() {
    const svgElement = this.svgRef.nativeElement;

    const svg = d3.select(svgElement)
      .attr('width', 500)
      .attr('height', 300)
      .style('border', '1px solid black');

    svg
      .append('text')
      .attr('x', 50)
      .attr('y', 50)
      .text('Hello world! Hover me for a tooltip!')
      .on('mouseenter', () => {
        const mouseEvent: MouseEvent = d3.event;

        const exampleTooltipComponentInstance = this.tooltipService.openAtMousePosition(ExampleTooltipComponent, mouseEvent);

        const randomNumber = Math.random();

        exampleTooltipComponentInstance.text = 'Hello world in tooltip with random number: ' + randomNumber;
      })
      .on('mouseleave', () => {
        this.tooltipService.close();
      });
  }

}
