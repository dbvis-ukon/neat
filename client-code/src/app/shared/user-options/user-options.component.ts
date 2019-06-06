import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserOptions } from '@shared';
import { UserOptionsRepositoryService } from '@app/core';

@Component({
  selector: 'dbvis-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.less']
})
export class UserOptionsComponent implements OnInit {

  @Output()
  public submitted = new EventEmitter<void>();

  userOptions: UserOptions = {
    id: null,
    name: '',
    color: ''
  };

  constructor(private userOptionsRepository: UserOptionsRepositoryService) { }

  ngOnInit() {
    this.userOptionsRepository.userOptions$.subscribe(opts => {
      this.userOptions = opts;
    });
  }

  onSubmit() {
    this.userOptionsRepository.setOptions(this.userOptions);
    this.submitted.emit();
  }

}
