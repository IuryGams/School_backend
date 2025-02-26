import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomError } from "../..";


export class BadRequestError extends CustomError {
    constructor(message: string = ReasonPhrases.BAD_REQUEST) {
        super("Bad Request", message, StatusCodes.BAD_REQUEST);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    };
};