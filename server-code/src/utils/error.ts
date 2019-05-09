export class ApiError extends Error {
    public status: number;
    
    public constructor(msg: string) {
        super(msg)
    }


}