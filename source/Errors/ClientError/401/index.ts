import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomError } from "../..";


export class UnauthorizedError extends CustomError {
    constructor(message: string = ReasonPhrases.UNAUTHORIZED) {
        super("Unauthorized", message, StatusCodes.UNAUTHORIZED);
        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    }
}
