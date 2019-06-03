import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserOptions } from '../../../../shared/dist/user-options';
import { UserOptionsRepositoryService } from '../user-options-repository.service';

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
    console.warn(this.userOptions);
    this.userOptionsRepository.setOptions(this.userOptions);
    this.submitted.emit();
  }

}
