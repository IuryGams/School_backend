import { ReasonPhrases, StatusCodes } from 'http-status-codes';

class CustomError extends Error {
    public nameError: string;
    public statusCode: number;
    public isOperational: boolean;

    constructor (
        nameError: string = "Error",
        description: string = ReasonPhrases.INTERNAL_SERVER_ERROR,
        statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
        isOperational: boolean = true
    ) {
        super(description);
        this.nameError = nameError;
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Object.setPrototypeOf(this, CustomError.prototype);
    };

    toJson() {
        return {
            error: this.nameError,
            message: this.message,
            statusCode: this.statusCode
        };
    };
}

export {CustomError}