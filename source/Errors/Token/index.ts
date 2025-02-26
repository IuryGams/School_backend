import { StatusCodes } from 'http-status-codes';
import { CustomError } from '..';

export class TokenExpiredCustomError extends CustomError {
    constructor(message: string = "Token expirado") {
        super("TokenExpiredError", message, StatusCodes.UNAUTHORIZED);
    }
}

export class JsonWebTokenCustomError extends CustomError {
    constructor(message: string = "Token inválido") {
        super("TokenError", message, StatusCodes.UNAUTHORIZED);
    }
}