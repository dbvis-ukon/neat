import {
  Directive,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  Input,
  HostListener
} from '@angular/core';
import { ResizedEvent } from '@app/shared/resized-event';
import { ResizeSensor } from 'css-element-queries';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

class MyResizedEvent implements ResizedEvent {

  constructor(
    public element: ElementRef,
    public newWidth: number,
    public newHeight: number,
    public oldWidth: number,
    public oldHeight: number
  ) {

  }
}

@Directive({
  selector: '[dbvisResized]'
})
export class ResizedDirective implements OnInit {
  @Input()
  debounceTime: number;

  @Input()
  windowResizeOnly: boolean;

  @Output()
  readonly dbvisResized = new EventEmitter<ResizedEvent>();

  private debouncer: Subject<void> = new Subject();

  private oldWidth: number;
  private oldHeight: number;

  constructor(private readonly element: ElementRef) {}

  ngOnInit() {
    // tslint:disable-next-line:no-unused-expression
    new ResizeSensor(this.element.nativeElement, _ => this.onResized());

    this.debouncer
      .pipe(debounceTime(this.debounceTime || 100))
      .subscribe(() => {
        const newWidth = this.element.nativeElement.clientWidth;
        const newHeight = this.element.nativeElement.clientHeight;

        if (newWidth === this.oldWidth && newHeight === this.oldHeight) {
          return;
        }

        const event = new MyResizedEvent(
          this.element,
          newWidth,
          newHeight,
          this.oldWidth,
          this.oldHeight
        );

        this.oldWidth = this.element.nativeElement.clientWidth;
        this.oldHeight = this.element.nativeElement.clientHeight;

        this.dbvisResized.emit(event);
      });

    this.onResized();
    this.onWindowResized();
  }

  private onResized() {
    if (!this.windowResizeOnly) {
      this.debouncer.next();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResized() {
    if (this.windowResizeOnly) {
      this.debouncer.next();
    }
  }
}
