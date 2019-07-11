import * as uuid from 'uuid/v4';
import { AnnotationNote, IAnnotationData, AnnotationPositionInfo } from '@shared/annotation-data';

export class AnnotationData implements IAnnotationData {
  public readonly uuid: string = uuid();
  public note: AnnotationNote;
  public data: AnnotationPositionInfo;
  public dx;
  public dy;
  public color = '#ff336f';

  public masterTimelineOriginalTitle?: string;

  public userId?: string;

  public userName?: string;


  constructor(color: string, date?: Date, y?: number, title?: string, label?: string) {
    this.color = color;
    this.note = {
      title, label2: label
    };
    this.data = {
      date,
      y
    };
    this.dx = 50;
    this.dy = 10;
  }
}
