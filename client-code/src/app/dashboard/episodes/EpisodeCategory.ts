import {Episode} from '@app/dashboard/episodes/episode';
import {CrisisLexCategory} from '@app/dashboard/episodes/CrisisLexCategory';
import {Observable} from "rxjs";

export class EpisodeCategory {
  private _episodes: Observable<Episode[]>;
  private _crisislexCategory: CrisisLexCategory;
  public visible = false;

  constructor(episodes: Observable<Episode[]>, crisislexCategory: CrisisLexCategory) {
    this._episodes = episodes;
    this._crisislexCategory = crisislexCategory;
  }

  get episodes(): Observable<Episode[]> {
    return this._episodes;
  }

  set episodes(value: Observable<Episode[]>) {
    this._episodes = value;
  }

  get crisislexCategory(): CrisisLexCategory {
    return this._crisislexCategory;
  }

  set crisislexCategory(value: CrisisLexCategory) {
    this._crisislexCategory = value;
  }
}
