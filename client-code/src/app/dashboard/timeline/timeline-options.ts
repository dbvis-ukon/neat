export interface TimelineOptions {
    /**
     * The global beginning date of our data.
     */
    begin: Date;

    /**
     * The global end date of our data.
     */
    end: Date;

    /**
     * The color of the user
     */
    userColor: string;

    brushOn: boolean;

    height: number;
}
