import { Injectable, ComponentRef, ElementRef } from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayPositionBuilder, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay/typings/position/flexible-connected-position-strategy';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  private overlayRef: OverlayRef;
  private tooltipRef: ComponentRef<any>;

  constructor(private overlay: Overlay,
              private overlayPositionBuilder: OverlayPositionBuilder) {
      this.overlayRef = this.overlay.create({
        scrollStrategy: this.overlay.scrollStrategies.block()
      });
    }

  openAtMousePosition<T>(tooltipComponent: ComponentType<T>, mouse: MouseEvent): T {
    const pos = this.overlayPositionBuilder.global()
      .left(mouse.clientX + 'px')
      .top(mouse.clientY + 'px');

    this.overlayRef.updatePositionStrategy(pos);
    this.overlayRef.updatePosition();

    if (!this.tooltipRef) {
      this.tooltipRef = this.overlayRef.attach(new ComponentPortal(tooltipComponent));
    }

    return this.tooltipRef.instance;
  }

  openAtEleementRef<T>(
    tooltipComponent: ComponentType<T>,
    elementRef: FlexibleConnectedPositionStrategyOrigin,
    positions: ConnectedPosition = {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
    }
  ): T {
    const pos = this.overlayPositionBuilder
    // Create position attached to the elementRef
    .flexibleConnectedTo(elementRef)
    // Describe how to connect overlay to the elementRef
    // Means, attach overlay's center bottom point to the
    // top center point of the elementRef.
    .withPositions([positions]);

    this.overlayRef.updatePositionStrategy(pos);
    this.overlayRef.updatePosition();

    if (!this.tooltipRef) {
      this.tooltipRef = this.overlayRef.attach(new ComponentPortal(tooltipComponent));
    }

    return this.tooltipRef.instance;
  }

  close() {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.tooltipRef = null;
    }
  }
}
