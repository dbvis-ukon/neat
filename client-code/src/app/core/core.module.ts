import { NgModule, Optional, SkipSelf } from '@angular/core';
import { UserOptionsRepositoryService, GroupRepositoryService } from '.';
import { TooltipService } from './services/tooltip.service';
import { Mc2DataRepositoryService } from './services/mc2-data-repository.service';

@NgModule({
  providers: [
    UserOptionsRepositoryService,
    GroupRepositoryService,
    TooltipService,
    Mc2DataRepositoryService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('You must not import the CoreModule into your module!');
    }
  }
}
