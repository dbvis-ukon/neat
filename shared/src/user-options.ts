import { NeighborhoodSelection } from "./neighborhood-selection";

export interface UserOptions {

    id: string;

    groupId?: string;

    name: string;

    color: string;

    timelineBrush?: [Date, Date];

    /**
     * The selection from the map. Shows what districts are selected.
     */
    neighborhoodSelection?: NeighborhoodSelection;
}