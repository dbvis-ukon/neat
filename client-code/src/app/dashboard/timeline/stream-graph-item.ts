export interface StreamGraphItem {
    timestamp: Date | number;

    data: {
        name: string;
        value: number;
    }[];
}
