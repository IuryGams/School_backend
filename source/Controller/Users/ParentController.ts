import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../Constants/tokensDI";
import { ParentWithStudents, ParentUser } from "../../@Types/user";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IParentController, IParentServices } from "../../implements";


@injectable()
class ParentController implements IParentController {

    constructor(
        @inject(TOKENS.services.ParentServices) private parentServices: IParentServices
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