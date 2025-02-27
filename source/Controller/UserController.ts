import { NextFunction, Request, Response } from "express";
import UserServices from "../Services/UserServices"
import { User } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../Constants/tokensDI";
import { StatusCodes } from "http-status-codes";
import { IUserController, IUserServices } from "../implements";
import { UserType } from "../Types/user";


@injectable()
class UserController implements IUserController {

    constructor(
        @inject(TOKENS.services.UserServices) private userServices: IUserServices
    ) {};

    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body: UserType = req.body;
            const response = await this.userServices.createUser(body);
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error)
        }
    }

}


export {UserController}