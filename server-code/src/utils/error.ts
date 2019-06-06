export class ApiError extends Error {
    public status: number;
    
    public constructor(msg: string, status: number) {
        super(msg);
        this.status = status;
    }


}