import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../Constants/tokensDI";
import { StatusCodes } from "http-status-codes";
import { IUserController, IUserServices } from "../../implements";


@injectable()
class UserController implements IUserController {

    constructor(
        @inject(TOKENS.services.UserServices) private userServices: IUserServices
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

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {user_id} = req.params;
            const response = await this.userServices.deleteUser(Number(user_id));
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

}


export {UserController}