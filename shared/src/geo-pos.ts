export class GeoPos {
    public longitude: number;
    public latitude: number;

    constructor(longitude, latitude) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    public toString = (): string => {
        return `${this.longitude},${this.latitude}`;
    }
}