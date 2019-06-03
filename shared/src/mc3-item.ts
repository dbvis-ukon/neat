import { GeoSlice } from './geo-slice';

export interface Mc3Item {

    time: Date;

    /**
     * district number
     */
    location: number;

    /**
     * shape of district
     */
    geoSlice: GeoSlice;

    /**
     * user name
     */
    account: string;

    /**
     * tweet
     */
    message: string;
}