import { GeoSlice } from './geo-slice';

export interface Mc1Item {
    time: Date;

    sewer_and_water: number;

    power: number;

    roads_and_bridges: number;

    medical: number;

    buildings: number;

    shake_intensity: number;

    /**
     * district number
     */
    location: number;

    /**
     * Defines the shape of the district
     */
    geoSlice: GeoSlice;
}