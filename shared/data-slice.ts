import { Mc1Item } from "./mc1-item";
import { Mc2Item } from "./mc2-item";
import { Mc3Item } from "./mc3-item";
import { Query } from "./query";

export interface DataSlice extends Query {

    mc1Data?: Array<Mc1Item>;

    mc2Data?: Array<Mc2Item>;

    mc3Data?: Array<Mc3Item>;
}