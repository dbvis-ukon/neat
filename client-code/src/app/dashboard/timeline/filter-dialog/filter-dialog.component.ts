import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectableFilterItem } from './selectable-filter-item';
import { FilterDialogData } from './filter-dialog-data';

@Component({
  selector: 'dbvis-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.less']
})
export class FilterDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogData) {}

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  onOkClick(): void {
    this.dialogRef.close(this.data);
  }

}
