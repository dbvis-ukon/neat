import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'dbvis-user-options-dialog',
  templateUrl: './user-options-dialog.component.html',
  styleUrls: ['./user-options-dialog.component.less']
})
export class UserOptionsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UserOptionsDialogComponent>,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
