import { NextFunction, Request, Response } from "express";
import UserServices from "../Services/UserServices"
import { User } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { IUserController } from "../interfaces/Implements";
import { TOKENS } from "../Constants/tokensDI";
import { StatusCodes } from "http-status-codes";


@injectable()
class UserController implements IUserController {

    constructor(
        @inject(TOKENS.UserServices) private userServices: UserServices
    ) {};

    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body;
            const response = await this.userServices.createUser(body);
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error)
        }
    }

}


export {UserController}