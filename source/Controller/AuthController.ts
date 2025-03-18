import { inject, injectable } from "tsyringe";
import { TOKENS } from "../Constants/tokensDI";
import { LoginRequest } from "../@Types/auth";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IAuthController, IAuthServices } from "../implements";

@injectable()
class AuthController implements IAuthController {

    constructor(@inject(TOKENS.services.AuthServices) private authServices: IAuthServices) { }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password }: LoginRequest = req.body;
            const token = await this.authServices.login({ email, password });
            res.status(StatusCodes.OK).json(token);
        } catch (error) {
            next(error);
        }
    }

    public async getInformationUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const userData = await this.authServices.decodeUser(token);
            res.status(StatusCodes.OK).json(userData);
        } catch (error) {
            next(error);
        }
    }
}


export {AuthController}