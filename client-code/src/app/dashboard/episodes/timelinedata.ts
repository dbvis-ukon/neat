export class Timelinedata {
  private _datetime: Date;
  private _count: number;

  constructor(datetime: string, count: number) {
    this._datetime = new Date(datetime);
    this._count = count;
  }

  get datetime(): Date {
    return this._datetime;
  }

  set datetime(value: Date) {
    this._datetime = value;
  }

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }
}
