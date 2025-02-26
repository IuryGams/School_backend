import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomError } from "../..";


export class NotFoundError extends CustomError {
    constructor(message: string = ReasonPhrases.NOT_FOUND) {
        super("Not Found", message, StatusCodes.NOT_FOUND);
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
}