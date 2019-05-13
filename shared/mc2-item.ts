import { GeoPos } from "./geo-pos";

export interface Mc2Item {

    type: 'mobile' | 'static';

    timestamp: Date;

    sensorId: number;

    location: GeoPos;

    value: number;

    userId?: string;
}