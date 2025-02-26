import { inject, injectable } from "tsyringe";
import { IParentController, IParentServices } from "../interfaces/Implements";
import { TOKENS } from "../Constants/tokensDI";
import ParentServices from "../Services/ParentServices";
import { ParentWithStudents, ParentUser } from "../Types/user";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


@injectable()
class ParentController implements IParentController {

    constructor(
        @inject(TOKENS.ParentServices) private parentServices: IParentServices
    ) {}

    async createParent(req: Request, res: Response, next: NextFunction): Promise<void> {
        const body: ParentUser = req.body;
        try {
            const response = await this.parentServices.createParent(body);
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error)
        }
    }

    async createParentWithStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
        const body: ParentWithStudents = req.body;
        try {
            const response = await this.parentServices.createParentWithStudents(body);
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error)
        }
    }
}


export {ParentController};