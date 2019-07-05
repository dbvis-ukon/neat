export class PixelPos {
    public x: number;
    public y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    public toString = (): string => {
        return `${this.x},${this.y}`;
    }
}