import { Component, OnInit } from '@angular/core';
import { Group } from '@shared';
import { GroupRepositoryService } from '@app/core';

@Component({
  selector: 'dbvis-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  groupName: string;

  groups: Group[];

  constructor(private groupRepository: GroupRepositoryService) {}

  ngOnInit() {
    this.updateGroups();
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
}
