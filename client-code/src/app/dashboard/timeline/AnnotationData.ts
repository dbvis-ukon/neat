import * as uuid from 'uuid/v4';
import { AnnotationNote, IAnnotationData, AnnotationPositionInfo } from '@shared/annotation-data';

export class AnnotationData implements IAnnotationData {
  private readonly _uuid: string = uuid();
  private _note: AnnotationNote;
  private _data: AnnotationPositionInfo;
  private _dx;
  private _dy;
  private _color = '#ff336f';

  public masterTimelineOriginalTitle?: string;

  public userId?: string;

  public userName?: string;


  constructor(color: string, date?: Date, y?: number, title?: string, label?: string) {
    this.color = color;
    this._note = {
      title, label2: label
    };
    this._data = {
      date,
      y
    };
    this._dx = 50;
    this._dy = 10;
  }

  get note(): AnnotationNote {
    return this._note;
  }

  set note(value: AnnotationNote) {
    this._note = value;
  }

  get data(): AnnotationPositionInfo {
    return this._data;
  }

  set data(value: AnnotationPositionInfo) {
    this._data = value;
  }

  get dx() {
    return this._dx;
  }

  set dx(value) {
    this._dx = value;
  }

  get dy() {
    return this._dy;
  }

  set dy(value) {
    this._dy = value;
  }

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  get uuid(): string {
    return this._uuid;
  }
}
