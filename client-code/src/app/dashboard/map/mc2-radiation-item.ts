export interface Mc2RadiationItem {
    timestamp: Date;
    sensorId: string;
    latitude: number;
    longitude: number;
    type: 'static' | 'mobile';
    value: number;
}
