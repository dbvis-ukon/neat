import { TimeSlice } from "./time-slice";
import { GeoSlice } from "./geo-slice";

export interface Query {


    times: Array<TimeSlice>;


    locations?: Array<GeoSlice>;


}