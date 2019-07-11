import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mc2RadiationItem } from '@app/dashboard/map/mc2-radiation-item';
import { map, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Mc2DataRepositoryService {

  constructor(private http: HttpClient) { }

  public getData(): Observable<Mc2RadiationItem[]> {
    return this.http.get<any[]>('/assets/MapMC2AllGrid.json')
      .pipe(
        map((itemArray: any[]) => itemArray.map(i => ({
            timestamp: new Date(i.timestamp),
            sensorId: i['Sensor-id'],
            type: i.type,
            latitude: parseFloat(i.lat),
            longitude: parseFloat(i.long),
            value: parseFloat(i.value)
          } as Mc2RadiationItem))
        )
      );
  }
}
