import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomError } from "../..";


export class ForbiddenError extends CustomError {
    constructor(message: string = ReasonPhrases.FORBIDDEN) {
        super("Forbidden", message, StatusCodes.FORBIDDEN);
        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }
}
