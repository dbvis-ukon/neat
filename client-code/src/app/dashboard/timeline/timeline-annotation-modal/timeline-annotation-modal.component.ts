import {Component, OnInit, Input, Inject} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AnnotationData} from '@app/dashboard/timeline/AnnotationData';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'dbvis-timeline-annotation-modal',
  templateUrl: './timeline-annotation-modal.component.html',
  styleUrls: ['./timeline-annotation-modal.component.less'],
  animations: [
    trigger('tooltip', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 })),
      ]),
    ]),
  ],

})
export class TimelineAnnotationModalComponent implements OnInit {

  public annotationForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<TimelineAnnotationModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AnnotationData) { }

  ngOnInit() {
    this.annotationForm = new FormGroup({
      title: new FormControl('', [Validators.required])
    });
  }

  public hasError(controlName: string, errorName: string) {
    return this.annotationForm.controls[controlName].hasError(errorName);
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
