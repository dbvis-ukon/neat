import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Group } from '@shared';
import { GroupRepositoryService } from '@app/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'dbvis-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, AfterViewInit {

  groupName: string;

  groups: Group[];

  constructor(
    private groupRepository: GroupRepositoryService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.updateGroups();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.activatedRoute.paramMap.subscribe(d => {
        if (d.has('kicked') && d.get('kicked') === 'true') {
          this._snackBar.open('You have been kicked from the group :(', 'OK', {
            duration: 10000
          });
        }
      });
    });
  }

  updateGroups() {
    this.groupRepository.list().subscribe(groups => {
      this.groups = groups;
    });
  }

  createGroup() {
    this.groupRepository.create(this.groupName).subscribe(() => {
      this.groupName = '';
      this.updateGroups();
    });
  }

  deleteGroup(groupId: string) {
    this.groupRepository.delete(groupId).subscribe(() => {
      this.updateGroups();
    });
  }
}
