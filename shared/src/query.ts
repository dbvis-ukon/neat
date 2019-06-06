import { GeoSlice } from './geo-slice';
import { TimeSlice } from './time-slice';

export interface Query {


    times: Array<TimeSlice>;


    locations?: Array<GeoSlice>;


}