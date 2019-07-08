import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserOptionsRepositoryService } from '../../core/services/user-options-repository.service';
import { UserOptions } from '@shared/user-options';
import { Group } from '@shared/group';
import { MatDialog, MatSidenav } from '@angular/material';
import { UserOptionsDialogComponent } from '../../shared/user-options-dialog/user-options-dialog.component';

@Component({
  selector: 'dbvis-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  @Output()
  view: EventEmitter<'default' | 'timelines'> = new EventEmitter();

  @Input()
  sidenav: MatSidenav;

  @Input()
  group: Group;

  userOptions: UserOptions;

  constructor(
    private userOptionsRepository: UserOptionsRepositoryService,
    private dialog: MatDialog
    ) { }

  ngOnInit() {
    this.userOptionsRepository.userOptions$.subscribe(opts => {
      this.userOptions = opts;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UserOptionsDialogComponent, {
      width: '40%'
    });
  }

  emitView(view: 'default' | 'timelines') {
    this.view.emit(view);
  }

}
