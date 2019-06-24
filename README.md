# VAST Challenge Grand Challenge 2019 Prototype

## Development

For development you need to have docker installed.
Afterward, simply execute `docker-compose up` in the root of this folder.
This will spin up two development environments and a database.
My recommended IDE is [VSCode](https://code.visualstudio.com/).
  
Before the first run you have to do an `npm install` for server and client
to create the `node_modules`-folder in the mounted volumes:

```
docker-compose run server npm install
docker-compose run client npm install
```


### Server

The server is written in typescript and runs on node.
Execute `docker-compose run server npm install` to install all dependencies for the server. You need to do this everytime the package.json is updated.
It is accessible on port `3000`. Check http://localhost:3000/health ; it should return `OK`.
When changing a file in the server code the server will restart automatically.

### Client

The client is written in typescript using the Angular 7 framework.
Execute `docker-compose run client npm install` to install all dependencies for the server. You need to do this everytime the package.json is updated.
The dev-server for the client is accessible via http://localhost:4200
When changing a file in the client code the dev-server will restart automatically.

### RethinkDB

The database to exchange data between the clients is RethinkDB because it allows observing for changes in a specific table.
RethinkDB provides an admin interface on http://localhost:8080

### How to: Tooltip (Angular Style)

An angular tooltip is an angular component. This means that you have the full capabilities available with double-databinding and nesting other components (e.g., to add another visualization in your tooltip)..
Okay so first you'll need your tooltip component so let's create it:

```shell
ng g component dashboard/episodes/episode-tooltip
```

This will create a component `episode-tooltip` in the episodes module (which itself is part of the dashboard module).
Your tooltip should have some input data to be able to show dynamic content.

An example tooltip component I created looks like this:

```typescript
import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'dbvis-example-tooltip',
  templateUrl: './example-tooltip.component.html',
  styleUrls: ['./example-tooltip.component.less'],
  animations: [
    trigger('tooltip', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ExampleTooltipComponent implements OnInit {

  @Input()
  text: string;

  constructor() { }

  ngOnInit() {
  }

}
```

I've only added a text property of type string and defined it as an Input. Of course you are completely free to use any input data or even multiple attributes.
The animations section is optional but it will give our tooltip a nice fade-in fade-out animation.
To make our tooltip look nice I've added the following in the tooltip-component.less:

```css
:host {
    display: block;
    position: fixed;
    pointer-events: none; // this is used that the tooltip does not block the mouse
}
  
div { // just some generic styling for the tooltip
    background-color: #292929;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}
```

The HTML part is simple:
```html
<div>
  <h3>I'm a tooltip!</h3>

  <p>My text: {{ text }}</p>
</div>
```

Remember that you have a fully-featured angular component here so you can nest any other components and you do all the angular magic (ngFor, ngIf, etc).

Now the tooltip component must be added to the module as an entryComponent.
```typescript
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOptionsDialogComponent } from './user-options-dialog/user-options-dialog.component';
import { HeaderComponent } from './header/header.component';
import { UserOptionsComponent } from './user-options/user-options.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { MatIconModule, MatToolbarModule, MatButtonModule, MatInputModule, MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { ResizedDirective } from './resized.directive';
import { ExampleTooltipComponent } from './example-tooltip/example-tooltip.component';
import { DemoVisComponent } from './demo-vis/demo-vis.component';

@NgModule({
  entryComponents: [
    UserOptionsDialogComponent,
    ExampleTooltipComponent // add your tooltip component here!
  ],
  declarations: [
    UserOptionsDialogComponent,
    UserOptionsComponent,
    HeaderComponent,
    ResizedDirective,
    ExampleTooltipComponent, // this should be already here automatically when you execute the ng g component ... command.
    DemoVisComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    ColorPickerModule,
    MatDialogModule
  ],
  exports: [
    UserOptionsDialogComponent,
    UserOptionsComponent,
    HeaderComponent,
    ResizedDirective,
    DemoVisComponent
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
```
In this example, this is the shared module, but you can simply add your tooltip component to your module (you may have to add the entryComponents key)


The final step is to add the tooltip to our visualization. I've created a small demo visualization:

```typescript
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

  @ViewChild('svg') svgRef: ElementRef<SVGElement>;

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
```

Step 1: Inject the `TooltipService`. You can simply do this by adding it to your constructor:

```typescript
    constructor(private tooltipService: TooltipService) { }
```

Step 2: Open the tooltip:
```typescript
    d3....
      .on('mouseenter', () => {
        const mouseEvent: MouseEvent = d3.event;

        const exampleTooltipComponentInstance = this.tooltipService.openAtMousePosition(ExampleTooltipComponent, mouseEvent);

        const randomNumber = Math.random();

        exampleTooltipComponentInstance.text = 'Hello world in tooltip with random number: ' + randomNumber;
      })
      .on('mouseleave', () => {
        this.tooltipService.close();
      });
```

Using the tooltipService we can open a tooltip at the current mouse position, simply tell the service which tooltip-component to loead and provide it with the mouse event.
The function will return an **instance** of your component. With that instance you are able to set the data properties or you could also call any method of your tooltip component.


You can try out this with http://localhost:4200/demovis