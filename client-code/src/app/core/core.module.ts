import { NgModule, Optional, SkipSelf } from '@angular/core';
import { UserOptionsRepositoryService, GroupRepositoryService } from '.';
import { TooltipService } from './services/tooltip.service';

@NgModule({
  providers: [
    UserOptionsRepositoryService,
    GroupRepositoryService,
    TooltipService
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('You must not import the CoreModule into your module!');
    }
  }
}
