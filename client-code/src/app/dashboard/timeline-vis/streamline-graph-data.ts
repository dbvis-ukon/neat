export interface StreamlineGraphItem {
    timestamp: Date | number;

    data: {
        name: string;
        value: number;
    }[];
}